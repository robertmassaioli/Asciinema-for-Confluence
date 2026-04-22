---
title: Inline Macro
parent: Macros
nav_order: 3
---

# Inline Macro

Paste raw `.cast` content directly into the macro body — no attachments, no file management, zero setup.

---

## When to use this macro

Use the Inline macro when you want the simplest possible way to embed a recording:

- You have a `.cast` file and want to share it quickly without managing attachments
- You're migrating recordings from another system and want to paste content directly
- You want the recording content version-controlled alongside the page (the `.cast`
  JSON is stored in the macro body, which is part of the page content)

{: .note }
For long recordings, the macro body can become very large. In that case, the
[Recording macro]({% link macros/recording.md %}) (which uses a page attachment)
is a cleaner choice. For demos you want to write and maintain as text, use
[CastScript]({% link macros/castscript.md %}).

---

## Step-by-step

### 1. Get your `.cast` content

If you recorded with the asciinema CLI:

```sh
# Record
asciinema rec demo.cast

# Print the content to copy
cat demo.cast
```

Copy the entire file content — it starts with a JSON header line followed by
event lines, like this:

```
{"version":3,"width":80,"height":24,"timestamp":1234567890}
[0.5,"o","$ "]
[1.2,"o","hello world\r\n"]
```

### 2. Insert the macro

1. In the Confluence editor, type `/` and search for **Asciinema Inline**
2. Select the macro — a code block body opens
3. Paste the full `.cast` content into the body
4. Configure playback options as needed (see below)
5. Click **Update**

### 3. Publish

Click **Publish** — the player renders on the published page using the content
you pasted.

---

## Configuration panel

| Option | Values | Default | Description |
|:-------|:-------|:--------|:------------|
| Theme | `asciinema`, `monokai`, `solarized-dark`, `solarized-light`, `tango` | `asciinema` | Player colour scheme |
| Speed | `0.5×`, `1×`, `1.5×`, `2×`, `3×` | `1×` | Playback speed multiplier |
| Autoplay | on / off | off | Start playing automatically when the page loads |
| Loop | on / off | off | Loop the recording indefinitely |
| Poster | time string e.g. `0:05` | *(none)* | Frame to show as thumbnail before playback starts |
| Cols | number | *(from cast header)* | Override terminal width |
| Rows | number | *(from cast header)* | Override terminal height |

See the [Configuration Reference]({% link reference/configuration.md %}) for full details.

---

## Troubleshooting

**The player shows an error**
: Make sure you pasted the complete `.cast` file — the first line must be a valid
  JSON header (starts with `{`). Partial content will not parse correctly.

**The recording looks cut off**
: Check that you copied the entire file, including the last event line.

**The terminal is the wrong size**
: Use the **Cols** and **Rows** config options to override the dimensions recorded
  in the `.cast` header.
