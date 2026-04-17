/**
 * Entry point for the inline macro Custom UI.
 *
 * Renders either the player (App) or the config panel (Config) depending
 * on the Forge render context (__FORGE_RENDER_CONTEXT__):
 *   - "macro"        → App  (the asciinema player)
 *   - "macro-config" → Config (playback options form, uses view.submit())
 *
 * Both views use standard ReactDOM.render() — this is a Custom UI app.
 * Config uses view.submit() from @forge/bridge to save settings (NOT
 * ForgeReconciler.addConfig(), which is UI Kit only).
 */

import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';

import App from './App';
import Config from './Config';

const context = window.__FORGE_RENDER_CONTEXT__;
const isConfig = context === 'macro-config';

ReactDOM.render(
  <React.StrictMode>
    {isConfig ? <Config /> : <App />}
  </React.StrictMode>,
  document.getElementById('root')
);
