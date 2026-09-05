import { MODE_RULES } from './config.js';
import { shuffle } from './utils.js';

export function renderMole(card, word, words, handlers) {
  const choices = shuffle([word, ...shuffle(words.filter(w => w.id !== word.id)).slice(0, 3)]);
  card.innerHTML = `
    <div class="mode-label">${MODE_RULES.mole.label} · 答对 +${MODE_RULES.mole.points}</div>
    <div class="cn">${word.meaning}</div><p class="prompt">快点找到正确单词！</p>
    <div class="mole-grid">${choices.map(w => `<button class="mole" data-id="${w.id}">🐹<br>${w.word}</button>`).join('')}</div>
    <div id="feedback" class="feedback" aria-live="polite"></div>`;
  card.querySelectorAll('.mole').forEach(button => button.addEventListener('click', () => handlers.choose(button, button.dataset.id)));
}

export function createMatchRound(card, words, handlers) {
  const chosen = shuffle(words).slice(0, 4);
  const cards = shuffle(chosen.flatMap(word => [
    { id: `en-${word.id}`, wordId: word.id, type: 'en', text: word.word },
    { id: `zh-${word.id}`, wordId: word.id, type: 'zh', text: word.meaning }
  ]));
  const matched = new Set(); let selected = []; let locked = false;
  card.innerHTML = `<div class="mode-label">${MODE_RULES.match.label} · 每组 +${MODE_RULES.match.points}</div><div class="cn">找出对应的英文和中文</div><div id="matchBoard" class="match-board"></div><div id="feedback" class="feedback" aria-live="polite"></div>`;
  const board = card.querySelector('#matchBoard');
  const draw = () => {
    board.innerHTML = cards.map(item => `<button class="match-card ${selected.includes(item.id) ? 'selected' : ''} ${matched.has(item.wordId) ? 'matched' : ''}" data-id="${item.id}">${item.text}</button>`).join('');
    board.querySelectorAll('.match-card').forEach(button => button.addEventListener('click', () => pick(button.dataset.id)));
  };
  const pick = id => {
    if (locked || selected.includes(id)) return;
    selected.push(id); draw();
    if (selected.length < 2) return;
    locked = true;
    const [a, b] = selected.map(key => cards.find(item => item.id === key));
    if (a.wordId === b.wordId && a.type !== b.type) {
      matched.add(a.wordId); handlers.match(a.wordId, matched.size === chosen.length);
      setTimeout(() => { selected = []; locked = false; draw(); }, 450);
    } else {
      handlers.mismatch();
      setTimeout(() => { selected = []; locked = false; draw(); }, 650);
    }
  };
  draw();
}
