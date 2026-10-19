import type { LogEntry, SetEntry } from './types';
import { exerciseById } from './data/exercises';

export function todayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** '2026-10-18' → '18 Oct' (adds year if not current year) */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const label = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return y === new Date().getFullYear() ? label : `${label} ${y}`;
}

export function formatNum(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n);
}

export type Pattern = 'Straight sets' | 'Ramp' | 'Top set' | 'Mixed';

export function patternLabel(weights: number[]): Pattern | null {
  if (weights.length < 2) return null;
  if (weights.every((w) => w === weights[0])) return 'Straight sets';
  const steps = weights.slice(1).map((w, i) => w - weights[i]);
  const last = steps[steps.length - 1];
  if (steps.every((s) => s > 0)) return 'Ramp';
  if (last > 0 && steps.slice(0, -1).every((s) => s === 0)) return 'Top set';
  return 'Mixed';
}

/** '40 · 40 · 45 kg × 10 · 10 · 8', or seconds/cardio variants */
export function formatSession(entry: LogEntry): string {
  const ex = exerciseById.get(entry.exerciseId);
  if (ex?.type === 'cardio') {
    const parts = [`${entry.minutes ?? 0} min`];
    if (entry.km) parts.push(`${entry.km} km`);
    return parts.join(' · ');
  }
  if (ex?.type === 'timed') {
    return entry.sets.map((s) => `${s.seconds ?? 0}`).join(' · ') + ' s';
  }
  const weights = entry.sets.map((s) => s.weightKg);
  const reps = entry.sets.map((s) => s.reps ?? 0);
  const repsPart = reps.join(' · ');
  if (ex?.type === 'bodyweight' && weights.every((w) => !w)) {
    return `${repsPart} reps`;
  }
  const weightPart = weights.map((w) => formatNum(w ?? 0)).join(' · ');
  return `${weightPart} kg × ${repsPart}`;
}

/** Best set = highest weight, tie broken by most reps */
export function bestSet(entries: LogEntry[]): { weightKg: number; reps: number } | null {
  let best: { weightKg: number; reps: number } | null = null;
  for (const e of entries) {
    for (const s of e.sets) {
      if (s.weightKg == null) continue;
      if (
        !best ||
        s.weightKg > best.weightKg ||
        (s.weightKg === best.weightKg && (s.reps ?? 0) > best.reps)
      ) {
        best = { weightKg: s.weightKg, reps: s.reps ?? 0 };
      }
    }
  }
  return best;
}

export function sortByRecency(entries: LogEntry[]): LogEntry[] {
  return [...entries].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
}

export function lastSessionFor(logs: LogEntry[], exerciseId: string): LogEntry | null {
  const mine = sortByRecency(logs.filter((l) => l.exerciseId === exerciseId));
  return mine[0] ?? null;
}

export function entryWeights(sets: SetEntry[]): number[] {
  return sets.map((s) => s.weightKg).filter((w): w is number => w != null);
}
