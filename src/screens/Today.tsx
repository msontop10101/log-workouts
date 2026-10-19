import { exerciseById } from '../data/exercises';
import { useStore } from '../store';
import { formatSession, sortByRecency, todayStr } from '../utils';

export function Today({
  onPick, onEdit,
}: {
  onPick: () => void;
  onEdit: (entryId: string) => void;
}) {
  const { logs } = useStore();
  const today = sortByRecency(logs.filter((l) => l.date === todayStr()));
  const totalSets = today.reduce(
    (n, l) => n + (exerciseById.get(l.exerciseId)?.type === 'cardio' ? 1 : l.sets.length),
    0,
  );

  return (
    <div className="screen">
      <button type="button" className="btn btn-primary btn-big" onClick={onPick}>
        Log an exercise
      </button>

      {today.length === 0 ? (
        <p className="empty">Nothing logged today yet.</p>
      ) : (
        <>
          <p className="today-total">
            {totalSets} set{totalSets === 1 ? '' : 's'} done today
          </p>
          {today.map((entry) => (
            <button
              key={entry.id} type="button" className="card today-card"
              onClick={() => onEdit(entry.id)}
            >
              <span className="ex-name">{exerciseById.get(entry.exerciseId)?.name ?? entry.exerciseId}</span>
              <span className="ex-last">{formatSession(entry)}</span>
              {entry.note && <span className="dim">{entry.note}</span>}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
