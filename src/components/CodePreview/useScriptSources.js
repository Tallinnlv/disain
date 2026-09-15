import * as React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { withBuildId } from '@site/src/utils/withBuildId';

// Script text is cached per URL for the lifetime of the page, so a doc page
// with a dozen previews of the same component fetches its script once.
const cache = new Map();

const isExternal = (url) => /^https?:\/\//i.test(url);

const fetchScript = (url) => {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.text();
      }),
    );
  }
  return cache.get(url);
};

/**
 * Builds a single JavaScript snippet from the scripts a CodePreview loads
 * into its iframe. Local scripts (served from static/scripts) are fetched and
 * inlined; external CDN scripts are listed as <script src> comments so the
 * reader knows what to include first.
 *
 * @param {string[]} urls - script URLs in load order
 * @param {boolean} enabled - only fetch once the code panel is open
 * @returns {{ status: 'idle'|'loading'|'ready'|'error', text: string }}
 */
export function useScriptSources(urls, enabled) {
  const key = urls.join('\n');
  const [state, setState] = React.useState({ status: 'idle', text: '' });
  // Fetch the same versioned URL the iframe loads (see CodePreviewIframe), but
  // keep showing the clean path in the snippet.
  const { siteConfig } = useDocusaurusContext();
  const buildId = siteConfig.customFields?.buildId;

  React.useEffect(() => {
    if (!enabled || urls.length === 0) {
      return undefined;
    }

    let cancelled = false;
    setState({ status: 'loading', text: '// Loading…' });

    const externals = urls.filter(isExternal);
    const locals = urls.filter((url) => !isExternal(url));

    Promise.all(
      locals.map((url) =>
        fetchScript(withBuildId(url, buildId))
          .then((text) => ({ url, text: text.trimEnd(), ok: true }))
          .catch(() => ({ url, ok: false })),
      ),
    ).then((results) => {
      if (cancelled) {
        return;
      }

      const parts = [];

      if (externals.length > 0) {
        parts.push(
          [
            `// External ${externals.length === 1 ? 'dependency' : 'dependencies'} – include before the script below:`,
            ...externals.map((url) => `// <script src="${url}"></script>`),
          ].join('\n'),
        );
      }

      results.forEach(({ url, text, ok }) => {
        parts.push(
          ok ? `// ${url}\n${text}` : `// Could not load ${url}`,
        );
      });

      setState({
        status: results.every((result) => result.ok) ? 'ready' : 'error',
        text: parts.join('\n\n'),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [key, enabled, buildId]);

  return state;
}

export default useScriptSources;
