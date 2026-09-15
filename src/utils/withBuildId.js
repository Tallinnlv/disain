/**
 * Appends `?v=<buildId>` to a same-origin asset URL so each deploy gets a
 * fresh URL. External (http/https) URLs and missing values pass through.
 *
 * @param {string} url
 * @param {string} [buildId]
 * @returns {string}
 */
export function withBuildId(url, buildId) {
  if (!url || !buildId || /^https?:\/\//i.test(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(buildId)}`;
}

export default withBuildId;
