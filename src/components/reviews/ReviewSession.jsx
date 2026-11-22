import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarCheck, Frown } from 'lucide-react';
import { versesById } from '../../data/verses';
import { addDays, dayKey, formatDay } from '../../lib/dates';
import { nextReviewDays } from '../../lib/srs';
import { useProgress } from '../../state/ProgressProvider';
import IconButton from '../IconButton';
import Level5Recall from '../training/Level5Recall';

export default function ReviewSession({ verseId, onExit }) {
  const verse = versesById[verseId];
  const { verses, reviewSuccess, reviewFail } = useProgress();
  const [outcome, setOutcome] = useState(null);
  const entry = verses[verseId];

  if (!verse) {
    return (
      <div className="surface p-6 text-center text-sm text-slate-400">
        Ce verset est introuvable.
        <button type="button" onClick={onExit} className="btn-ghost mt-4 w-full">
          Retour aux révisions
        </button>
      </div>
    );
  }

  function handleSuccess() {
    const days = nextReviewDays(entry?.step ?? 0);
    reviewSuccess(verseId);
    setOutcome({ success: true, days });
  }

  function handleFail() {
    reviewFail(verseId);
    setOutcome({ success: false });
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-center gap-3">
        <IconButton label="Retour aux révisions" onClick={onExit}>
          <ArrowLeft className="h-4 w-4" />
        </IconButton>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400/80">Révision · niveau 5</p>
          <h1 className="truncate font-serif text-2xl text-slate-50">{verse.reference}</h1>
        </div>
      </div>

      {outcome ? (
        <section className="surface animate-pop overflow-hidden p-6 text-center sm:p-8">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${
              outcome.success
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                : 'border-red-400/25 bg-red-400/10 text-red-300'
            }`}
          >
            {outcome.success ? <CalendarCheck className="h-8 w-8" /> : <Frown className="h-8 w-8" />}
          </div>
          <h2 className="mt-4 font-serif text-2xl text-slate-50">
            {outcome.success ? 'Révision réussie' : 'À revoir demain'}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
            {outcome.success
              ? `Le texte est solide. Prochaine révision dans ${outcome.days} jour${
                  outcome.days > 1 ? 's' : ''
                }, le ${formatDay(addDays(dayKey(), outcome.days), 'long')}.`
              : 'Ce n’est pas grave : le verset revient demain, à J+1, pour consolider les cinq niveaux.'}
          </p>
          <button type="button" onClick={onExit} className="btn-gold mt-6 w-full">
            Retour aux révisions <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      ) : (
        <section className="surface overflow-hidden">
          <div className="border-b border-white/5 bg-gradient-to-r from-gold-500/[0.06] to-transparent px-4 py-4 sm:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400/90">Sans filet</p>
            <h2 className="mt-1 font-serif text-xl text-slate-100">Restituez le verset de mémoire</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">Votre réponse détermine la prochaine échéance.</p>
          </div>
          <div className="p-4 sm:p-6">
            <Level5Recall verse={verse} onMastered={handleSuccess} onGiveUp={handleFail} reviewMode />
          </div>
        </section>
      )}
    </div>
  );
}
