import React from 'react';
import ReactDOM from 'react-dom';
import { ViewContext } from './ViewContext';
import { ContextRoute } from './ContextRouter';
import InlineApp from './InlineApp';
import AttachmentApp from './AttachmentApp';
import '@atlaskit/css-reset';

ReactDOM.render(
  <React.StrictMode>
    <ViewContext>
      <ContextRoute moduleKey='asciinema-inline'>
        <InlineApp />
      </ContextRoute>
      <ContextRoute moduleKey='asciinema-attachment'>
        <AttachmentApp />
      </ContextRoute>
    </ViewContext>
  </React.StrictMode>,
  document.getElementById('root')
);
