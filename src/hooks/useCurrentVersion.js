import { useActiveVersion } from '@docusaurus/plugin-content-docs/client';

export const useCurrentVersion = () => {
  // useActiveVersion is SSR-safe (it reads the router location), so we call it
  // unconditionally. Returning null on the server made the server-rendered
  // markup differ from the client (e.g. a Canary page linking the 2.0.0 CSS),
  // and React does not patch attribute mismatches during hydration.
  try {
    const activeVersion = useActiveVersion('default'); // Explicitly provide pluginId
    return activeVersion?.label ?? null;
  } catch (error) {
    console.error('Error using useActiveVersion:', error);
    return null;
  }
};
