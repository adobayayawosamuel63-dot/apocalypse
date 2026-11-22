import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Eraser, Mic, MicOff, TriangleAlert } from 'lucide-react';
import { diffWords } from '../../lib/text';
import { createRecognition, recognitionSupported } from '../../lib/speech';

export default function Level5Recall({ verse, onMastered, reviewMode = false, onGiveUp }) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const [micError, setMicError] = useState(null);
  const recognitionRef = useRef(null);
  const masteredRef = useRef(false);
  const supported = recognitionSupported();

  useEffect(
    () => () => {
      try {
        recognitionRef.current?.abort?.();
      } catch {
        // Reconnaissance déjà arrêtée.
      }
    },
    []
  );

  function handleChange(event) {
    setValue(event.target.value);
    setResult(null);
  }

  function check() {
    if (masteredRef.current) return;
    const diff = diffWords(verse.texte, value);
    setResult(diff);
    if (diff.perfect) {
      masteredRef.current = true;
      onMastered();
    }
  }

  function toggleDictation() {
    if (listening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Déjà arrêtée.
      }
      setListening(false);
      return;
    }
    const recognition = createRecognition();
    if (!recognition) return;
    setMicError(null);
    recognition.onresult = (event) => {
      let transcript = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += `${event.results[index][0].transcript} `;
      }
      setValue((previous) => `${previous.trim()} ${transcript.trim()}`.trim());
      setResult(null);
    };
    recognition.onerror = (event) => {
      setListening(false);
      setMicError(
        event.error === 'not-allowed'
          ? 'Micro refusé. Autorisez l’accès au microphone puis réessayez.'
          : 'La dictée n’a pas abouti. Réessayez ou écrivez le texte.'
      );
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
      setMicError('Impossible de démarrer la dictée.');
    }
  }

  function clear() {
    setValue('');
    setResult(null);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/[0.06] bg-night-950/60 px-4 py-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Restituez de mémoire</p>
        <p className="mt-2 font-serif text-2xl text-slate-100">{verse.reference}</p>
        <p className="mt-1 text-[11px] text-slate-500">Texte intégral, sans autre indice.</p>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          rows={6}
          placeholder="Écrivez le verset ici…"
          aria-label={`Saisir ${verse.reference} de mémoire`}
          className="w-full resize-y rounded-2xl border border-white/10 bg-night-950/60 p-4 pr-24 font-serif text-lg leading-relaxed text-slate-100 placeholder:font-sans placeholder:text-sm placeholder:text-slate-600 focus:border-gold-400/50 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
        />
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
          {supported && (
            <button
              type="button"
              onClick={toggleDictation}
              title={listening ? 'Arrêter la dictée' : 'Dicter le verset'}
              aria-label={listening ? 'Arrêter la dictée' : 'Dicter le verset'}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                listening
                  ? 'animate-pulse border-red-400/40 bg-red-400/15 text-red-300'
                  : 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-100'
              }`}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
          {value.trim() && (
            <button
              type="button"
              onClick={clear}
              title="Effacer la saisie"
              aria-label="Effacer la saisie"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:text-slate-100"
            >
              <Eraser className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {listening && <p className="text-[11px] text-red-300">Écoute en cours… parlez maintenant.</p>}

      {micError && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3 py-2.5 text-[11px] leading-relaxed text-amber-300">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {micError}
        </p>
      )}

      {result && !result.perfect && (
        <div className="space-y-3 rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300/90">Comparaison</p>
            <p className="text-[11px] tabular-nums text-slate-400">
              {result.correct}/{result.total} mots exacts
            </p>
          </div>
          <div className="flex flex-wrap gap-x-1.5 gap-y-2 text-[15px] leading-relaxed">
            {result.items.map((item, index) => {
              if (item.type === 'match') {
                return (
                  <span key={index} className="rounded bg-emerald-400/10 px-1 text-emerald-300">
                    {item.actual}
                  </span>
                );
              }
              if (item.type === 'missing') {
                return (
                  <span key={index} className="rounded bg-red-400/10 px-1 text-red-300" title="Mot manquant ou erroné">
                    {item.expected}
                  </span>
                );
              }
              return (
                <span
                  key={index}
                  className="rounded bg-red-400/15 px-1 text-red-200 line-through decoration-red-400/50"
                  title="Mot en trop"
                >
                  {item.actual}
                </span>
              );
            })}
          </div>
          <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400">
            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
            Vert : mot exact. Rouge : mot manquant, erroné ou en trop. La ponctuation et les majuscules ne comptent pas.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <button type="button" onClick={check} disabled={!value.trim()} className="btn-emerald w-full">
          <CheckCircle2 className="h-4 w-4" /> Vérifier ma restitution
        </button>

        {reviewMode && onGiveUp && (
          confirmGiveUp ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onGiveUp}
                className="btn flex-1 border border-red-400/25 bg-red-400/10 text-red-300 hover:bg-red-400/15"
              >
                Confirmer l’échec
              </button>
              <button type="button" onClick={() => setConfirmGiveUp(false)} className="btn-ghost flex-1">
                Annuler
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmGiveUp(true)} className="btn-ghost w-full">
              <Eraser className="h-4 w-4" /> Je ne sais pas
            </button>
          )
        )}
      </div>

      <p className="text-center text-[10px] leading-relaxed text-slate-600">
        Vérification souple sur la ponctuation et les majuscules, stricte sur l’orthographe.
      </p>
    </div>
  );
}
