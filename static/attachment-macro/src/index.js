/**
 * Entry point for the attachment macro Custom UI (player view only).
 *
 * The config panel is now a separate UI Kit app (static/attachment-config/).
 * This file only needs to render the player (App).
 */

import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
