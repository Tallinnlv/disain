import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import SearchIcon from '@site/static/img/icons/search-24.svg';
import ClearIcon from '@site/static/img/icons/close-circle-24.svg';
import styles from './SiteSearch.module.scss';

export const SEARCH_PLACEHOLDER = 'Search components, foundations, patterns';

// The 48px search row: magnifier, text input, clear button and the primary
// "Search" button. `variant="hero"` wraps it in the white rounded box used
// on the homepage and the results page; "panel" is the bare row for the
// navbar panel.
const SearchField = forwardRef(function SearchField(
  {
    value,
    onChange,
    onSubmit,
    onClear,
    onKeyDown,
    onFocus,
    variant = 'hero',
    showButton = true,
    label = 'Search the design system',
    inputId,
    comboboxProps,
    autoFocus = false,
  },
  ref,
) {
  const windowSize = useWindowSize();
  const placeholder =
    windowSize === 'mobile' ? 'Search components' : SEARCH_PLACEHOLDER;

  return (
    <form
      role="search"
      className={clsx(styles.field, styles[`field--${variant}`])}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <label htmlFor={inputId} className="visually-hidden">
        {label}
      </label>
      <div className={styles.fieldRow}>
        <span className={styles.fieldIcon} aria-hidden="true">
          <SearchIcon />
        </span>
        <input
        ref={ref}
        id={inputId}
        type="search"
        className={styles.fieldInput}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        autoComplete="off"
        spellCheck="false"
        enterKeyHint="search"
        autoFocus={autoFocus}
        {...comboboxProps}
        />
        {value && (
          <button
            type="button"
            className={styles.fieldClear}
            aria-label="Clear search"
            onClick={onClear}
          >
            <ClearIcon aria-hidden="true" />
          </button>
        )}
      </div>
      {showButton && (
        <button
          type="submit"
          className={clsx('tds-button', 'tds-button--primary', styles.fieldButton)}
        >
          Search
        </button>
      )}
    </form>
  );
});

export default SearchField;
