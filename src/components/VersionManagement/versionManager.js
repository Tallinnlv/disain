import { useCurrentVersion } from '@site/src/hooks/useCurrentVersion';

export const useVersionManager = () => {
  const currentVersion = useCurrentVersion() || 'canary'; // Default to Canary if no version

  return {
    getVersion: () => currentVersion,
    isDefault: () => currentVersion === 'canary',
  };
};
