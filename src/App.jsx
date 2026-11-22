import { useEffect, useState } from 'react';
import { ProgressProvider, useProgress } from './state/ProgressProvider';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import SettingsSheet from './components/SettingsSheet';
import ParcoursScreen from './components/chapters/ParcoursScreen';
import ChapterScreen from './components/chapters/ChapterScreen';
import TrainingScreen from './components/training/TrainingScreen';
import ReviewsScreen from './components/reviews/ReviewsScreen';
import ReviewSession from './components/reviews/ReviewSession';

function AppShell() {
  const [view, setView] = useState({ name: 'parcours' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { dueVerses } = useProgress();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const goHome = () => setView({ name: 'parcours' });
  const goReviews = () => setView({ name: 'reviews' });

  let content;
  if (view.name === 'chapter') {
    content = (
      <ChapterScreen
        chapter={view.chapter}
        onBack={goHome}
        onStartVerse={(verseId, level) =>
          setView({ name: 'training', verseId, level, chapter: view.chapter })
        }
      />
    );
  } else if (view.name === 'training') {
    content = (
      <TrainingScreen
        verseId={view.verseId}
        startLevel={view.level}
        onBack={() => setView({ name: 'chapter', chapter: view.chapter ?? 1 })}
      />
    );
  } else if (view.name === 'reviews') {
    content = (
      <ReviewsScreen
        onBack={goHome}
        onStartReview={(verseId) => setView({ name: 'review', verseId })}
      />
    );
  } else if (view.name === 'review') {
    content = <ReviewSession verseId={view.verseId} onExit={goReviews} />;
  } else {
    content = (
      <ParcoursScreen
        onOpenChapter={(chapter) => setView({ name: 'chapter', chapter })}
        onOpenReviews={goReviews}
      />
    );
  }

  const immersive = view.name === 'training' || view.name === 'review';

  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-500/[0.05] blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative">
        <AppHeader onHome={goHome} onOpenSettings={() => setSettingsOpen(true)} />
        <main
          className={`mx-auto w-full max-w-3xl px-4 pt-4 sm:px-6 sm:pt-6 ${
            immersive ? 'pb-10' : 'pb-28'
          }`}
        >
          {content}
        </main>
      </div>

      {!immersive && (
        <BottomNav
          active={view.name === 'reviews' ? 'reviews' : 'parcours'}
          dueCount={dueVerses.length}
          onNavigate={(tab) => (tab === 'reviews' ? goReviews() : goHome())}
        />
      )}

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AppShell />
    </ProgressProvider>
  );
}
