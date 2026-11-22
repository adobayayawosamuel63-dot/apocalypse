export function speechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickFrenchVoice() {
  if (!speechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  const french = voices.filter((voice) => /^fr([-_]|$)/i.test(voice.lang));
  if (!french.length) return null;
  return french.find((voice) => voice.localService) ?? french[0];
}

export function speakFrench(text, { onEnd, onError, rate = 0.88 } = {}) {
  if (!speechSupported()) return null;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = rate;
  utterance.pitch = 1;
  const voice = pickFrenchVoice();
  if (voice) utterance.voice = voice;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onError?.();

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
}

export function recognitionSupported() {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createRecognition() {
  if (!recognitionSupported()) return null;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new Recognition();
  recognition.lang = 'fr-FR';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
}
