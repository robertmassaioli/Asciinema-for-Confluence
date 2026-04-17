/**
 * Entry point for the shared Asciinema for Confluence Custom UI app.
 *
 * Both the inline macro and the attachment macro use this single React app.
 * We use view.getContext() to read the moduleKey and route to the correct
 * component — the same pattern as ep-tool's ViewContext + ContextRoute.
 *
 * Module keys (as declared in manifest.yml):
 *   asciinema-inline      → InlineApp (reads .cast from macro body)
 *   asciinema-attachment  → AttachmentApp (loads .cast from page attachment)
 */

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { view } from '@forge/bridge';
import '@atlaskit/css-reset';

import InlineApp from './InlineApp';
import AttachmentApp from './AttachmentApp';

function Router() {
  const [moduleKey, setModuleKey] = useState(null);

  useEffect(() => {
    view.getContext().then((ctx) => {
      setModuleKey(ctx.moduleKey);
    });
  }, []);

  if (!moduleKey) {
    // Still loading context — render nothing (avoids flash of wrong content)
    return null;
  }

  if (moduleKey === 'asciinema-inline') {
    return <InlineApp />;
  }

  if (moduleKey === 'asciinema-attachment') {
    return <AttachmentApp />;
  }

  return (
    <div style={{ padding: '16px', color: '#de350b', fontFamily: 'sans-serif' }}>
      Unknown module key: {moduleKey}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);
