import { useRef, useState } from 'react';
import { useStore } from '../store';

export function SettingsSheet({ onClose }: { onClose: () => void }) {
  const { settings, setSettings, exportData, importData } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  return (
    <div className="sheet" role="dialog" aria-label="Settings">
      <div className="sheet-scroll">
        <header className="sheet-head">
          <button type="button" className="btn btn-ghost" onClick={onClose}>← Back</button>
          <h2 className="sheet-title">Settings</h2>
        </header>

        <label className="field">
          <span>Default number of sets</span>
          <select
            value={settings.defaultSets}
            onChange={(e) => setSettings({ defaultSets: Number(e.target.value) })}
          >
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        <label className="field">
          <span>kg increment for the + button</span>
          <select
            value={settings.increment}
            onChange={(e) => setSettings({ increment: Number(e.target.value) })}
          >
            {[0.5, 1, 1.25, 2, 2.5, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        <h3 className="group-head">Backup</h3>
        <div className="settings-btns">
          <button type="button" className="btn" onClick={exportData}>
            Export backup
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            Import backup
          </button>
          <input
            ref={fileRef} type="file" accept="application/json,.json" hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                setMessage(await importData(file));
              } catch (err) {
                setMessage(`Import failed: ${(err as Error).message}`);
              }
              e.target.value = '';
            }}
          />
        </div>
        {message && <p className="hint">{message}</p>}
        <p className="dim settings-note">
          Everything is stored on this device only. Export a backup now and then.
        </p>
      </div>
    </div>
  );
}
