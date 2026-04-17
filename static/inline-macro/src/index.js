/**
 * Entry point for the inline macro Custom UI.
 *
 * This file boots the React app inside the Forge iframe. It renders two
 * different components depending on the Forge "render context":
 *   - "macro"        → the main App component (the player)
 *   - "macro-config" → the Config component (playback options form)
 *
 * Forge injects a __FORGE_RENDER_CONTEXT__ global to tell us which mode
 * we are in. However, because both the main view and config view point at
 * the same resource in this template, we check for it defensively.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';

import App from './App';
import Config from './Config';

// Determine whether we are rendering the player or the config panel.
// The config panel is shown when the user clicks the pencil icon on the macro.
const context = window.__FORGE_RENDER_CONTEXT__;
const isConfig = context === 'macro-config';

ReactDOM.render(
  <React.StrictMode>
    {isConfig ? <Config /> : <App />}
  </React.StrictMode>,
  document.getElementById('root')
);
