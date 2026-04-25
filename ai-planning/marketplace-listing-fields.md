# Marketplace Listing Fields — Copy Options

This file contains three options for every field visible on the Atlassian Marketplace
"About App" form. Pick one from each section, or mix and match.

Character counts are shown for fields with limits. All options have been checked
against the limits.

---

## App Name

Fixed — do not change. Passes Atlassian's name validation.

```
Asciinema for Confluence
```

---

## App Tagline *(130 chars max, no trailing punctuation)*

**Option A** — Leads with CastScript's "no recording" angle *(105 chars)*
```
Write terminal demos as plain text and publish them as live animations — no screen recording needed
```

**Option B** — Broader, covers all features *(97 chars)*
```
Embed interactive terminal recordings in Confluence — write, attach, or paste your cast files
```

**Option C** — Problem-first, punchy *(99 chars)*
```
Terminal demos that stay accurate — write them as text, update them like docs, embed them anywhere
```

---

## App Summary *(250 chars max)*

**Option A** — CastScript-first, all four features mentioned *(237 chars)*
```
Write terminal demos as plain text with CastScript and watch them compile to live animations —
no screen recording needed. Or embed existing .cast recordings inline or from a page attachment.
Smart Links for asciinema.org included.
```

**Option B** — Feature-list style *(221 chars)*
```
Four ways to embed terminal recordings in Confluence: write demos as plain text with CastScript,
attach a .cast file to the page, paste raw cast content inline, or use Smart Links for
asciinema.org URLs.
```

**Option C** — Pain-point opening *(245 chars)*
```
Stop re-recording every time your CLI changes. CastScript lets you write terminal demos as plain
text and update them like any document. Plus: embed .cast recordings from page attachments,
inline paste, and asciinema.org Smart Links.
```

---

## Categories *(up to 2)*

**Option A** *(recommended)*
- Primary: `Developer Tools`
- Secondary: `Documentation`

**Option B**
- Primary: `Documentation`
- Secondary: `Developer Tools`

**Option C** *(if only one category is required)*
- `Developer Tools`

> Note: Check the current category list in the dropdown — "Developer Tools" and
> "Documentation" are the closest fit. If neither is available, "Productivity" is
> the next best alternative.

---

## Keywords *(up to 4)*

**Option A** *(recommended — covers the tool name, use case, and format)*
- `asciinema`
- `terminal`
- `recording`
- `documentation`

**Option B** *(more feature-focused)*
- `asciinema`
- `terminal recording`
- `cast`
- `developer tools`

**Option C** *(broader reach)*
- `asciinema`
- `terminal`
- `screen recording`
- `CLI`

---

## Release Behavior

**All three options: `Publish app immediately after approval`**

This is the correct setting for a new listing. There is no reason to delay
publication once Atlassian has approved the app.

---

## More Details *(1,000 chars max — awards, testimonials, language support, etc.)*

**Option A** — Focus on what makes this unique + technical trust signals *(583 chars)*
```
Asciinema for Confluence is the only Confluence macro that lets you write a terminal
demo entirely as plain text — no screen recording tool required. Powered by
asciinema-player, the same open-source player used on asciinema.org, trusted by
hundreds of thousands of developers worldwide.

• Supports .cast v2 and v3 format
• Three macros + Smart Link resolver
• Works with any terminal output — shell, Docker, Git, npm, kubectl, and more
• Minimal permissions: reads only what it needs, stores nothing externally
• Built on Atlassian Forge — no servers to manage, no infrastructure to maintain
```

**Option B** — Use-case driven, speaks to technical writers and engineers *(598 chars)*
```
Built for engineering teams who document CLIs, scripts, and developer workflows in
Confluence. Asciinema for Confluence lets you:

• Create terminal demos from a plain-text script — no recording equipment needed
• Keep demos accurate by editing text, not re-recording video
• Embed existing .cast recordings directly from page attachments
• Link to asciinema.org recordings with automatic rich preview cards

Uses the asciinema-player open-source library. No external data storage.
No third-party analytics. Minimal Confluence permissions.

Ideal for: CLI documentation, onboarding guides, runbooks, and API tutorials.
```

**Option C** — Short and direct, lets the highlights do the heavy lifting *(421 chars)*
```
Asciinema for Confluence brings interactive terminal recordings to your documentation
without the overhead of video hosting or screen recording tools.

The CastScript macro is the standout feature: describe what your terminal should show
as plain text, and the macro compiles it to a live animation in the browser.
Edit the script when things change — no re-recording required.

Built on Atlassian Forge. No external data storage. Open-source player (asciinema-player).
```

---

## App Stores Personal Data

**All three options: `No`**

This app does not collect, store, or transmit personal data to any external system.
Macro content stays within Confluence (managed by Atlassian). The only external
call is a read-only metadata fetch to `asciinema.org` for Smart Links — no user
data is included in that request.

---

## Google Analytics ID / GA4 ID / Segment Write Key

**All three options: leave blank**

The documentation microsite (GitHub Pages) does not currently have analytics
configured, and the Forge app itself has no client-side tracking. Adding analytics
to the Marketplace listing page is optional and can be done later if desired.

If you later add GA4 to the GitHub Pages site, add the same Measurement ID here
for consistent funnel tracking from Marketplace listing → docs → install.
