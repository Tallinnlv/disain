import { useActiveVersion } from '@docusaurus/plugin-content-docs/client';

export const useCurrentVersion = () => {
  if (typeof window === 'undefined') {
    console.error('getCurrentVersion called during SSR. Returning null.');
    return null; // Avoid calling during SSR
  }

  try {
    const activeVersion = useActiveVersion('default'); // Explicitly provide pluginId
    return activeVersion?.label ?? null;
  } catch (error) {
    console.error('Error using useActiveVersion:', error);
    return null;
  }
};
