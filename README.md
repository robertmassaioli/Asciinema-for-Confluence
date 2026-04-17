# Asciinema for Confluence

A Forge app that brings [asciinema](https://asciinema.org) terminal recordings into Confluence pages via two macros and a Smart Link resolver.

## Modules

| Module | Type | Description |
|---|---|---|
| **Asciinema Inline** | Bodied macro | Paste raw `.cast` file content directly into the macro body |
| **Asciinema Recording** | Macro | Render a `.cast` file attached to the current Confluence page |
| **Asciinema.org Smart Link** | `graph:smartLink` | Paste an `https://asciinema.org/a/<id>` URL and get a rich preview card |

## Requirements

- [Forge CLI](https://developer.atlassian.com/platform/forge/set-up-forge/) installed and authenticated (`forge login`)
- Node.js 24 (use `nvm` — a `.nvmrc` is provided)
- npm

## Node.js version

This project uses Node.js 24, matching the `nodejs24.x` Forge runtime. If you use [nvm](https://github.com/nvm-sh/nvm), just run the following in the project root to switch to the correct version:

```sh
nvm use
```

If you don't have Node.js 24 installed yet:

```sh
nvm install
```

## Project structure

```
Asciinema-for-Confluence/
├── manifest.yml                  # Forge app manifest
├── package.json                  # Root — backend + UI Kit dependencies
├── src/
│   ├── index.js                  # Backend resolver (resolveAttachmentUrl)
│   ├── smartLink.js              # Smart Link resolver (asciinema.org metadata fetch)
│   └── frontend/
│       ├── inlineConfig.jsx      # UI Kit config panel for the inline macro
│       └── attachmentConfig.jsx  # UI Kit config panel for the attachment macro
└── static/
    └── app/                      # Single shared Custom UI React app (both macros)
        ├── src/
        │   ├── index.js          # Entry point — ViewContext + ContextRoute routing
        │   ├── ViewContext.js    # Forge context provider (from ep-tool)
        │   ├── ContextRouter.js  # moduleKey-based route component (from ep-tool)
        │   ├── useEffectAsync.js # Async effect hook (from ep-tool)
        │   ├── InlineApp.js      # Player — reads .cast from macro body
        │   └── AttachmentApp.js  # Player — fetches .cast from page attachment
        └── package.json          # npm start → PORT=3000
```

---

## First-time setup

### 1. Install backend dependencies

```sh
npm install
```

### 2. Install frontend dependencies and build

```sh
cd static/app && npm install && npm run build && cd ../..
```

### 3. Deploy the app

```sh
forge deploy
```

### 4. Install on a Confluence site

```sh
forge install --site <your-site>.atlassian.net --product confluence
```

---

## Local development (with hot-reloading)

The app uses `forge tunnel` to proxy requests to local dev servers, giving you hot-reloading without needing to rebuild or redeploy on every change.

You need **two terminals** running simultaneously:

**Terminal 1 — Forge tunnel** (proxies UI resources and handles backend functions locally):
```sh
forge tunnel
```

**Terminal 2 — Shared app dev server** (hot-reloads on port 3000, serves both macros):
```sh
cd static/app
npm start
```

Once both are running, open a Confluence page with either macro inserted and refresh — changes to any `src/` file in `static/app/` will be reflected immediately. Backend function changes (`src/index.js`, `src/smartLink.js`, `src/frontend/*.jsx`) are also picked up automatically by `forge tunnel` without redeploying.

> **Note:** `forge tunnel` only serves your own browser session. Other users on the same site continue to see the last deployed version.

### Port assignments

| Resource | Manifest key | Dev server port |
|---|---|---|
| Shared app (both macros) | `main` | 3000 |

The port is configured in `manifest.yml` under the `main` resource's `tunnel.port` field, and set via `PORT=3000` in `static/app/package.json`'s `start` script.

---

## Deploying changes

If you change **`manifest.yml`** or the **backend** (`src/`), you must redeploy:

```sh
forge deploy
```

If you only change **frontend source files** (`static/*/src/`), you can either:
- Use `forge tunnel` + `npm start` for local dev (no deploy needed), or
- Run `npm run build` in the relevant static directory, then `forge deploy`

---

## Using the macros

### Asciinema Inline

1. Edit a Confluence page
2. Insert the **Asciinema Inline** macro
3. The config panel opens automatically — set playback options (autoplay, loop, speed, theme, terminal size overrides), then click **Save**
4. Paste your `.cast` file content into the macro body
5. Publish the page

### Asciinema Recording

1. Attach your `.cast` file to the Confluence page
2. Edit the page and insert the **Asciinema Recording** macro
3. The config panel opens automatically — enter the exact attachment filename (e.g. `demo.cast`) and set playback options, then click **Save**
4. Publish the page

### Asciinema.org Smart Link

1. Edit a Confluence page
2. Paste any `https://asciinema.org/a/<id>` URL
3. Confluence will automatically resolve it to a rich Smart Link card showing the recording title and SVG poster

---

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for Forge support resources.
