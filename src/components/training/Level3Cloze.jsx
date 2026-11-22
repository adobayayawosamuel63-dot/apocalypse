import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import {
  normalizeWord,
  pickBlankIndices,
  shuffle,
  splitWords,
  stripPunctuation,
  trailingPunctuation,
} from '../../lib/text';

export default function Level3Cloze({ verse, onComplete }) {
  const words = useMemo(() => splitWords(verse.texte), [verse.texte]);
  const { blanks, bank } = useMemo(() => {
    const indices = pickBlankIndices(words);
    const items = indices.map((index) => ({
      id: `${index}-${normalizeWord(words[index])}`,
      word: stripPunctuation(words[index]),
      target: index,
    }));
    return { blanks: new Set(indices), bank: shuffle(items) };
  }, [words]);

  const [answers, setAnswers] = useState({});
  const [active, setActive] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [solved, setSolved] = useState(false);

  const usedIds = new Set(Object.values(answers).map((answer) => answer.id));
  const firstEmpty = [...blanks].find((index) => !answers[index]);

  function selectBlank(index) {
    if (solved) return;
    if (answers[index]) {
      setAnswers((previous) => {
        const next = { ...previous };
        delete next[index];
        return next;
      });
      setActive(index);
      setFeedback(null);
      return;
    }
    setActive((previous) => (previous === index ? null : index));
    setFeedback(null);
  }

  function place(item) {
    if (solved || usedIds.has(item.id)) return;
    const target = active ?? firstEmpty;
    if (target == null) return;
    setAnswers((previous) => ({ ...previous, [target]: { id: item.id, word: item.word } }));
    setActive(null);
    setFeedback(null);
  }

  function reset() {
    setAnswers({});
    setActive(null);
    setFeedback(null);
  }

  function check() {
    if (solved) return;
    if (Object.keys(answers).length < blanks.size) {
      setFeedback('incomplete');
      return;
    }
    const wrong = [...blanks].filter(
      (index) => normalizeWord(answers[index]?.word ?? '') !== normalizeWord(words[index])
    );
    if (wrong.length) {
      setFeedback('error');
      return;
    }
    setFeedback(null);
    setSolved(true);
    onComplete();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/[0.06] bg-night-950/60 p-4 sm:p-6">
        <p className="verse">
          {words.map((word, index) => {
            if (!blanks.has(index)) {
              return (
                <span key={`${word}-${index}`} className="mr-1.5">
                  {word}
                </span>
              );
            }
            const answer = answers[index];
            const isWrong =
              feedback === 'error' && answer && normalizeWord(answer.word) !== normalizeWord(words[index]);
            const isActive = active === index;
            const ending = trailingPunctuation(word);
            return (
              <span key={`${word}-${index}`} className="mr-1.5 inline-flex items-baseline">
                <button
                  type="button"
                  onClick={() => selectBlank(index)}
                  aria-label={answer ? `Mot placé : ${answer.word}. Toucher pour retirer.` : 'Blanc à remplir'}
                  className={`inline-flex min-w-[3ch] items-center justify-center rounded-md border-b-2 px-1 pb-0.5 font-serif text-[0.95em] transition ${
                    isWrong
                      ? 'animate-shake border-red-400/70 bg-red-400/10 text-red-300'
                      : answer
                        ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
                        : feedback === 'incomplete'
                          ? 'border-amber-400/70 bg-amber-400/[0.06] text-amber-200'
                          : isActive
                            ? 'border-gold-400 bg-gold-400/10 text-gold-200'
                            : 'border-dashed border-slate-500/60 text-slate-500 hover:border-gold-400/60'
                  }`}
                >
                  {answer ? answer.word : '______'}
                </button>
                {ending && <span className="text-slate-300">{ending}</span>}
              </span>
            );
          })}
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-white/10 bg-night-950/50 p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Banque de mots</p>
          <button
            type="button"
            onClick={reset}
            disabled={!Object.keys(answers).length || solved}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 transition hover:text-slate-300 disabled:opacity-30"
          >
            <RotateCcw className="h-3 w-3" /> Recommencer
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {bank.map((item) => {
            const used = usedIds.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                disabled={used || solved}
                onClick={() => place(item)}
                className={`rounded-lg border px-2.5 py-1.5 font-serif text-sm transition ${
                  used
                    ? 'border-white/5 bg-white/[0.02] text-slate-700 line-through'
                    : 'border-white/10 bg-white/[0.05] text-slate-200 hover:border-gold-400/40 hover:bg-gold-400/10 hover:text-gold-200 active:scale-95'
                }`}
              >
                {item.word}
              </button>
            );
          })}
        </div>
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
            ? 'Certains mots ne sont pas à la bonne place. Les cases rouges sont à corriger.'
            : 'Il reste des blancs à remplir avant de vérifier.'}
        </div>
      )}

      <button type="button" onClick={check} className="btn-emerald w-full">
        <CheckCircle2 className="h-4 w-4" /> Vérifier
      </button>
    </div>
  );
}
