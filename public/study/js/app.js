import { FEEDBACK_DELAY, MODE_RULES } from './config.js';
import { loadState, saveState, importState, resetState } from './storage.js';
import { addModeScore } from './scoring.js';
import { applyMastery, ensureProgress, isMastered, masteryLevel } from './mastery.js';
import { markWrong, recordReviewCorrect, wrongWords } from './wrong-book.js';
import { speak, stopSpeech } from './speech.js';
import { downloadJson, normalizeAnswer, shuffle, todayKey } from './utils.js';
import { renderChunks, renderListening, renderSpelling } from './practice.js';
import { createMatchRound, renderMole } from './games.js';

async function init() {
const words = await fetch('./data/words.json').then(response => { if (!response.ok) throw new Error('词库加载失败'); return response.json(); });
let state = loadState(words);
let mode = null, currentWord = null, pool = [], poolIndex = 0, count = 0, locked = false, timer = null;
const $ = selector => document.querySelector(selector);
const card = $('#questionCard');

function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1800); }
function star() { const el = document.createElement('div'); el.className = 'star'; el.textContent = ['⭐','🌟','✨'][Math.floor(Math.random()*3)]; document.body.appendChild(el); setTimeout(() => el.remove(), 900); }
function showView(id) { document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === id)); if (id === 'manage') renderManage(); refreshStats(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function refreshStats() {
  const mastered = words.filter(word => isMastered(state.wordProgress[word.id])).length;
  const percent = words.length ? Math.round(mastered / words.length * 100) : 0;
  $('#totalScore').textContent = state.scores.total; $('#todayScore').textContent = state.scores.daily[todayKey()] || 0;
  $('#masteredCount').textContent = mastered; $('#wordCount').textContent = words.length; $('#progressText').textContent = `${percent}%`; $('#progressBar').style.width = `${percent}%`;
}
function renderManage() {
  $('#wordSummary').textContent = `共 ${words.length} 个词`;
  $('#wordTableWrap').innerHTML = `<div style="overflow:auto"><table class="word-table"><thead><tr><th>英文</th><th>中文</th><th>学习拆分</th><th>掌握度</th><th>错题</th></tr></thead><tbody>${words.map(word => {
    const p = ensureProgress(state, word.id); const level = masteryLevel(p);
    return `<tr><td><b>${word.word}</b></td><td>${word.meaning}</td><td>${word.learningChunks.join(' · ')}</td><td><span class="tag">${level.label} ${p.masteryScore}/12</span></td><td>${p.inWrongBook ? `📕 ${p.reviewCorrectStreak}/2` : '—'}</td></tr>`;
  }).join('')}</tbody></table></div>`;
}
function makePool() { pool = shuffle(mode === 'wrong' ? wrongWords(state, words) : words); poolIndex = 0; }
function pickWord() { if (!pool.length || poolIndex >= pool.length) makePool(); if (!pool.length) return null; let word = pool[poolIndex++]; if (word.id === currentWord?.id && pool.length > 1) { const next = poolIndex < pool.length ? poolIndex : 0; [word, pool[next]] = [pool[next], word]; } return word; }
function startMode(nextMode) {
  if (['listen','mole','match'].includes(nextMode) && words.length < 4) return toast('至少需要 4 个词');
  mode = nextMode; count = 0; locked = false; currentWord = null; makePool(); showView('practice'); nextQuestion();
}
function leave() { clearTimeout(timer); stopSpeech(); mode = null; locked = false; showView('home'); }
function nextQuestion() {
  locked = false; count += 1; $('#practiceCounter').textContent = mode === 'match' ? `第 ${count} 轮` : `第 ${count} 题`;
  if (mode === 'match') return renderMatch();
  currentWord = pickWord();
  if (!currentWord) { card.innerHTML = `<div class="empty"><div class="cn">当前没有错题 🎉</div><button id="emptyBack" class="btn primary">返回首页</button></div>`; $('#emptyBack').addEventListener('click', leave); return; }
  const handlers = { answer: answer => mode === 'chunks' ? finish(Boolean(answer)) : finish(answer === normalizeAnswer(currentWord.word)), choose, speak: () => speak(currentWord.word), toast };
  if (mode === 'chunks') renderChunks(card, currentWord, handlers);
  if (mode === 'listen') renderListening(card, currentWord, words, handlers);
  if (mode === 'spell' || mode === 'wrong') renderSpelling(card, currentWord, mode, ensureProgress(state, currentWord.id), handlers);
  if (mode === 'mole') renderMole(card, currentWord, words, handlers);
}
function disableQuestion() { locked = true; card.querySelectorAll('button,input').forEach(element => element.disabled = true); }
function feedbackHtml(ok, points, removed = false) {
  const headline = ok ? `✅ 答对了！+${points} 分` : '❌ 选择错误';
  const review = removed ? '<div>已连续答对 2 次，移出错题本</div>' : '';
  return `<div>${headline}</div><div class="answer-word">${currentWord.word}</div><div class="answer-meaning">${currentWord.meaning}</div>${review}`;
}
function finish(ok, selectedButton = null) {
  if (locked) return; disableQuestion();
  if (selectedButton) {
    selectedButton.classList.add(ok ? 'correct' : 'wrong');
    if (!ok) card.querySelector(`[data-id="${currentWord.id}"]`)?.classList.add('correct');
  }
  const points = ok ? addModeScore(state, mode) : 0;
  applyMastery(state, currentWord.id, mode, ok);
  let removed = false;
  if (ok && mode === 'wrong') removed = recordReviewCorrect(state, currentWord.id);
  if (!ok) markWrong(state, currentWord.id);
  saveState(state); refreshStats();
  const fb = $('#feedback'); fb.className = `feedback ${ok ? 'ok' : 'bad'}`; fb.innerHTML = feedbackHtml(ok, points, removed);
  if (ok) star(); speak(currentWord.word);
  timer = setTimeout(() => { if (mode === 'wrong') makePool(); if (mode) nextQuestion(); }, FEEDBACK_DELAY);
}
function choose(button, wordId) { finish(wordId === currentWord.id, button); }
function renderMatch() {
  createMatchRound(card, words, {
    match(wordId, complete) {
      const word = words.find(item => item.id === wordId); const points = addModeScore(state, 'match'); applyMastery(state, wordId, 'match', true); saveState(state); refreshStats(); star();
      const fb = $('#feedback'); fb.className = 'feedback ok'; fb.innerHTML = `<div>✅ 匹配成功！+${points} 分</div><div class="answer-word">${word.word}</div><div class="answer-meaning">${word.meaning}</div>`;
      speak(word.word); if (complete) timer = setTimeout(nextQuestion, FEEDBACK_DELAY);
    },
    mismatch() { const fb = $('#feedback'); fb.className = 'feedback bad'; fb.textContent = '再想一想，这两张不匹配'; }
  });
}

document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => startMode(button.dataset.mode)));
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
$('#leaveBtn').addEventListener('click', leave);
$('#exportBtn').addEventListener('click', () => { saveState(state); downloadJson(state, `翊涵-单词学习数据-${todayKey()}.json`); toast('学习数据已导出'); });
$('#importBtn').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', async event => { try { const file = event.target.files[0]; if (!file) return; state = importState(JSON.parse(await file.text()), words); saveState(state); refreshStats(); renderManage(); toast('学习数据导入成功'); } catch (error) { toast(`导入失败：${error.message}`); } finally { event.target.value = ''; } });
$('#resetBtn').addEventListener('click', () => { if (!confirm('确定清空积分、掌握度和错题记录吗？')) return; state = resetState(); refreshStats(); renderManage(); toast('学习记录已清空'); });
window.addEventListener('beforeunload', () => saveState(state));
refreshStats();
}

init().catch(error => {
  console.error(error);
  const card = document.querySelector('#home .hero-main');
  if (card) card.insertAdjacentHTML('beforeend', '<p style="color:#c83f4b;font-weight:700">页面加载失败，请刷新或升级浏览器后重试。</p>');
});
