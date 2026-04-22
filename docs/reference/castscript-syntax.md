---
title: CastScript Syntax
parent: Reference
nav_order: 1
---

# CastScript Syntax Reference

Complete reference for the CastScript format used by the
[CastScript macro]({% link macros/castscript.md %}).

---

## Document structure

A CastScript document has exactly two sections, each introduced by a section header:

```
--- config ---

... configuration key-value pairs ...

--- script ---

... script steps ...
```

Both sections are required. The config section must come first.

---

## Config section

The config section contains key-value pairs, one per line, separated by colons.
Leading and trailing whitespace around the value is ignored, so you can align
values with spaces for readability.

```
--- config ---
title:        My Recording
width:        100
height:       28
prompt:       user@host:~/project$
typing-speed: normal
idle-time:    0.8
```

### Keys

#### `title`
The title of the recording. Shown in the player header (if the player theme supports it).

```
title: Git Workflow Demo
```

**Default:** *(empty — no title shown)*

---

#### `width`
Terminal width in columns. Should match the width of your actual terminal for
realistic output. Common values: `80`, `100`, `120`, `132`.

```
width: 100
```

**Default:** `80`

---

#### `height`
Terminal height in rows.

```
height: 28
```

**Default:** `24`

---

#### `prompt`
The shell prompt string prepended to each command line. Does not need to end in a
space — the macro handles spacing automatically.

```
prompt: user@host:~/project$
```

```
prompt: →
```

**Default:** `$ `

---

#### `typing-speed`
Controls how fast commands are "typed" in the animation.

| Value | Effect |
|:------|:-------|
| `slow` | Deliberate, one character at a time — good for tutorials |
| `normal` | Natural typing pace — good for most demos |
| `fast` | Near-instant typing — good for long commands or technical audiences |

```
typing-speed: normal
```

**Default:** `normal`

---

#### `idle-time`
Number of seconds to pause between script steps (after a command + output block,
before the next command). Accepts decimals.

```
idle-time: 0.8
```

**Default:** `0.5`

---

## Script section

The script section contains a sequence of steps. Each step is one of: a command,
an output line, a marker, or a blank line (pause).

```
--- script ---

marker: Getting started

$ echo "Hello, world!"
> Hello, world!

$ pwd
> /home/user/project
```

### Step types

#### `$ <command>` — Command
Types `<command>` at the prompt with animated keystroke timing (controlled by
`typing-speed`), then simulates pressing Enter.

```
$ git status
```

The full rendered line on screen will be: `<prompt> git status`

---

#### `> <output>` — Output line
Prints a single line of output text instantly (no typing animation).

```
> On branch main
> nothing to commit, working tree clean
```

Use `>` alone (with nothing after it) to print a blank line of output:

```
> first line
>
> third line (blank line between)
```

---

#### `marker: <label>` — Chapter marker
Inserts a named chapter marker at this point in the recording. Markers appear
as navigation points in the asciinema-player progress bar, letting viewers jump
to specific sections.

```
marker: Installation
marker: Configuration
marker: Running the tests
```

Marker labels can contain spaces and most punctuation. They are case-sensitive.

---

#### Blank lines — Pause
A blank line in the script section inserts a natural pause between steps. The
length of the pause is controlled by the `idle-time` config key.

Use blank lines to give viewers time to read output before the next command runs:

```
$ npm install
> added 42 packages in 3s

$ npm test
> PASS src/index.test.js
```

Multiple consecutive blank lines insert multiple `idle-time` pauses.

---

## Common mistakes

**Missing `--- script ---` header**
: Both section headers are required. Without `--- script ---`, nothing after
  `--- config ---` will be interpreted as script steps.

**Output lines without `>`**
: Lines in the script section that don't start with `$`, `>`, `marker:`, or aren't
  blank will be ignored. Output must start with `>`.

**Prompt included in `$` lines**
: Don't include the prompt in command lines — it is added automatically. Write
  `$ git status`, not `$ user@host$ git status`.

**Config values with colons**
: If a config value contains a colon (e.g. a URL), it will parse correctly as
  long as the colon is not the first character of the value:
  ```
  title: See https://example.com for details
  ```

---

## Full example

```
--- config ---
title:        Docker Build Demo
width:        120
height:       30
prompt:       dev@laptop:~/myapp$
typing-speed: normal
idle-time:    0.6

--- script ---

marker: Build the image

$ docker build -t myapp:latest .
> [+] Building 12.3s (8/8) FINISHED
> => [internal] load build definition from Dockerfile
> => [internal] load metadata for docker.io/library/node:20
> => [1/4] FROM docker.io/library/node:20
> => [2/4] WORKDIR /app
> => [3/4] COPY package*.json ./
> => [4/4] RUN npm ci
> => exporting to image
> => => writing image sha256:abc123
> => => naming to docker.io/library/myapp:latest

marker: Run the container

$ docker run --rm -p 3000:3000 myapp:latest
> Server listening on http://localhost:3000
```
