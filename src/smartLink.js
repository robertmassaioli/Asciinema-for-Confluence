/**
 * Smart Link resolver for asciinema.org recording URLs.
 *
 * When a Confluence user pastes a URL like https://asciinema.org/a/756853,
 * Atlassian calls this function with a batch of matching URLs. We fetch
 * basic metadata from asciinema.org and return entity objects so Confluence
 * can render a rich Smart Link card instead of a plain hyperlink.
 *
 * API contract:
 *   Request:  { type: "resolve", payload: { urls: string[] } }
 *   Response: { entities: EntityResult[] }
 *
 * Each EntityResult:
 *   { identifier: { url }, meta: { access, visibility }, entity?: {...} }
 */

import api from '@forge/api';

/**
 * Main Smart Link handler — processes all URLs in the batch.
 */
export async function handler(event) {
  const urls = event.payload?.urls ?? [];

  // Process all URLs concurrently for performance
  const entities = await Promise.all(urls.map(resolveUrl));

  return { entities };
}

/**
 * Resolves a single asciinema.org URL to a Smart Link entity.
 *
 * @param {string} url - e.g. "https://asciinema.org/a/756853"
 * @returns {Object} EntityResult conforming to the Smart Link API contract
 */
async function resolveUrl(url) {
  // Extract the recording ID from the URL path segment
  const match = url.match(/asciinema\.org\/a\/([0-9a-zA-Z]+)/);
  if (!match) {
    return notFound(url);
  }

  const id = match[1];

  try {
    // Fetch the HTML page to extract the recording title from <title>.
    // This is the same approach used in asciinema/src/html.rs to discover
    // the machine-readable .cast URL via <link rel="alternate">.
    const response = await api.fetch(`https://asciinema.org/a/${id}`);

    if (!response.ok) {
      // Recording doesn't exist or is private
      if (response.status === 404) return notFound(url);
      if (response.status === 401 || response.status === 403) return forbidden(url);
      return notFound(url);
    }

    const html = await response.text();

    // Extract the page title — asciinema.org uses format "title - asciinema"
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let displayName = `asciinema recording ${id}`;
    if (titleMatch) {
      // Strip the " - asciinema" site suffix if present
      displayName = titleMatch[1].replace(/\s*-\s*asciinema\s*$/i, '').trim();
    }

    // Extract description from the og:description meta tag if available
    const descMatch = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i);
    const description = descMatch ? descMatch[1] : undefined;

    return {
      identifier: { url },
      meta: {
        access: 'granted',
        visibility: 'public',
      },
      entity: {
        // Unique identifier for this entity
        id,
        // Human-readable title shown on the Smart Link card
        displayName,
        // Canonical URL
        url,
        // Poster image — asciinema.org generates an SVG screenshot of the recording
        thumbnail: {
          externalUrl: `https://asciinema.org/a/${id}.svg`,
        },
        // Optional description text shown below the title on the card
        ...(description && { summary: description }),
        // Entity type metadata required by the Smart Link schema
        'atlassian:document': {
          type: { category: 'document' },
        },
      },
    };
  } catch (err) {
    // Network error or unexpected failure — return not_found rather than crashing
    console.error(`Smart Link resolution failed for ${url}:`, err);
    return notFound(url);
  }
}

/** Helper: entity result for URLs that cannot be found */
function notFound(url) {
  return {
    identifier: { url },
    meta: { access: 'not_found', visibility: 'not_found' },
  };
}

/** Helper: entity result for URLs the user cannot access */
function forbidden(url) {
  return {
    identifier: { url },
    meta: { access: 'forbidden', visibility: 'restricted' },
  };
}
