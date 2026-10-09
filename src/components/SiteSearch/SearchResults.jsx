import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useSearchIndex } from './useSearchIndex';
import { excerpt, highlight } from './highlight';
import styles from './SiteSearch.module.scss';

// Category → filter chip label and badge colour. Badges reuse the TDS
// badge classes (global via custom.scss).
const CATEGORIES = [
  { category: 'Component', label: 'Components', badge: 'tds-badge--primary' },
  { category: 'Foundation', label: 'Foundations', badge: 'tds-badge--green' },
  { category: 'Pattern', label: 'Patterns', badge: 'tds-badge--yellow' },
  {
    category: 'Getting started',
    label: 'Getting started',
    badge: 'tds-badge--neutral',
    optional: true,
  },
];

function Badge({ category }) {
  const meta = CATEGORIES.find((c) => c.category === category);
  return (
    <span className={clsx('tds-badge', 'tds-badge--small', meta?.badge)}>
      <span className="tds-badge__text tds-badge__text--small tds-badge__text--bold">
        {category}
      </span>
    </span>
  );
}

export default function SearchResults({ query, version }) {
  const search = useSearchIndex(version);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setFilter('All');
  }, [query]);

  const results = useMemo(
    () => (search && query ? search(query) : []),
    [search, query],
  );

  const chips = CATEGORIES.filter(
    (c) => !c.optional || results.some((r) => r.category === c.category),
  );
  const visible =
    filter === 'All' ? results : results.filter((r) => r.category === filter);

  const count = results.length;
  const countText = `${count} result${count === 1 ? '' : 's'} for`;

  return (
    <section className={styles.results} aria-labelledby="search-results-title">
      <div>
        <h2 id="search-results-title" className={styles.resultsTitle}>
          Search results
        </h2>
        <p className={styles.resultsCount} role="status" aria-live="polite">
          {!query ? (
            'Type what you are looking for in the field above.'
          ) : !search ? (
            'Loading…'
          ) : (
            <>
              {countText} <strong>&ldquo;{query}&rdquo;</strong>
            </>
          )}
        </p>
      </div>

      {query && count > 0 && (
        <div className={styles.filters} role="group" aria-label="Filter results">
          <ul className={styles.chips}>
            {[{ category: 'All', label: 'All' }, ...chips].map((chip) => (
              <li key={chip.category}>
                <button
                  type="button"
                  className={clsx(
                    'tds-chip',
                    'tds-chip--selection-medium',
                    styles.chip,
                  )}
                  aria-pressed={filter === chip.category}
                  onClick={() => setFilter(chip.category)}
                >
                  <span className="tds-chip--text">{chip.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {query && search && count === 0 && (
        <p className={styles.empty}>
          Nothing matched &ldquo;{query}&rdquo;. Check the spelling or try a
          more general term, such as a component name.
        </p>
      )}

      {visible.length > 0 && (
        <ul className={styles.resultList}>
          {visible.map((record) => (
            <li key={record.id} className={styles.result}>
              <Badge category={record.category} />
              <h3 className={styles.resultTitle}>
                <Link to={record.permalink}>{record.title}</Link>
              </h3>
              <p className={styles.excerpt}>
                {highlight(excerpt(record, query), query)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
