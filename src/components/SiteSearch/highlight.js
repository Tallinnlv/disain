import React from 'react';

const EXCERPT_LENGTH = 220;

export function queryTerms(query) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((t) => t.length >= 2);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Matches words that start with any of the query terms (MiniSearch runs
// with prefix matching, so this mirrors what it matched on).
function termPattern(terms) {
  if (!terms.length) return null;
  const alternatives = terms.map(escapeRegExp).join('|');
  return new RegExp(`(?<![\\p{L}\\p{N}])(${alternatives})(\\p{L}|\\p{N})*`, 'giu');
}

export function matchesTitle(title, query) {
  const pattern = termPattern(queryTerms(query));
  return Boolean(pattern && title && pattern.test(title));
}

// Returns React nodes with every matching word wrapped in <mark>. When
// `prefixOnly` is set only the matched prefix is wrapped, as in the
// suggestion rows of the design ("Sel" bold in "Select").
export function highlight(text, query, { prefixOnly = false } = {}) {
  const pattern = termPattern(queryTerms(query));
  if (!pattern || !text) return text;
  const nodes = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    const matched = prefixOnly ? match[1] : match[0];
    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(<mark key={key++}>{matched}</mark>);
    last = start + matched.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// The description when it contains a match, else a window of the body
// text around the first match, else the start of the description/body.
export function excerpt(record, query) {
  const pattern = termPattern(queryTerms(query));
  const { description = '', text = '' } = record;
  if (pattern && pattern.test(description)) return description;
  if (pattern) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      const start = Math.max(0, match.index - EXCERPT_LENGTH / 3);
      let snippet = text.slice(start, start + EXCERPT_LENGTH);
      if (start > 0) snippet = `…${snippet.replace(/^\S*\s/, '')}`;
      if (start + EXCERPT_LENGTH < text.length)
        snippet = `${snippet.replace(/\s\S*$/, '')}…`;
      return snippet;
    }
  }
  const base = description || text;
  return base.length > EXCERPT_LENGTH
    ? `${base.slice(0, EXCERPT_LENGTH).replace(/\s\S*$/, '')}…`
    : base;
}
