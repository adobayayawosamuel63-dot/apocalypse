import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { versesById } from '../data/verses';
import { addDays, dayKey, daysBetween } from '../lib/dates';
import { createDefaultState, emptyVerse, loadState, saveState } from '../lib/storage';
import { REVIEW_INTERVALS } from '../lib/srs';

const ProgressContext = createContext(null);

function bumpStreak(stats, today) {
  if (stats.lastStudyDate === today) return stats;
  const isConsecutive = Boolean(stats.lastStudyDate) && daysBetween(stats.lastStudyDate, today) === 1;
  const streak = isConsecutive ? stats.streak + 1 : 1;
  return {
    ...stats,
    streak,
    bestStreak: Math.max(stats.bestStreak, streak),
    lastStudyDate: today,
  };
}

function addDailyVerse(stats, today, verseId) {
  const ids = new Set(stats.days[today] ?? []);
  ids.add(verseId);
  const days = { ...stats.days, [today]: [...ids] };
  const keys = Object.keys(days).sort();
  if (keys.length > 90) {
    for (const key of keys.slice(0, keys.length - 90)) delete days[key];
  }
  return { ...stats, days };
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(loadState);
  const today = dayKey();

  useEffect(() => {
    saveState(state);
  }, [state]);

  const completeLevel = useCallback((verseId, level) => {
    setState((previous) => {
      const todayKey = dayKey();
      const current = previous.verses[verseId] ?? emptyVerse();
      const levels = [...current.levels];
      const wasMastered = Boolean(levels[4]);
      levels[Math.min(Math.max(level, 1), 5) - 1] = true;

      const entry = {
        ...current,
        levels,
        lastActivityAt: new Date().toISOString(),
      };

      if (level === 5 && !wasMastered) {
        entry.step = 0;
        entry.due = addDays(todayKey, REVIEW_INTERVALS[0]);
        entry.masteredAt = todayKey;
      }

      let stats = bumpStreak({ ...previous.stats, days: { ...previous.stats.days } }, todayKey);
      if (level === 5) stats = addDailyVerse(stats, todayKey, verseId);

      return {
        ...previous,
        verses: { ...previous.verses, [verseId]: entry },
        stats,
      };
    });
  }, []);

  const reviewSuccess = useCallback((verseId) => {
    setState((previous) => {
      const todayKey = dayKey();
      const current = previous.verses[verseId];
      if (!current) return previous;
      const step = Math.min((current.step ?? 0) + 1, REVIEW_INTERVALS.length - 1);
      const entry = {
        ...current,
        step,
        due: addDays(todayKey, REVIEW_INTERVALS[step]),
        reviews: (current.reviews ?? 0) + 1,
        lastReviewedAt: todayKey,
      };
      let stats = bumpStreak({ ...previous.stats, days: { ...previous.stats.days } }, todayKey);
      stats = addDailyVerse(stats, todayKey, verseId);
      return { ...previous, verses: { ...previous.verses, [verseId]: entry }, stats };
    });
  }, []);

  const reviewFail = useCallback((verseId) => {
    setState((previous) => {
      const todayKey = dayKey();
      const current = previous.verses[verseId];
      if (!current) return previous;
      const entry = {
        ...current,
        step: 0,
        due: addDays(todayKey, REVIEW_INTERVALS[0]),
        reviews: (current.reviews ?? 0) + 1,
        lapses: (current.lapses ?? 0) + 1,
        lastReviewedAt: todayKey,
      };
      let stats = bumpStreak({ ...previous.stats, days: { ...previous.stats.days } }, todayKey);
      stats = addDailyVerse(stats, todayKey, verseId);
      return { ...previous, verses: { ...previous.verses, [verseId]: entry }, stats };
    });
  }, []);

  const setDailyGoal = useCallback((goal) => {
    setState((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        dailyGoal: Math.min(10, Math.max(1, Math.round(goal))),
      },
    }));
  }, []);

  const enableReminder = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    if (permission === 'granted') {
      setState((previous) => ({
        ...previous,
        settings: { ...previous.settings, reminder: true },
      }));
      try {
        new Notification('Rappels activés', {
          body: 'Vous serez prévenu à l’ouverture de l’app quand des versets sont à réviser.',
          icon: '/icons/icon-192.png',
          tag: 'apocalypse-enabled',
        });
      } catch {
        // Certains navigateurs autorisent la permission sans Notification constructeur.
      }
    }
    return permission;
  }, []);

  const disableReminder = useCallback(() => {
    setState((previous) => ({
      ...previous,
      settings: { ...previous.settings, reminder: false },
    }));
  }, []);

  const dueVerses = useMemo(
    () =>
      Object.entries(state.verses)
        .filter(([, entry]) => entry.levels?.[4] && entry.due && entry.due <= today)
        .map(([id, entry]) => ({ verse: versesById[id], entry }))
        .filter((item) => item.verse)
        .sort((a, b) => a.entry.due.localeCompare(b.entry.due)),
    [state.verses, today]
  );

  const upcomingVerses = useMemo(
    () =>
      Object.entries(state.verses)
        .filter(([, entry]) => entry.levels?.[4] && entry.due && entry.due > today)
        .map(([id, entry]) => ({ verse: versesById[id], entry }))
        .filter((item) => item.verse)
        .sort((a, b) => a.entry.due.localeCompare(b.entry.due)),
    [state.verses, today]
  );

  const todayVerseIds = state.stats.days[today] ?? [];

  const streakIsAlive =
    state.stats.lastStudyDate === today ||
    (state.stats.lastStudyDate && daysBetween(state.stats.lastStudyDate, today) === 1);
  const streak = streakIsAlive ? state.stats.streak : 0;

  useEffect(() => {
    const { reminder, lastNotified } = state.settings;
    if (!reminder || typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted' || dueVerses.length === 0 || lastNotified === today) return;

    const timer = window.setTimeout(() => {
      try {
        const notification = new Notification('Révisions du jour', {
          body: `${dueVerses.length} verset${dueVerses.length > 1 ? 's' : ''} vous attend${
            dueVerses.length > 1 ? 'ent' : ''
          } pour garder votre série.`,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: 'apocalypse-due',
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        setState((previous) => ({
          ...previous,
          settings: { ...previous.settings, lastNotified: today },
        }));
      } catch {
        // Notification impossible : le rappel visuel reste affiché dans l'app.
      }
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [state.settings, dueVerses.length, today]);

  const value = useMemo(
    () => ({
      state,
      verses: state.verses,
      settings: state.settings,
      stats: state.stats,
      dueVerses,
      upcomingVerses,
      dailyCount: todayVerseIds.length,
      dailyGoal: state.settings.dailyGoal,
      todayVerseIds,
      streak,
      bestStreak: state.stats.bestStreak,
      completeLevel,
      reviewSuccess,
      reviewFail,
      setDailyGoal,
      enableReminder,
      disableReminder,
      notificationsSupported: typeof window !== 'undefined' && 'Notification' in window,
    }),
    [
      state,
      dueVerses,
      upcomingVerses,
      todayVerseIds,
      streak,
      completeLevel,
      reviewSuccess,
      reviewFail,
      setDailyGoal,
      enableReminder,
      disableReminder,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress doit être utilisé dans ProgressProvider');
  return context;
}

export { createDefaultState };
