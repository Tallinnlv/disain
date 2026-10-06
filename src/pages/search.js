import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useHistory, useLocation } from '@docusaurus/router';
import SearchField from '@site/src/components/SiteSearch/SearchField';
import SearchResults from '@site/src/components/SiteSearch/SearchResults';
import { searchUrl } from '@site/src/components/SiteSearch/SearchPanel';
import { useLatestVersionName } from '@site/src/components/SiteSearch/useSearchIndex';
import { addRecentSearch } from '@site/src/components/SiteSearch/recentSearches';
import styles from '@site/src/components/SiteSearch/SiteSearch.module.scss';

// /search?q=<query>[&v=<docs version>] — the version defaults to the one
// visitors see by default (lastVersion); the navbar panel adds `v` when a
// search was started from another version's pages.
export default function SearchPage() {
  const location = useLocation();
  const history = useHistory();
  const latestVersion = useLatestVersionName();
  const params = new URLSearchParams(location.search);
  const query = (params.get('q') || '').trim();
  const version = params.get('v') || latestVersion;
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  const submit = (value) => {
    const q = value.trim();
    if (!q) return;
    addRecentSearch(q);
    history.push(searchUrl(q, version, latestVersion));
  };

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
            <SearchField
              variant="hero"
              inputId="search-page-query"
              value={draft}
              onChange={setDraft}
              onSubmit={submit}
              onClear={() => setDraft('')}
            />
          </div>
        </div>
        <SearchResults query={query} version={version} />
      </main>
    </Layout>
  );
}
