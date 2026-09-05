export const STORAGE_KEY = 'yihan_word_game_v3';
export const V2_STORAGE_KEY = 'yihan_word_game_v2_vocab';
export const SCHEMA_VERSION = 3;
export const FEEDBACK_DELAY = 1800;

export const MODE_RULES = Object.freeze({
  chunks: { label: '🧱 拆分拼词', points: 5, correct: 2, wrong: -1 },
  listen: { label: '🎧 听音选词', points: 3, correct: 1, wrong: -1 },
  spell:  { label: '✍️ 拼写答题', points: 8, correct: 3, wrong: -2 },
  wrong:  { label: '📕 错题复习', points: 5, correct: 2, wrong: -2 },
  mole:   { label: '🐹 单词打地鼠', points: 3, correct: 1, wrong: -1 },
  match:  { label: '🧩 单词消消乐', points: 2, correct: 1, wrong: 0 }
});
