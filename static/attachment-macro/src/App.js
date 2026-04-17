/**
 * Attachment Macro — Main Player Component
 *
 * Reads the attachment filename and page ID from the Forge context, calls the
 * backend resolver to get a download URL for the .cast file, then initialises
 * the asciinema-player pointing at that URL.
 *
 * The asciinema-player npm package is imported directly — no need to load
 * JS/CSS from static assets at runtime.
 */

import React, { useEffect, useRef, useState } from 'react';
import { view, invoke } from '@forge/bridge';
import * as AsciinemaPlayer from 'asciinema-player';
import 'asciinema-player/dist/bundle/asciinema-player.css';

export default function App() {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let player = null;

    async function initPlayer() {
      try {
        // contentId is the Confluence page ID.
        // config holds what the author set in the config panel.
        const ctx = await view.getContext();
        const pageId = ctx.contentId;
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

        // Ask the backend resolver to look up the attachment download URL.
        const { downloadUrl } = await invoke('resolveAttachmentUrl', { pageId, filename });

        if (!containerRef.current) return;

        setLoading(false);

        // Create the player pointing at the Confluence attachment URL.
        player = AsciinemaPlayer.create(
          downloadUrl,
          containerRef.current,
          {
            autoPlay: config.autoplay === true || config.autoplay === 'true',
            loop: config.loop === true || config.loop === 'true',
            speed: config.speed ? parseFloat(config.speed) : 1,
            theme: config.theme || 'asciinema',
            poster: config.poster ? `npt:${config.poster}` : undefined,
            fit: 'width',
          }
        );
      } catch (err) {
        console.error('Asciinema attachment player error:', err);
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
