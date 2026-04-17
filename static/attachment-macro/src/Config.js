/**
 * Attachment Macro — Configuration Panel (Custom UI)
 *
 * Uses @forge/bridge's view.submit() to save config — the correct
 * Custom UI approach. ForgeReconciler is NOT used here.
 *
 * Config fields:
 *   - filename  : string  — name of the .cast file attached to this page (required)
 *   - autoplay  : boolean — start playing immediately
 *   - loop      : boolean — loop the recording
 *   - speed     : number  — playback speed multiplier
 *   - theme     : string  — terminal colour theme
 *   - poster    : number  — time (seconds) to use as poster/preview frame
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
    filename: '',
    autoplay: false,
    loop: false,
    speed: '1',
    theme: 'asciinema',
    poster: '',
  });
  const [error, setError] = useState(null);

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
    if (!config.filename?.trim()) {
      setError('Attachment filename is required.');
      return;
    }
    setError(null);
    view.submit(config);
  };

  const handleCancel = () => {
    view.close();
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: '16px', maxWidth: '480px' }}>
      {/* Info banner */}
      <div style={{ background: '#deebff', border: '1px solid #4c9aff', borderRadius: '3px', padding: '10px 14px', marginBottom: '16px', fontSize: '14px', color: '#0747a6' }}>
        <strong>Setup:</strong> Attach your <code>.cast</code> file to this Confluence page first, then enter its filename below.
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Required: attachment filename ── */}
        <label style={{ ...labelStyle, color: error ? '#de350b' : '#6b778c' }}>
          Attachment filename (required)
        </label>
        <input
          type="text"
          style={{ ...inputStyle, borderColor: error ? '#de350b' : '#dfe1e6' }}
          placeholder="demo.cast"
          value={config.filename ?? ''}
          onChange={(e) => { handleChange('filename', e.target.value); setError(null); }}
        />
        {error && <p style={{ color: '#de350b', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
        <p style={descStyle}>The exact filename of the .cast attachment on this page, including the .cast extension.</p>

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

        {/* ── Poster frame ── */}
        <label style={labelStyle}>Poster frame (seconds)</label>
        <input
          type="number"
          min="0"
          step="0.1"
          style={inputStyle}
          placeholder="Leave blank for default"
          value={config.poster ?? ''}
          onChange={(e) => handleChange('poster', e.target.value)}
        />
        <p style={descStyle}>Time position (in seconds) to use as the preview image before playback starts.</p>

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
