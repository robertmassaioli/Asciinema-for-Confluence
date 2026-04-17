# Asciinema for Confluence

A Forge app that brings [asciinema](https://asciinema.org) terminal recordings into Confluence pages via three macros and a Smart Link resolver.

## Modules

| Module | Type | Description |
|---|---|---|
| **Asciinema Inline** | Bodied macro | Paste raw `.cast` file content into a Code Block in the macro body |
| **Asciinema CastScript** | Bodied macro | Write a human-readable castscript in a Code Block — compiled to a recording in-browser |
| **Asciinema Recording** | Macro | Render a `.cast` file attached to the current Confluence page |
| **Asciinema.org Smart Link** | `graph:smartLink` | Paste an `https://asciinema.org/a/<id>` URL and get a rich preview card |

---

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

---

## Project structure

```
Asciinema-for-Confluence/
├── manifest.yml                  # Forge app manifest (3 macros + Smart Link)
├── package.json                  # Root — backend dependencies (@forge/api, @forge/resolver)
├── src/
│   ├── index.js                  # Backend resolver (attachment URL lookup)
│   ├── smartLink.js              # Smart Link resolver (asciinema.org metadata fetch)
│   ├── InlineConfig.jsx          # UI Kit config panel for the Inline macro
│   ├── AttachmentConfig.jsx      # UI Kit config panel for the Attachment macro
│   └── CastScriptConfig.jsx      # UI Kit config panel for the CastScript macro
└── static/
    └── app/                      # Single shared Custom UI React app (all three macros)
        ├── src/
        │   ├── index.js          # Entry point — ViewContext + ContextRoute routing
        │   ├── ViewContext.js    # Forge context provider (from ep-tool pattern)
        │   ├── ContextRouter.js  # moduleKey-based route + ForgeReconciler.addConfig()
        │   ├── useEffectAsync.js # Async effect hook helper
        │   ├── InlineApp.js      # Player — reads .cast from ADF code block in body
        │   ├── AttachmentApp.js  # Player — fetches .cast from page attachment
        │   └── CastScriptApp.js  # Player — compiles castscript from body, renders in-browser
        └── package.json          # npm start → PORT=3000
```

### Architecture notes

- **Three rendering worlds co-exist:**
  - **Backend** (`src/index.js`, `src/smartLink.js`) — Node.js functions running on Forge
  - **Custom UI** (`static/app/src/*.js`) — React apps rendered by `ReactDOM` inside the macro iframe
  - **UI Kit config** (`src/frontend/*.jsx`) — `@forge/react` components registered via `ForgeReconciler.addConfig()` for macro config panels

- **One shared React app** — all three macros share `static/app/`. The `ContextRouter` reads `moduleKey` from `view.getContext()` to route to the correct component.

- **Two-world rule** — `useConfig()` from `@forge/react` can only be called in UI Kit components (config panels). The Custom UI app reads config via `ctx.extension.config` from `view.getContext()`.

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

The app uses `forge tunnel` to proxy requests to your local dev server, giving you instant feedback without rebuilding or redeploying on every change.

You need **two terminals** running simultaneously:

**Terminal 1 — Forge tunnel** (proxies UI resources and handles backend functions locally):
```sh
forge tunnel
```

**Terminal 2 — Shared app dev server** (hot-reloads on port 3000, serves all three macros):
```sh
cd static/app
npm start
```

Once both are running, open a Confluence page with any macro inserted and refresh — changes to any `src/` file in `static/app/` will be reflected immediately. Backend changes (`src/index.js`, `src/smartLink.js`) are also picked up automatically by `forge tunnel` without redeploying.

> **Note:** `forge tunnel` only serves your own browser session. Other users on the same site continue to see the last deployed version.

### Port assignments

| Resource | Manifest key | Dev server port |
|---|---|---|
| Shared app (all three macros) | `main` | 3000 |

The port is configured in `manifest.yml` under the `main` resource's `tunnel.port` field, and set via `PORT=3000` in `static/app/package.json`'s `start` script.

---

## Deploying changes

| What changed | Action needed |
|---|---|
| `manifest.yml` | `forge deploy` + `forge install --upgrade` |
| `src/index.js` or `src/smartLink.js` (backend) | `forge deploy` |
| `src/frontend/*.jsx` (UI Kit config panels) | `forge deploy` |
| `static/app/src/` (Custom UI frontend) | `npm run build` in `static/app/`, then `forge deploy` |
| Frontend only, using `forge tunnel` | No action needed — changes are live immediately |

---

## Using the macros

### Asciinema Inline

Renders an asciinema recording from a raw `.cast` file pasted directly into the page.

1. Edit a Confluence page
2. Insert the **Asciinema Inline** macro
3. Inside the macro body, insert a **Code Block** (type `/code` in the editor)
4. Paste your `.cast` file content (asciicast v2 NDJSON) into the Code Block
5. Publish the page — the player renders automatically
6. To adjust playback options (autoplay, loop, speed, theme), click the pencil icon on the macro

### Asciinema CastScript

Renders a recording from a human-readable castscript — no recording tools or raw JSON required. Edit the page to update the animation.

1. Edit a Confluence page
2. Insert the **Asciinema CastScript** macro
3. Inside the macro body, insert a **Code Block** (type `/code` in the editor)
4. Write (or paste) a castscript — see the [cast-builder documentation](https://github.com/robertmassaioli/cast-builder) for the format
5. Publish the page — the script is compiled and rendered in-browser
6. To adjust playback options, click the pencil icon on the macro

**Example castscript:**
```
--- config ---
title:        My Demo
width:        100
height:       28
prompt:       user@host:~$
typing-speed: normal

--- script ---

$ echo "Hello, Confluence!"
> Hello, Confluence!
```

### Asciinema Recording

Renders a recording from a `.cast` file attached to the page.

1. Attach your `.cast` file to the Confluence page
2. Edit the page and insert the **Asciinema Recording** macro
3. Click the pencil icon to open the config panel — enter the exact attachment filename (e.g. `demo.cast`) and set playback options, then click **Save**
4. Publish the page

### Asciinema.org Smart Link

1. Edit a Confluence page
2. Paste any `https://asciinema.org/a/<id>` URL and press Enter
3. Confluence automatically resolves it to a rich Smart Link card showing the recording title

---

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for Forge support resources.
