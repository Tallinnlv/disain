import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import SearchIcon from '@site/static/img/icons/search-20.svg';
import SearchPanel from '@site/src/components/SiteSearch/SearchPanel';
import styles from '@site/src/components/SiteSearch/SiteSearch.module.scss';

const PANEL_ID = 'tds-site-search';

// Docusaurus renders @theme/SearchBar at the end of the navbar's right
// items. The trigger toggles the site search panel, which drops down from
// the navbar (the sticky .navbar is the panel's positioning context).
export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const { pathname, search } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname, search]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <div className={styles.searchBar}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={open ? 'Close search' : 'Search'}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 13.4142L5.70711 19.7071L4.29289 18.2929L10.5858 12L4.29289 5.70711L5.70711 4.29289L12 10.5858L18.2929 4.29289L19.7071 5.70711L13.4142 12L19.7071 18.2929L18.2929 19.7071L12 13.4142Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <SearchIcon aria-hidden="true" />
        )}
      </button>
      {open && (
        <SearchPanel id={PANEL_ID} onClose={close} inputRef={inputRef} />
      )}
    </div>
  );
}
