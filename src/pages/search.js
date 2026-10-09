import React from 'react';
import Layout from '@theme/Layout';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useLocation } from '@docusaurus/router';
import SearchPanel from '@site/src/components/SiteSearch/SearchPanel';
import SearchResults from '@site/src/components/SiteSearch/SearchResults';
import { useLatestVersionName } from '@site/src/components/SiteSearch/useSearchIndex';
import styles from '@site/src/components/SiteSearch/SiteSearch.module.scss';

// /search?q=<query>[&v=<docs version>] — the version defaults to the one
// visitors see by default (lastVersion); the navbar panel adds `v` when a
// search was started from another version's pages.
export default function SearchPage() {
  const location = useLocation();
  const latestVersion = useLatestVersionName();
  // The static build renders this page without a query string, so the
  // first client render must match that or React drops the server HTML.
  const isBrowser = useIsBrowser();
  const params = new URLSearchParams(isBrowser ? location.search : '');
  const query = (params.get('q') || '').trim();
  const version = params.get('v') || latestVersion;
  return (
    <Layout
      title="Search"
      description="Search the Tallinn Design System documentation"
    >
      <main>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>
              Search components, foundations, patterns
            </h1>
            <SearchPanel
              key={`${version}:${query}`}
              id="results-search"
              inputId="search-page-query"
              inline
              initialQuery={query}
              searchVersion={version}
            />
          </div>
        </div>
        <SearchResults query={query} version={version} />
      </main>
    </Layout>
  );
}
