import { BookOpen, Check, Flame, Settings } from 'lucide-react';
import { TRANSLATION } from '../data/verses';
import { useProgress } from '../state/ProgressProvider';

export default function AppHeader({ onOpenSettings, onHome }) {
  const { streak, bestStreak, dailyCount, dailyGoal } = useProgress();
  const ratio = Math.min(1, dailyCount / dailyGoal);
  const completed = dailyCount >= dailyGoal;

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-night-950/85 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onHome}
            aria-label="Retour au parcours"
            className="group flex min-w-0 items-center gap-3 rounded-xl text-left"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-500/25 bg-gradient-to-br from-gold-500/20 to-transparent shadow-inner shadow-gold-500/10">
              <BookOpen className="h-5 w-5 text-gold-300" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-serif text-lg font-medium leading-tight text-slate-50">Apocalypse</span>
              <span className="block whitespace-nowrap text-[9px] uppercase tracking-[0.16em] text-slate-500">{TRANSLATION}</span>
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full border border-gold-500/20 bg-gold-500/[0.08] px-3 py-1.5"
              title={`Série en cours : ${streak} jour${streak > 1 ? 's' : ''} · record : ${bestStreak}`}
            >
              <Flame className={`h-4 w-4 ${streak > 0 ? 'text-gold-400' : 'text-slate-600'}`} />
              <span className="text-sm font-semibold tabular-nums text-gold-200">{streak}</span>
            </div>
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Ouvrir les réglages"
              title="Réglages"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:text-slate-100"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Objectif du jour</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-gold-500 to-gold-300'
              }`}
              style={{ width: `${ratio * 100}%` }}
            />
          </div>
          <span
            className={`flex shrink-0 items-center gap-1 text-[10px] font-semibold tabular-nums ${
              completed ? 'text-emerald-300' : 'text-slate-400'
            }`}
            title={`${dailyCount} verset(s) appris ou révisé(s) sur ${dailyGoal}`}
          >
            {completed && <Check className="h-3 w-3" />}
            {dailyCount}/{dailyGoal}
          </span>
        </div>
      </div>
    </header>
  );
}
