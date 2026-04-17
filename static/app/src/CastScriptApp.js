/**
 * CastScript Macro — Player Component
 *
 * Reads a castscript from the macro body (ADF code block), compiles it
 * entirely in the browser using @cast-builder/core, and renders it with
 * the asciinema-player.
 *
 * No backend, no file uploads, no raw JSON. Edit the page to update the video.
 *
 * Pipeline:
 *   ADF body → extractCodeBlockText() → castscript source
 *     → parse() → { config, nodes }
 *       → compile() → CompiledCast
 *         → encodeV3() → .cast NDJSON string
 *           → data: URL → AsciinemaPlayer.create()
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { view } from '@forge/bridge';
import { parse, compile, encodeV3, NULL_RESOLVER } from '@cast-builder/core';
import * as AsciinemaPlayer from 'asciinema-player';
import 'asciinema-player/dist/bundle/asciinema-player.css';

/**
 * Extract the text content of exactly one code block from ADF body.
 * Returns { text } on success or { error } on failure.
 */
function extractCodeBlockText(body) {
  if (!body || !body.content) {
    return { error: 'The macro body is empty. Add a Code Block containing your castscript.' };
  }

  const codeBlocks = body.content.filter(node => node.type === 'codeBlock');

  if (codeBlocks.length === 0) {
    return {
      error:
        'No Code Block found in the macro body. ' +
        'Use the / menu to insert a Code Block, then paste your castscript inside it.',
    };
  }

  if (codeBlocks.length > 1) {
    return {
      error:
        `Found ${codeBlocks.length} Code Blocks in the macro body. ` +
        'Please remove the extra Code Blocks — only one is allowed.',
    };
  }

  const text = codeBlocks[0].content?.map(n => n.text ?? '').join('') ?? '';

  if (!text.trim()) {
    return { error: 'The Code Block in the macro body is empty. Paste your castscript inside it.' };
  }

  return { text };
}

export default function CastScriptApp() {
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'compiling' | 'ready'
  const [castData, setCastData] = useState(null); // { castText, playerOpts }
  const castDataRef = useRef(null); // mirror of castData for use in callback ref
  const playerRef = useRef(null);

  // Phase 1: fetch context, parse, compile — runs once on mount
  useEffect(() => {
    async function compile_() {
      try {
        const ctx = await view.getContext();
        console.log('[asciinema-castscript] full context:', JSON.stringify(ctx, null, 2));

        const config = ctx.extension?.config ?? {};
        console.log('[asciinema-castscript] config:', config);

        const body = ctx.extension?.macro?.body;
        console.log('[asciinema-castscript] raw body:', JSON.stringify(body, null, 2));

        const { text: castscriptSource, error: extractError } = extractCodeBlockText(body);
        if (extractError) {
          setError(extractError);
          setStatus('ready');
          return;
        }
        console.log('[asciinema-castscript] castscript source (first 200 chars):', castscriptSource.slice(0, 200));

        setStatus('compiling');

        const { config: scriptConfig, nodes } = parse(castscriptSource);

        const seed = config.seed ? parseInt(config.seed, 10) : undefined;
        if (seed !== undefined && !isNaN(seed)) {
          scriptConfig.typingSeed = seed;
          console.log('[asciinema-castscript] using typing seed:', seed);
        }

        const compiled = await compile(scriptConfig, nodes, {
          resolver: NULL_RESOLVER,
          onResolveError: 'error',
          now: Math.floor(Date.now() / 1000),
        });
        console.log('[asciinema-castscript] compiled successfully');

        const castText = encodeV3(compiled);
        console.log('[asciinema-castscript] encoded cast (first 200 chars):', castText.slice(0, 200));

        const playback = Array.isArray(config.playback) ? config.playback : [];
        const playerOpts = {
          autoPlay: playback.includes('autoplay'),
          loop: playback.includes('loop'),
          speed: config.speed ? parseFloat(config.speed) : 1,
          theme: config.theme || scriptConfig.theme || 'asciinema',
          fit: 'width',
        };

        // Store cast data in both state (triggers re-render) and ref (for callback ref).
        const data = { castText, playerOpts };
        castDataRef.current = data;
        setCastData(data);
        setStatus('ready');
      } catch (err) {
        console.error('[asciinema-castscript] error:', err);
        setError(`Failed to compile castscript: ${err.message}`);
        setStatus('ready');
      }
    }

    compile_();
  }, []);

  // Callback ref — called by React when the container div is mounted/unmounted.
  // This fires AFTER the DOM node is attached, so containerRef.current is always valid.
  const containerCallbackRef = useCallback((node) => {
    console.log('[asciinema-castscript] containerCallbackRef called — node:', node, 'castDataRef.current:', !!castDataRef.current);
    if (node === null) {
      // Unmounted — dispose player
      if (playerRef.current && typeof playerRef.current.dispose === 'function') {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      return;
    }
    // Mounted — create player if cast data is ready
    if (!castDataRef.current) {
      console.log('[asciinema-castscript] container mounted but castData not ready yet');
      return;
    }
    console.log('[asciinema-castscript] creating player with opts:', castDataRef.current.playerOpts);
    const dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(castDataRef.current.castText)}`;
    playerRef.current = AsciinemaPlayer.create(dataUrl, node, castDataRef.current.playerOpts);
    console.log('[asciinema-castscript] player created successfully');
  }, []); // stable — no deps needed since we read from refs

  console.log('[asciinema-castscript] render — status:', status, 'castData:', !!castData, 'error:', error);

  if (error) {
    return (
      <div style={{ padding: '16px', color: '#de350b', fontFamily: 'sans-serif' }}>
        <strong>Asciinema CastScript:</strong> {error}
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div style={{ padding: '16px', fontFamily: 'sans-serif', color: '#6b778c' }}>
        Loading…
      </div>
    );
  }

  if (status === 'compiling') {
    return (
      <div style={{ padding: '16px', fontFamily: 'sans-serif', color: '#6b778c' }}>
        Compiling castscript…
      </div>
    );
  }

  return <div ref={containerCallbackRef} style={{ width: '100%' }} />;
}
