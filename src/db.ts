import { get, set } from 'idb-keyval';
import type { LogEntry, Settings } from './types';
import { DEFAULT_SELECTED } from './data/exercises';

const LOGS_KEY = 'lift-log:logs';
const SETTINGS_KEY = 'lift-log:settings';

export const DEFAULT_SETTINGS: Settings = {
  selectedExerciseIds: DEFAULT_SELECTED,
  defaultSets: 3,
  increment: 2.5,
};

export async function loadLogs(): Promise<LogEntry[]> {
  return (await get<LogEntry[]>(LOGS_KEY)) ?? [];
}

export async function saveLogs(logs: LogEntry[]): Promise<void> {
  await set(LOGS_KEY, logs);
}

export async function loadSettings(): Promise<Settings> {
  const stored = await get<Settings>(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await set(SETTINGS_KEY, settings);
}
