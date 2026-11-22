import { ArrowRight, CalendarCheck, Check, RotateCcw } from 'lucide-react';
import { formatDay } from '../../lib/dates';

export default function LevelComplete({ completion, hasNext, onNext, onBack, onPractice }) {
  const isMastery = completion.level === 5;

  return (
    <section className="surface animate-pop overflow-hidden">
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-500/[0.14] to-transparent p-6 text-center sm:p-8">
        <div aria-hidden className="absolute left-1/2 top-4 h-32 w-32 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 shadow-lg shadow-emerald-500/10">
          <Check className="h-8 w-8 text-emerald-300" strokeWidth={2.5} />
        </div>
        <h2 className="relative mt-4 font-serif text-2xl text-slate-50 sm:text-3xl">
          {isMastery ? 'Verset maîtrisé' : `Niveau ${completion.level} validé`}
        </h2>
        <p className="relative mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-slate-400">
          {isMastery
            ? completion.newlyMastered
              ? 'La restitution est fidèle. Votre première révision est programmée.'
              : 'La restitution est fidèle. Continuez à entretenir votre mémoire.'
            : completion.level === 4
              ? 'Le puzzle est reconstitué. Il reste la restitution de mémoire.'
              : `Le niveau ${completion.level + 1} se débloque à son tour.`}
        </p>
        {isMastery && completion.newlyMastered && (
          <div className="relative mx-auto mt-4 inline-flex items-center gap-2 rounded-xl border border-gold-400/20 bg-gold-400/[0.08] px-3 py-2 text-xs text-gold-200">
            <CalendarCheck className="h-4 w-4" /> Prochaine révision {formatDay(completion.due)} · J+1
          </div>
        )}
      </div>

      <div className="space-y-2 p-4 sm:p-5">
        {hasNext ? (
          <button type="button" onClick={onNext} className="btn-emerald w-full">
            Passer au niveau {completion.level + 1} <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={onBack} className="btn-gold w-full">
            Retour aux versets <ArrowRight className="h-4 w-4" />
          </button>
        )}

        {isMastery && !hasNext ? (
          <button type="button" onClick={onPractice} className="btn-ghost w-full">
            <RotateCcw className="h-4 w-4" /> Refaire l’exercice de mémoire
          </button>
        ) : (
          <button type="button" onClick={onBack} className="btn-ghost w-full">
            Revenir au chapitre
          </button>
        )}
      </div>
    </section>
  );
}
