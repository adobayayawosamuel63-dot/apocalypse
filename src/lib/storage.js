export const STORAGE_KEY = 'apocalypse-memoire-v1';
export const STATE_VERSION = 1;

export function emptyVerse() {
  return {
    levels: [false, false, false, false, false],
    step: -1,
    due: null,
    reviews: 0,
    lapses: 0,
    masteredAt: null,
    lastActivityAt: null,
    lastReviewedAt: null,
  };
}

export function createDefaultState() {
  return {
    version: STATE_VERSION,
    verses: {},
    stats: {
      streak: 0,
      bestStreak: 0,
      lastStudyDate: null,
      days: {},
    },
    settings: {
      dailyGoal: 3,
      reminder: false,
      lastNotified: null,
    },
  };
}

function sanitizeState(parsed) {
  const base = createDefaultState();
  if (!parsed || typeof parsed !== 'object' || parsed.version !== STATE_VERSION) return base;

  const verses = {};
  for (const [id, value] of Object.entries(parsed.verses ?? {})) {
    if (!value || typeof value !== 'object') continue;
    const levels = Array.from({ length: 5 }, (_, index) => Boolean(value.levels?.[index]));
    verses[id] = {
      ...emptyVerse(),
      ...value,
      levels,
      step: Number.isFinite(value.step) ? value.step : -1,
      reviews: Number.isFinite(value.reviews) ? value.reviews : 0,
      lapses: Number.isFinite(value.lapses) ? value.lapses : 0,
      due: typeof value.due === 'string' ? value.due : null,
    };
  }

  const rawGoal = Number(parsed.settings?.dailyGoal);
  const dailyGoal = Number.isFinite(rawGoal) ? Math.min(10, Math.max(1, Math.round(rawGoal))) : base.settings.dailyGoal;

  return {
    version: STATE_VERSION,
    verses,
    stats: {
      ...base.stats,
      ...(parsed.stats ?? {}),
      streak: Number(parsed.stats?.streak) || 0,
      bestStreak: Number(parsed.stats?.bestStreak) || 0,
      lastStudyDate: typeof parsed.stats?.lastStudyDate === 'string' ? parsed.stats.lastStudyDate : null,
      days: parsed.stats?.days && typeof parsed.stats.days === 'object' ? parsed.stats.days : {},
    },
    settings: {
      ...base.settings,
      ...(parsed.settings ?? {}),
      dailyGoal,
      reminder: Boolean(parsed.settings?.reminder),
      lastNotified: typeof parsed.settings?.lastNotified === 'string' ? parsed.settings.lastNotified : null,
    },
  };
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    return sanitizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Stockage indisponible (navigation privée, quota) : l'app continue en mémoire.
  }
}
