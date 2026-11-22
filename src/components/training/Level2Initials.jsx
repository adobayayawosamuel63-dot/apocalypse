import { useMemo, useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { maskWord, splitWords } from '../../lib/text';

export default function Level2Initials({ verse, onComplete }) {
  const words = useMemo(() => splitWords(verse.texte), [verse.texte]);
  const [revealed, setRevealed] = useState(() => new Set());

  function reveal(index) {
    setRevealed((previous) => {
      if (previous.has(index)) return previous;
      const next = new Set(previous);
      next.add(index);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2 rounded-xl border border-gold-400/15 bg-gold-400/[0.05] px-3 py-2.5 text-[11px] leading-relaxed text-gold-200/90">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Récitez le verset à voix haute. Un mot vous échappe ? Touchez ses initiales pour le révéler.
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-night-950/60 p-4 sm:p-6">
        <p className="font-serif text-[1.15rem] leading-[2.1] text-slate-300 sm:text-[1.3rem]">
          {words.map((word, index) => {
            const isRevealed = revealed.has(index);
            return (
              <button
                key={`${word}-${index}`}
                type="button"
                onClick={() => reveal(index)}
                title={isRevealed ? word : 'Révéler le mot'}
                className={`mr-1.5 inline rounded px-0.5 align-baseline transition ${
                  isRevealed
                    ? 'bg-gold-400/10 text-gold-200'
                    : 'text-slate-500 decoration-white/20 decoration-dotted underline-offset-4 hover:bg-white/[0.05] hover:text-slate-300 hover:underline'
                }`}
              >
                {isRevealed ? word : maskWord(word)}
              </button>
            );
          })}
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" /> {revealed.size} mot{revealed.size === 1 ? '' : 's'} révélé
          {revealed.size === 1 ? '' : 's'}
        </span>
        <span>{words.length} mots</span>
      </div>

      <button type="button" onClick={onComplete} className="btn-emerald w-full">
        J’ai récité le verset sans erreur
      </button>
    </div>
  );
}
