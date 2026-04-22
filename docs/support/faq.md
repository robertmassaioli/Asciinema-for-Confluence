---
title: FAQ & Support
nav_order: 5
---

# FAQ & Support

---

## General

**Which Confluence products does this app support?**
: Confluence Cloud only. The app is built on the Atlassian Forge platform, which
  is a Cloud-only runtime. Confluence Data Center is not supported.

**Does this app store any of my data externally?**
: No. Recordings are stored either in the Confluence macro body (CastScript and
  Inline macros) or as Confluence page attachments (Recording macro). No data is
  sent to or stored on any external server. See the [Privacy Policy]({% link privacy.md %})
  for full details.

**What permissions does the app request?**
: Two scopes — `read:confluence-content.all` (to render macro content on pages)
  and `read:attachment:confluence` (to load `.cast` files from page attachments).
  The app requests only what it needs.

---

## CastScript

**My CastScript doesn't render — the player shows an error.**
: Check that your document has both `--- config ---` and `--- script ---` section
  headers, and that the config section comes first. See the
  [CastScript Syntax Reference]({% link reference/castscript-syntax.md %}) for the
  full format.

**The output in my CastScript doesn't look right.**
: Output lines must start with `>` followed by a space and the output text.
  A `>` on its own prints a blank line. Lines that don't match any recognised
  pattern are silently ignored.

**Can I show ANSI colours in CastScript output?**
: Not directly — CastScript output lines are plain text. If you need to demo
  coloured output, use a real recording with the
  [Recording macro]({% link macros/recording.md %}) or
  [Inline macro]({% link macros/inline.md %}) instead.

**How do I make the demo pause longer between steps?**
: Increase `idle-time` in the config section (e.g. `idle-time: 1.5`), or add
  extra blank lines between steps in the script section — each blank line adds
  one `idle-time` worth of pause.

---

## Recording Macro

**The recording macro shows an error / doesn't load.**
: Check that the **Filename** field in the macro config matches the attachment
  name exactly — including the `.cast` extension and capitalisation. Filenames
  are case-sensitive.

**Can I reference an attachment on a different page?**
: No — the Recording macro only reads attachments from the page it is placed on.
  Move the attachment to the correct page, or use the Inline macro to paste the
  content directly.

**The attachment loads but the player is the wrong size.**
: The player dimensions are read from the `.cast` file header. If the terminal
  was recorded in an unusual size, use the Inline macro instead, which lets you
  override the `Cols` and `Rows` values.

---

## Inline Macro

**I pasted my `.cast` content but nothing plays.**
: Make sure you pasted the complete file. The content must start with a JSON
  header line (begins with `{`). Partial content will fail to parse.

---

## Smart Links

**Pasted an asciinema.org URL but it stayed as plain text.**
: After pasting, look for Confluence's prompt to convert the URL to a Smart Link
  and accept it. If no prompt appears, select the URL, open the link toolbar,
  and switch the display style to "Smart Link" / "Card".

**The Smart Link card shows "Unable to connect" or no preview.**
: The recording may be private or unlisted. Check that it is publicly accessible
  by opening the URL in an incognito window. Private recordings are not supported.

**Can I embed a full player from asciinema.org instead of just a card?**
: Smart Links are preview cards only. For a fully interactive embedded player,
  download the `.cast` file from asciinema.org and use the
  [Recording macro]({% link macros/recording.md %}) or
  [Inline macro]({% link macros/inline.md %}).

---

## General player issues

**The player doesn't appear — I just see the macro placeholder.**
: The player only renders in **published** view. Publish the page and check it
  there. In the editor you will always see a placeholder.

**Multiple recordings on one page are slow.**
: Each player loads the asciinema-player JavaScript bundle. Having many players
  on one page may affect load time. Consider splitting content across pages, or
  use posters so players don't autoplay simultaneously.

---

## Getting help

If your issue isn't covered here:

- **Search or open an issue** on [GitHub Issues](https://github.com/rmassaioli/Asciinema-for-Confluence/issues) — this is the best place for bug reports and feature requests.
- **Atlassian Community** — post in the [Atlassian Community forums](https://community.atlassian.com) with the tag `forge` for platform-level questions.
