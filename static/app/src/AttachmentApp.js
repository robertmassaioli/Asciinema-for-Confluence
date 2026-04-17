/**
 * Attachment Macro — Player Component
 *
 * Reads the attachment filename and page ID from the Forge context, calls the
 * backend resolver to get a download URL for the .cast file, then initialises
 * the asciinema-player pointing at that URL.
 */

import React, { useEffect, useRef, useState } from 'react';
import { view, invoke } from '@forge/bridge';
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

        const { downloadUrl } = await invoke('resolveAttachmentUrl', { pageId, filename });

        if (!containerRef.current) return;

        setLoading(false);

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
