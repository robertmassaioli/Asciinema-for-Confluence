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
 * Extracts plain text from a code block in an ADF document.
 *
 * Expects exactly ONE codeBlock node at the top level of the document.
 * Returns { text, error } — if error is set, text will be null.
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
 */
function extractCodeBlockText(adf) {
  if (!adf) {
    return { text: null, error: 'The macro body is empty. Add a Code Block containing your .cast file content.' };
  }

  if (typeof adf === 'string') {
    // Shouldn't happen with layout: bodied but handle gracefully
    return { text: adf, error: null };
  }

  const nodes = adf?.content ?? [];
  const codeBlocks = nodes.filter((n) => n.type === 'codeBlock');

  if (codeBlocks.length === 0) {
    return {
      text: null,
      error: 'No Code Block found in the macro body. This macro expects exactly one Code Block containing the raw .cast file content. Use the / menu to insert a Code Block, then paste your .cast content inside it.',
    };
  }

  if (codeBlocks.length > 1) {
    return {
      text: null,
      error: `Found ${codeBlocks.length} Code Blocks in the macro body. This macro expects exactly one Code Block containing the .cast file content. Please remove the extra Code Blocks.`,
    };
  }

  const text = (codeBlocks[0].content ?? [])
    .filter((n) => n.type === 'text')
    .map((n) => n.text)
    .join('');

  if (!text.trim()) {
    return { text: null, error: 'The Code Block in the macro body is empty. Paste your .cast file content inside it.' };
  }

  return { text, error: null };
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

        // Config is saved by the UI Kit config panel and read back via context.
        // We cannot use useConfig() here — that hook belongs to @forge/react's
        // React instance, but this component is rendered by ReactDOM (Custom UI).
        // Using it here causes an "invalid hook call" error due to two React copies.
        const config = ctx.extension?.config ?? {};
        console.log('[asciinema-inline] config:', config);

        // The macro body is ADF (Atlassian Document Format) — a JSON object.
        // We extract the raw text from the first code block in the body,
        // which is where the user should paste their .cast file content.
        const body = ctx.extension?.macro?.body;
        console.log('[asciinema-inline] raw body:', JSON.stringify(body, null, 2));

        const { text: castText, error: bodyError } = extractCodeBlockText(body);
        console.log('[asciinema-inline] extracted castText (first 200 chars):', castText?.slice(0, 200));

        if (bodyError) {
          console.warn('[asciinema-inline] body error:', bodyError);
          setError(bodyError);
          return;
        }

        if (!containerRef.current) return;

        // CheckboxGroup stores selected values in config.playback as an array
        // e.g. ['autoplay', 'loop'] — not as separate boolean keys
        const playback = Array.isArray(config.playback) ? config.playback : [];

        const playerOpts = {
          cols: config.cols ? parseInt(config.cols, 10) : undefined,
          rows: config.rows ? parseInt(config.rows, 10) : undefined,
          autoPlay: playback.includes('autoplay'),
          loop: playback.includes('loop'),
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
