import { MODE_RULES } from './config.js';
import { clamp } from './utils.js';

export function emptyProgress() {
  return { masteryScore: 0, spellingCorrectCount: 0, wrongCount: 0, reviewCorrectStreak: 0, inWrongBook: false, lastWrongTime: null, lastPracticeTime: null };
}
export function ensureProgress(state, wordId) {
  state.wordProgress[wordId] ||= emptyProgress();
  return state.wordProgress[wordId];
}
export function applyMastery(state, wordId, mode, correct) {
  const progress = ensureProgress(state, wordId);
  const delta = correct ? MODE_RULES[mode].correct : MODE_RULES[mode].wrong;
  progress.masteryScore = clamp(Number(progress.masteryScore || 0) + delta, 0, 12);
  if (correct && mode === 'spell') progress.spellingCorrectCount = Number(progress.spellingCorrectCount || 0) + 1;
  progress.lastPracticeTime = new Date().toISOString();
  return progress;
}
export function masteryLevel(progress) {
  const p = progress || emptyProgress();
  if (p.masteryScore >= 9 && p.spellingCorrectCount >= 1) return { key: 'mastered', label: '🏆 掌握' };
  if (p.masteryScore >= 6) return { key: 'skilled', label: p.masteryScore >= 9 ? '⭐ 熟练 · 待拼写' : '⭐ 熟练' };
  if (p.masteryScore >= 3) return { key: 'learning', label: '🌿 不熟' };
  return { key: 'new', label: '🌱 陌生' };
}
export const isMastered = progress => masteryLevel(progress).key === 'mastered';
