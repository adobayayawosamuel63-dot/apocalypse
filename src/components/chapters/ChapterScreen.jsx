import { ArrowLeft, CalendarClock, CheckCircle2, ChevronRight } from 'lucide-react';
import { BOOK, getChapterVerses } from '../../data/verses';
import { chapterStats, firstIncompleteLevel, getLevels, isDue } from '../../lib/progress';
import { dayKey } from '../../lib/dates';
import { useProgress } from '../../state/ProgressProvider';
import IconButton from '../IconButton';

export default function ChapterScreen({ chapter, onBack, onStartVerse }) {
  const { verses } = useProgress();
  const chapterVerses = getChapterVerses(chapter);
  const stats = chapterStats(verses, chapter);
  const today = dayKey();

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-center gap-3">
        <IconButton label="Retour au parcours" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </IconButton>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400/80">Chapitre</p>
          <h1 className="truncate font-serif text-2xl text-slate-50">
            {BOOK} {chapter}
          </h1>
        </div>
        <div className="text-right">
          <p className="font-serif text-2xl leading-none text-gold-300">{stats.percent}%</p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500">maîtrise</p>
        </div>
      </div>

      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 transition-all duration-700"
            style={{ width: `${stats.percent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            {stats.mastered} / {stats.total} versets maîtrisés
          </span>
          <span>
            {stats.levelsDone} / {stats.levelsTotal} niveaux
          </span>
        </div>
      </div>

      <section className="space-y-3">
        {chapterVerses.map((verse) => {
          const levels = getLevels(verses, verse.id);
          const mastered = levels.every(Boolean);
          const due = isDue(verses, verse.id, today);
          const currentLevel = firstIncompleteLevel(verses, verse.id);
          return (
            <button
              key={verse.id}
              type="button"
              onClick={() => onStartVerse(verse.id, currentLevel)}
              className="group block w-full rounded-2xl border border-white/[0.06] bg-night-900/60 p-4 text-left transition hover:border-gold-500/25 hover:bg-night-850/80 active:scale-[0.995]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] font-serif text-base text-gold-300">
                  {verse.verset}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[13px] font-semibold text-slate-200">{verse.reference}</span>
                    {mastered && (
                      <span className="chip border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> Maîtrisé
                      </span>
                    )}
                    {due && (
                      <span className="chip border-gold-400/25 bg-gold-400/10 text-gold-300">
                        <CalendarClock className="h-3 w-3" /> À réviser
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 font-serif text-[15px] leading-snug text-slate-400">{verse.texte}</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    {levels.map((done, index) => (
                      <span
                        key={index}
                        title={`Niveau ${index + 1}`}
                        className={`h-1.5 flex-1 rounded-full ${
                          done ? 'bg-emerald-400/80' : index + 1 === currentLevel ? 'bg-gold-400/70' : 'bg-white/10'
                        }`}
                      />
                    ))}
                    <span className="ml-2 shrink-0 text-[10px] font-medium text-slate-500">{levels.filter(Boolean).length}/5</span>
                  </div>
                </div>
                <ChevronRight className="mt-3 h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-gold-300" />
              </div>
            </button>
          );
        })}
      </section>

      <p className="pt-1 text-center text-[11px] leading-relaxed text-slate-600">
        {chapterVerses.length} versets disponibles dans ce chapitre.
        <br />
        Les chapitres suivants seront ajoutés au fil de la mémorisation.
      </p>
    </div>
  );
}
