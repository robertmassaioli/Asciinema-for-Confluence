import React from 'react';
import ReactDOM from 'react-dom';
import ForgeReconciler from '@forge/react';
import { ViewContext } from './ViewContext';
import { ContextRoute } from './ContextRouter';
import InlineApp from './InlineApp';
import AttachmentApp from './AttachmentApp';
import InlineConfig from './InlineConfig';
import AttachmentConfig from './AttachmentConfig';
import '@atlaskit/css-reset';

// Custom UI render — both macros share this single React app.
// ContextRoute reads the Forge moduleKey and renders only the matching component.
// When a config prop is provided and the moduleKey matches, ContextRoute calls
// ForgeReconciler.addConfig() once with the appropriate UI Kit config component.
ReactDOM.render(
  <React.StrictMode>
    <ViewContext>
      <ContextRoute moduleKey='asciinema-inline' config={<InlineConfig />}>
        <InlineApp />
      </ContextRoute>
      <ContextRoute moduleKey='asciinema-attachment' config={<AttachmentConfig />}>
        <AttachmentApp />
      </ContextRoute>
    </ViewContext>
  </React.StrictMode>,
  document.getElementById('root')
);
