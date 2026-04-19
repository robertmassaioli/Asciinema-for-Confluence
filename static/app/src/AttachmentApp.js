/**
 * Attachment Macro — Player Component
 *
 * Uses requestConfluence from @forge/bridge to fetch the .cast file content
 * directly from the frontend — no backend resolver needed.
 *
 * Flow:
 *   1. GET /wiki/api/v2/pages/{pageId}/attachments?filename={filename}
 *      → find the attachment ID
 *   2. GET /wiki/rest/api/content/{attachmentId}/download
 *      → fetch raw .cast text content
 *   3. Pass the text to AsciinemaPlayer.create() as { data: castText }
 */

import React, { useEffect, useRef, useState } from 'react';
import { view, requestConfluence } from '@forge/bridge';
import * as AsciinemaPlayer from 'asciinema-player';
import 'asciinema-player/dist/bundle/asciinema-player.css';

export default function AttachmentApp() {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let player = null;

    async function initPlayer() {
      try {
        const ctx = await view.getContext();

        const pageId = ctx.extension?.content?.id;
        // Config is read from context — cannot use useConfig() here as it belongs
        // to @forge/react's React instance, not our ReactDOM instance.
        const config = ctx.extension?.config ?? {};

        const filename = config.filename?.trim();

        if (!filename) {
          setError(
            'No attachment filename configured. ' +
            'Click the pencil icon on the macro and enter the filename of the .cast attachment.'
          );
          setLoading(false);
          return;
        }

        if (!pageId) {
          setError('Could not determine the current page ID from the Forge context.');
          setLoading(false);
          return;
        }

        // Step 1: Find the attachment ID by filename using Confluence v2 API
        const listResp = await requestConfluence(
          `/wiki/api/v2/pages/${pageId}/attachments?filename=${encodeURIComponent(filename)}&limit=1`
        );
        if (!listResp.ok) {
          throw new Error(`Failed to list attachments: ${listResp.status} ${listResp.statusText}`);
        }
        const listData = await listResp.json();

        const attachment = listData.results?.[0];
        if (!attachment) {
          setError(
            `No attachment named "${filename}" found on this page. ` +
            'Make sure you have attached the .cast file and the filename matches exactly.'
          );
          setLoading(false);
          return;
        }

        const attachmentId = attachment.id;

        // Step 2: Download the raw .cast file content using the officially-supported
        // Confluence REST v1 attachment download endpoint.
        //
        // We previously used _links.download from the attachment list response, but
        // that path came from a deprecated private API that Confluence withdrew for
        // security reasons and which can return non-working URLs.
        //
        // The supported replacement (recommended by a Confluence engineer) is:
        //   GET /wiki/rest/api/content/{pageId}/child/attachment/{attachmentId}/download
        //
        // Both pageId and attachmentId are already available from earlier in this
        // function, so no extra API call is needed.
        const downloadResp = await requestConfluence(
          `/wiki/rest/api/content/${pageId}/child/attachment/${attachmentId}/download`,
          {
            // The download endpoint responds with a 302 redirect to the actual
            // file storage location. We must explicitly ask the Forge bridge to
            // follow that redirect — without this option the 302 is surfaced as
            // the final response and the body is empty.
            redirect: 'follow',
          }
        );
        if (!downloadResp.ok) {
          throw new Error(`Failed to download attachment: ${downloadResp.status} ${downloadResp.statusText}`);
        }
        const castText = await downloadResp.text();

        if (!castText.trim()) {
          setError(`The attachment "${filename}" appears to be empty.`);
          setLoading(false);
          return;
        }

        // CheckboxGroup stores selected values in config.playback as an array
        // e.g. ['autoplay', 'loop'] — not as separate boolean keys
        const playback = Array.isArray(config.playback) ? config.playback : [];

        const playerOpts = {
          autoPlay: playback.includes('autoplay'),
          loop: playback.includes('loop'),
          speed: config.speed ? parseFloat(config.speed) : 1,
          theme: config.theme || 'asciinema',
          poster: config.poster ? `npt:${config.poster}` : undefined,
          fit: 'width',
        };

        // Pass the cast text content directly to the player as an object with a
        // `data` property. This tells asciinema-player to use the string in-memory
        // rather than making a fetch() request for a URL.
        //
        // We previously used a data: URL here, but Confluence's iframe CSP blocks
        // fetch requests to data: URLs via the connect-src directive. Passing
        // { data: castText } avoids any network request entirely.
        //
        // This is the same approach used by InlineApp.js.
        if (!containerRef.current) {
          // Should not happen now that the div is always rendered, but guard anyway.
          throw new Error('Player container element is not available — cannot mount player.');
        }

        player = AsciinemaPlayer.create({ data: castText }, containerRef.current, playerOpts);

        // Only hide the loading indicator once the player has been successfully created.
        setLoading(false);
      } catch (err) {
        console.error('[asciinema-attachment] error:', err);
        setError(`Failed to load recording: ${err.message}`);
        setLoading(false);
      }
    }

    initPlayer();

    return () => {
      if (player && typeof player.dispose === 'function') {
        player.dispose();
      }
    };
  }, []);

  // The container div must ALWAYS be rendered so that containerRef.current is
  // available as soon as the component mounts — before the async initPlayer()
  // function finishes. We overlay loading/error messages on top of it instead
  // of conditionally swapping it in/out, which would cause the ref to be null
  // during the async fetch and player creation.
  return (
    <div style={{ width: '100%' }}>
      {error && (
        <div style={{ padding: '16px', color: '#de350b', fontFamily: 'sans-serif' }}>
          <strong>Asciinema Recording:</strong> {error}
        </div>
      )}
      {loading && !error && (
        <div style={{ padding: '16px', fontFamily: 'sans-serif', color: '#6b778c' }}>
          Loading recording…
        </div>
      )}
      {/* The player mounts into this div. It is always in the DOM so that
          containerRef.current is never null when AsciinemaPlayer.create() runs. */}
      <div ref={containerRef} style={{ width: '100%', display: loading || error ? 'none' : 'block' }} />
    </div>
  );
}
