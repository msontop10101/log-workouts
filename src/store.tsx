import {
  createContext, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import type { ReactNode } from 'react';
import type { LogEntry, Settings } from './types';
import { DEFAULT_SETTINGS, loadLogs, loadSettings, saveLogs, saveSettings } from './db';

interface Store {
  ready: boolean;
  logs: LogEntry[];
  settings: Settings;
  addLog: (entry: LogEntry) => void;
  updateLog: (entry: LogEntry) => void;
  deleteLog: (id: string) => void;
  toggleExercise: (exerciseId: string) => void;
  removeExercise: (exerciseId: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  exportData: () => void;
  importData: (file: File) => Promise<string>;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const loaded = useRef(false);

  useEffect(() => {
    Promise.all([loadLogs(), loadSettings()]).then(([l, s]) => {
      setLogs(l);
      setSettingsState(s);
      loaded.current = true;
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (loaded.current) void saveLogs(logs);
  }, [logs]);
  useEffect(() => {
    if (loaded.current) void saveSettings(settings);
  }, [settings]);

  const store = useMemo<Store>(() => ({
    ready,
    logs,
    settings,
    addLog: (entry) => setLogs((prev) => [...prev, entry]),
    updateLog: (entry) =>
      setLogs((prev) => prev.map((l) => (l.id === entry.id ? entry : l))),
    deleteLog: (id) => setLogs((prev) => prev.filter((l) => l.id !== id)),
    toggleExercise: (exerciseId) =>
      setSettingsState((prev) => ({
        ...prev,
        selectedExerciseIds: prev.selectedExerciseIds.includes(exerciseId)
          ? prev.selectedExerciseIds.filter((id) => id !== exerciseId)
          : [...prev.selectedExerciseIds, exerciseId],
      })),
    removeExercise: (exerciseId) =>
      setSettingsState((prev) => ({
        ...prev,
        selectedExerciseIds: prev.selectedExerciseIds.filter((id) => id !== exerciseId),
      })),
    setSettings: (patch) => setSettingsState((prev) => ({ ...prev, ...patch })),
    exportData: () => {
      const blob = new Blob(
        [JSON.stringify({ version: 1, logs, settings }, null, 2)],
        { type: 'application/json' },
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lift-log-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    importData: async (file) => {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.logs)) throw new Error('Not a Lift Log backup');
      const incoming = data.logs as LogEntry[];
      const byId = new Map(logs.map((l) => [l.id, l]));
      let added = 0;
      for (const entry of incoming) {
        if (!byId.has(entry.id)) added++;
        byId.set(entry.id, entry);
      }
      setLogs([...byId.values()]);
      if (data.settings) {
        setSettingsState((prev) => ({
          ...prev,
          ...data.settings,
          selectedExerciseIds: [
            ...new Set([
              ...prev.selectedExerciseIds,
              ...(data.settings.selectedExerciseIds ?? []),
            ]),
          ],
        }));
      }
      return `Imported ${incoming.length} sessions (${added} new)`;
    },
  }), [ready, logs, settings]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore outside StoreProvider');
  return store;
}
