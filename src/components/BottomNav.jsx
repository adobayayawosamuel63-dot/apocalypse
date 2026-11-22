import { BookOpen, CalendarCheck } from 'lucide-react';

const ITEMS = [
  { id: 'parcours', label: 'Parcours', icon: BookOpen },
  { id: 'reviews', label: 'Révisions', icon: CalendarCheck },
];

export default function BottomNav({ active, dueCount, onNavigate }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-night-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-stretch gap-1 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={selected ? 'page' : undefined}
              className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium transition ${
                selected ? 'text-gold-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {item.id === 'reviews' && dueCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-bold leading-none text-night-950">
                    {dueCount}
                  </span>
                )}
              </span>
              {item.label}
              {selected && <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-gold-400" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
