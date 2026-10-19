import { useMemo, useState } from 'react';
import { exerciseById } from '../data/exercises';
import type { LogEntry, SetEntry } from '../types';
import { useStore } from '../store';
import {
  bestSet, formatDate, formatNum, formatSession, lastSessionFor, patternLabel, todayStr,
} from '../utils';
import { Clip, ClipModal } from '../components/Clip';

interface Row {
  weight: string;   // kg, free-typed
  reps: number | null;
  seconds: string;  // timed only
  done: boolean;
}

function toRow(s: SetEntry): Row {
  return {
    weight: s.weightKg != null ? String(s.weightKg) : '',
    reps: s.reps ?? null,
    seconds: s.seconds != null ? String(s.seconds) : '',
    done: false,
  };
}

const EMPTY_ROW: Row = { weight: '', reps: null, seconds: '', done: false };

export function LogSheet({
  exerciseId, existing, onClose,
}: {
  exerciseId: string;
  existing?: LogEntry;
  onClose: (saved: boolean) => void;
}) {
  const { logs, settings, addLog, updateLog } = useStore();
  const ex = exerciseById.get(exerciseId)!;
  const inc = settings.increment;

  const last = useMemo(
    () => lastSessionFor(logs.filter((l) => l.id !== existing?.id), exerciseId),
    [logs, exerciseId, existing?.id],
  );

  const [date, setDate] = useState(existing?.date ?? todayStr());
  const [note, setNote] = useState(existing?.note ?? '');
  const [rows, setRows] = useState<Row[]>(() => {
    const source = existing ?? last;
    if (source && source.sets.length > 0) return source.sets.map(toRow);
    return Array.from({ length: settings.defaultSets }, () => ({ ...EMPTY_ROW }));
  });
  const [minutes, setMinutes] = useState(
    existing?.minutes != null ? String(existing.minutes) : (last?.minutes != null ? String(last.minutes) : ''),
  );
  const [km, setKm] = useState(
    existing?.km != null ? String(existing.km) : (last?.km != null ? String(last.km) : ''),
  );
  const [error, setError] = useState('');
  const [showPhoto, setShowPhoto] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  const patch = (i: number, p: Partial<Row>) =>
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...p } : r)));

  const stepWeight = (i: number, dir: 1 | -1) => {
    setRows((prev) => prev.map((r, j) => {
      if (j !== i) return r;
      const cur = parseFloat(r.weight) || 0;
      const next = Math.max(0, cur + dir * inc);
      return { ...r, weight: next ? formatNum(next) : '' };
    }));
  };

  const sameWeightAll = () =>
    setRows((prev) => prev.map((r) => ({ ...r, weight: prev[0].weight })));

  const plusFromPrev = (i: number) =>
    setRows((prev) => prev.map((r, j) => {
      if (j !== i) return r;
      const prevW = parseFloat(prev[i - 1]?.weight) || 0;
      return { ...r, weight: formatNum(prevW + inc) };
    }));

  const isFilled = (r: Row): boolean => {
    if (ex.type === 'weighted') return r.weight !== '' && r.reps != null;
    if (ex.type === 'bodyweight') return r.reps != null;
    if (ex.type === 'timed') return r.seconds !== '';
    return false;
  };

  const anyDone = rows.some((r) => r.done);
  const included = rows.filter((r) => (anyDone ? r.done : isFilled(r)));

  const liveWeights = included
    .map((r) => parseFloat(r.weight))
    .filter((w) => !Number.isNaN(w));
  const pattern = ex.type === 'weighted' ? patternLabel(liveWeights) : null;

  const hint =
    last &&
    (ex.type === 'weighted' || ex.type === 'bodyweight') &&
    last.sets.length > 0 &&
    last.sets.every((s) => s.reps === 10);

  const save = () => {
    setError('');
    let sets: SetEntry[] = [];
    if (ex.type !== 'cardio') {
      if (included.length === 0) {
        setError(anyDone ? 'Fill in the ticked sets first.' : 'Fill in at least one set.');
        return;
      }
      for (const r of included) {
        if (ex.type === 'weighted' && (r.weight === '' || r.reps == null)) {
          setError('Each ticked set needs a weight and reps.');
          return;
        }
        if (ex.type === 'bodyweight' && r.reps == null) {
          setError('Each ticked set needs reps.');
          return;
        }
        if (ex.type === 'timed' && r.seconds === '') {
          setError('Each ticked set needs seconds.');
          return;
        }
      }
      sets = included.map((r) => {
        const s: SetEntry = {};
        if (ex.type === 'timed') {
          s.seconds = parseInt(r.seconds, 10);
        } else {
          if (r.weight !== '') s.weightKg = parseFloat(r.weight);
          if (r.reps != null) s.reps = r.reps;
        }
        return s;
      });
    } else if (minutes === '' || parseFloat(minutes) <= 0) {
      setError('Enter the minutes.');
      return;
    }

    const entry: LogEntry = {
      id: existing?.id ?? crypto.randomUUID(),
      exerciseId,
      date,
      sets,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    if (ex.type === 'cardio') {
      entry.minutes = parseFloat(minutes);
      if (km !== '') entry.km = parseFloat(km);
    }
    if (note.trim()) entry.note = note.trim();

    // "New best" badge: heaviest set (ties by reps) beats everything before
    let isNewBest = false;
    if (ex.type === 'weighted') {
      const prevBest = bestSet(logs.filter((l) => l.exerciseId === exerciseId && l.id !== entry.id));
      const nowBest = bestSet([entry]);
      if (nowBest && (!prevBest ||
        nowBest.weightKg > prevBest.weightKg ||
        (nowBest.weightKg === prevBest.weightKg && nowBest.reps > prevBest.reps))) {
        isNewBest = !!prevBest; // first-ever session isn't a "new best"
      }
    }

    if (existing) updateLog(entry); else addLog(entry);

    if (isNewBest) {
      setSavedBadge(true);
      setTimeout(() => onClose(true), 1200);
    } else {
      onClose(true);
    }
  };

  return (
    <div className="sheet" role="dialog" aria-label={`Log ${ex.name}`}>
      <div className="sheet-scroll">
        <header className="sheet-head">
          <button type="button" className="btn btn-ghost" onClick={() => onClose(false)}>
            ✕ Cancel
          </button>
          <input
            type="date"
            className="date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Session date"
          />
        </header>

        <div className="log-top">
          <Clip exerciseId={ex.id} alt={ex.name} size="medium" onTap={() => setShowPhoto(true)} />
          <div>
            <h2 className="log-title">{ex.name}</h2>
            {last && (
              <p className="last-line">
                Last: {formatSession(last)} ({formatDate(last.date)})
              </p>
            )}
            {hint && (
              <p className="hint">
                You hit 10 on every set last time. Try +{formatNum(inc)} kg.
              </p>
            )}
          </div>
        </div>

        {ex.type === 'cardio' ? (
          <div className="cardio-fields">
            <label className="field">
              <span>Minutes</span>
              <input
                inputMode="decimal" type="text" value={minutes}
                onChange={(e) => setMinutes(e.target.value.replace(',', '.'))}
                placeholder="30"
              />
            </label>
            <label className="field">
              <span>km (optional)</span>
              <input
                inputMode="decimal" type="text" value={km}
                onChange={(e) => setKm(e.target.value.replace(',', '.'))}
                placeholder="5"
              />
            </label>
          </div>
        ) : (
          <>
            {ex.type === 'weighted' && rows.length > 1 && (
              <button type="button" className="btn btn-small" onClick={sameWeightAll}>
                Same weight for all sets
              </button>
            )}
            <div className="set-rows">
              {rows.map((row, i) => (
                <div key={i} className={`set-row${row.done ? ' set-done' : ''}`}>
                  <div className="set-row-top">
                    <span className="set-label">Set {i + 1}</span>
                    <div className="set-row-actions">
                      {ex.type === 'weighted' && i > 0 && (
                        <button
                          type="button" className="btn btn-tiny"
                          onClick={() => plusFromPrev(i)}
                          title={`Previous set's weight + ${formatNum(inc)} kg`}
                        >
                          +{formatNum(inc)}
                        </button>
                      )}
                      <button
                        type="button"
                        className={`tick${row.done ? ' tick-on' : ''}`}
                        onClick={() => patch(i, { done: !row.done })}
                        aria-label={`Set ${i + 1} ${row.done ? 'done' : 'not done'}`}
                        aria-pressed={row.done}
                      >
                        ✓
                      </button>
                      {rows.length > 1 && (
                        <button
                          type="button" className="btn btn-tiny btn-danger"
                          onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                          aria-label={`Remove set ${i + 1}`}
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </div>

                  {ex.type === 'timed' ? (
                    <div className="weight-group">
                      <input
                        inputMode="numeric" type="text" className="weight-input"
                        value={row.seconds}
                        onChange={(e) => patch(i, { seconds: e.target.value.replace(/\D/g, '') })}
                        placeholder="60" aria-label={`Set ${i + 1} seconds`}
                      />
                      <span className="unit">s</span>
                    </div>
                  ) : (
                    <>
                      <div className="weight-group">
                        <button type="button" className="step-btn" onClick={() => stepWeight(i, -1)} aria-label="Less weight">−</button>
                        <input
                          inputMode="decimal" type="text" className="weight-input"
                          value={row.weight}
                          onChange={(e) => patch(i, { weight: e.target.value.replace(',', '.').replace(/[^0-9.]/g, '') })}
                          placeholder={ex.type === 'bodyweight' ? '+kg' : '0'}
                          aria-label={`Set ${i + 1} weight in kg`}
                        />
                        <span className="unit">kg</span>
                        <button type="button" className="step-btn" onClick={() => stepWeight(i, 1)} aria-label="More weight">+</button>
                      </div>
                      <div className="rep-chips" role="radiogroup" aria-label={`Set ${i + 1} reps`}>
                        {Array.from({ length: 10 }, (_, n) => n + 1).map((n) => (
                          <button
                            key={n} type="button"
                            className={`chip${row.reps === n ? ' chip-on' : ''}`}
                            onClick={() => patch(i, { reps: row.reps === n ? null : n })}
                          >
                            {n}
                          </button>
                        ))}
                        <input
                          inputMode="numeric" type="text" className="more-reps"
                          placeholder="more"
                          value={row.reps != null && row.reps > 10 ? row.reps : ''}
                          onChange={(e) => {
                            const v = parseInt(e.target.value.replace(/\D/g, ''), 10);
                            patch(i, { reps: Number.isNaN(v) ? null : Math.min(v, 30) });
                          }}
                          aria-label={`Set ${i + 1} reps over 10`}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button" className="btn btn-small"
              onClick={() => setRows((prev) => [...prev, { ...EMPTY_ROW }])}
            >
              + Add set
            </button>
            {pattern && <p className="pattern-label">{pattern}</p>}
          </>
        )}

        <label className="field note-field">
          <span>Note</span>
          <input
            type="text" value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="optional"
          />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
      </div>

      <div className="sheet-footer">
        <button type="button" className="btn btn-primary btn-save" onClick={save}>
          Save
        </button>
      </div>

      {savedBadge && <div className="best-toast">🏆 New best!</div>}
      {showPhoto && (
        <ClipModal exerciseId={ex.id} name={ex.name} onClose={() => setShowPhoto(false)} />
      )}
    </div>
  );
}
