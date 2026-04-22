---
title: Privacy Policy
nav_order: 6
---

# Privacy Policy

**Effective date:** 2026-04-22  
**App:** Asciinema for Confluence  
**Developer:** Robert Massaioli

---

## Overview

Asciinema for Confluence is a Forge app that runs on the Atlassian Cloud platform.
This Privacy Policy explains what data the app accesses, how it is used, and your
rights as a user.

**Summary:** This app does not collect, store, or transmit any personal data to
external systems. All content remains within your Atlassian site.

---

## What data does the app access?

### Macro content

- **CastScript Macro** — The terminal script you write is stored in the Confluence
  macro body, which is part of the Confluence page. It is managed entirely by
  Atlassian and never leaves your Confluence site.

- **Inline Macro** — The `.cast` content you paste is stored in the Confluence macro
  body. Same as above — managed by Atlassian, stays in your site.

- **Recording Macro** — The app reads `.cast` files that you have uploaded as
  Confluence page attachments. It accesses these files using the Confluence
  Attachments REST API on behalf of the authenticated user. The file content is
  loaded into the browser to power the player — it is not sent to any external server.

### Smart Links

When a Confluence user pastes an `asciinema.org` URL into a page, the app makes a
server-side request to `asciinema.org` to fetch recording metadata (title, duration,
author name). This is a read-only request. **No user data is included in this
request** — only the URL of the asciinema.org recording.

---

## What data does the app store externally?

**None.** The app has no external database, no analytics service, and no telemetry.

All data accessed by this app remains within:
- Your Atlassian Confluence site (macro body content, attachments)
- The Atlassian Forge platform (app runtime, managed by Atlassian)

---

## Atlassian Forge platform

This app is built on [Atlassian Forge](https://developer.atlassian.com/platform/forge/),
Atlassian's cloud app platform. The app runtime, including any resolver functions,
runs within Atlassian's infrastructure. Atlassian's own
[Privacy Policy](https://www.atlassian.com/legal/privacy-policy) applies to the
Forge platform itself.

---

## Permissions (scopes) the app requests

| Scope | Purpose |
|:------|:--------|
| `read:confluence-content.all` | Required to read page content and render macro bodies in view mode |
| `read:attachment:confluence` | Required by the Recording macro to download `.cast` attachment files |

The app requests only the minimum permissions necessary for its features to work.

---

## Data residency

Because the app stores no data externally, data residency is handled entirely by the
Atlassian platform. The app is classified as **PINNED** for data residency purposes —
your Confluence content stays in the region you have configured for your Atlassian site.

---

## Children's privacy

This app is intended for use in professional Confluence environments and is not
directed at children under 13. We do not knowingly collect any information from
children.

---

## Changes to this policy

If the app's data practices change (for example, if new permissions are added in
a future version), this policy will be updated and the effective date revised.
Significant changes will be noted in the app's release notes on the Atlassian
Marketplace.

---

## Contact

For privacy-related questions or to exercise any data rights, contact:

**Robert Massaioli**  
Email: [your-email@example.com](mailto:your-email@example.com)  
GitHub: [github.com/rmassaioli](https://github.com/rmassaioli)

As the app stores no personal data externally, requests for data access, correction,
or deletion can be fulfilled by managing your own Confluence page content and
attachments directly within your Atlassian site.
