---
title: Smart Links
parent: Macros
nav_order: 4
---

# Smart Links

Paste any `asciinema.org` recording URL into a Confluence page and it automatically becomes a rich preview card — no macro insertion needed.

---

## How it works

Confluence Smart Links are a platform feature that enriches URLs from supported
services into visual preview cards. Asciinema for Confluence registers
`asciinema.org` as a Smart Link provider, so any recording URL you paste is
automatically converted.

The card shows:
- The recording **title**
- The **author** name
- The recording **duration**
- A **thumbnail** from the recording
- A link back to the full recording on asciinema.org

---

## Using Smart Links

1. Copy a recording URL from asciinema.org, e.g.:
   ```
   https://asciinema.org/a/abc123
   ```
2. Paste it into a Confluence page in edit mode
3. Confluence will prompt you to convert it to a Smart Link — click **Yes** (or it may convert automatically)
4. Publish the page — the card renders in the published view

{: .note }
Smart Links render in published view. In the editor you may see the raw URL or
a simplified card preview.

---

## Supported URL formats

| URL pattern | Supported |
|:------------|:----------|
| `https://asciinema.org/a/<id>` | ✅ Yes |
| `https://asciinema.org/a/<id>?t=10` | ✅ Yes |
| Private / unlisted recordings | ❌ No — the app cannot access private recordings |
| Self-hosted asciinema server URLs | ❌ No — only `asciinema.org` is supported |

---

## Troubleshooting

**The URL stays as plain text / doesn't convert to a card**
: Make sure the URL is from `asciinema.org`. After pasting, look for the Confluence
  prompt to convert to a Smart Link and accept it. If no prompt appears, select the
  URL text and use the link toolbar to switch the display to "Smart Link".

**The card shows "Unable to connect" or no preview**
: The recording may be private or the `asciinema.org` service may be temporarily
  unavailable. Check that the recording is publicly accessible by opening the URL
  in an incognito browser window.

**I want a full embedded player, not just a card**
: Smart Links are preview cards only — they link out to asciinema.org for playback.
  To embed a fully interactive player directly in the page, use the
  [Recording macro]({% link macros/recording.md %}) or
  [Inline macro]({% link macros/inline.md %}) instead.
