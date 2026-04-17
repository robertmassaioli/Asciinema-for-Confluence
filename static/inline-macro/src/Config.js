/**
 * Inline Macro — Configuration Panel (Custom UI)
 *
 * This component is rendered when a page author opens the macro config.
 * It uses @forge/bridge's view.submit() to save config values — this is
 * the correct Custom UI approach for macro config panels. ForgeReconciler
 * is NOT used here (that API is for UI Kit only).
 *
 * view.submit(config) saves the config object which is later available
 * in App.js via ctx.extension.config.
 */

import React, { useEffect, useState } from 'react';
import { view } from '@forge/bridge';

const THEME_OPTIONS = [
  { label: 'asciinema (default)', value: 'asciinema' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Solarized Dark', value: 'solarized-dark' },
  { label: 'Solarized Light', value: 'solarized-light' },
  { label: 'Dracula', value: 'dracula' },
];

const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '2px solid #dfe1e6',
  borderRadius: '3px',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  fontSize: '12px',
  color: '#6b778c',
  marginBottom: '4px',
  marginTop: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const descStyle = {
  fontSize: '12px',
  color: '#6b778c',
  marginTop: '4px',
};

export default function Config() {
  const [config, setConfig] = useState({
    autoplay: false,
    loop: false,
    speed: '1',
    theme: 'asciinema',
    cols: '',
    rows: '',
  });

  // Load existing config values when the panel opens
  useEffect(() => {
    view.getContext().then((ctx) => {
      const saved = ctx.extension?.config ?? {};
      setConfig((prev) => ({ ...prev, ...saved }));
    });
  }, []);

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // view.submit() saves the config and closes the panel
    view.submit(config);
  };

  const handleCancel = () => {
    view.close();
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: '16px', maxWidth: '480px' }}>
      <p style={{ color: '#6b778c', fontSize: '14px', marginTop: 0 }}>
        Paste your <strong>.cast</strong> file content into the macro body, then configure playback options below.
      </p>

      <form onSubmit={handleSubmit}>
        {/* ── Playback behaviour ── */}
        <label style={labelStyle}>Playback</label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={config.autoplay === true || config.autoplay === 'true'}
            onChange={(e) => handleChange('autoplay', e.target.checked)}
          />
          Autoplay — start playing immediately when the page loads
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={config.loop === true || config.loop === 'true'}
            onChange={(e) => handleChange('loop', e.target.checked)}
          />
          Loop — loop the recording continuously
        </label>

        <label style={labelStyle}>Speed</label>
        <input
          type="number"
          min="0.1"
          max="10"
          step="0.1"
          style={inputStyle}
          value={config.speed ?? '1'}
          onChange={(e) => handleChange('speed', e.target.value)}
        />
        <p style={descStyle}>Playback speed multiplier. 1 = normal, 2 = double speed.</p>

        {/* ── Visual options ── */}
        <label style={labelStyle}>Theme</label>
        <select
          style={inputStyle}
          value={config.theme ?? 'asciinema'}
          onChange={(e) => handleChange('theme', e.target.value)}
        >
          {THEME_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* ── Terminal size overrides ── */}
        <label style={labelStyle}>Terminal Width (columns)</label>
        <input
          type="number"
          min="1"
          style={inputStyle}
          placeholder="Auto (from cast header)"
          value={config.cols ?? ''}
          onChange={(e) => handleChange('cols', e.target.value)}
        />
        <p style={descStyle}>Leave blank to use the width declared in the .cast file.</p>

        <label style={labelStyle}>Terminal Height (rows)</label>
        <input
          type="number"
          min="1"
          style={inputStyle}
          placeholder="Auto (from cast header)"
          value={config.rows ?? ''}
          onChange={(e) => handleChange('rows', e.target.value)}
        />
        <p style={descStyle}>Leave blank to use the height declared in the .cast file.</p>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button
            type="submit"
            style={{
              background: '#0052cc', color: '#fff', border: 'none',
              padding: '8px 16px', borderRadius: '3px', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600,
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              background: 'none', color: '#42526e', border: '2px solid #dfe1e6',
              padding: '8px 16px', borderRadius: '3px', cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
