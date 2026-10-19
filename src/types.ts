export interface SetEntry {
  weightKg?: number;   // weighted: required. bodyweight: optional added weight. step 0.5
  reps?: number;       // weighted/bodyweight: 1–10 normally, allow up to 30
  seconds?: number;    // timed (plank etc.)
}

export interface LogEntry {
  id: string;            // crypto.randomUUID()
  exerciseId: string;
  date: string;          // 'YYYY-MM-DD', local time
  sets: SetEntry[];      // in the order performed
  minutes?: number;      // cardio only
  km?: number;           // cardio only, optional
  note?: string;
  createdAt: string;     // ISO timestamp
}

export interface Settings {
  selectedExerciseIds: string[];
  defaultSets: number;
  increment: number;     // kg for the "+" button
}
