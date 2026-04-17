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
├── package.json                  # Root — backend dependencies (@forge/api, @forge/resolver)
├── src/
│   ├── index.js                  # Backend resolver (resolveAttachmentUrl)
│   └── smartLink.js              # Smart Link resolver (asciinema.org metadata fetch)
└── static/
    ├── inline-macro/             # Custom UI React app for the Asciinema Inline macro
    │   ├── src/
    │   │   ├── index.js          # Entry point — renders App or Config based on context
    │   │   ├── App.js            # Player view — reads .cast from macro body
    │   │   └── Config.js         # Config panel — playback options (autoplay, speed, theme…)
    │   └── package.json          # npm start → PORT=3000
    └── attachment-macro/         # Custom UI React app for the Asciinema Recording macro
        ├── src/
        │   ├── index.js          # Entry point — renders App or Config based on context
        │   ├── App.js            # Player view — fetches .cast from page attachment
        │   └── Config.js         # Config panel — filename, playback options
        └── package.json          # npm start → PORT=3001
```

---

## First-time setup

### 1. Install backend dependencies

```sh
npm install
```

### 2. Install frontend dependencies and build

```sh
# Inline macro
cd static/inline-macro && npm install && npm run build && cd ../..

# Attachment macro
cd static/attachment-macro && npm install && npm run build && cd ../..
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

You need **three terminals** running simultaneously:

**Terminal 1 — Forge tunnel** (proxies UI resources and handles backend functions locally):
```sh
forge tunnel
```

**Terminal 2 — Inline macro dev server** (hot-reloads on port 3000):
```sh
cd static/inline-macro
npm start
```

**Terminal 3 — Attachment macro dev server** (hot-reloads on port 3001):
```sh
cd static/attachment-macro
npm start
```

Once all three are running, open a Confluence page with the macro inserted and refresh — changes to any `src/` file in either frontend will be reflected immediately. Backend function changes (`src/index.js`, `src/smartLink.js`) are also picked up automatically by `forge tunnel` without redeploying.

> **Note:** `forge tunnel` only serves your own browser session. Other users on the same site continue to see the last deployed version.

### Port assignments

| Resource | Manifest key | Dev server port |
|---|---|---|
| Inline macro | `main-inline` | 3000 |
| Attachment macro | `main-attachment` | 3001 |

These ports are configured in `manifest.yml` under each resource's `tunnel.port` field, and locked in via the `PORT=` prefix in each `package.json`'s `start` script.

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
