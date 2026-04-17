/**
 * Backend resolver for both Confluence macro modules.
 *
 * The inline macro (asciinema-inline) doesn't need a backend call for its
 * primary render — the .cast content lives in the macro body, which the
 * frontend reads via view.getContext(). However we still export a resolver
 * in case it's needed for future operations.
 *
 * The attachment macro (asciinema-attachment) calls `resolveAttachmentUrl`
 * to translate an attachment filename into a Confluence download URL that the
 * frontend can pass directly to the asciinema player.
 */

import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

/**
 * Looks up the download URL for a named .cast attachment on a Confluence page.
 *
 * Called by the attachment macro frontend after reading the configured
 * filename and current page ID from the Forge context.
 *
 * @param {Object} req.payload - { pageId: string, filename: string }
 * @returns {{ downloadUrl: string }} Absolute Confluence attachment download URL
 */
resolver.define('resolveAttachmentUrl', async (req) => {
  const { pageId, filename } = req.payload;

  if (!pageId || !filename) {
    throw new Error('resolveAttachmentUrl requires both pageId and filename');
  }

  // Use asUser() so the request runs with the current user's permissions —
  // they must have read access to the page to see its attachments.
  const response = await api.asUser().requestConfluence(
    route`/wiki/rest/api/content/${pageId}/child/attachment?filename=${filename}&limit=1`,
    { headers: { 'Accept': 'application/json' } }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Confluence API error ${response.status}: ${body}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(
      `No attachment named "${filename}" found on page ${pageId}. ` +
      `Make sure the file is attached to this page.`
    );
  }

  const attachment = data.results[0];
  // _links.download is a relative path like /wiki/download/attachments/...
  // We construct the full URL by prepending the Confluence base URL.
  const baseUrl = attachment._links.base || '';
  const downloadPath = attachment._links.download;
  const downloadUrl = `${baseUrl}${downloadPath}`;

  return { downloadUrl };
});

export const handler = resolver.getDefinitions();
