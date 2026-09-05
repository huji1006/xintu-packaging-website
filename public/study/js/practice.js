import { MODE_RULES } from './config.js';
import { compactWord, normalizeAnswer, shuffle } from './utils.js';

const label = mode => `${MODE_RULES[mode].label} · 答对 +${MODE_RULES[mode].points}`;

export function renderSpelling(card, word, mode, progress, handlers) {
  const review = mode === 'wrong';
  card.innerHTML = `
    <div class="mode-label">${label(mode)}</div>
    <div class="cn">${word.meaning}</div>
    ${review ? `<p class="prompt">连续正确 ${progress.reviewCorrectStreak || 0} / 2</p>` : '<p class="prompt">请独立写出完整英文</p>'}
    <input id="answerInput" class="answer" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="请输入英文">
    <button id="submitAnswer" class="btn primary submit">提交答案</button>
    <div id="feedback" class="feedback" aria-live="polite"></div>`;
  const input = card.querySelector('#answerInput');
  const submit = card.querySelector('#submitAnswer');
  const send = () => { if (input.value.trim()) handlers.answer(normalizeAnswer(input.value)); else handlers.toast('先输入答案哦'); };
  submit.addEventListener('click', send);
  input.addEventListener('keydown', event => { if (event.key === 'Enter') send(); });
  input.focus();
}

export function renderListening(card, word, words, handlers) {
  const choices = shuffle([word, ...shuffle(words.filter(w => w.id !== word.id)).slice(0, 3)]);
  card.innerHTML = `
    <div class="mode-label">${label('listen')}</div><div class="cn">听发音，选出正确单词</div>
    <button class="speaker" id="speaker" aria-label="播放发音">🔊</button>
    <div class="options">${choices.map(w => `<button class="option" data-id="${w.id}">${w.word}</button>`).join('')}</div>
    <div id="feedback" class="feedback" aria-live="polite"></div>`;
  card.querySelector('#speaker').addEventListener('click', handlers.speak);
  card.querySelectorAll('.option').forEach(button => button.addEventListener('click', () => handlers.choose(button, button.dataset.id)));
  setTimeout(handlers.speak, 250);
}

export function renderChunks(card, word, handlers) {
  const pieces = word.learningChunks.map((text, index) => ({ text, index, key: `${index}-${text}` }));
  let selected = [];
  card.innerHTML = `
    <div class="mode-label">${label('chunks')}</div><div class="cn">${word.meaning}</div>
    <p class="prompt">按正确顺序点击词块</p><div id="chunkAnswer" class="chunk-answer">等待拼词…</div>
    <div id="chunks" class="chunks"></div>
    <button id="undoChunk" class="btn secondary">撤回一步</button>
    <div id="feedback" class="feedback" aria-live="polite"></div>`;
  const answerBox = card.querySelector('#chunkAnswer');
  const board = card.querySelector('#chunks');
  const drawn = shuffle(pieces);
  const refresh = () => {
    answerBox.textContent = selected.length ? selected.map(piece => piece.text).join(' + ') : '等待拼词…';
    board.innerHTML = drawn.map(piece => `<button class="chunk ${selected.some(item => item.key === piece.key) ? 'used' : ''}" data-key="${piece.key}">${piece.text}</button>`).join('');
    board.querySelectorAll('.chunk').forEach(button => button.addEventListener('click', () => {
      const piece = pieces.find(item => item.key === button.dataset.key);
      selected.push(piece); refresh();
      if (selected.length === pieces.length) handlers.answer(compactWord(selected.map(item => item.text).join('')) === compactWord(word.word));
    }));
  };
  card.querySelector('#undoChunk').addEventListener('click', () => { selected.pop(); refresh(); });
  refresh();
}
