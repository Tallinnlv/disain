// Docusaurus 3.3 exports useDoc from theme-common/internal (it moves to
// @docusaurus/plugin-content-docs/client in 3.5+).
import { useDoc } from '@docusaurus/theme-common/internal';

/**
 * Title of the docs page currently rendering, or null outside a docs page
 * (e.g. the full-screen preview route). Used to give example iframes a
 * meaningful accessible name such as "Phone input example".
 */
export const useDocTitle = () => {
  try {
    return useDoc().metadata.title ?? null;
  } catch (error) {
    return null;
  }
};

export default useDocTitle;
