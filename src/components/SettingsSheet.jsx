import { useEffect, useState } from 'react';
import { Bell, Minus, Plus, ShieldCheck, X } from 'lucide-react';
import { useProgress } from '../state/ProgressProvider';

export default function SettingsSheet({ open, onClose }) {
  const { settings, setDailyGoal, enableReminder, disableReminder, notificationsSupported } = useProgress();
  const [requestState, setRequestState] = useState('idle');

  useEffect(() => {
    if (!open) {
      setRequestState('idle');
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const permission = notificationsSupported ? Notification.permission : 'unsupported';
  const reminderOn = settings.reminder && permission === 'granted';

  async function toggleReminder() {
    if (reminderOn) {
      disableReminder();
      return;
    }
    setRequestState('pending');
    const result = await enableReminder();
    setRequestState(result === 'granted' || result === 'default' ? 'idle' : result);
  }

  let reminderNote = 'Optionnel : recevez un rappel à l’ouverture de l’app lorsqu’un verset est dû.';
  if (!notificationsSupported) {
    reminderNote = 'Les notifications ne sont pas prises en charge par ce navigateur.';
  } else if (permission === 'denied' || requestState === 'denied') {
    reminderNote = 'Notifications refusées. Autorisez-les dans les réglages du navigateur pour ce site.';
  } else if (requestState === 'unsupported') {
    reminderNote = 'Les notifications ne sont pas prises en charge par ce navigateur.';
  } else if (reminderOn) {
    reminderNote = 'Rappels activés : une notification s’affiche à l’ouverture de l’app les jours de révision.';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Réglages">
      <button type="button" aria-label="Fermer les réglages" onClick={onClose} className="absolute inset-0 cursor-default bg-night-950/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-md animate-fade-up rounded-t-3xl border border-white/10 bg-night-900 p-5 shadow-2xl shadow-black/50 sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400/80">Personnaliser</p>
            <h2 className="mt-0.5 font-serif text-2xl text-slate-50">Réglages</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition hover:text-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-200">Objectif quotidien</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Versets appris ou révisés par jour</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDailyGoal(settings.dailyGoal - 1)}
                disabled={settings.dailyGoal <= 1}
                aria-label="Réduire l’objectif quotidien"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-30"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center font-serif text-2xl leading-none text-gold-200">{settings.dailyGoal}</span>
              <button
                type="button"
                onClick={() => setDailyGoal(settings.dailyGoal + 1)}
                disabled={settings.dailyGoal >= 10}
                aria-label="Augmenter l’objectif quotidien"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-30"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2.5">
              <Bell className={`mt-0.5 h-4 w-4 shrink-0 ${reminderOn ? 'text-gold-300' : 'text-slate-500'}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200">Rappel de révision</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{reminderNote}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={reminderOn}
              aria-label="Activer le rappel de révision"
              onClick={toggleReminder}
              disabled={!notificationsSupported || permission === 'denied' || requestState === 'pending'}
              className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors disabled:opacity-40 ${
                reminderOn ? 'border-emerald-400/40 bg-emerald-500/30' : 'border-white/10 bg-white/[0.06]'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full shadow transition-transform ${
                  reminderOn ? 'translate-x-6 bg-emerald-300' : 'translate-x-1 bg-slate-400'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/80" />
          <p className="text-[11px] leading-relaxed text-slate-400">
            Vos niveaux, votre série et vos dates de révision restent sur cet appareil, dans le stockage local du navigateur.
            La lecture audio utilise la voix française de votre système.
          </p>
        </div>
      </div>
    </div>
  );
}
