import { ensureProgress } from './mastery.js';

export function markWrong(state, wordId) {
  const p = ensureProgress(state, wordId);
  p.wrongCount = Number(p.wrongCount || 0) + 1;
  p.reviewCorrectStreak = 0;
  p.inWrongBook = true;
  p.lastWrongTime = new Date().toISOString();
}
export function recordReviewCorrect(state, wordId) {
  const p = ensureProgress(state, wordId);
  p.reviewCorrectStreak = Number(p.reviewCorrectStreak || 0) + 1;
  if (p.reviewCorrectStreak >= 2) {
    p.inWrongBook = false;
    p.reviewCorrectStreak = 0;
    return true;
  }
  return false;
}
export const wrongWords = (state, words) => words.filter(word => state.wordProgress[word.id]?.inWrongBook);
