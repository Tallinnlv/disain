const KEY = 'tds-search-recent';
const MAX = 5;

export function getRecentSearches() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query) {
  const q = query.trim();
  if (!q) return;
  try {
    const next = [q, ...getRecentSearches().filter((s) => s !== q)].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode, blocked); recents are a convenience.
  }
}
