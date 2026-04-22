---
title: Configuration Reference
parent: Reference
nav_order: 2
---

# Configuration Reference

All playback options available in the macro configuration panels.

---

## Shared options

These options are available on all three macros (CastScript, Recording, and Inline).

### Theme

Controls the colour scheme of the terminal player.

| Value | Description |
|:------|:------------|
| `asciinema` | Default dark theme — dark background, coloured ANSI output |
| `monokai` | Monokai-inspired dark theme |
| `solarized-dark` | Solarized dark |
| `solarized-light` | Solarized light (light background) |
| `tango` | GNOME Tango palette |

**Default:** `asciinema`

---

### Speed

Playback speed multiplier applied to the entire recording.

| Value | Effect |
|:------|:-------|
| `0.5×` | Half speed — useful for complex output |
| `1×` | Normal speed |
| `1.5×` | Slightly faster |
| `2×` | Double speed |
| `3×` | Triple speed — useful for long recordings |

**Default:** `1×`

{: .note }
For CastScript, speed is also influenced by the `typing-speed` and `idle-time`
config keys in the script itself. The Speed option applies an additional multiplier
on top of those settings.

---

### Autoplay

When enabled, the player starts playing as soon as the page loads — no click needed.

**Default:** off

{: .warning }
Use autoplay sparingly. Multiple autoplaying recordings on the same page can be
distracting and may cause performance issues on slower machines.

---

### Loop

When enabled, the recording restarts from the beginning after it finishes.

**Default:** off

---

### Poster

A time offset that specifies which frame to display as the thumbnail before
the user presses play. Useful for showing a representative moment rather than
the blank first frame.

**Format:** `M:SS` or `MM:SS` — e.g. `0:05` for 5 seconds in, `1:30` for 90 seconds in.

**Default:** *(none — shows the first frame)*

**Example:** If your recording shows a finished result at the 10-second mark,
set Poster to `0:10` so viewers can see what the demo produces before they play it.

---

## Recording macro only

### Filename

The exact name of the `.cast` attachment on the current Confluence page.

- Must include the `.cast` extension
- Case-sensitive — `Demo.cast` and `demo.cast` are different files
- Must be an attachment on **this page** (not another page)

**Example:** `demo.cast`, `git-workflow.cast`, `My Recording.cast`

---

## Inline macro only

### Cols

Override the terminal width (number of columns) specified in the `.cast` file header.

**Default:** *(value from the `.cast` header)*

### Rows

Override the terminal height (number of rows) specified in the `.cast` file header.

**Default:** *(value from the `.cast` header)*

{: .note }
Use Cols and Rows if the recorded terminal dimensions don't fit well in the
Confluence page layout. For example, if the recording was made in a very wide
terminal (200 columns), you can override to `100` to make it fit a standard
page width without horizontal scrolling.
