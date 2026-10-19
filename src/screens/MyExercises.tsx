import { useState } from 'react';
import { exerciseById, GROUPS } from '../data/exercises';
import { useStore } from '../store';
import { bestSet, formatDate, formatNum, formatSession, lastSessionFor } from '../utils';
import { Clip, ClipModal } from '../components/Clip';

export function MyExercises({
  onLog, onHistory,
}: {
  onLog: (exerciseId: string) => void;
  onHistory: (exerciseId: string) => void;
}) {
  const { logs, settings, removeExercise } = useStore();
  const [photo, setPhoto] = useState<{ id: string; name: string } | null>(null);

  const mine = settings.selectedExerciseIds
    .map((id) => exerciseById.get(id))
    .filter((e) => e != null);

  if (mine.length === 0) {
    return (
      <div className="screen">
        <p className="empty">
          No exercises picked yet. Open Library and tap Add on the ones you do.
        </p>
      </div>
    );
  }

  return (
    <div className="screen">
      {GROUPS.filter((g) => mine.some((e) => e.group === g)).map((g) => (
        <section key={g}>
          <h3 className="group-head">{g}</h3>
          {mine.filter((e) => e.group === g).map((e) => {
            const last = lastSessionFor(logs, e.id);
            const best = bestSet(logs.filter((l) => l.exerciseId === e.id));
            return (
              <article key={e.id} className="card ex-card">
                <div className="ex-card-main">
                  <Clip
                    exerciseId={e.id} alt={e.name} size="small"
                    onTap={() => setPhoto({ id: e.id, name: e.name })}
                  />
                  <div className="ex-card-info">
                    <h4 className="ex-name">{e.name}</h4>
                    {last ? (
                      <p className="ex-last">
                        {formatSession(last)} <span className="dim">on {formatDate(last.date)}</span>
                      </p>
                    ) : (
                      <p className="ex-last dim">Not logged yet</p>
                    )}
                    {best && (
                      <p className="ex-best">
                        Best: {formatNum(best.weightKg)} kg × {best.reps}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ex-card-btns">
                  <button type="button" className="btn btn-primary" onClick={() => onLog(e.id)}>
                    Log
                  </button>
                  <button type="button" className="btn" onClick={() => onHistory(e.id)}>
                    History
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => removeExercise(e.id)}>
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ))}
      {photo && (
        <ClipModal exerciseId={photo.id} name={photo.name} onClose={() => setPhoto(null)} />
      )}
    </div>
  );
}
