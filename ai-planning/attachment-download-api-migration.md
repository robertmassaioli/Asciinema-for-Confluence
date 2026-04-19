# Proposal: Migrate Attachment Download URL to Supported Confluence API

## Background

A Confluence engineer has confirmed that the download link currently used by the
**Asciinema Recording** (attachment) macro is derived from a **deprecated, private
API** (`_links.download` from the attachment list response). This endpoint was
withdrawn due to security concerns and can return non-working URLs for Confluence
Cloud sites.

The recommended replacement is the official, vendor-supported REST v1 endpoint:

```
GET /wiki/rest/api/content/{id}/child/attachment/{attachmentId}/download
```

Reference:
https://developer.atlassian.com/cloud/confluence/rest/v1/api-group-content---attachments/#api-wiki-rest-api-content-id-child-attachment-attachmentid-download-get

---

## Current Behaviour (Broken)

`AttachmentApp.js` currently performs **two** HTTP calls:

1. **List attachments** — `GET /wiki/api/v2/pages/{pageId}/attachments?filename={filename}&limit=1`  
   → extracts `attachment.downloadLink` or `attachment._links.download` (a relative
   path like `/wiki/download/attachments/…`).

2. **Download content** — `GET /wiki{downloadLink}`  
   → fetches the raw `.cast` file text and passes it to the asciinema player.

The `_links.download` path comes from the deprecated private download API and can
be broken or inaccessible for end users, causing the macro to silently fail or show
a load error.

There is **also** a backend resolver (`resolveAttachmentUrl` in `src/index.js`) that
performs a similar lookup via the v1 REST API and constructs the same broken URL. 
This resolver is no longer called by the frontend (the frontend does everything
itself via `requestConfluence`), but it carries the same flawed URL construction
logic and should be updated for correctness and consistency.

---

## Proposed Change

Replace Step 2's download URL construction with the officially-supported endpoint.
No changes to the attachment-list Step 1 are required — we still need the
`attachmentId` returned by that call.

### New download URL pattern

```
/wiki/rest/api/content/{pageId}/child/attachment/{attachmentId}/download
```

> **Note:** The `{id}` in the API docs refers to the **parent page ID**, not the
> attachment ID. The attachment ID is the second path segment. Both values are
> already available after Step 1.

---

## Files to Change

### 1. `static/app/src/AttachmentApp.js`

**Current logic (lines 78–90):**
```js
const attachmentId = attachment.id;
const downloadLink = attachment.downloadLink || attachment._links?.download;

const downloadResp = await requestConfluence(`/wiki${downloadLink}`);
```

**Proposed logic:**
```js
const attachmentId = attachment.id;

// Use the officially-supported attachment download endpoint instead of the
// deprecated _links.download path. This endpoint is stable and vendor-approved.
const downloadResp = await requestConfluence(
  `/wiki/rest/api/content/${pageId}/child/attachment/${attachmentId}/download`
);
```

The `downloadLink` variable and its log line can be removed entirely. The
`attachmentId` variable is still needed (it was already extracted) so there is no
additional API call required.

### 2. `src/index.js` — `resolveAttachmentUrl` resolver

This resolver is not currently called by the frontend, but it constructs the same
broken URL and may be used in future or by third parties inspecting the code. It
should be updated to return the canonical download path instead.

**Current logic (lines 55–60):**
```js
const attachment = data.results[0];
const baseUrl = attachment._links.base || '';
const downloadPath = attachment._links.download;
const downloadUrl = `${baseUrl}${downloadPath}`;
return { downloadUrl };
```

**Proposed logic:**
```js
const attachment = data.results[0];
const attachmentId = attachment.id;

// Construct the download URL using the stable, vendor-supported REST v1 endpoint.
// /wiki/rest/api/content/{pageId}/child/attachment/{attachmentId}/download
// This replaces the deprecated _links.download path.
const downloadUrl = `/wiki/rest/api/content/${pageId}/child/attachment/${attachmentId}/download`;
return { downloadUrl };
```

The `_links.base` and `_links.download` references are removed entirely.

---

## Scope Summary

| File | Change type | Risk |
|------|-------------|------|
| `static/app/src/AttachmentApp.js` | Replace deprecated download URL construction with new endpoint | Low — same HTTP flow, different path |
| `src/index.js` | Update `resolveAttachmentUrl` to use the same endpoint for consistency | Low — resolver not currently called |

No manifest changes, no new scopes, and no new dependencies are required. The
existing `read:attachment:confluence` and `read:confluence-content.all` scopes
already cover this endpoint.

---

## Testing Checklist

- [ ] Attach a `.cast` file to a Confluence test page
- [ ] Insert the **Asciinema Recording** macro and configure the filename
- [ ] Verify the player loads and plays the recording correctly
- [ ] Verify the error message is shown clearly when the filename doesn't match any
      attachment
- [ ] Check browser console logs — `[asciinema-attachment]` lines should show the
      new URL path and a 200 response
- [ ] Test with a user who only has **read** access to the page (not edit/admin) to
      confirm `asUser()` authorisation is working correctly
