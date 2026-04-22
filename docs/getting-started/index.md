---
title: Getting Started
nav_order: 2
has_children: false
---

# Getting Started

This guide walks you through installing Asciinema for Confluence and embedding
your first terminal recording in under five minutes.

---

## 1. Install the app

1. In Confluence, go to **Settings** (⚙️ gear icon) → **Find new apps**
2. Search for **Asciinema for Confluence**
3. Click **Install** and follow the prompts

Or install directly from the [Atlassian Marketplace](#){: target="_blank" }.

{: .note }
You need Confluence administrator permissions to install apps.

---

## 2. Choose your macro

All three macros (plus Smart Links) are available immediately after installation.
Use this table to pick the right one for your situation:

| I want to… | Use this |
|:-----------|:---------|
| Write a terminal demo from scratch, without recording | [CastScript macro]({% link macros/castscript.md %}) ← recommended |
| Embed a `.cast` file I've uploaded to the page | [Recording macro]({% link macros/recording.md %}) |
| Paste raw `.cast` content directly | [Inline macro]({% link macros/inline.md %}) |
| Link to a recording on asciinema.org | [Smart Links]({% link macros/smart-links.md %}) |

**Not sure?** Start with CastScript — it's the most flexible and requires no
recording tool at all.

---

## 3. Insert a macro

1. Open a Confluence page in **edit mode**
2. Type `/` to open the macro browser, then search for **Asciinema**
3. Select the macro you want
4. Fill in the macro body or configuration panel (each macro has its own guide)
5. Click **Update** or press **Escape** to close the config panel

{: .highlight }
The player only renders in **published** view — it shows a placeholder in the editor.

---

## 4. Publish the page

Click **Publish** (or **Update**, if the page already exists). The macro will render
as a fully interactive terminal player on the published page.

---

## Next steps

- [CastScript macro]({% link macros/castscript.md %}) — the most powerful option
- [Recording macro]({% link macros/recording.md %}) — for existing `.cast` files
- [Inline macro]({% link macros/inline.md %}) — for quick paste-and-go
- [Configuration reference]({% link reference/configuration.md %}) — all playback options
