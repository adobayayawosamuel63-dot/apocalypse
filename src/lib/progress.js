import { allVerses, getChapterVerses } from '../data/verses';

export const EMPTY_LEVELS = Object.freeze([false, false, false, false, false]);

export function getLevels(progress, verseId) {
  return progress[verseId]?.levels ?? EMPTY_LEVELS;
}

export function completedLevels(progress, verseId) {
  return getLevels(progress, verseId).filter(Boolean).length;
}

export function isMastered(progress, verseId) {
  return completedLevels(progress, verseId) === 5;
}

export function firstIncompleteLevel(progress, verseId) {
  const levels = getLevels(progress, verseId);
  const index = levels.findIndex((done) => !done);
  return index === -1 ? 5 : index + 1;
}

export function isDue(progress, verseId, today) {
  const entry = progress[verseId];
  return Boolean(entry?.levels?.[4] && entry.due && entry.due <= today);
}

export function chapterStats(progress, chapterNumber) {
  const verses = getChapterVerses(chapterNumber);
  if (!verses.length) {
    return { total: 0, mastered: 0, started: 0, percent: 0, levelsDone: 0, levelsTotal: 0 };
  }
  let levelsDone = 0;
  let mastered = 0;
  let started = 0;

  for (const verse of verses) {
    const levels = getLevels(progress, verse.id);
    const done = levels.filter(Boolean).length;
    levelsDone += done;
    if (done === 5) mastered += 1;
    if (done > 0) started += 1;
  }

  const levelsTotal = verses.length * 5;
  return {
    total: verses.length,
    mastered,
    started,
    percent: Math.round((levelsDone / levelsTotal) * 100),
    levelsDone,
    levelsTotal,
  };
}

export function overallStats(progress) {
  const mastered = allVerses.filter((verse) => isMastered(progress, verse.id)).length;
  const started = allVerses.filter((verse) => completedLevels(progress, verse.id) > 0).length;
  const levelsDone = allVerses.reduce((sum, verse) => sum + completedLevels(progress, verse.id), 0);
  const levelsTotal = allVerses.length * 5;

  return {
    mastered,
    started,
    total: allVerses.length,
    percent: levelsTotal ? Math.round((levelsDone / levelsTotal) * 100) : 0,
    levelsDone,
    levelsTotal,
  };
}

export function findContinueTarget(progress) {
  const unfinished = allVerses.find((verse) => !isMastered(progress, verse.id));
  return unfinished ?? allVerses[allVerses.length - 1] ?? null;
}
