/**
 * Deterministic id for HTML templates.
 *
 * Templates used to hardcode ids ("event-name", "tabs-default", ...), so two
 * instances of a component on one page collided and their `for` /
 * `aria-controls` / `aria-describedby` wiring pointed at the wrong element.
 *
 * The id is derived from a hash of the template's props rather than from
 * Math.random(): two different examples get different ids, the same example
 * always gets the same id (so the code snippet shown to readers is stable and
 * server-rendered markup matches the client), and there is no counter to keep
 * in sync between server and browser.
 *
 * @param {string} prefix - readable prefix, e.g. 'tabs'
 * @param {...unknown} seeds - the props (or any values) that identify this instance
 * @returns {string} e.g. 'tabs-1k9x3q'
 */
export const uid = (prefix, ...seeds) => {
  const input = JSON.stringify(seeds, (_, value) =>
    typeof value === 'function' ? value.toString() : value,
  );

  // djb2 string hash, kept in 32-bit range.
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }

  return `${prefix}-${(hash >>> 0).toString(36)}`;
};

export default uid;
