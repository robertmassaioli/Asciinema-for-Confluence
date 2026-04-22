---
title: CastScript Macro
parent: Macros
nav_order: 1
---

# CastScript Macro
{: .text-green-200 }

Write a terminal demo as plain text. Edit it like a document. The macro compiles it to a live, interactive terminal animation — no screen recording required.
{: .fs-5 .fw-300 }

---

## Why CastScript?

Most terminal documentation has a painful lifecycle: record → upload → embed → watch it go stale when the CLI changes → repeat. CastScript breaks that cycle.

Instead of recording your terminal, you **describe** what it should show:

- What commands to type
- What the output looks like
- How fast to type
- Where the chapter breaks are

The macro compiles that description to a frame-perfect terminal animation in the browser. When something changes, you edit a line of text and republish — no new recording needed.

---

## Inserting the macro

1. In the Confluence editor, type `/` and search for **Asciinema CastScript**
2. Select the macro — an editor panel opens with a code block body
3. Write your CastScript in the body (see format below)
4. Click **Update** to close the panel
5. Publish the page — the player renders in the published view

{: .highlight }
The player only renders in **published** view. In the editor you will see a
placeholder with the macro name.

---

## CastScript format

A CastScript document has two sections separated by section headers.

### Config section

```
--- config ---
title:        My Demo
width:        100
height:       28
prompt:       user@host:~/project$
typing-speed: normal
idle-time:    0.8
```

| Key | Description | Default |
|:----|:------------|:--------|
| `title` | Recording title shown in the player | *(none)* |
| `width` | Terminal width in columns | `80` |
| `height` | Terminal height in rows | `24` |
| `prompt` | The shell prompt string shown before commands | `$ ` |
| `typing-speed` | `slow`, `normal`, or `fast` — controls keystroke timing | `normal` |
| `idle-time` | Seconds to pause between script steps | `0.5` |

### Script section

```
--- script ---

marker: Initialise

$ git init
> Initialized empty Git repository in /home/user/project/.git/

$ git status
> On branch main
>
> No commits yet
>
> nothing to commit
```

| Syntax | What it does |
|:-------|:-------------|
| `$ <command>` | Types `<command>` at the prompt with realistic keystroke timing |
| `> <output>` | Prints a line of output |
| `>` *(alone)* | Prints a blank output line |
| `marker: <label>` | Inserts a named chapter marker — visible as a navigation point in the player |
| *(blank line)* | A natural pause between steps |

{: .note }
Output lines (`>`) are printed instantly — they represent what the terminal
would display after running the command. Only the command itself is "typed" with
keystroke animation.

---

## Full example

Here is a complete CastScript demonstrating a Git workflow:

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

$ git status
> On branch main
>
> No commits yet (bucko!)
>
> nothing to commit

marker: Stage and Commit

$ git add .
>

$ git commit -m "Initial commit"
> [main (root-commit) 1a2b3c4] Initial commit
>  3 files changed, 42 insertions(+)
>  create mode 100644 README.md
>  create mode 100644 package.json
>  create mode 100644 src/index.ts

marker: Push

$ git push origin main
> Enumerating objects: 5, done.
> Counting objects: 100% (5/5), done.
> Writing objects: 100% (5/5), 1.23 KiB | 1.23 MiB/s, done.
> To github.com:user/project.git
>  * [new branch]      main -> main
```

---

## Configuration panel

The CastScript macro has a configuration panel with playback options. Open it
by clicking the macro in the editor and selecting **Edit**.

| Option | Values | Default | Description |
|:-------|:-------|:--------|:------------|
| Theme | `asciinema`, `monokai`, `solarized-dark`, `solarized-light`, `tango` | `asciinema` | Player colour scheme |
| Speed | `0.5×`, `1×`, `1.5×`, `2×`, `3×` | `1×` | Playback speed multiplier |
| Autoplay | on / off | off | Start playing automatically when the page loads |
| Loop | on / off | off | Loop the recording indefinitely |

See the [Configuration Reference]({% link reference/configuration.md %}) for full details.

---

## Tips

- **Use `marker:` liberally** — chapter markers let readers jump to the part they care about without scrubbing through the whole recording.
- **Keep `idle-time` short** — 0.5–1.0 seconds is usually enough. Long pauses make demos feel slow.
- **Match the prompt exactly** — if your docs show `$` but the CastScript shows `user@host:~/project$`, readers may be confused. Pick one and be consistent.
- **Test with `typing-speed: fast`** first — it's quicker to review, then slow down for the published version.
- **Blank lines = pauses** — use them intentionally between logical steps to give readers time to read the output.
