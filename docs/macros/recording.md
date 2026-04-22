---
title: Recording Macro
parent: Macros
nav_order: 2
---

# Recording Macro

Embed a `.cast` recording stored as a Confluence page attachment — the recording lives alongside the documentation that describes it.

---

## When to use this macro

Use the Recording macro when you have an existing `.cast` file captured with the
[asciinema CLI](https://docs.asciinema.org/manual/cli/) and want to attach it directly
to the Confluence page where it's documented.

The recording stays in Confluence — no external hosting, no CDN, no broken links when
an external service changes.

{: .note }
If you don't have a `.cast` file yet and want to write your demo as text instead,
see the [CastScript macro]({% link macros/castscript.md %}).

---

## Step-by-step

### 1. Record your terminal session

Install the asciinema CLI and record a session:

```sh
# Install (macOS)
brew install asciinema

# Record
asciinema rec demo.cast

# ... do your thing in the terminal ...
# Press Ctrl+D or type 'exit' to stop recording
```

### 2. Upload the `.cast` file as a page attachment

1. Open the Confluence page in edit mode
2. Go to **Insert** → **Files and images** → **Upload files**
3. Upload your `demo.cast` file
4. Note the exact filename (including the `.cast` extension)

### 3. Insert the macro

1. In the editor, type `/` and search for **Asciinema Recording**
2. Select the macro
3. In the **Filename** field, enter the exact name of the attachment (e.g. `demo.cast`)
4. Configure playback options as needed (see below)
5. Click **Update**

### 4. Publish

Click **Publish** — the player will render on the published page, loading the
recording from the attachment automatically.

---

## Configuration panel

| Option | Values | Default | Description |
|:-------|:-------|:--------|:------------|
| Filename | string | *(required)* | Exact name of the `.cast` attachment on this page |
| Theme | `asciinema`, `monokai`, `solarized-dark`, `solarized-light`, `tango` | `asciinema` | Player colour scheme |
| Speed | `0.5×`, `1×`, `1.5×`, `2×`, `3×` | `1×` | Playback speed multiplier |
| Autoplay | on / off | off | Start playing automatically when the page loads |
| Loop | on / off | off | Loop the recording indefinitely |
| Poster | time string e.g. `0:05` | *(none)* | Frame to show as the thumbnail before playback starts |

See the [Configuration Reference]({% link reference/configuration.md %}) for full details.

---

## Troubleshooting

**The player shows an error / recording doesn't load**
: Check that the filename in the macro config matches the attachment name exactly — including the `.cast` extension and capitalisation. Filenames are case-sensitive.

**The attachment was renamed or replaced**
: Update the macro's Filename field to match the new attachment name.

**I uploaded the file but the player still doesn't work in edit mode**
: The player only renders in **published** view. Click Publish and check the live page.

**The file is on a different page**
: The Recording macro only reads attachments from the same page it is placed on.
  Move the attachment to the correct page, or use the [Inline macro]({% link macros/inline.md %})
  and paste the `.cast` content directly.
