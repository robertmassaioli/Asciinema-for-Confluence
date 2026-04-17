/**
 * Entry point for the attachment macro Custom UI.
 *
 * Renders either the player (App) or the config panel (Config) depending
 * on the Forge render context injected by the platform.
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
