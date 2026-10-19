import { useMemo, useState } from 'react';
import { EXERCISES, GROUPS } from '../data/exercises';
import type { MuscleGroup } from '../data/exercises';
import { useStore } from '../store';
import { Clip, ClipModal } from '../components/Clip';

export function Library() {
  const { settings, toggleExercise } = useStore();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<MuscleGroup | 'All'>('All');
  const [photo, setPhoto] = useState<{ id: string; name: string } | null>(null);

  const selected = new Set(settings.selectedExerciseIds);
  const q = query.trim().toLowerCase();

  const visible = useMemo(
    () => EXERCISES.filter(
      (e) =>
        (group === 'All' || e.group === group) &&
        (!q || e.name.toLowerCase().includes(q) || e.equipment.includes(q)),
    ),
    [q, group],
  );

  return (
    <div className="screen">
      <input
        type="search" className="search" placeholder="Search exercises…"
        value={query} onChange={(e) => setQuery(e.target.value)}
        aria-label="Search exercises"
      />
      <div className="chip-row">
        {(['All', ...GROUPS] as const).map((g) => (
          <button
            key={g} type="button"
            className={`chip${group === g ? ' chip-on' : ''}`}
            onClick={() => setGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {GROUPS.filter((g) => visible.some((e) => e.group === g)).map((g) => (
        <section key={g}>
          <h3 className="group-head">{g}</h3>
          <ul className="lib-list">
            {visible.filter((e) => e.group === g).map((e) => (
              <li key={e.id} className="lib-row">
                <Clip
                  exerciseId={e.id} alt={e.name} size="small"
                  onTap={() => setPhoto({ id: e.id, name: e.name })}
                />
                <div className="lib-row-info">
                  <span className="lib-name">{e.name}</span>
                  <span className="lib-equip">{e.equipment}</span>
                </div>
                <button
                  type="button"
                  className={`btn btn-small${selected.has(e.id) ? ' btn-added' : ' btn-primary'}`}
                  onClick={() => toggleExercise(e.id)}
                >
                  {selected.has(e.id) ? 'Added ✓' : 'Add'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {visible.length === 0 && <p className="empty">No exercises match “{query}”.</p>}

      {photo && (
        <ClipModal exerciseId={photo.id} name={photo.name} onClose={() => setPhoto(null)} />
      )}
    </div>
  );
}
