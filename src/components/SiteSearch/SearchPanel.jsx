import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLockBodyScroll } from "@docusaurus/theme-common/internal";
import HistoryIcon from "@site/static/img/icons/history-16.svg";
import SearchField from "./SearchField";
import {
  useLatestVersionName,
  useSearchIndex,
  useSearchVersion,
} from "./useSearchIndex";
import { highlight, matchesTitle } from "./highlight";
import { addRecentSearch, getRecentSearches } from "./recentSearches";
import styles from "./SiteSearch.module.scss";

const MAX_SUGGESTIONS = 6;

export function searchUrl(query, version, latestVersion) {
  const params = new URLSearchParams({ q: query });
  if (version && version !== latestVersion) params.set("v", version);
  return `/search?${params.toString()}`;
}

// The dropdown under the navbar: search field, page suggestions, recent
// searches, quick links. One listbox (suggestions + recents) is driven by
// the field's aria-activedescendant so arrow keys work from the input.
export default function SearchPanel({
  id,
  onClose,
  inputRef,
  inline = false,
  initialQuery = "",
  searchVersion,
  inputId = `${id}-input`,
}) {
  const rootRef = useRef(null);
  const localInputRef = useRef(null);
  const fieldRef = inputRef || localInputRef;
  const [expanded, setExpanded] = useState(!inline);
  const close = () => {
    if (inline) setExpanded(false);
    else onClose();
  };

  useEffect(() => {
    if (!inline || !expanded) return undefined;
    const dismiss = (event) => {
      if (!rootRef.current?.contains(event.target)) setExpanded(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [inline, expanded]);
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const quickLinks = siteConfig.customFields.searchQuickLinks || [];
  const activeVersion = useSearchVersion();
  const version = searchVersion || activeVersion;
  const latestVersion = useLatestVersionName();
  const search = useSearchIndex(version);
  const [query, setQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recents, setRecents] = useState([]);
  const listboxId = `${id}-listbox`;

  useLockBodyScroll(!inline);

  useEffect(() => {
    setRecents(getRecentSearches());
  }, [expanded]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  // Suggest pages whose title matches what was typed; body-text matches
  // belong on the results page. Fall back to the best matches overall so
  // the list is never empty when the index found something.
  const suggestions = useMemo(() => {
    if (!search) return [];
    const results = search(query);
    const byTitle = results.filter((r) => matchesTitle(r.title, query));
    return (byTitle.length ? byTitle : results).slice(0, MAX_SUGGESTIONS);
  }, [search, query]);

  const options = useMemo(
    () => [
      ...suggestions.map((record) => ({ kind: "page", record })),
      ...recents.map((recent) => ({ kind: "recent", query: recent })),
    ],
    [suggestions, recents],
  );

  const trimmed = query.trim();

  const submit = (value) => {
    const q = value.trim();
    if (!q) return;
    addRecentSearch(q);
    close();
    history.push(searchUrl(q, version, latestVersion));
  };

  const openPage = (record) => {
    addRecentSearch(query);
    close();
    history.push(record.permalink);
  };

  const choose = (option) =>
    option.kind === "page" ? openPage(option.record) : submit(option.query);

  const onInputKeyDown = (event) => {
    if (inline && !expanded && ["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      setExpanded(true);
      return;
    }
    if (!expanded || !options.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      if (options[activeIndex]) choose(options[activeIndex]);
    }
  };

  const onPanelKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (inline) fieldRef.current?.focus();
      close();
    }
  };

  const optionId = (index) => `${listboxId}-option-${index}`;

  const status = !trimmed
    ? ""
    : !search
      ? "Loading search…"
      : suggestions.length
        ? `${suggestions.length} suggestion${suggestions.length === 1 ? "" : "s"}`
        : "No suggestions";

  return (
    <>
      {!inline &&
        createPortal(
          <div className={styles.backdrop} onClick={close} />,
          document.body,
        )}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={rootRef}
        id={id}
        className={inline ? styles.inlineSearch : styles.panel}
        onKeyDown={onPanelKeyDown}
        onBlur={(event) => {
          if (inline && !event.currentTarget.contains(event.relatedTarget))
            setExpanded(false);
        }}
      >
        <div className={inline ? undefined : styles.panelField}>
          <SearchField
            ref={fieldRef}
            variant={inline ? "hero" : "panel"}
            inputId={inputId}
            value={query}
            onChange={(value) => {
              setQuery(value);
              setExpanded(true);
            }}
            onFocus={() => setExpanded(true)}
            onSubmit={submit}
            onClear={() => {
              setQuery("");
              fieldRef.current?.focus();
            }}
            onKeyDown={onInputKeyDown}
            autoFocus={!inline}
            comboboxProps={{
              role: "combobox",
              "aria-expanded": expanded && options.length > 0,
              "aria-controls": listboxId,
              "aria-autocomplete": "list",
              "aria-activedescendant":
                expanded && options[activeIndex]
                  ? optionId(activeIndex)
                  : undefined,
            }}
          />
        </div>

        <div
          className={inline ? styles.inlineDropdown : undefined}
          hidden={!expanded}
        >
          <div
            id={listboxId}
            role="listbox"
            aria-label="Suggestions"
            className={clsx(
              styles.listbox,
              options.length > 0 && styles.panelSection,
            )}
            hidden={options.length === 0}
          >
            {suggestions.length > 0 && (
              <div
                role="group"
                aria-label="Pages"
                className={styles.listboxGroup}
              >
                {suggestions.map((record, index) => (
                  <div
                    key={record.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={clsx(styles.option, styles["option--page"])}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => openPage(record)}
                  >
                    <span>
                      {highlight(record.title, query, { prefixOnly: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {recents.length > 0 && (
              <div
                role="group"
                aria-label="Recent searches"
                className={styles.listboxGroup}
              >
                {recents.map((recent, offset) => {
                  const index = suggestions.length + offset;
                  return (
                    <div
                      key={recent}
                      id={optionId(index)}
                      role="option"
                      aria-selected={index === activeIndex}
                      className={clsx(styles.option, styles["option--recent"])}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => submit(recent)}
                    >
                      <HistoryIcon aria-hidden="true" />
                      <span>{recent}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={clsx(styles.quickLinks, styles.panelSection)}>
            <div className={styles.quickLinksBody}>
              <p className={styles.quickLinksTitle} id={`${id}-quick-links`}>
                Quick Links
              </p>
              <ul
                className={styles.chips}
                aria-labelledby={`${id}-quick-links`}
              >
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={clsx(
                        "tds-chip",
                        "tds-chip--selection",
                        "tds-chip--selection-medium",
                        styles.chip,
                      )}
                      onClick={close}
                    >
                      <span className="tds-chip--text">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {trimmed && (
              <Link
                className={clsx(
                  "tds-link",
                  "tds-link--standalone",
                  styles.seeAll,
                )}
                to={searchUrl(trimmed, version, latestVersion)}
                onClick={() => {
                  addRecentSearch(trimmed);
                  close();
                }}
              >
                See all results
              </Link>
            )}
          </div>

          <div role="status" aria-live="polite" className="visually-hidden">
            {status}
          </div>
        </div>
      </div>
    </>
  );
}
