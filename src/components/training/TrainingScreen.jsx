import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { TRANSLATION, versesById } from '../../data/verses';
import { LEVELS } from '../../data/levels';
import { addDays, dayKey } from '../../lib/dates';
import { firstIncompleteLevel, getLevels } from '../../lib/progress';
import { REVIEW_INTERVALS } from '../../lib/srs';
import { useProgress } from '../../state/ProgressProvider';
import IconButton from '../IconButton';
import LevelStepper from './LevelStepper';
import LevelComplete from './LevelComplete';
import Level1Read from './Level1Read';
import Level2Initials from './Level2Initials';
import Level3Cloze from './Level3Cloze';
import Level4Puzzle from './Level4Puzzle';
import Level5Recall from './Level5Recall';

export default function TrainingScreen({ verseId, startLevel, onBack }) {
  const verse = versesById[verseId];
  const { verses, completeLevel } = useProgress();
  const levels = getLevels(verses, verseId);
  const maxUnlocked = firstIncompleteLevel(verses, verseId);
  const initialLevel = startLevel && startLevel <= maxUnlocked ? startLevel : maxUnlocked;

  const [activeLevel, setActiveLevel] = useState(initialLevel);
  const [completion, setCompletion] = useState(null);

  if (!verse) {
    return (
      <div className="surface p-6 text-center text-sm text-slate-400">
        Ce verset est introuvable.
        <button type="button" onClick={onBack} className="btn-ghost mt-4 w-full">
          Retour
        </button>
      </div>
    );
  }

  const meta = LEVELS[activeLevel - 1];
  const Icon = meta.icon;

  function handleComplete() {
    const newlyMastered = activeLevel === 5 && !levels[4];
    completeLevel(verseId, activeLevel);
    setCompletion({
      level: activeLevel,
      newlyMastered,
      due: addDays(dayKey(), REVIEW_INTERVALS[0]),
    });
  }

  function goToLevel(level) {
    if (level > maxUnlocked) return;
    setCompletion(null);
    setActiveLevel(level);
  }

  return (
    <div className="animate-fade-up space-y-4">
      <div className="flex items-center gap-3">
        <IconButton label="Retour au chapitre" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </IconButton>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400/80">Mémorisation</p>
          <h1 className="truncate font-serif text-2xl text-slate-50">{verse.reference}</h1>
        </div>
        <span className="chip hidden sm:inline-flex">{TRANSLATION}</span>
      </div>

      <LevelStepper
        activeLevel={activeLevel}
        levels={levels}
        maxUnlocked={maxUnlocked}
        onSelect={goToLevel}
      />

      {completion ? (
        <LevelComplete
          completion={completion}
          hasNext={completion.level < 5}
          onNext={() => goToLevel(completion.level + 1)}
          onBack={onBack}
          onPractice={() => setCompletion(null)}
        />
      ) : (
        <section className="surface animate-pop overflow-hidden">
          <div className="border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400/90">
              <Icon className="h-3.5 w-3.5" /> Niveau {meta.id} · {meta.name}
            </div>
            <h2 className="mt-1.5 font-serif text-xl text-slate-100 sm:text-2xl">{meta.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">{meta.instruction}</p>
          </div>
          <div className="p-4 sm:p-6">
            {activeLevel === 1 && <Level1Read verse={verse} onComplete={handleComplete} />}
            {activeLevel === 2 && <Level2Initials verse={verse} onComplete={handleComplete} />}
            {activeLevel === 3 && <Level3Cloze verse={verse} onComplete={handleComplete} />}
            {activeLevel === 4 && <Level4Puzzle verse={verse} onComplete={handleComplete} />}
            {activeLevel === 5 && <Level5Recall verse={verse} onMastered={handleComplete} />}
          </div>
        </section>
      )}

      <p className="flex items-start gap-1.5 px-1 text-[11px] leading-relaxed text-slate-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Les niveaux se débloquent dans l’ordre. Vos niveaux, votre série et vos dates de révision sont enregistrés
        automatiquement sur cet appareil.
      </p>
    </div>
  );
}
