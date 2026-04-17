/**
 * Inline Macro — Player Component
 *
 * Reads the raw .cast file content from the macro body (via Forge context),
 * then initialises the asciinema-player with the configured playback options.
 */

import React, { useEffect, useRef, useState } from 'react';
import { view } from '@forge/bridge';
import * as AsciinemaPlayer from 'asciinema-player';
import 'asciinema-player/dist/bundle/asciinema-player.css';

export default function InlineApp() {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let player = null;

    async function initPlayer() {
      try {
        const ctx = await view.getContext();
        const castText = ctx.extension?.macro?.body ?? '';
        const config = ctx.extension?.config ?? {};

        if (!castText.trim()) {
          setError('No .cast content found. Edit the macro and paste your .cast file content into the body.');
          return;
        }

        if (!containerRef.current) return;

        player = AsciinemaPlayer.create(
          { data: castText },
          containerRef.current,
          {
            cols: config.cols ? parseInt(config.cols, 10) : undefined,
            rows: config.rows ? parseInt(config.rows, 10) : undefined,
            autoPlay: config.autoplay === true || config.autoplay === 'true',
            loop: config.loop === true || config.loop === 'true',
            speed: config.speed ? parseFloat(config.speed) : 1,
            theme: config.theme || 'asciinema',
            fit: 'width',
          }
        );
      } catch (err) {
        console.error('Asciinema inline player error:', err);
        setError(`Failed to initialise player: ${err.message}`);
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
        <strong>Asciinema Inline:</strong> {error}
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: '100%' }} />;
}
