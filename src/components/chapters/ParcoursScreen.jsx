import { ArrowRight, CalendarClock, CheckCircle2, Lock, Target } from 'lucide-react';
import { TOTAL_CHAPTERS, TRANSLATION, chapters } from '../../data/verses';
import { chapterStats, findContinueTarget, firstIncompleteLevel, overallStats } from '../../lib/progress';
import { useProgress } from '../../state/ProgressProvider';

export default function ParcoursScreen({ onOpenChapter, onOpenReviews }) {
  const { verses, dueVerses, dailyCount, dailyGoal } = useProgress();
  const overall = overallStats(verses);
  const target = findContinueTarget(verses);
  const started = overall.started > 0;
  const remaining = Math.max(0, dailyGoal - dailyCount);

  return (
    <div className="animate-fade-up space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-gold-500/15 bg-gradient-to-br from-night-850 via-night-900 to-night-950 p-5 shadow-2xl shadow-black/30 sm:p-7">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-emerald-500/[0.06] blur-3xl" />

        <p className="relative text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-400/90">Parcours de mémorisation</p>
        <h1 className="relative mt-2 font-serif text-[2rem] leading-[1.1] text-slate-50 sm:text-4xl">
          L’Apocalypse,
          <br />
          <span className="italic text-gold-300">mot pour mot.</span>
        </h1>
        <p className="relative mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          Cinq niveaux par verset, de la première écoute à la restitution intégrale. Un peu chaque jour.
        </p>

        <div className="relative mt-6 flex items-end justify-between gap-3 text-xs">
          <span className="text-slate-400">
            <span className="font-semibold text-slate-200">{overall.mastered}</span> / {overall.total} versets maîtrisés
          </span>
          <span className="font-serif text-2xl leading-none text-gold-300">{overall.percent}%</span>
        </div>
        <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 transition-all duration-700"
            style={{ width: `${overall.percent}%` }}
          />
        </div>

        <div className="relative mt-5 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => target && onOpenChapter(target.chapitre)} className="btn-gold flex-1">
            {started ? 'Continuer' : 'Commencer'} <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={onOpenReviews} className="btn-ghost flex-1 sm:flex-none">
            <CalendarClock className="h-4 w-4" /> Révisions
            {dueVerses.length > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-night-950">
                {dueVerses.length}
              </span>
            )}
          </button>
        </div>

        {started && target && (
          <p className="relative mt-3 text-[11px] text-slate-500">
            Reprise : {target.reference} · niveau {firstIncompleteLevel(verses, target.id)}/5
          </p>
        )}
      </section>

      {dueVerses.length > 0 && (
        <button
          type="button"
          onClick={onOpenReviews}
          className="group flex w-full items-center gap-3 rounded-2xl border border-gold-500/25 bg-gold-500/[0.07] p-4 text-left transition hover:border-gold-400/40 hover:bg-gold-500/[0.1]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
            <CalendarClock className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-gold-200">
              {dueVerses.length} verset{dueVerses.length > 1 ? 's' : ''} à réviser
            </span>
            <span className="block text-[11px] text-slate-400">Une révision courte suffit pour aujourd’hui.</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-gold-400/70 transition group-hover:translate-x-0.5" />
        </button>
      )}

      {remaining > 0 && (
        <div className="surface p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gold-300">
              <Target className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-slate-200">Objectif du jour</p>
                <p className="text-[11px] font-semibold tabular-nums text-slate-400">
                  {dailyCount} / {dailyGoal}
                </p>
              </div>
              <div className="mt-2 flex gap-1.5">
                {Array.from({ length: dailyGoal }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${index < dailyCount ? 'bg-emerald-400' : 'bg-white/[0.07]'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Encore {remaining} verset{remaining > 1 ? 's' : ''} à apprendre ou réviser pour valider la journée.
          </p>
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-end justify-between px-1">
          <div>
            <h2 className="font-serif text-xl text-slate-100">Les chapitres</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {chapters.length} chapitre{chapters.length > 1 ? 's' : ''} disponible{chapters.length > 1 ? 's' : ''} · {TOTAL_CHAPTERS} au total
            </p>
          </div>
          <span className="chip">
            <CheckCircle2 className="h-3 w-3 text-emerald-400/80" /> {overall.mastered} maîtrisé{overall.mastered === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: TOTAL_CHAPTERS }, (_, index) => index + 1).map((number) => {
            const available = chapters.some((chapter) => chapter.chapitre === number);
            const stats = chapterStats(verses, number);
            return (
              <button
                key={number}
                type="button"
                disabled={!available}
                onClick={() => onOpenChapter(number)}
                className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                  available
                    ? 'border-white/[0.07] bg-night-900/70 hover:-translate-y-0.5 hover:border-gold-500/30 hover:bg-night-850'
                    : 'cursor-not-allowed border-white/[0.03] bg-white/[0.015] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">Chapitre</span>
                  {available && stats.mastered === stats.total ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  ) : !available ? (
                    <Lock className="h-3.5 w-3.5 text-slate-600" />
                  ) : null}
                </div>
                <p className={`mt-1 font-serif text-3xl leading-none ${available ? 'text-slate-100' : 'text-slate-600'}`}>
                  {number}
                </p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${available ? 'bg-gradient-to-r from-gold-500 to-gold-300' : 'bg-transparent'}`}
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                  {available ? `${stats.mastered}/${stats.total} maîtrisés · ${stats.percent}%` : 'Bientôt disponible'}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <p className="px-1 pt-1 text-center text-[11px] leading-relaxed text-slate-600">
        « Heureux celui qui lit et ceux qui entendent les paroles de la prophétie… »
        <br />
        Apocalypse 1:3 · {TRANSLATION}
      </p>
    </div>
  );
}
