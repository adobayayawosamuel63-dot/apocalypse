import { Check, Lock } from 'lucide-react';
import { LEVELS } from '../../data/levels';

export default function LevelStepper({ activeLevel, levels, maxUnlocked, onSelect }) {
  return (
    <div className="surface px-2 py-3 sm:px-3" role="tablist" aria-label="Niveaux d’apprentissage">
      <div className="grid grid-cols-5 gap-1">
        {LEVELS.map((level) => {
          const Icon = level.icon;
          const done = levels[level.id - 1];
          const active = activeLevel === level.id;
          const locked = level.id > maxUnlocked;
          return (
            <button
              key={level.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Niveau ${level.id} — ${level.name}${locked ? ' (verrouillé)' : ''}`}
              disabled={locked}
              onClick={() => onSelect(level.id)}
              className={`group relative flex flex-col items-center gap-1.5 rounded-xl px-1 py-2 transition ${
                active ? 'bg-gold-500/10' : 'hover:bg-white/[0.04]'
              } ${locked ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold transition ${
                  done && !active
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                    : active
                      ? 'border-gold-400/50 bg-gold-400/15 text-gold-200 shadow-[0_0_18px_-4px_rgba(212,164,80,0.5)]'
                      : 'border-white/10 bg-white/[0.03] text-slate-400'
                }`}
              >
                {done && !active ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-3.5 w-3.5" /> : <Icon className="h-4 w-4" />}
              </span>
              <span
                className={`text-[9px] font-medium uppercase tracking-wide ${
                  active ? 'text-gold-200' : locked ? 'text-slate-600' : 'text-slate-500'
                }`}
              >
                {level.short}
              </span>
              {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
