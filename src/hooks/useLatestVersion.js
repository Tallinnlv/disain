import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';

export const useLatestVersion = () => {
  const allDocsData = useAllDocsData();

  // Find the latest version from all docs data
  const latestVersion = Object.values(allDocsData).reduce(
    (latest, pluginData) => {
      const version = pluginData.versions.find((v) => v.isLast);
      return version ? version.label : latest;
    },
    '',
  );

  return latestVersion || null; // Return the latest version or null
};
