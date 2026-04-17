# Asciinema for Confluence — Forge App Proposal

## Overview

This document proposes a Forge app for Confluence that brings asciinema terminal
recordings into Confluence pages in three complementary ways:

1. **Bodied Macro (`asciinema-inline`)** — paste raw `.cast` file content directly
   into the macro body; the app renders it in-place with the asciinema player.
2. **Attachment Macro (`asciinema-attachment`)** — point at a `.cast` file that is
   attached to the current Confluence page; the app fetches and renders it.
3. **Smart Link resolver (`graph:smartLink`)** — when a user pastes an
   `https://asciinema.org/a/<id>` URL into a Confluence page, it unfurls into
   a rich Smart Link card with an embedded terminal player preview.

---

## Background & Motivation

The asciinema ecosystem represents terminal sessions as lightweight `.cast` files
(JSON-lines format, asciicast v2/v3). The
[asciinema-player](https://github.com/asciinema/asciinema-player) JavaScript
library can replay these files entirely in the browser — no plugin, no native
video codec, fully accessible text-based output.

Confluence teams that document CLI tooling, DevOps runbooks, or onboarding guides
currently have no good way to embed live terminal recordings. Screenshots are
static; screen-capture `.mp4` files are heavy and unselectable. This app fills
that gap.

---

## Corrections vs. Original Draft (Documentation Review)

After checking against the current Forge documentation, the following corrections
were identified:

| # | Original | Corrected | Source |
|---|---|---|---|
| 1 | Module key `confluence:bodied-macro` | **Does not exist.** Forge uses a single `macro` module for both bodied and non-bodied macros; `bodyType` controls whether a body is present. | [Macro module docs](https://developer.atlassian.com/platform/forge/manifest-reference/modules/macro/) |
| 2 | Module key `confluence:macro` | Correct key is simply **`macro`** (not namespaced) | Same |
| 3 | Module key `confluence:teamwork-graph-smart-link` | Correct key is **`graph:smartLink`** | [Teamwork Graph Smart Link docs](https://developer.atlassian.com/platform/forge/manifest-reference/modules/teamwork-graph-smart-link/) |
| 4 | Macro manifest used `function:` as the renderer | Modern Forge macros use **`resource`** (Custom UI) or `resource` + `render: native` (UI Kit), with an optional **`resolver`** for backend calls. A raw `function` handler is not the macro rendering mechanism. | Macro module docs |
| 5 | Smart Link used `urlPattern: 'https://...'` | Smart Links use **`domains`** (array) + **`patterns`** (array of regexes), plus a mandatory **`icon`** field. | Smart Link docs |
| 6 | Smart Link response was a JSON-LD/OpenGraph object | Actual response schema is **`{ entities: [ { identifier: { url }, meta: { access, visibility }, entity: {...} } ] }`** | Smart Link API contract docs |
| 7 | Macro parameters used `type: confluence-content-reference` and `type: attachment` | Forge macro parameters support types: `string`, `number`, `boolean`, `enum`, `spacekey`, `username`, `confluence-content-reference` is a Connect concept. Attachment picker is handled via **configuration UI** (`useConfig`), not a manifest parameter type. | Macro module docs |
| 8 | Smart Link resolver received a single URL | The function receives **a batch of URLs** in `payload.urls[]` and must return an `entities[]` array — one entry per URL. | Smart Link API contract |
| 9 | External fetch declared as `- 'https://asciinema.org'` | Correct form is a string entry under `permissions.external.fetch.backend`. The value `'https://asciinema.org'` is valid; no `fetch:` wrapper key is needed at the top level. | Permissions docs |
| 10 | `bodyType: plain-text` casing | Allowed values include `plain-text` and `PLAIN-TEXT` — lowercase hyphenated is correct. ✓ | Macro module docs |

---

## Forge Module Architecture

```
manifest.yml
├── modules
│   ├── macro                    → asciinema-inline   (bodied, plain-text body)
│   ├── macro                    → asciinema-attachment (no body, config UI)
│   └── graph:smartLink          → asciinema-org-smart-link
├── resources
│   ├── main-inline              → src/frontend/inline/index.jsx
│   ├── config-inline            → src/frontend/inline/config.jsx
│   ├── main-attachment          → src/frontend/attachment/index.jsx
│   ├── config-attachment        → src/frontend/attachment/config.jsx
│   └── player-embed             → static/player-embed.html
└── function
    ├── resolver-inline          (backend: reads macro body, no Confluence API needed)
    ├── resolver-attachment      (backend: resolves attachment download URL)
    └── smart-link-resolver      (backend: fetches asciinema.org metadata)
```

### Static Assets

The following files from the upstream asciinema-player distribution are bundled
as Forge static resources and served via the app's CDN:

| File | Purpose |
|---|---|
| `asciinema-player.min.js` | Player runtime (no external dependencies) |
| `asciinema-player.css` | Player stylesheet |
| `SymbolsNerdFont-Regular.woff2` | Nerd Font glyphs used in many recordings |

These are already present in `asciinema/assets/` in this repository and can be
copied verbatim into `static/`.

> **Custom UI is required** for both macros. The asciinema-player is a complex
> canvas-based widget that cannot be expressed in Forge UI Kit primitives.
> Macro content is rendered inside a sandboxed Forge iframe; note that bare
> `<a href>` links inside the iframe are not clickable — use `router.navigate`
> from `@forge/bridge` if navigation is needed.

---

## Module 1 — Bodied Macro: `asciinema-inline`

### Purpose

Lets an author paste the raw text content of a `.cast` file directly into the
macro body. Useful when the recording is small, self-contained, or generated
on-the-fly and there is no natural attachment to link to.

### How Bodied Macros Work in Forge

In Forge, the `macro` module handles both bodied and non-bodied macros. Setting
`bodyType: plain-text` causes the Confluence editor to render an editable
plain-text body area between the macro's opening and closing tags. The frontend
resource receives the body contents via `view.getContext()`:

```js
const ctx = await view.getContext();
const castText = ctx.extension.body; // raw .cast content
```

Playback options (autoplay, speed, theme, etc.) are handled by a **config UI**
resource registered via `config:`.

### Manifest Declaration

```yaml
modules:
  macro:
    - key: asciinema-inline
      title: Asciinema Inline
      description: >
        Render an asciinema terminal recording whose .cast content is
        pasted directly into the macro body.
      resource: main-inline
      resolver:
        function: resolver-inline
      bodyType: plain-text
      categories:
        - media
      config:
        resource: config-inline
        render: native
        title: Playback Options
        openOnInsert: true
```

### Config Parameters (via `useConfig` hook)

The configuration UI (`config-inline`) renders a form with these fields:

| Field | UI Kit Component | Default | Description |
|---|---|---|---|
| `autoplay` | `Checkbox` | false | Start playing immediately |
| `loop` | `Checkbox` | false | Loop continuously |
| `speed` | `Textfield` (number) | 1 | Playback speed multiplier |
| `theme` | `Select` | asciinema | Colour theme |
| `cols` | `Textfield` (number) | — | Override terminal width |
| `rows` | `Textfield` (number) | — | Override terminal height |

### Rendering Logic (`main-inline` resource)

The Custom UI frontend (`src/frontend/inline/index.jsx`):

1. Calls `view.getContext()` to get `ctx.extension.body` (the raw `.cast` text)
   and `ctx.extension.config` (playback options from `useConfig`).
2. Loads `asciinema-player.min.js` and `asciinema-player.css` from the app's
   static resource URL (resolved via `getStaticUrl()` from `@forge/bridge`).
3. Calls `AsciinemaPlayer.create({ data: castText }, container, opts)` where
   `opts` maps config values to player options.

**Skeleton frontend (`index.jsx`):**

```jsx
import { view, getStaticUrl } from '@forge/bridge';
import { useEffect, useRef } from 'react';

export default function App() {
  const container = useRef(null);

  useEffect(() => {
    (async () => {
      const ctx = await view.getContext();
      const castText = ctx.extension.body;
      const config = ctx.extension.config || {};

      // Dynamically load the player bundle from Forge static resources
      const playerJs = await getStaticUrl('asciinema-player.min.js');
      const playerCss = await getStaticUrl('asciinema-player.css');

      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = playerCss;
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = playerJs;
      script.onload = () => {
        window.AsciinemaPlayer.create(
          { data: castText },
          container.current,
          {
            cols: config.cols ? parseInt(config.cols) : undefined,
            rows: config.rows ? parseInt(config.rows) : undefined,
            autoPlay: config.autoplay === true,
            loop: config.loop === true,
            speed: parseFloat(config.speed || '1'),
            theme: config.theme || 'asciinema',
          }
        );
      };
      document.head.appendChild(script);
    })();
  }, []);

  return <div ref={container} />;
}
```

> **Note on `bodyType: plain-text`:** Confluence will not attempt to interpret
> the body as wiki markup or storage-format XML, which is critical because
> `.cast` files contain JSON characters (`{`, `"`, `[`) that would otherwise be
> escaped or parsed incorrectly.

---

## Module 2 — Attachment Macro: `asciinema-attachment`

### Purpose

Lets an author select a `.cast` file already attached to the current Confluence
page and render it via the player. This is the primary workflow for larger
recordings or those shared across multiple pages.

### Manifest Declaration

```yaml
  macro:
    - key: asciinema-attachment
      title: Asciinema Recording
      description: >
        Render an asciinema terminal recording from a page attachment.
      resource: main-attachment
      resolver:
        function: resolver-attachment
      categories:
        - media
      config:
        resource: config-attachment
        render: native
        title: Recording Options
        openOnInsert: true
```

### Config Parameters (via `useConfig` hook)

The configuration UI (`config-attachment`) renders:

| Field | UI Kit Component | Required | Description |
|---|---|---|---|
| `filename` | `Textfield` | Yes | Name of the `.cast` attachment on this page |
| `autoplay` | `Checkbox` | — | Start playing immediately |
| `loop` | `Checkbox` | — | Loop continuously |
| `speed` | `Textfield` (number) | — | Playback speed multiplier (default 1) |
| `theme` | `Select` | — | Colour theme |
| `poster` | `Textfield` (number) | — | Poster frame time in seconds |

> **Why not a native attachment picker?** Forge macro manifest parameter types
> (`string`, `number`, `boolean`, `enum`, `spacekey`, `username`) do not include
> a built-in attachment picker. The attachment filename is collected via the
> config UI text field. The backend resolver then looks up the actual download
> URL via the Confluence REST API.

### Rendering Logic

**Backend resolver (`resolver-attachment`):**

Uses `api.asApp().requestConfluence()` to resolve the attachment download URL:

```js
import api, { route } from '@forge/api';

export async function resolveAttachmentUrl({ payload }) {
  const { pageId, filename } = payload;
  const res = await api.asApp().requestConfluence(
    route`/wiki/rest/api/content/${pageId}/child/attachment?filename=${filename}&limit=1`
  );
  const data = await res.json();
  const attachment = data.results?.[0];
  if (!attachment) throw new Error(`Attachment "${filename}" not found`);
  return { downloadUrl: `https://your-site.atlassian.net/wiki${attachment._links.download}` };
}
```

**Frontend resource (`main-attachment`):**

1. Calls `view.getContext()` to get `ctx.extension.config` (filename, options)
   and `ctx.contentId` (page ID).
2. Invokes the backend resolver via `invoke('resolveAttachmentUrl', { pageId, filename })`.
3. Passes the resolved URL directly to `AsciinemaPlayer.create(url, container, opts)`.

### Permissions Required

```yaml
permissions:
  scopes:
    - read:confluence-content.all   # to resolve attachment metadata + download URL
```

---

## Module 3 — Smart Link: `asciinema-org-smart-link`

### Purpose

When a Confluence author pastes a URL of the form
`https://asciinema.org/a/<recording-id>`, Confluence calls this resolver and
displays a rich Smart Link card instead of a bare hyperlink.

### How asciinema.org Exposes Cast Data

The asciinema.org server follows a well-known convention already implemented in
`asciinema/src/html.rs`: the HTML page at `https://asciinema.org/a/<id>`
contains a `<link>` tag in `<head>`:

```html
<link rel="alternate"
      type="application/x-asciicast"
      href="https://asciinema.org/a/<id>.cast">
```

This provides a direct, unauthenticated URL to the raw `.cast` file. The SVG
poster image is available at `https://asciinema.org/a/<id>.svg`.

### Manifest Declaration

```yaml
  graph:smartLink:
    - key: asciinema-org-smart-link
      name: Asciinema.org Smart Link
      icon: https://asciinema.org/favicon.ico
      function: smart-link-resolver
      domains:
        - asciinema.org
      subdomains: false
      patterns:
        - 'https:\/\/asciinema\.org\/a\/([0-9a-zA-Z]+)(\?.*)?$'
```

**Key corrections vs original draft:**
- Module key is `graph:smartLink` (not `confluence:teamwork-graph-smart-link`)
- `domains` is a required array of domain strings
- `patterns` is a required array of **regular expressions** (not glob patterns)
- `icon` is a required field (absolute URL to the provider's favicon)
- `urlPattern` (single string) does not exist — replaced by `domains` + `patterns`

### API Contract

**Request:** Atlassian calls the function with a batch of URLs:

```json
{
  "type": "resolve",
  "payload": {
    "urls": [
      "https://asciinema.org/a/756853",
      "https://asciinema.org/a/123456"
    ]
  }
}
```

**Response:** The function must return one `EntityResult` per URL:

```json
{
  "entities": [
    {
      "identifier": { "url": "https://asciinema.org/a/756853" },
      "meta": {
        "access": "granted",
        "visibility": "public"
      },
      "entity": {
        "id": "756853",
        "displayName": "asciinema CLI demo",
        "url": "https://asciinema.org/a/756853",
        "thumbnail": {
          "externalUrl": "https://asciinema.org/a/756853.svg"
        },
        "atlassian:document": {
          "type": { "category": "document" }
        }
      }
    }
  ]
}
```

- `meta.access`: `"granted"` | `"forbidden"` | `"unauthorized"` | `"not_found"`
- `meta.visibility`: `"public"` | `"restricted"` | `"other"` | `"not_found"`
- `entity` is optional — omit it if the URL cannot be resolved

### Resolver Logic (`smart-link-resolver`)

```js
import api from '@forge/api';

export async function handler(event) {
  const urls = event.payload.urls;

  const entities = await Promise.all(urls.map(async (url) => {
    try {
      const match = url.match(/asciinema\.org\/a\/([0-9a-zA-Z]+)/);
      if (!match) return notFound(url);

      const id = match[1];

      // Fetch the HTML page to extract title/description from <meta> tags
      // (same approach as asciinema/src/html.rs extract_asciicast_link)
      const htmlRes = await api.fetch(`https://asciinema.org/a/${id}`);
      if (!htmlRes.ok) return notFound(url);

      const html = await htmlRes.text();
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const displayName = titleMatch ? titleMatch[1].trim() : `asciinema recording ${id}`;

      return {
        identifier: { url },
        meta: { access: 'granted', visibility: 'public' },
        entity: {
          id,
          displayName,
          url,
          thumbnail: { externalUrl: `https://asciinema.org/a/${id}.svg` },
          'atlassian:document': { type: { category: 'document' } },
        },
      };
    } catch {
      return notFound(url);
    }
  }));

  return { entities };
}

function notFound(url) {
  return {
    identifier: { url },
    meta: { access: 'not_found', visibility: 'not_found' },
  };
}
```

---

## Full `manifest.yml`

```yaml
app:
  id: ari:cloud:ecosystem::app/<uuid>
  name: Asciinema for Confluence
  runtime:
    name: nodejs22.x

modules:
  macro:
    - key: asciinema-inline
      title: Asciinema Inline
      description: >
        Render an asciinema recording pasted inline as .cast content.
      resource: main-inline
      resolver:
        function: resolver-inline
      bodyType: plain-text
      categories:
        - media
      config:
        resource: config-inline
        render: native
        title: Playback Options
        openOnInsert: true

    - key: asciinema-attachment
      title: Asciinema Recording
      description: >
        Render an asciinema recording from a page attachment.
      resource: main-attachment
      resolver:
        function: resolver-attachment
      categories:
        - media
      config:
        resource: config-attachment
        render: native
        title: Recording Options
        openOnInsert: true

  graph:smartLink:
    - key: asciinema-org-smart-link
      name: Asciinema.org Smart Link
      icon: https://asciinema.org/favicon.ico
      function: smart-link-resolver
      domains:
        - asciinema.org
      subdomains: false
      patterns:
        - 'https:\/\/asciinema\.org\/a\/([0-9a-zA-Z]+)(\?.*)?$'

  function:
    - key: resolver-inline
      handler: src/resolvers/inline.handler
    - key: resolver-attachment
      handler: src/resolvers/attachment.handler
    - key: smart-link-resolver
      handler: src/resolvers/smartLink.handler

resources:
  - key: main-inline
    path: src/frontend/inline/index.jsx
  - key: config-inline
    path: src/frontend/inline/config.jsx
  - key: main-attachment
    path: src/frontend/attachment/index.jsx
  - key: config-attachment
    path: src/frontend/attachment/config.jsx
  - key: static-assets
    path: static

permissions:
  scopes:
    - read:confluence-content.all
  external:
    fetch:
      backend:
        - 'https://asciinema.org'
```

---

## Project Structure

```
forge-app/
├── manifest.yml
├── package.json
├── src/
│   ├── frontend/
│   │   ├── inline/
│   │   │   ├── index.jsx        # Module 1 — main render (Custom UI)
│   │   │   └── config.jsx       # Module 1 — config UI (UI Kit)
│   │   └── attachment/
│   │       ├── index.jsx        # Module 2 — main render (Custom UI)
│   │       └── config.jsx       # Module 2 — config UI (UI Kit)
│   └── resolvers/
│       ├── inline.js            # Module 1 backend resolver
│       ├── attachment.js        # Module 2 backend resolver
│       └── smartLink.js         # Module 3 Smart Link handler
└── static/
    ├── asciinema-player.min.js  # copied from asciinema/assets/
    ├── asciinema-player.css     # copied from asciinema/assets/
    └── SymbolsNerdFont-Regular.woff2  # copied from asciinema/assets/
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Single `macro` module type for both bodied and non-bodied | Forge has no separate `confluence:bodied-macro` module; `bodyType: plain-text` on the standard `macro` module enables the body. |
| `bodyType: plain-text` for the inline macro | `.cast` files are JSON-lines; `plain-text` prevents Confluence mangling JSON characters as wiki markup. |
| Custom UI for macro rendering, UI Kit for config UI | The asciinema-player is a complex canvas widget that cannot be expressed in UI Kit. Config UI (allowed components: Label, Textfield, Select, Checkbox, etc.) uses UI Kit for a native Confluence look. |
| Bundle player JS/CSS as static resources | Avoids an external CDN dependency; works in air-gapped or strict-CSP Confluence deployments. |
| `graph:smartLink` with `domains` + regex `patterns` | This is the actual Forge Smart Link API — `domains` is required for the domain allow-list and `patterns` uses regex, not glob syntax. |
| Smart Link resolver handles batched URLs | The API contract delivers multiple URLs in a single invocation; the response must include one entity result per URL. |
| Attachment URL resolved server-side | The backend resolver looks up the Confluence attachment download URL, avoiding any CORS or auth issues in the frontend iframe. |
| `openOnInsert: true` on config | Causes the config modal to open automatically when the macro is first inserted, guiding the user to configure playback options immediately. |

---

## Asciicast Format Reference

The `.cast` format (asciicast v2) used by both macros is a JSON-lines file:

```
<header line — JSON object>
[<time>, "<event-code>", "<data>"]
[<time>, "<event-code>", "<data>"]
...
```

- **Header fields:** `version`, `width`, `height`, `timestamp`,
  `idle_time_limit`, `title`, `env`, `theme`
- **Event codes:** `"o"` (output), `"i"` (input), `"r"` (resize),
  `"m"` (marker)

v1 (`.json`) and v3 formats are also supported by the asciinema-player library.

---

## Out of Scope (Future Work)

- **Live streaming** — the asciinema WebSocket streaming protocol
  (`asciinema stream`) could be a future fourth module (a macro pointing at
  an `asciinema stream` relay URL).
- **Upload to asciinema.org** — a content action that uploads an attachment
  directly to asciinema.org and converts it to a Smart Link.
- **asciinema.org private recordings** — would require OAuth integration
  with the asciinema.org API using `asUser()` in the Smart Link resolver.
- **Macro autoConvert for the attachment macro** — using `autoConvert.matchers`
  to auto-insert the macro when an asciinema.org URL is pasted (this would
  complement the Smart Link, converting the link to a full embedded player
  rather than a card). Pattern: `https://asciinema.org/a/*`.
