import { ArrowLeft, ArrowRight, CalendarCheck, CalendarClock, CheckCircle2, History, Timer } from 'lucide-react';
import { dayKey, dueLabel, formatDay } from '../../lib/dates';
import { REVIEW_INTERVALS } from '../../lib/srs';
import { useProgress } from '../../state/ProgressProvider';
import IconButton from '../IconButton';

export default function ReviewsScreen({ onStartReview, onBack }) {
  const { dueVerses, upcomingVerses } = useProgress();
  const today = dayKey();

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-center gap-3">
        <IconButton label="Retour au parcours" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </IconButton>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400/80">Répétition espacée</p>
          <h1 className="truncate font-serif text-2xl text-slate-50">Révisions du jour</h1>
        </div>
        <span className="hidden shrink-0 font-serif text-sm text-slate-500 sm:block">{formatDay(today, 'long')}</span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-gold-500/15 bg-gradient-to-br from-gold-500/[0.08] to-transparent p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/10 text-gold-300">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="font-serif text-2xl text-slate-50">
              {dueVerses.length}{' '}
              <span className="text-base text-slate-400">
                verset{dueVerses.length > 1 ? 's' : ''} à réviser
              </span>
            </p>
            <p className="text-[11px] text-slate-400">Un rappel doux pour ancrer durablement le texte.</p>
          </div>
        </div>
      </div>

      {dueVerses.length === 0 ? (
        <div className="surface p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-3 font-serif text-xl text-slate-100">Tout est à jour</h2>
          <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-slate-400">
            {upcomingVerses.length
              ? `Prochaine révision ${dueLabel(upcomingVerses[0].entry.due)} · ${formatDay(upcomingVerses[0].entry.due)}.`
              : 'Maîtrisez un verset au niveau 5 pour programmer votre première révision.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dueVerses.map(({ verse, entry }) => (
            <button
              key={verse.id}
              type="button"
              onClick={() => onStartReview(verse.id)}
              className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-night-900/70 p-4 text-left transition hover:border-gold-500/25 hover:bg-night-850"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/10 font-serif text-sm text-gold-300">
                {verse.verset}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-100">{verse.reference}</span>
                <span className="mt-0.5 block truncate font-serif text-[13px] text-slate-500">{verse.texte}</span>
                <span className="mt-1.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gold-400/90">
                  <Timer className="h-3 w-3" /> {dueLabel(entry.due, today)}
                </span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition group-hover:border-gold-400/30 group-hover:text-gold-300">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      )}

      <section className="surface p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-gold-400" />
          <h2 className="text-sm font-semibold text-slate-200">Rythme de répétition</h2>
        </div>
        <div className="mt-3 flex items-center gap-1">
          {REVIEW_INTERVALS.map((days, index) => (
            <div key={days} className="flex flex-1 flex-col items-center gap-1.5">
              <span className={`h-1.5 w-full rounded-full ${index === 0 ? 'bg-gold-400' : 'bg-white/10'}`} />
              <span className="text-[9px] font-medium uppercase tracking-wide text-slate-500">{days} j</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          Chaque réussite allonge l’intervalle (J+1, J+3, J+7, J+14, J+30). Un oubli ramène le verset à J+1 sans
          effacer votre maîtrise des cinq niveaux.
        </p>
      </section>

      {upcomingVerses.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">À venir</h2>
            <span className="text-[10px] text-slate-600">{upcomingVerses.length} planifié(s)</span>
          </div>
          {upcomingVerses.slice(0, 8).map(({ verse, entry }) => (
            <div
              key={verse.id}
              className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-3"
            >
              <CalendarClock className="h-4 w-4 shrink-0 text-slate-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-300">{verse.reference}</p>
                <p className="text-[10px] text-slate-600">
                  Étape {Math.min((entry.step ?? 0) + 1, REVIEW_INTERVALS.length)} / {REVIEW_INTERVALS.length}
                </p>
              </div>
              <span className="text-[11px] text-slate-400">{formatDay(entry.due)}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
