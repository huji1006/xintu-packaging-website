import { MODE_RULES } from './config.js';
import { todayKey } from './utils.js';

export function addModeScore(state, mode) {
  const points = MODE_RULES[mode].points;
  const day = todayKey();
  state.scores.total += points;
  state.scores.daily[day] = (state.scores.daily[day] || 0) + points;
  return points;
}
