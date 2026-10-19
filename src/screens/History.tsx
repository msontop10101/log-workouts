import { useMemo, useState } from 'react';
import { exerciseById } from '../data/exercises';
import type { LogEntry } from '../types';
import { useStore } from '../store';
import { entryWeights, formatDate, formatSession, patternLabel, sortByRecency } from '../utils';

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      className={`btn btn-small${armed ? ' btn-danger' : ' btn-ghost'}`}
      onClick={() => {
        if (armed) onDelete();
        else {
          setArmed(true);
          setTimeout(() => setArmed(false), 3000);
        }
      }}
    >
      {armed ? 'Tap again to confirm' : 'Delete'}
    </button>
  );
}

function SessionLine({
  entry, onEdit,
}: {
  entry: LogEntry;
  onEdit: (entry: LogEntry) => void;
}) {
  const { deleteLog } = useStore();
  const pattern = exerciseById.get(entry.exerciseId)?.type === 'weighted'
    ? patternLabel(entryWeights(entry.sets))
    : null;
  return (
    <div className="card history-line">
      <div className="history-line-text">
        <span>
          {formatDate(entry.date)} — {formatSession(entry)}
          {pattern && <span className="dim"> ({pattern})</span>}
        </span>
        {entry.note && <span className="dim">{entry.note}</span>}
      </div>
      <div className="history-line-btns">
        <button type="button" className="btn btn-small" onClick={() => onEdit(entry)}>Edit</button>
        <DeleteButton onDelete={() => deleteLog(entry.id)} />
      </div>
    </div>
  );
}

/** Inline SVG line chart of the top-set weight per session over time. */
function ProgressChart({ entries }: { entries: LogEntry[] }) {
  // entries oldest → newest
  const points = entries
    .map((e) => {
      const weights = entryWeights(e.sets);
      return weights.length ? { date: e.date, top: Math.max(...weights) } : null;
    })
    .filter((p) => p != null);
  if (points.length < 2) return null;

  const W = 320; const H = 120; const PAD = 24;
  const min = Math.min(...points.map((p) => p.top));
  const max = Math.max(...points.map((p) => p.top));
  const span = max - min || 1;
  const x = (i: number) => PAD + (i * (W - PAD * 2)) / (points.length - 1);
  const y = (v: number) => H - PAD - ((v - min) * (H - PAD * 2)) / span;
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.top).toFixed(1)}`).join(' ');

  return (
    <svg
      className="chart" viewBox={`0 0 ${W} ${H}`}
      role="img" aria-label="Top set weight per session"
    >
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.top)} r="3.5" fill="var(--accent)" />
      ))}
      <text x={PAD} y={y(max) - 8} className="chart-label">{max} kg</text>
      {min !== max && <text x={PAD} y={y(min) + 14} className="chart-label">{min} kg</text>}
    </svg>
  );
}

export function ExerciseHistory({
  exerciseId, onEdit, onBack,
}: {
  exerciseId: string;
  onEdit: (entry: LogEntry) => void;
  onBack: () => void;
}) {
  const { logs } = useStore();
  const ex = exerciseById.get(exerciseId)!;
  const mine = useMemo(
    () => sortByRecency(logs.filter((l) => l.exerciseId === exerciseId)),
    [logs, exerciseId],
  );

  return (
    <div className="sheet" role="dialog" aria-label={`${ex.name} history`}>
      <div className="sheet-scroll">
        <header className="sheet-head">
          <button type="button" className="btn btn-ghost" onClick={onBack}>← Back</button>
          <h2 className="sheet-title">{ex.name}</h2>
        </header>
        {ex.type === 'weighted' && <ProgressChart entries={[...mine].reverse()} />}
        {mine.length === 0 && <p className="empty">No sessions yet.</p>}
        {mine.map((entry) => (
          <SessionLine key={entry.id} entry={entry} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}

export function HistoryTab({ onEdit }: { onEdit: (entry: LogEntry) => void }) {
  const { logs } = useStore();
  const sorted = sortByRecency(logs);
  const dates = [...new Set(sorted.map((l) => l.date))];

  if (sorted.length === 0) {
    return (
      <div className="screen">
        <p className="empty">No sessions yet. Log your first one from My Exercises.</p>
      </div>
    );
  }

  return (
    <div className="screen">
      {dates.map((date) => (
        <section key={date}>
          <h3 className="group-head">{formatDate(date)}</h3>
          {sorted.filter((l) => l.date === date).map((entry) => (
            <div key={entry.id} className="history-named">
              <span className="history-ex-name">
                {exerciseById.get(entry.exerciseId)?.name ?? entry.exerciseId}
              </span>
              <SessionLine entry={entry} onEdit={onEdit} />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
