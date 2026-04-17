# Proposal: Asciinema CastScript Macro

## Overview

Add a fourth module to the Asciinema for Confluence Forge app: a bodied macro called
**Asciinema CastScript** that accepts a `.castscript` source in a Code Block in its body,
compiles it to a `.cast` recording entirely in the browser using `@cast-builder/core`, and
renders it with the asciinema-player — all without any backend, attachment upload, or
external fetch.

Because the script is stored directly in the Confluence page body, editing the page and
republishing is all that is needed to update the animation. No files to upload, no
copy-paste of opaque JSON, no re-recording required.

---

## Why This Is More User-Friendly Than the Existing Macros

| | Inline (.cast body) | Attachment (.cast file) | **CastScript (this proposal)** |
|---|---|---|---|
| Content format | Raw asciicast JSON-lines | Uploaded file | Human-readable script |
| Edit to update | Paste new JSON | Re-upload file | Edit page text |
| Readable in editor | No | No | **Yes** |
| Deterministic output | Yes | Yes | Yes (seeded RNG) |
| Requires file upload | No | Yes | **No** |
| Requires external tool | No | Yes (asciinema record) | **No** |

---

## The CastScript Format (from `@cast-builder/core`)

A `.castscript` file has two sections separated by `--- script ---`:

```
--- config ---
title:        My Demo
width:        100
height:       28
prompt:       user@host:~/project$
theme:        dracula
typing-speed: normal
idle-time:    0.8

--- script ---

print: Welcome to my demo!

wait: 1s

$ git status
> On branch main
> nothing to commit, working tree clean

wait: 500ms

$ echo "Hello, Confluence!"
> Hello, Confluence!
```

Key directives:
- `$ <command>` — types a shell command at the prompt with realistic keystroke timing
- `> <output>` — prints command output (supports `{bold: ...}`, `{green: ...}` etc.)
- `print: <text>` — prints text without a prompt
- `wait: <duration>` — pauses (e.g. `1s`, `500ms`)
- `clear` — clears the terminal
- `marker: <label>` — adds a named chapter marker
- `type: <text>` — types text without executing (e.g. for interactive prompts)

---

## Architecture

### Module key: `asciinema-castscript`

### Manifest additions

```yaml
modules:
  macro:
    - key: asciinema-castscript
      title: Asciinema CastScript
      description: >
        Write a castscript in the macro body and watch it render as an animated
        terminal recording. Edit the page to update the animation — no tools needed.
      resource: main
      resolver:
        function: resolver
      layout: bodied
      config: true
      categories:
        - media
```

No `parameters:` block — config is handled by a UI Kit component (see below),
not classic macro parameters. `config: true` tells Confluence to show a config
panel; the panel's fields are defined entirely in `CastScriptConfig.js`.

### Frontend: `static/app/src/CastScriptApp.js`

Added as a new `ContextRoute` in `index.js`:

```jsx
<ContextRoute moduleKey='asciinema-castscript'>
  <CastScriptApp />
</ContextRoute>
```

**Rendering pipeline (all in-browser, zero backend):**

```
Macro body (ADF)
  └─ extractCodeBlockText()          [reuse from InlineApp]
       └─ castscript source string
            └─ parse(source)         [@cast-builder/core]
                 └─ { config, nodes }
                      └─ compile(config, nodes, { resolver: NULL_RESOLVER })
                           └─ CompiledCast
                                └─ encodeV3(cast)
                                     └─ .cast NDJSON string
                                          └─ data: URL
                                               └─ AsciinemaPlayer.create()
                                                    └─ rendered player
```

**Key implementation details:**

1. **ADF extraction** — reuse the existing `extractCodeBlockText()` logic from `InlineApp.js`
   (enforce exactly one Code Block in the body, clear error messages otherwise).

2. **NULL_RESOLVER** — since the castscript is self-contained in the macro body, no file
   I/O is needed. `@cast-builder/core` exports `NULL_RESOLVER` for exactly this case.
   Scripts using `>>` or `include:` directives will produce a `CompileError` with a clear
   message explaining that those directives require file access not available in this context.

3. **Deterministic seed** — the `seed` parameter (if set) is written into `config.typingSeed`
   before calling `compile()`. This means the same castscript always produces the same
   timing, which is important for Confluence pages that may be viewed by many people
   simultaneously — no jitter variation between renders.

4. **Config override** — player theme, autoplay, loop, and speed come from the classic macro
   parameters (same as the other macros). The castscript `--- config ---` block sets terminal
   dimensions and typing characteristics; the macro parameters control the player wrapper.

5. **Error display** — `CompileError` from `@cast-builder/core` has a `.message` and
   optionally a `.line` property. Display these clearly so the author can fix their script
   without leaving Confluence.

### Dependency addition

```bash
npm install @cast-builder/core
```

Added to `static/app/package.json`. The library is explicitly browser-safe (zero Node.js
built-ins, no filesystem access), so `react-scripts` can bundle it without any
configuration changes.

---

## User Experience

### Authoring flow

1. Insert **Asciinema CastScript** macro on a page
2. Inside the macro body, insert a **Code Block** (type `/code` in the editor, set language
   to `plaintext` or `castscript`)
3. Write the castscript directly in the Code Block
4. Save the page — the player renders immediately, no upload required
5. To update the animation: edit the page, change the script, save

### Config panel (`CastScriptConfig.js`)

The config panel follows the same pattern as `InlineConfig.js` and `AttachmentConfig.js`:

- `CastScriptConfig.js` is passed as the `config` prop on the matching `ContextRoute` in
  `index.js`: `<ContextRoute moduleKey='asciinema-castscript' config={<CastScriptConfig />}>`
- `ContextRoute` calls `ForgeReconciler.addConfig(<CastScriptConfig />)` once on first render
- `CastScriptConfig.js` uses `@forge/react` components (`CheckboxGroup`, `Select`,
  `Textfield`, `Label`) and `useConfig()` to populate default values — this is the
  ForgeReconciler (UI Kit) world
- `CastScriptApp.js` reads the saved config via `ctx.extension.config` from
  `view.getContext()` — this is the ReactDOM (Custom UI) world. `useConfig()` must NOT
  be called here (two React instances — see the `useConfig()` / ReactDOM boundary rule)

Fields in `CastScriptConfig.js`:
- **Playback** — `CheckboxGroup` (name: `playback`) with values `autoplay` and `loop`;
  read back in app as `Array.isArray(config.playback) && config.playback.includes('autoplay')`
- **Speed** — `Textfield` (name: `speed`, default `"1"`)
- **Theme** — `Select` (name: `theme`) with options: asciinema / monokai / solarized-dark /
  solarized-light / dracula
- **Typing seed** — `Textfield` (name: `seed`, placeholder `"Leave blank for random timing"`)


---

## What Does NOT Need Changing

- `manifest.yml` scopes — no new scopes needed (no API calls)
- `ContextRouter.js` — add one `<ContextRoute>` line, no changes to the class itself
- `InlineApp.js` / `AttachmentApp.js` — no changes
- Backend (`src/index.js`) — no changes
- Build pipeline — no changes (`npm run build` picks up the new file automatically)

---

## Files to Create / Modify

| File | Change |
|---|---|
| `static/app/src/CastScriptApp.js` | **Create** — new macro renderer (Custom UI, ReactDOM) |
| `static/app/src/CastScriptConfig.js` | **Create** — UI Kit config panel (ForgeReconciler) |
| `static/app/src/index.js` | **Modify** — add `<ContextRoute moduleKey='asciinema-castscript' config={<CastScriptConfig />}>` |
| `static/app/package.json` | **Modify** — add `@cast-builder/core` dependency |
| `manifest.yml` | **Modify** — add `asciinema-castscript` macro module (no `parameters:` block) |

---

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| `@cast-builder/core` uses ESM; `react-scripts` may struggle | Library is explicitly browser-safe and ESM-first; CRA handles ESM deps fine via webpack |
| Large castscripts slow compile | `compile()` is async; show a "Compiling…" spinner while it runs |
| `include:` / `>>` directives silently fail | Use `onResolveError: 'error'` (default) so `CompileError` is thrown and shown to the user |
| Typing timing differs on each view (non-seeded) | Document the `seed` parameter clearly; default is intentionally random for variety |
| Page saved with broken script breaks the published view | Wrap everything in try/catch; always show a clear error message instead of a blank/spinner |

---

## Example CastScript (ready to paste into a Code Block)

```
--- config ---
title:        Forge Deployment Demo
width:        100
height:       28
prompt:       user@host:~/my-app$
theme:        dracula
typing-speed: normal
idle-time:    0.8

--- script ---

print: ╔══════════════════════════════╗
print: ║   Deploying to Confluence    ║
print: ╚══════════════════════════════╝

wait: 1s

$ forge deploy
> Deploying your app to the development environment.
>
>   {green: ✔} Uploaded app
>   {green: ✔} Deployed successfully

wait: 1s

$ forge install --upgrade
> {green: ✔} App installed successfully.
```

---

## Summary

This macro turns Confluence into a lightweight castscript IDE. Authors write human-readable
terminal scripts directly on the page, and readers see a live animated terminal. No external
tools, no file uploads, no opaque JSON blobs. Updating the animation is as simple as editing
the page.
