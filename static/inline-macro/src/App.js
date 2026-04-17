/**
 * Inline Macro — Main Player Component
 *
 * Reads the raw .cast file content from the macro body (via Forge context),
 * then initialises the asciinema-player with the configured playback options.
 *
 * The asciinema-player JS and CSS are served as Forge static resources from
 * the player-assets resource key. We load them dynamically at runtime using
 * the asset() helper from @forge/bridge so we get the correct CDN URL.
 *
 * Flow:
 *   1. view.getContext() → body (.cast text) + config (playback options)
 *   2. Load player CSS via <link>
 *   3. Load player JS via <script>, then call AsciinemaPlayer.create()
 */

import React, { useEffect, useRef, useState } from 'react';
import { view, assets } from '@forge/bridge';

/**
 * Resolves a static asset URL from the Forge CDN.
 * Falls back to a relative path if the assets API is unavailable (local dev).
 */
async function resolveAssetUrl(filename) {
  try {
    // assets.getUrl() returns the full CDN URL for a file in the resource bundle
    return await assets.getUrl(filename);
  } catch {
    return filename;
  }
}

/**
 * Injects the asciinema-player CSS into the document head (once only).
 */
function injectPlayerCss(cssUrl) {
  if (document.querySelector(`link[data-asciinema-css]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  link.setAttribute('data-asciinema-css', '1');
  document.head.appendChild(link);
}

/**
 * Loads the asciinema-player JS bundle and resolves when it's ready.
 */
function loadPlayerScript(jsUrl) {
  return new Promise((resolve, reject) => {
    if (window.AsciinemaPlayer) {
      // Already loaded (e.g. hot-reload scenario)
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = jsUrl;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load player script: ${jsUrl}`));
    document.head.appendChild(script);
  });
}

export default function App() {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function initPlayer() {
      try {
        // Step 1: Get the Forge context — body holds the raw .cast content,
        // extension.config holds playback options set in the config panel.
        const ctx = await view.getContext();
        const castText = ctx.extension?.body ?? '';
        const config = ctx.extension?.config ?? {};

        if (!castText.trim()) {
          setError('No .cast content found. Edit the macro and paste your .cast file content into the body.');
          return;
        }

        if (cancelled) return;

        // Step 2: Resolve the asset URLs from the Forge CDN
        const [cssUrl, jsUrl] = await Promise.all([
          resolveAssetUrl('asciinema-player.css'),
          resolveAssetUrl('asciinema-player.min.js'),
        ]);

        if (cancelled) return;

        // Step 3: Inject CSS and load the JS bundle
        injectPlayerCss(cssUrl);
        await loadPlayerScript(jsUrl);

        if (cancelled || !containerRef.current) return;

        // Step 4: Initialise the player with the cast content and options.
        // { data: castText } tells the player to parse the string directly
        // rather than fetching a URL — ideal for the inline body approach.
        window.AsciinemaPlayer.create(
          { data: castText },
          containerRef.current,
          {
            // Override terminal dimensions if the author specified them
            cols: config.cols ? parseInt(config.cols, 10) : undefined,
            rows: config.rows ? parseInt(config.rows, 10) : undefined,
            // Playback behaviour from config panel
            autoPlay: config.autoplay === true || config.autoplay === 'true',
            loop: config.loop === true || config.loop === 'true',
            speed: config.speed ? parseFloat(config.speed) : 1,
            // Visual theme
            theme: config.theme || 'asciinema',
            // Fit the player width to its container
            fit: 'width',
          }
        );
      } catch (err) {
        if (!cancelled) {
          console.error('Asciinema inline player error:', err);
          setError(`Failed to initialise player: ${err.message}`);
        }
      }
    }

    initPlayer();

    // Cleanup: prevent state updates if the component unmounts mid-init
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div style={{ padding: '16px', color: '#de350b', fontFamily: 'sans-serif' }}>
        <strong>Asciinema Inline:</strong> {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', minHeight: '200px' }}
    />
  );
}
