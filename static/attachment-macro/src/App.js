/**
 * Attachment Macro — Main Player Component
 *
 * Reads the attachment filename and page ID from the Forge context, calls the
 * backend resolver to get a download URL for the .cast file, then initialises
 * the asciinema-player pointing at that URL.
 *
 * Flow:
 *   1. view.getContext() → contentId (page ID) + config (filename + options)
 *   2. invoke('resolveAttachmentUrl') → downloadUrl
 *   3. Load player CSS + JS from Forge static assets CDN
 *   4. AsciinemaPlayer.create(downloadUrl, container, opts)
 */

import React, { useEffect, useRef, useState } from 'react';
import { view, invoke, assets } from '@forge/bridge';

/**
 * Resolves a static asset URL from the Forge CDN.
 */
async function resolveAssetUrl(filename) {
  try {
    return await assets.getUrl(filename);
  } catch {
    return filename;
  }
}

/**
 * Injects the asciinema-player CSS into the document head (once only).
 */
function injectPlayerCss(cssUrl) {
  if (document.querySelector('link[data-asciinema-css]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  link.setAttribute('data-asciinema-css', '1');
  document.head.appendChild(link);
}

/**
 * Loads the asciinema-player JS bundle and resolves when ready.
 */
function loadPlayerScript(jsUrl) {
  return new Promise((resolve, reject) => {
    if (window.AsciinemaPlayer) {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initPlayer() {
      try {
        // Step 1: Get the Forge context.
        // contentId is the Confluence page ID. config holds what the author
        // set in the config panel (filename, playback options, etc.)
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

        if (cancelled) return;

        // Step 2: Ask the backend resolver to look up the attachment download URL.
        // This runs server-side with the user's Confluence permissions.
        const { downloadUrl } = await invoke('resolveAttachmentUrl', { pageId, filename });

        if (cancelled) return;

        // Step 3: Resolve Forge CDN URLs for the player assets
        const [cssUrl, jsUrl] = await Promise.all([
          resolveAssetUrl('asciinema-player.css'),
          resolveAssetUrl('asciinema-player.min.js'),
        ]);

        if (cancelled) return;

        // Step 4: Inject CSS and load the JS bundle
        injectPlayerCss(cssUrl);
        await loadPlayerScript(jsUrl);

        if (cancelled || !containerRef.current) return;

        setLoading(false);

        // Step 5: Create the player, pointing at the Confluence attachment URL.
        // The player fetches the .cast file directly from Confluence — no
        // server-side streaming or proxying needed.
        window.AsciinemaPlayer.create(
          downloadUrl,
          containerRef.current,
          {
            autoPlay: config.autoplay === true || config.autoplay === 'true',
            loop: config.loop === true || config.loop === 'true',
            speed: config.speed ? parseFloat(config.speed) : 1,
            theme: config.theme || 'asciinema',
            // Show a poster frame at this number of seconds before the user plays
            poster: config.poster ? `npt:${config.poster}` : undefined,
            fit: 'width',
          }
        );
      } catch (err) {
        if (!cancelled) {
          console.error('Asciinema attachment player error:', err);
          setError(`Failed to load recording: ${err.message}`);
          setLoading(false);
        }
      }
    }

    initPlayer();

    return () => { cancelled = true; };
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

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', minHeight: '200px' }}
    />
  );
}
