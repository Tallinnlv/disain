import React, { useState } from 'react';
import styles from './HeaderComponent.module.scss';
import { Link } from 'react-router-dom';
import { useHistory } from '@docusaurus/router';
import SearchField from '../SiteSearch/SearchField';
import { addRecentSearch } from '../SiteSearch/recentSearches';

export default function HeaderComponent() {
  const history = useHistory();
  const [query, setQuery] = useState('');

  const submit = (value) => {
    const q = value.trim();
    if (!q) return;
    addRecentSearch(q);
    history.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div>
      <img
        style={{ backgroundColor: 'white' }}
        src="/img/main-pattern.svg"
        className={styles.HeaderComponentBackground}
        alt=""
      />
      <div className={styles.HeaderComponent}>
        <div className={styles.layout}>
          <h1>Tallinn Design System</h1>
          <p className={styles.tagline}>
            The central digital experience resource of Tallinn. Guidelines,
            design assets and component libraries for building a consistent and
            accessible digital brand across the city.
          </p>

          <div className={styles.search}>
            <SearchField
              variant="hero"
              inputId="home-search-query"
              value={query}
              onChange={setQuery}
              onSubmit={submit}
              onClear={() => setQuery('')}
            />
          </div>

          <Link
            className="tds-button tds-button--primary"
            to="/docs/getting-started"
          >
            Getting started{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.5858 11L11.2929 5.70712L12.7071 4.29291L20.4142 12L12.7071 19.7071L11.2929 18.2929L16.5858 13H3V11H16.5858Z"
                fill="white"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
