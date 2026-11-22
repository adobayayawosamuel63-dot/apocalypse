import { useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, Pause, TriangleAlert, Volume2 } from 'lucide-react';
import { speakFrench, speechSupported, stopSpeaking } from '../../lib/speech';

export default function Level1Read({ verse, onComplete }) {
  const [speaking, setSpeaking] = useState(false);
  const supported = useMemo(() => speechSupported(), []);

  useEffect(() => () => stopSpeaking(), []);

  function toggleAudio() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const utterance = speakFrench(verse.texte, {
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
    if (utterance) setSpeaking(true);
  }

  function complete() {
    stopSpeaking();
    setSpeaking(false);
    onComplete();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/[0.06] bg-night-950/60 p-4 sm:p-6">
        <p className="verse">{verse.texte}</p>
        <p className="mt-4 text-right font-serif text-sm italic text-slate-500">{verse.reference}</p>
      </div>

      <button type="button" onClick={toggleAudio} disabled={!supported} className="btn-ghost w-full">
        {speaking ? <Pause className="h-4 w-4 text-gold-300" /> : <Volume2 className="h-4 w-4 text-gold-300" />}
        {speaking ? 'Arrêter la lecture' : 'Écouter le verset'}
      </button>

      {!supported && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3 py-2.5 text-[11px] leading-relaxed text-amber-300">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          La synthèse vocale n’est pas disponible sur ce navigateur. Lisez le texte à voix haute.
        </p>
      )}

      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-[11px] leading-relaxed text-slate-400">
        Astuce : lisez à voix haute en même temps que la voix, puis répétez le verset sans regarder le texte.
      </div>

      <button type="button" onClick={complete} className="btn-emerald w-full">
        <BookOpenCheck className="h-4 w-4" /> J’ai lu et compris
      </button>
    </div>
  );
}
