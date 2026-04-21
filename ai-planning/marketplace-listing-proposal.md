# Marketplace Listing Proposal: Asciinema for Confluence

**Status:** Draft  
**Author:** AI Planning  
**Date:** 2026-04-21

---

## Overview

This document contains everything we need to list **Asciinema for Confluence** on the
Atlassian Marketplace. It covers the copy, marketing assets, legal, pricing, security,
and review process. Work through each section in order — the items marked 🔴 are
hard blockers that must be completed before submission.

---

## 1. Listing Identity

### App Name
**Asciinema for Confluence**

> 60 character limit. ✅ (27 characters). The name is clear, descriptive, and
> searchable. It cannot start with "Confluence" (Atlassian trademark rule), so
> "Asciinema for Confluence" is the correct form.

### Tagline *(130 characters max)*
```
Turn a plain-text script into a live terminal demo — or embed any .cast recording — right inside Confluence.
```
*(108 characters)*

Alternative:
```
Confluence macros for asciinema recordings — including CastScript, where plain text becomes a live terminal demo.
```

### App Summary *(250 characters max)*
```
Write terminal demos as plain text with CastScript and watch them compile to live animations —
no screen recording needed. Or embed existing .cast recordings inline or from a page attachment.
Smart Links for asciinema.org included.
```
*(237 characters)*

### Category
**Primary:** `Developer Tools`  
**Secondary:** `Documentation` (if multi-category is supported)

> These are the most natural fit — the app is for engineering teams who want to document
> CLI tools, scripts, onboarding guides, and runbooks with live terminal demos.

---

## 2. Detailed Description *(up to 1,000 characters)*

```
Most terminal demos go stale the moment the CLI changes. Asciinema for Confluence fixes
that with CastScript: write your demo as a plain-text script — commands, expected output,
timing, and chapter markers — and the macro compiles it to a live, interactive terminal
animation right on the page. When the CLI changes, edit a line of text and you're done.
No re-recording, no re-uploading, no broken screenshots.

Already have .cast recordings? Two more macros have you covered:

• Recording Macro — Reference a .cast file attached to the Confluence page. Stays in sync
  with your attachments automatically.

• Inline Macro — Paste raw .cast content directly into the macro body. Zero setup.

• Smart Links — Paste any asciinema.org URL for an automatic rich preview card.

All four use the asciinema-player with full support for autoplay, loop, speed control,
themes, and poster frames.
```
*(998 characters)*

---

## 3. Three Highlights

Highlights are the primary marketing real estate on the listing page. Each needs a
title, summary, full screenshot (1840 × 900 px), cropped screenshot (580 × 330 px),
and caption.

### Highlight 1 — CastScript Macro ⭐ Lead feature
**Title (50 chars max):** `Write a script. Get a live terminal demo.`  
**Summary (220 chars max):**
```
CastScript turns plain text into an interactive terminal animation — no screen recording
needed. When your CLI changes, edit a line and republish. Your demos stay accurate as long
as your docs do.
```
**Caption (220 chars max):**
```
A plain-text CastScript in the macro editor (left) compiling to a fully interactive
terminal animation on the published Confluence page (right).
```
**Screenshot needed:** 🔴 Side-by-side: the CastScript macro body in edit mode (showing
commands, output lines, markers, and config) alongside the published page showing the
rendered animated player.

---

### Highlight 2 — Inline & Attachment Macros
**Title (50 chars max):** `Embed any .cast recording — no hosting needed`  
**Summary (220 chars max):**
```
Already have .cast recordings? Reference a file attached to the Confluence page, or paste
raw .cast content directly into the macro body. No CDN, no external hosting — your
recordings live where your docs live.
```
**Caption (220 chars max):**
```
The Asciinema Recording macro (top) loading a .cast file from a page attachment, and the
Inline macro (bottom) rendering content pasted directly into the macro body.
```
**Screenshot needed:** 🔴 A Confluence page showing both an Attachment macro and an
Inline macro, each rendering a playable terminal session.

---

### Highlight 3 — Smart Links & Configuration
**Title (50 chars max):** `Smart Links and rich playback controls`  
**Summary (220 chars max):**
```
Paste any asciinema.org URL and get a rich Smart Link preview automatically. All macros
support autoplay, loop, playback speed, poster frames, and multiple player themes — all
configurable without touching code.
```
**Caption (220 chars max):**
```
An asciinema.org URL rendered as a Smart Link card in Confluence, alongside the macro
configuration panel showing playback options.
```
**Screenshot needed:** 🔴 A Confluence page showing an asciinema.org Smart Link card
and the macro config panel open.

---

## 4. Marketing Assets Required

All assets are **🔴 blockers** — the listing cannot be submitted without them.

| Asset | Dimensions | Format | Notes |
|-------|-----------|--------|-------|
| App Logo | 144 × 144 px | PNG (transparent bg) | Use the asciinema "play" icon styled for Confluence blue. Avoid Atlassian trademark colours/logos. |
| App Banner / Hero | 1120 × 548 px | PNG or JPG | Include app name, tagline, and a terminal screenshot. No time-limited promotions. |
| Highlight screenshots (×3 full) | 1840 × 900 px | PNG or JPG | One per highlight — see Section 3. |
| Highlight screenshots (×3 cropped) | 580 × 330 px | PNG or JPG | Cropped/focal version of each full screenshot. |
| Vendor / Partner Logo | 72 × 72 px | PNG | Logo for your developer profile page. |
| Vendor Icon | 16 × 16 px | PNG | Small icon for partner listing. |

> **Tip:** Use a real Confluence Cloud instance with the app tunnelled to capture
> authentic-looking screenshots. Avoid lorem-ipsum content — show realistic terminal
> sessions (e.g., a git workflow, a Docker build, or an npm install).

---

## 5. Release Information

### Version
`1.0.0` (initial Marketplace release)

### Release Summary *(80 chars max)*
```
Initial Marketplace release of Asciinema for Confluence.
```

### Release Notes *(up to 1,000 characters)*
```
Initial public release.

• CastScript Macro — write terminal demos as plain text (commands, expected output,
  timing, chapter markers) and compile to a live animation in the browser. Edit the
  script when things change — no re-recording required.
• Recording Macro — reference a .cast file attached to any Confluence page.
• Inline Macro — embed .cast content pasted directly into the macro body.
• Smart Links — paste any asciinema.org URL for a rich preview card.
• Full playback controls: autoplay, loop, speed, themes, and poster frames.
• No external data storage — all content lives in Confluence.
• Minimal permissions: read:confluence-content.all and read:attachment:confluence.
```

### Documentation URL 🔴
A publicly accessible documentation site is required for paid apps and strongly
recommended for free apps. Options:
- A GitHub Pages site from the repo
- A Confluence public space
- A dedicated docs site (e.g., Mintlify, Docusaurus)

Suggested sections:
1. Getting Started / Installation
2. Inline Macro
3. Recording Macro
4. CastScript Macro
5. Smart Links
6. Configuration Reference
7. Troubleshooting / FAQ

### Issue Tracker URL *(optional but recommended)*
Link to the GitHub Issues page (or equivalent) so customers can report bugs.

---

## 6. Privacy & Security Tab

This tab is visible to customers and is reviewed by Atlassian during approval.

### Data Collection
```
This app does not collect, store, or transmit any user data to external systems.

• Inline and CastScript macros: Recording content is stored entirely within the
  Confluence macro body — no external storage is used.

• Recording macro: .cast files are stored as standard Confluence page attachments.
  The app reads them using the Confluence Attachments REST API (v1) with the
  authenticated user's permissions.

• Smart Links: The app makes a server-side request to asciinema.org to fetch
  recording metadata for URL preview enrichment. No user data is sent to asciinema.org.

All data accessed by this app remains within your Atlassian site.
```

### Scopes Justification

| Scope | Reason |
|-------|--------|
| `read:confluence-content.all` | Required to read page content and render macro bodies in view mode. |
| `read:attachment:confluence` | Required by the Recording macro to download .cast attachment files from the page. |

### External Hosts
| Host | Why |
|------|-----|
| `https://asciinema.org` | Smart Link resolver fetches recording metadata (title, duration, author) to generate rich preview cards for asciinema.org URLs. Only called when a Smart Link is rendered. |

### Data Residency
Since this app uses no external persistent storage of its own, data residency
is automatically handled by Atlassian's Forge platform. All macro content lives
in Confluence (Atlassian-managed). The app qualifies as **PINNED** for data
residency purposes.

> **Note:** The server-side Smart Link call to `asciinema.org` is a read-only metadata
> fetch (no user data sent). This should be disclosed in the Privacy tab.

---

## 7. Pricing Model

### Recommended: **Free**

**Rationale:**
- The app has minimal infrastructure costs (Forge-hosted, no external databases or services).
- A free listing maximises adoption and builds reputation, especially for a v1.0 release.
- Asciinema itself is free and open-source; a free app aligns with that community ethos.
- Reviews and installs from a free listing accelerate partner tier advancement, which
  unlocks future monetisation opportunities.

### Future Paid Options (if desired later)
If monetisation becomes desirable, the most natural path is:

| Model | Notes |
|-------|-------|
| **Free + Paid Advanced edition** | Free: Inline + Smart Links. Paid: Recording + CastScript (more powerful macros). |
| **Paid via Atlassian (PVA)** | Atlassian handles billing; vendor receives 85% revenue. User-based billing is available for Forge apps. |

For a v1.0 free listing, no pricing configuration is needed in the manifest.

---

## 8. Legal Requirements 🔴

### Privacy Policy
A publicly accessible Privacy Policy URL is required. It must cover:
- What data is collected (in this case: none stored externally)
- How data is used
- Contact details for privacy enquiries
- GDPR/data subject rights (right to access, deletion, etc.)

**Action:** Write and host a Privacy Policy page. Given this app stores no data,
it can be a simple, short document. A GitHub Pages or Notion page is acceptable.

### Terms of Service / End User Agreement
Options:
1. **Atlassian Standard Agreement** — Atlassian provides a customisable open-source
   template (Bonterms, CC BY ND). This is the easiest path for an initial listing.
   Download from: https://developer.atlassian.com/platform/marketplace/list-customizable-end-user-agreement
2. **Custom Terms** — Write your own; requires legal review.

**Recommendation:** Use the Atlassian Standard Agreement with minimal customisation
(add governing law/jurisdiction). This is the fastest path to listing.

### Marketplace Partner Agreement
Must be accepted in the developer console before submission. Review with legal
counsel first. This governs the vendor–Atlassian relationship, revenue share,
support obligations, and dispute resolution.

---

## 9. Vendor / Partner Profile

Before the listing goes live, you need a complete partner profile:

| Field | Value |
|-------|-------|
| Company/Vendor Name | *(your name or company name)* |
| Vendor Logo | 72 × 72 px PNG |
| Vendor Icon | 16 × 16 px PNG |
| Website URL | *(your personal/company site)* |
| Support Email | *(a dedicated support email)* |
| Support URL | *(documentation or support portal URL)* |
| Privacy Policy URL | *(see Section 8)* |

---

## 10. Support Setup

### Minimum Requirements (for any listing)
- A support email address (e.g., support@yourdomain.com or a GitHub Issues link)
- Response time commitment: **<48 hours** for Silver tier

### Recommended Setup
- GitHub Issues as the primary bug/feature tracker (free, familiar to developer audience)
- A simple FAQ page in the documentation site covering:
  - "My attachment doesn't load" → check filename matches exactly, including extension
  - "The player doesn't appear" → check the page is published (not in draft)
  - "CastScript syntax errors" → link to CastScript syntax reference
  - "Smart Links don't show previews" → ensure the URL is a valid asciinema.org recording

---

## 11. Submission Checklist

Work through this list in order. Items marked 🔴 are hard blockers.

### Identity & Copy
- [ ] Finalise app name (confirm "Asciinema for Confluence")
- [ ] Finalise tagline
- [ ] Finalise app summary
- [ ] Finalise detailed description
- [ ] Finalise three highlight titles, summaries, and captions

### Marketing Assets 🔴
- [ ] Create app logo (144 × 144 px PNG)
- [ ] Create app banner / hero image (1120 × 548 px)
- [ ] Capture Highlight 1 screenshot — Inline + Recording macros (1840 × 900 px + 580 × 330 px)
- [ ] Capture Highlight 2 screenshot — CastScript editor + output (1840 × 900 px + 580 × 330 px)
- [ ] Capture Highlight 3 screenshot — Smart Link card + config panel (1840 × 900 px + 580 × 330 px)
- [ ] Create vendor logo (72 × 72 px) and icon (16 × 16 px)

### Documentation 🔴
- [ ] Write and publish documentation site (Getting Started, all three macros, Smart Links, Config Reference, FAQ)
- [ ] Confirm documentation URL is publicly accessible

### Legal 🔴
- [ ] Write and publish Privacy Policy page (public URL)
- [ ] Choose Terms of Service approach (Atlassian Standard Agreement recommended)
- [ ] Review and accept Marketplace Partner Agreement in developer console

### Partner Profile 🔴
- [ ] Create / complete vendor profile in Atlassian developer console
- [ ] Add vendor logo, icon, website, support email/URL, privacy policy URL

### Technical
- [ ] App deployed to **production** environment (currently on development)
- [ ] App sharing enabled in developer console
- [ ] Confirm app is assigned to a published Developer Space
- [ ] Run `forge lint` — no issues
- [ ] Confirm all scopes are minimal and justified
- [ ] Confirm `unsafe-eval` and `unsafe-inline` permissions are justified in Privacy tab
  (required for asciinema-player WebAssembly/styles)

### Security Questionnaire 🔴
- [ ] Complete Atlassian security questionnaire in developer console
  (authentication, data security, secrets management, vulnerability management, logging)
- [ ] Register a security contact for vulnerability notifications
- [ ] Complete KYC/KYB partner identity verification (one-time, required for new partners)

### Final Submission
- [ ] Create listing draft in developer console
- [ ] Fill in all listing fields using copy from this document
- [ ] Upload all marketing assets
- [ ] Complete Privacy & Security tab (see Section 6)
- [ ] Set pricing to Free
- [ ] Link documentation URL and issue tracker URL
- [ ] Preview listing — read through everything once more
- [ ] Submit for review

---

## 12. Review Process & Timeline

| Step | Estimated Time |
|------|---------------|
| Submit listing | Day 0 |
| Automated vulnerability scan + validation | Day 1–2 |
| Atlassian manual review (functionality, content, security) | Day 3–8 |
| Feedback / corrections (if any) | +2–5 days |
| Approval and publication | Day 5–10 (if no issues) |

**Important:** Once submitted, the listing is locked — you cannot edit it during
review. Plan for this window by ensuring everything is finalised before submission.

### Most Common Rejection Reasons (avoid these)
1. Incomplete Privacy & Security tab — always fill this in fully
2. Missing or inaccessible Privacy Policy URL
3. Marketing assets wrong dimensions or too small
4. Scopes not justified for each permission requested
5. App not deployed to production environment

---

## 13. Future Considerations (Post-Launch)

Once the app is live and accumulating installs and reviews, consider:

- **Cloud Fortified certification** — Requires SLO monitoring, synthetic testing,
  incident management process, and dedicated support SLA (<24h). Significantly
  increases enterprise customer trust and Marketplace ranking.

- **Partner tier advancement** — Silver tier (entry) → Gold ($750K gross sales,
  SOC 2 audit scheduled) → Platinum ($3M gross sales, current SOC 2/ISO 27001
  certification, Trust Center required).

- **Paid edition** — If the free app gains traction, introduce a paid tier with
  advanced features (e.g., bulk CastScript compilation, team-level themes, analytics).

- **Data Center version** — Would require significant performance and scale testing
  (1/2/4-node clusters, enterprise dataset), but opens a large enterprise customer base.

- **SEO optimisation** — After launch, monitor Marketplace search rankings and adjust
  the listing description and highlights to improve discoverability.

---

## Appendix: App Technical Summary (for Security Review)

| Field | Value |
|-------|-------|
| Platform | Atlassian Forge (Cloud only) |
| Runtime | Node.js 24.x (ARM64, 256 MB) |
| Scopes | `read:confluence-content.all`, `read:attachment:confluence` |
| External fetch (backend) | `https://asciinema.org` (Smart Link metadata only) |
| External fetch (frontend) | None |
| User data stored externally | None |
| Data residency | PINNED (Forge managed) |
| CSP overrides | `scripts: unsafe-eval` (asciinema-player WebAssembly), `styles: unsafe-inline` (player inline styles) |
| Auth model | `.asUser()` for all Confluence API calls |
| Backend resolvers | Smart Link resolver (asciinema.org metadata), attachment URL resolver |
| Frontend | React (asciinema-player, @cast-builder/core) |
