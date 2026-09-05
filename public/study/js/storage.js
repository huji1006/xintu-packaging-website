import { SCHEMA_VERSION, STORAGE_KEY, V2_STORAGE_KEY } from './config.js';
import { clamp, compactWord, normalizeAnswer } from './utils.js';
import { emptyProgress } from './mastery.js';

const now = () => new Date().toISOString();
export function defaultState() {
  return { schemaVersion: SCHEMA_VERSION, scores: { total: 0, daily: {} }, wordProgress: {}, meta: { createdAt: now(), updatedAt: now(), migratedFrom: null } };
}
function sanitizeProgress(raw = {}) {
  return {
    masteryScore: clamp(Number(raw.masteryScore || 0), 0, 12),
    spellingCorrectCount: Math.max(0, Number(raw.spellingCorrectCount || 0)),
    wrongCount: Math.max(0, Number(raw.wrongCount || 0)),
    reviewCorrectStreak: clamp(Number(raw.reviewCorrectStreak || 0), 0, 1),
    inWrongBook: Boolean(raw.inWrongBook),
    lastWrongTime: raw.lastWrongTime || null,
    lastPracticeTime: raw.lastPracticeTime || null
  };
}
function sanitizeV3(raw) {
  const state = defaultState();
  state.scores.total = Math.max(0, Number(raw?.scores?.total || 0));
  state.scores.daily = raw?.scores?.daily && typeof raw.scores.daily === 'object' ? raw.scores.daily : {};
  for (const [id, progress] of Object.entries(raw?.wordProgress || {})) state.wordProgress[id] = sanitizeProgress(progress);
  state.meta = { ...state.meta, ...(raw.meta || {}), updatedAt: now() };
  return state;
}
export function migrateV2(raw, words) {
  const state = defaultState();
  state.scores.total = Math.max(0, Number(raw.totalScore || 0));
  state.scores.daily = raw.dailyScores && typeof raw.dailyScores === 'object' ? raw.dailyScores : {};
  const legacyScores = [0, 2, 5, 8];
  for (const word of words) {
    const oldWord = (raw.words || []).find(item => compactWord(item.en) === compactWord(word.word));
    const oldKey = oldWord?.en || word.word.toLowerCase();
    const wrong = raw.wrong?.[oldKey] || raw.wrong?.[normalizeAnswer(oldKey)];
    const p = emptyProgress();
    p.masteryScore = legacyScores[clamp(Number(raw.mastery?.[oldKey] || 0), 0, 3)];
    if (wrong) {
      p.wrongCount = Math.max(1, Number(wrong.count || 1));
      p.reviewCorrectStreak = clamp(Number(wrong.reviewStreak || 0), 0, 1);
      p.inWrongBook = true;
      p.lastWrongTime = wrong.lastWrongAt || null;
    }
    if (p.masteryScore || p.inWrongBook) state.wordProgress[word.id] = p;
  }
  state.meta.migratedFrom = 'v2'; state.meta.updatedAt = now();
  return state;
}
export function loadState(words) {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (current?.schemaVersion === SCHEMA_VERSION) return sanitizeV3(current);
  } catch {}
  try {
    const legacy = JSON.parse(localStorage.getItem(V2_STORAGE_KEY));
    if (legacy?.words) { const migrated = migrateV2(legacy, words); saveState(migrated); return migrated; }
  } catch {}
  return defaultState();
}
export function saveState(state) {
  state.meta.updatedAt = now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
export function importState(raw, words) {
  if (raw?.schemaVersion === SCHEMA_VERSION) return sanitizeV3(raw);
  if (Array.isArray(raw?.words) && typeof raw?.totalScore === 'number') return migrateV2(raw, words);
  throw new Error('不支持的数据格式');
}
export function resetState() { const state = defaultState(); saveState(state); return state; }
