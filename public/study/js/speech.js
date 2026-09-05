let speaking = false;
export function speak(text, onStateChange = () => {}) {
  if (!('speechSynthesis' in window)) return false;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; utterance.rate = 0.82;
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(v => /en-US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || null;
  utterance.onstart = () => { speaking = true; onStateChange(true); };
  utterance.onend = utterance.onerror = () => { speaking = false; onStateChange(false); };
  speechSynthesis.speak(utterance);
  return true;
}
export function stopSpeech() { if ('speechSynthesis' in window) speechSynthesis.cancel(); speaking = false; }
export const isSpeaking = () => speaking;
