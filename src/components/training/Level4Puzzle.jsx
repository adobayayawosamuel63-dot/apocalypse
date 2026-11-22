import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { buildSegments, shuffle, splitWords } from '../../lib/text';

export default function Level4Puzzle({ verse, onComplete }) {
  const { chunks, bank } = useMemo(() => {
    const segments = buildSegments(splitWords(verse.texte));
    return {
      chunks: segments,
      bank: shuffle(segments.map((segment, index) => ({ id: index, text: segment.join(' ') }))),
    };
  }, [verse.texte]);

  const [order, setOrder] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [solved, setSolved] = useState(false);

  const placed = new Set(order);

  function add(id) {
    if (solved || placed.has(id)) return;
    setOrder((previous) => [...previous, id]);
    setFeedback(null);
  }

  function remove(index) {
    if (solved) return;
    setOrder((previous) => previous.filter((_, position) => position !== index));
    setFeedback(null);
  }

  function reset() {
    setOrder([]);
    setFeedback(null);
  }

  function check() {
    if (solved) return;
    if (order.length < chunks.length) {
      setFeedback('incomplete');
      return;
    }
    if (order.some((id, index) => id !== index)) {
      setFeedback('error');
      return;
    }
    setSolved(true);
    onComplete();
  }

  return (
    <div className="space-y-5">
      <div
        className={`min-h-[92px] rounded-2xl border p-3 transition ${
          feedback === 'error' ? 'border-red-400/30 bg-red-400/[0.04]' : 'border-white/[0.08] bg-night-950/50'
        }`}
      >
        {order.length === 0 ? (
          <p className="flex min-h-[68px] items-center justify-center px-3 text-center text-xs leading-relaxed text-slate-600">
            Touchez les segments ci-dessous dans l’ordre du verset.
          </p>
        ) : (
          <div className={`flex flex-wrap gap-2 ${feedback === 'error' ? 'animate-shake' : ''}`}>
            {order.map((id, index) => (
              <button
                key={`${id}-${index}`}
                type="button"
                onClick={() => remove(index)}
                title="Retirer ce segment"
                className="group inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1.5 font-serif text-sm text-emerald-100 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
              >
                <span className="text-[9px] text-emerald-400/60 group-hover:text-red-300/70">{index + 1}</span>
                {chunks[id].join(' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {bank.map(({ id, text }) => {
          if (placed.has(id)) return null;
          return (
            <button
              key={id}
              type="button"
              disabled={solved}
              onClick={() => add(id)}
              className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 font-serif text-sm text-slate-200 transition hover:border-gold-400/40 hover:bg-gold-400/10 hover:text-gold-200 active:scale-95"
            >
              {text}
            </button>
          );
        })}
        {order.length === 0 && (
          <span className="flex items-center text-[11px] text-slate-600">Les segments sont mélangés.</span>
        )}
      </div>

      {feedback && (
        <div
          className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[11px] leading-relaxed ${
            feedback === 'error'
              ? 'border-red-400/20 bg-red-400/[0.06] text-red-300'
              : 'border-amber-400/20 bg-amber-400/[0.06] text-amber-300'
          }`}
        >
          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {feedback === 'error'
            ? 'L’ordre n’est pas encore bon. Touchez un segment placé pour le retirer, puis recommencez.'
            : 'Placez tous les segments avant de vérifier.'}
        </div>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={check} className="btn-emerald flex-1">
          <CheckCircle2 className="h-4 w-4" /> Vérifier
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!order.length}
          className="btn-ghost px-4"
          aria-label="Effacer l’assemblage"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
