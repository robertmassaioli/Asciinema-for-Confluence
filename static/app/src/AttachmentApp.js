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
 *   3. Pass the text to AsciinemaPlayer.create() via a data URL
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
        console.log('[asciinema-attachment] full context:', JSON.stringify(ctx, null, 2));

        const pageId = ctx.extension?.content?.id;
        // Config is read from context — cannot use useConfig() here as it belongs
        // to @forge/react's React instance, not our ReactDOM instance.
        const config = ctx.extension?.config ?? {};
        console.log('[asciinema-attachment] pageId:', pageId);
        console.log('[asciinema-attachment] config:', config);

        const filename = config.filename?.trim();
        console.log('[asciinema-attachment] filename:', filename);

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
        console.log('[asciinema-attachment] looking up attachment by filename...');
        const listResp = await requestConfluence(
          `/wiki/api/v2/pages/${pageId}/attachments?filename=${encodeURIComponent(filename)}&limit=1`
        );
        if (!listResp.ok) {
          throw new Error(`Failed to list attachments: ${listResp.status} ${listResp.statusText}`);
        }
        const listData = await listResp.json();
        console.log('[asciinema-attachment] attachment list response:', JSON.stringify(listData, null, 2));

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
        console.log('[asciinema-attachment] found attachment id:', attachmentId);

        // Step 2: Download the raw .cast file content
        console.log('[asciinema-attachment] downloading attachment content...');
        const downloadResp = await requestConfluence(
          `/wiki/rest/api/content/${attachmentId}/download`
        );
        if (!downloadResp.ok) {
          throw new Error(`Failed to download attachment: ${downloadResp.status} ${downloadResp.statusText}`);
        }
        const castText = await downloadResp.text();
        console.log('[asciinema-attachment] downloaded castText (first 200 chars):', castText.slice(0, 200));

        if (!castText.trim()) {
          setError(`The attachment "${filename}" appears to be empty.`);
          setLoading(false);
          return;
        }

        if (!containerRef.current) return;

        setLoading(false);

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
        console.log('[asciinema-attachment] creating player with opts:', playerOpts);

        // Pass cast content as a data URL so the player can parse it directly
        const dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(castText)}`;
        player = AsciinemaPlayer.create(dataUrl, containerRef.current, playerOpts);
        console.log('[asciinema-attachment] player created successfully');
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

  if (error) {
    return (
      <div style={{ padding: '16px', color: '#de350b', fontFamily: 'sans-serif' }}>
        <strong>Asciinema Recording:</strong> {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '16px', fontFamily: 'sans-serif', color: '#6b778c' }}>
        Loading recording…
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: '100%' }} />;
}
