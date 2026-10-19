import { useState } from 'react';
import { useStore } from './store';
import { exerciseById } from './data/exercises';
import type { LogEntry } from './types';
import { Today } from './screens/Today';
import { MyExercises } from './screens/MyExercises';
import { Library } from './screens/Library';
import { HistoryTab, ExerciseHistory } from './screens/History';
import { LogSheet } from './screens/LogSheet';
import { SettingsSheet } from './screens/SettingsSheet';

type Tab = 'today' | 'mine' | 'library' | 'history';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '◉' },
  { id: 'mine', label: 'My Exercises', icon: '★' },
  { id: 'library', label: 'Library', icon: '▤' },
  { id: 'history', label: 'History', icon: '↺' },
];

function PickSheet({
  onPick, onClose,
}: {
  onPick: (exerciseId: string) => void;
  onClose: () => void;
}) {
  const { settings } = useStore();
  const mine = settings.selectedExerciseIds
    .map((id) => exerciseById.get(id))
    .filter((e) => e != null);
  return (
    <div className="sheet" role="dialog" aria-label="Pick an exercise">
      <div className="sheet-scroll">
        <header className="sheet-head">
          <button type="button" className="btn btn-ghost" onClick={onClose}>← Back</button>
          <h2 className="sheet-title">Log which exercise?</h2>
        </header>
        {mine.length === 0 && (
          <p className="empty">No exercises picked yet. Open Library and tap Add on the ones you do.</p>
        )}
        {mine.map((e) => (
          <button key={e.id} type="button" className="card pick-row" onClick={() => onPick(e.id)}>
            <span className="ex-name">{e.name}</span>
            <span className="dim">{e.group}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { ready, logs } = useStore();
  const [tab, setTab] = useState<Tab>('today');
  const [logTarget, setLogTarget] = useState<{ exerciseId: string; existing?: LogEntry } | null>(null);
  const [historyFor, setHistoryFor] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!ready) return <div className="loading">Lift Log</div>;

  const editEntry = (entry: LogEntry) =>
    setLogTarget({ exerciseId: entry.exerciseId, existing: entry });

  return (
    <div className="app">
      <header className="app-head">
        <h1 className="app-title">Lift Log</h1>
        <button
          type="button" className="btn btn-ghost gear"
          onClick={() => setSettingsOpen(true)} aria-label="Settings"
        >
          ⚙
        </button>
      </header>

      <main className="app-main">
        {tab === 'today' && (
          <Today
            onPick={() => setPicking(true)}
            onEdit={(id) => {
              const entry = logs.find((l) => l.id === id);
              if (entry) editEntry(entry);
            }}
          />
        )}
        {tab === 'mine' && (
          <MyExercises
            onLog={(exerciseId) => setLogTarget({ exerciseId })}
            onHistory={setHistoryFor}
          />
        )}
        {tab === 'library' && <Library />}
        {tab === 'history' && <HistoryTab onEdit={editEntry} />}
      </main>

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id} type="button"
            className={`tab${tab === t.id ? ' tab-on' : ''}`}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id}
          >
            <span className="tab-icon" aria-hidden>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {picking && (
        <PickSheet
          onPick={(exerciseId) => {
            setPicking(false);
            setLogTarget({ exerciseId });
          }}
          onClose={() => setPicking(false)}
        />
      )}
      {historyFor && (
        <ExerciseHistory
          exerciseId={historyFor}
          onEdit={editEntry}
          onBack={() => setHistoryFor(null)}
        />
      )}
      {logTarget && (
        <LogSheet
          exerciseId={logTarget.exerciseId}
          existing={logTarget.existing}
          onClose={() => setLogTarget(null)}
        />
      )}
      {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
