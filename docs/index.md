---
title: Home
nav_order: 1
description: >-
  Asciinema for Confluence brings interactive terminal recordings to your
  Confluence pages — write a script, get a live demo.
permalink: /
---

# Asciinema for Confluence
{: .fs-9 }

Terminal recordings that live inside your docs — and stay accurate as long as your docs do.
{: .fs-6 .fw-300 }

[Get started]({% link getting-started/index.md %}){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View on Marketplace](#){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## The problem with terminal demos

Screenshots go stale. Screen recordings break the moment a flag changes. Re-recording takes time you don't have, so most CLI documentation ends up inaccurate, outdated, or just missing.

**Asciinema for Confluence** solves this with four flexible ways to embed terminal recordings directly in your pages — the most powerful of which requires no recording at all.

---

## CastScript — write a demo, don't record one
{: .text-green-200 }

The CastScript macro lets you write a terminal session as a plain-text script. You describe the commands, the expected output, timing, and chapter markers — and the macro compiles it to a fully interactive terminal animation right on the Confluence page.

```
--- config ---
title:        Git Workflow Demo
width:        100
height:       28
prompt:       user@host:~/project$
typing-speed: normal
idle-time:    0.8

--- script ---

marker: Initialise

$ git init
> Initialized empty Git repository in /home/user/project/.git/

$ git add .
$ git commit -m "Initial commit"
> [main abc1234] Initial commit
>  3 files changed, 42 insertions(+)
```

When the CLI changes, you edit a line of text and republish. No re-recording, no re-uploading, no broken screenshots.

[Learn more about CastScript →]({% link macros/castscript.md %}){: .btn .btn-outline }

---

## Already have recordings?

Three more options have you covered:

| Macro | How it works | Best for |
|:------|:-------------|:---------|
| [Recording]({% link macros/recording.md %}) | References a `.cast` file attached to the Confluence page | Storing recordings alongside the docs that describe them |
| [Inline]({% link macros/inline.md %}) | Paste raw `.cast` content directly into the macro body | Quick sharing with zero attachment management |
| [Smart Links]({% link macros/smart-links.md %}) | Paste any `asciinema.org` URL for a rich preview card | Linking out to recordings hosted on asciinema.org |

---

## Features

- **Interactive playback** — play, pause, seek, and control speed on every recording
- **No external hosting** — recordings live in Confluence (macro body or page attachments)
- **CastScript** — generate terminal animations from plain text; update by editing, not re-recording
- **Chapter markers** — navigate long demos with named sections
- **Configurable player** — autoplay, loop, speed, themes (asciinema, monokai, solarized, tango), and poster frames
- **Smart Links** — rich preview cards for any `asciinema.org` URL, automatically
- **Minimal permissions** — only requests the scopes it actually needs

---

## Installation

Install **Asciinema for Confluence** from the Atlassian Marketplace:

1. Go to **Confluence Settings → Find new apps**
2. Search for **Asciinema for Confluence**
3. Click **Install**

Or [install directly from the Marketplace](#){: target="_blank" }.

Once installed, insert any of the macros from the Confluence editor macro browser — search for **Asciinema**.

[Read the full getting started guide →]({% link getting-started/index.md %})
