# Proposal: GitHub Pages Documentation Microsite

**Status:** Draft  
**Date:** 2026-04-22

---

## Overview

This proposal describes how to add a documentation microsite to the
**Asciinema-for-Confluence** GitHub repository and publish it via GitHub Pages.
The site will serve as the public documentation URL required by the Atlassian
Marketplace listing, and as a landing page for prospective users.

The recommended approach is **Jekyll with the Minima or Just the Docs theme**,
as it is natively supported by GitHub Pages with zero build configuration — push
Markdown files, GitHub does the rest. No Node.js pipeline, no separate deployment
action required (though a GitHub Action is recommended for more control).

---

## 1. Recommended Tooling

### Option A — Just the Docs (Jekyll) ✅ Recommended

**Why:**
- Purpose-built for software documentation sites
- Excellent navigation sidebar, search, breadcrumbs, and code highlighting out of the box
- Natively supported by GitHub Pages (no custom build needed)
- Markdown-first — no JSX, no build pipeline to maintain alongside the Forge app
- Free, open source, widely used by developer tools

**What it looks like:** https://just-the-docs.com

---

### Option B — Docusaurus (React/Node)

A popular React-based docs framework used by many open-source projects. Produces a
polished site but requires a separate `npm run build` step and a GitHub Actions
workflow to deploy. More powerful than Just the Docs but significantly more
overhead for a small app docs site. Recommended only if you want a full-featured
landing page with custom React components.

---

### Option C — Plain HTML + GitHub Pages

The simplest possible approach — write HTML/CSS directly into a `docs/` folder.
Gives full control but requires hand-crafting navigation, search, and styling.
Not recommended: the maintenance cost outweighs the control gained.

---

**Recommendation: Option A (Just the Docs).** It produces a professional,
searchable documentation site with near-zero configuration, and the content is
plain Markdown so it's easy to keep in sync with the app.

---

## 2. Repository Changes

### Folder Structure

Add a `docs/` directory at the repository root. GitHub Pages is configured to
serve from `docs/` on the `main` branch (set in Repository → Settings → Pages).

```
Asciinema-for-Confluence/
├── docs/                          ← NEW: entire site lives here
│   ├── _config.yml                ← Jekyll + Just the Docs configuration
│   ├── Gemfile                    ← Ruby gem dependencies (just the theme)
│   ├── Gemfile.lock               ← locked gem versions
│   ├── index.md                   ← Landing / home page
│   ├── privacy.md                 ← Privacy Policy (required for Marketplace)
│   ├── terms.md                   ← Terms of Service (optional)
│   │
│   ├── getting-started/
│   │   └── index.md               ← Installation + first use
│   │
│   ├── macros/
│   │   ├── castscript.md          ← CastScript macro (lead feature)
│   │   ├── recording.md           ← Recording (attachment) macro
│   │   ├── inline.md              ← Inline macro
│   │   └── smart-links.md         ← Smart Links
│   │
│   ├── reference/
│   │   ├── castscript-syntax.md   ← Full CastScript format reference
│   │   └── configuration.md       ← All macro config options
│   │
│   └── support/
│       └── faq.md                 ← Frequently asked questions
│
├── ai-planning/                   ← unchanged
├── src/                           ← unchanged
├── static/                        ← unchanged
├── manifest.yml                   ← unchanged
└── ...
```

### Files to Create

#### `docs/_config.yml`
```yaml
title: Asciinema for Confluence
description: >-
  Embed live terminal recordings in Confluence — write a script, get an
  interactive demo. No screen recording required.

# Just the Docs theme (natively supported by GitHub Pages)
remote_theme: just-the-docs/just-the-docs

# Site URL — update with your GitHub Pages URL once live
url: "https://<your-github-username>.github.io"
baseurl: "/Asciinema-for-Confluence"

# Navigation order for the sidebar
nav_sort: order  # uses the 'nav_order' front matter key

# Enable search
search_enabled: true

# Colour scheme — 'dark' or 'light'
color_scheme: dark  # matches the terminal/developer aesthetic

# Footer links
footer_content: >-
  &copy; 2026 <a href="https://github.com/<your-github-username>">Your Name</a>.
  Available on the
  <a href="https://marketplace.atlassian.com/apps/<app-id>">Atlassian Marketplace</a>.

# GitHub edit link (lets readers suggest edits)
gh_edit_link: true
gh_edit_link_text: "Edit this page on GitHub"
gh_edit_repository: "https://github.com/<your-github-username>/Asciinema-for-Confluence"
gh_edit_branch: "main"
gh_edit_source: docs
gh_edit_view_mode: "edit"

# Exclude non-site files from Jekyll build
exclude:
  - Gemfile
  - Gemfile.lock
```

#### `docs/Gemfile`
```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "just-the-docs"
```

> **Note:** You do not need Ruby installed locally to use this — GitHub Pages
> builds it automatically. If you want to preview locally, install Ruby and run
> `bundle exec jekyll serve` inside `docs/`.

---

## 3. Page Content Plan

Each page below maps to a file in the `docs/` directory. The front matter
controls the sidebar label, order, and parent.

---

### Home Page (`docs/index.md`)

The landing page. Should answer: what does this app do, who is it for, and
how do I get started? Lead with CastScript.

**Front matter:**
```yaml
---
title: Home
nav_order: 1
---
```

**Content outline:**
- One-liner: "Asciinema for Confluence brings interactive terminal recordings
  to your Confluence pages."
- Hero callout: CastScript — "Write a terminal demo as plain text. Edit it like
  a document. Never re-record again."
- Brief descriptions of all four features (CastScript, Recording, Inline, Smart Links)
- "Get started" button → `/getting-started/`
- Marketplace install button → Atlassian Marketplace URL

---

### Getting Started (`docs/getting-started/index.md`)

**Front matter:**
```yaml
---
title: Getting Started
nav_order: 2
---
```

**Content outline:**
1. Install the app from the Marketplace (link)
2. Open a Confluence page in edit mode
3. Insert a macro (search "Asciinema")
4. Choose which macro suits your use case (table: CastScript vs Recording vs Inline)
5. Publish the page

---

### Macros section

#### CastScript (`docs/macros/castscript.md`) — lead macro

**Front matter:**
```yaml
---
title: CastScript Macro
parent: Macros
nav_order: 1
---
```

**Content outline:**
- What it does and why it's powerful (no recording required, edit like a doc)
- Step-by-step: insert macro → write script → publish
- Minimal CastScript example (a simple `git init` / `git commit` workflow)
- Link to full CastScript Syntax Reference
- Config panel options (theme, speed, autoplay, loop, poster)
- Tips: using `marker:` for chapter headings, `idle-time:` for pacing

#### Recording Macro (`docs/macros/recording.md`)

**Front matter:**
```yaml
---
title: Recording Macro
parent: Macros
nav_order: 2
---
```

**Content outline:**
- What it does: loads a `.cast` file from a Confluence page attachment
- Step-by-step: record with asciinema CLI → upload as attachment → insert macro → enter filename
- Note on the filename field (must match exactly, including `.cast` extension)
- Config panel options

#### Inline Macro (`docs/macros/inline.md`)

**Front matter:**
```yaml
---
title: Inline Macro
parent: Macros
nav_order: 3
---
```

**Content outline:**
- What it does: paste raw `.cast` JSON directly into the macro body
- When to use it vs the Recording macro (quick sharing, no attachment management)
- Step-by-step: record → `cat recording.cast` → paste into macro body
- Config panel options

#### Smart Links (`docs/macros/smart-links.md`)

**Front matter:**
```yaml
---
title: Smart Links
parent: Macros
nav_order: 4
---
```

**Content outline:**
- What it does: paste an `asciinema.org` URL anywhere in Confluence for a rich card
- No macro needed — just paste the URL
- What the card shows (title, author, duration, thumbnail)

---

### Reference section

#### CastScript Syntax (`docs/reference/castscript-syntax.md`)

**Front matter:**
```yaml
---
title: CastScript Syntax
parent: Reference
nav_order: 1
---
```

**Content outline:**
- `--- config ---` block: all supported keys (`title`, `width`, `height`, `prompt`,
  `typing-speed`, `idle-time`)
- `--- script ---` block:
  - `$ <command>` — types a command at the prompt
  - `> <output>` — prints expected output
  - `marker: <label>` — chapter marker
  - Blank lines — natural pause
- Full worked example (the Git workflow demo from the planning doc)
- Common mistakes and how to fix them

#### Configuration Reference (`docs/reference/configuration.md`)

**Front matter:**
```yaml
---
title: Configuration Reference
parent: Reference
nav_order: 2
---
```

**Content outline:**
Table of all config options shared across macros:

| Option | Values | Default | Macros |
|--------|--------|---------|--------|
| Theme | asciinema, monokai, solarized-dark, solarized-light, tango | asciinema | All |
| Speed | 0.5, 1, 1.5, 2, 3 | 1 | All |
| Autoplay | on/off | off | All |
| Loop | on/off | off | All |
| Poster | `npt:SS` or `npt:MM:SS` | none | All |
| Filename | string | — | Recording only |

---

### Support / FAQ (`docs/support/faq.md`)

**Front matter:**
```yaml
---
title: FAQ & Support
nav_order: 5
---
```

**Content outline:**
- **My recording macro shows an error** — check the filename matches exactly (case-sensitive, includes `.cast`)
- **The player doesn't appear in edit mode** — the player only renders in published view
- **CastScript output doesn't look right** — check `>` lines match prompt output exactly; extra spaces matter
- **Smart Links don't show a preview card** — must be a valid `asciinema.org/a/...` URL; private recordings are not supported
- **Can I use this on Confluence Data Center?** — not currently; Cloud only (Forge platform)
- **Where are my recordings stored?** — inside Confluence (macro body or page attachments); no external storage
- **How do I report a bug or request a feature?** — link to GitHub Issues

---

### Privacy Policy (`docs/privacy.md`)

**Front matter:**
```yaml
---
title: Privacy Policy
nav_order: 6
---
```

This page fulfils the Marketplace requirement for a public Privacy Policy URL.

**Content outline:**
- Effective date
- What data we collect: none stored externally; macro content stays in Confluence
- Smart Links: server-side read-only metadata fetch from asciinema.org (no user data sent)
- Data residency: Atlassian Forge managed (PINNED)
- Contact for privacy enquiries
- GDPR rights (access, deletion, portability) — N/A since no personal data stored externally, but include anyway for completeness

---

## 4. GitHub Pages Configuration

### Step-by-step setup

1. Push the `docs/` folder to the `main` branch
2. Go to **Repository → Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set **Branch** to `main`, **Folder** to `/docs`
5. Click **Save**
6. GitHub will build and publish the site within ~2 minutes
7. The URL will be: `https://<your-github-username>.github.io/Asciinema-for-Confluence/`

### Optional: Custom Domain

If you want a cleaner URL (e.g. `asciinema-confluence.dev`):

1. Buy a domain (Namecheap, Cloudflare, etc.)
2. Add a `CNAME` file inside `docs/` containing your domain:
   ```
   asciinema-confluence.dev
   ```
3. Configure DNS: add a CNAME record pointing to `<your-github-username>.github.io`
4. Enable "Enforce HTTPS" in GitHub Pages settings

Without a custom domain, use the default `github.io` URL for the Marketplace listing.

---

## 5. Optional: GitHub Actions for Build Preview

By default, GitHub Pages builds Jekyll automatically. If you want pull request
previews or more control, add this workflow:

**`.github/workflows/docs.yml`:**
```yaml
name: Deploy docs to GitHub Pages

on:
  push:
    branches: [main]
    paths: [docs/**]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/jekyll-build-pages@v1
        with:
          source: ./docs
          destination: ./_site
      - uses: actions/upload-pages-artifact@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

This only re-builds when files under `docs/` change, so it won't interfere
with normal Forge app development.

---

## 6. `.gitignore` Updates

Add the following to the root `.gitignore` to avoid committing Jekyll build
artifacts if you preview locally:

```gitignore
# Jekyll / GitHub Pages local build
docs/_site/
docs/.jekyll-cache/
docs/.jekyll-metadata/
docs/vendor/
```

---

## 7. Implementation Order

Work through these steps in order:

1. **Create `docs/_config.yml`** — fill in your GitHub username and app details
2. **Create `docs/Gemfile`** — two lines, copy from Section 2
3. **Create `docs/index.md`** — home page with CastScript hero and Marketplace link
4. **Create `docs/privacy.md`** — Privacy Policy (needed for Marketplace submission)
5. **Create `docs/getting-started/index.md`**
6. **Create all four macro pages** (`castscript.md` first)
7. **Create reference pages** (CastScript syntax, config table)
8. **Create FAQ page**
9. **Push to `main`, configure GitHub Pages** (Settings → Pages → `/docs`)
10. **Verify the live URL** — click through every page, check all links
11. **Add the URL to the Marketplace listing proposal** — update
    `ai-planning/marketplace-listing-proposal.md` with the live docs URL and
    privacy policy URL

---

## 8. Maintenance Notes

- The docs live alongside the app code in the same repo — update them in the
  same PR as any feature change. Reviewers can see the docs and code change together.
- The CastScript Syntax Reference should be treated as the source of truth —
  keep it in sync with `@cast-builder/core` as the library evolves.
- The Privacy Policy effective date should be updated if you ever change what
  data the app accesses (e.g. if new scopes are added).
