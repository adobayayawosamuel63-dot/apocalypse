import bible from './apocalypse.json';

export const BOOK = bible.livre;
export const TRANSLATION = bible.traduction;
export const TOTAL_CHAPTERS = bible.totalChapitres ?? 22;

export const chapters = [...(bible.chapitres ?? [])]
  .sort((a, b) => a.chapitre - b.chapitre)
  .map((chapter) => ({
    chapitre: chapter.chapitre,
    versets: [...(chapter.versets ?? [])]
      .sort((a, b) => a.verset - b.verset)
      .map((verse) => ({
        id: `${chapter.chapitre}:${verse.verset}`,
        chapitre: chapter.chapitre,
        verset: verse.verset,
        texte: verse.texte,
        reference: `${BOOK} ${chapter.chapitre}:${verse.verset}`,
      })),
  }));

export const allVerses = chapters.flatMap((chapter) => chapter.versets);

export const versesById = Object.fromEntries(allVerses.map((verse) => [verse.id, verse]));

export function getChapter(chapterNumber) {
  return chapters.find((chapter) => chapter.chapitre === Number(chapterNumber)) ?? null;
}

export function getChapterVerses(chapterNumber) {
  return getChapter(chapterNumber)?.versets ?? [];
}

export function isChapterAvailable(chapterNumber) {
  return chapters.some((chapter) => chapter.chapitre === Number(chapterNumber));
}
