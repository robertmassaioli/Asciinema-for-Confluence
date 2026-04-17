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

/**
 * Extracts plain text from the first code block found in an ADF document.
 *
 * ADF structure for a code block:
 * {
 *   "type": "doc",
 *   "content": [
 *     {
 *       "type": "codeBlock",
 *       "content": [{ "type": "text", "text": "<cast content>" }]
 *     }
 *   ]
 * }
 *
 * If no code block is found, falls back to concatenating all text nodes
 * in the document so plain-text paste also works as a fallback.
 */
function extractCodeBlockText(adf) {
  if (!adf) return '';

  // If it's already a plain string (shouldn't happen with layout: bodied, but just in case)
  if (typeof adf === 'string') return adf;

  const nodes = adf?.content ?? [];

  // First pass: look for a codeBlock node
  for (const node of nodes) {
    if (node.type === 'codeBlock') {
      return (node.content ?? [])
        .filter((n) => n.type === 'text')
        .map((n) => n.text)
        .join('');
    }
  }

  // Fallback: concatenate all top-level text nodes
  return nodes
    .flatMap((n) => n.content ?? [])
    .filter((n) => n.type === 'text')
    .map((n) => n.text)
    .join('');
}

export default function InlineApp() {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let player = null;

    async function initPlayer() {
      try {
        const ctx = await view.getContext();
        console.log('[asciinema-inline] full context:', JSON.stringify(ctx, null, 2));

        const config = ctx.extension?.config ?? {};
        console.log('[asciinema-inline] config:', config);

        // The macro body is ADF (Atlassian Document Format) — a JSON object.
        // We extract the raw text from the first code block in the body,
        // which is where the user should paste their .cast file content.
        const body = ctx.extension?.macro?.body;
        console.log('[asciinema-inline] raw body:', JSON.stringify(body, null, 2));

        const castText = extractCodeBlockText(body);
        console.log('[asciinema-inline] extracted castText (first 200 chars):', castText?.slice(0, 200));

        if (!castText || !castText.trim()) {
          setError(
            'No .cast content found. Edit the macro, insert a Code Block, ' +
            'and paste your .cast file content inside it.'
          );
          return;
        }

        if (!containerRef.current) return;

        const playerOpts = {
          cols: config.cols ? parseInt(config.cols, 10) : undefined,
          rows: config.rows ? parseInt(config.rows, 10) : undefined,
          autoPlay: config.autoplay === true || config.autoplay === 'true',
          loop: config.loop === true || config.loop === 'true',
          speed: config.speed ? parseFloat(config.speed) : 1,
          theme: config.theme || 'asciinema',
          fit: 'width',
        };
        console.log('[asciinema-inline] creating player with opts:', playerOpts);

        player = AsciinemaPlayer.create(
          { data: castText },
          containerRef.current,
          playerOpts
        );
        console.log('[asciinema-inline] player created successfully');
      } catch (err) {
        console.error('[asciinema-inline] error:', err);
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
