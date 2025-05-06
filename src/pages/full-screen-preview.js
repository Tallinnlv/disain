import React, { useEffect, useState } from 'react';
import CodePreview from '@site/src/components/CodePreview';
import styles from './full-preview.module.scss';
import { ColorModeProvider } from '@docusaurus/theme-common/internal';

export default function FullPreview() {
  const [iframeData, setIframeData] = useState(null);

  useEffect(() => {
    // Retrieve iframe data from sessionStorage
    const data = sessionStorage.getItem('iframeContent');
    if (data) {
      const parsedData = JSON.parse(data);
      setIframeData(parsedData);
    }

    // Add event listener for Escape key
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        history.back();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const calculateCssPath = (currentVersion, latestVersion) => {
    if (!currentVersion && !latestVersion) return '/tds.min.css';
    if (currentVersion === 'Canary 🚧') return '/tds-next.min.css';
    return `/tds-${currentVersion || latestVersion}.min.css`;
  };

  if (!iframeData) {
    return <div>Loading...</div>;
  }

  const {
    iframeContent: code,
    minHeight,
    width,
    showDimensions,
    orientationVertical,
    showElementButtons,
    scriptPath,
    scriptPaths,
    currentVersion,
    latestVersion,
  } = iframeData;

  const recalculatedCssPath = calculateCssPath(currentVersion, latestVersion);

  // Removed handleClose function as it was redundant.

  return (
    <>
      <div className={styles.fullWidthContainer}>
        <button
          style={{ marginBottom: '10px' }}
          className="tds-button tds-button--tertiary-neutral"
          onClick={() => history.back()}
        >
          Close
        </button>
        <ColorModeProvider>
          <CodePreview
            code={code}
            minHeight={minHeight}
            width={width}
            showDimensions={true}
            showOpenFullWidth={false}
            orientationVertical={orientationVertical}
            showElementButtons={true}
            scriptPath={scriptPath}
            scriptPaths={scriptPaths}
            cssPath={recalculatedCssPath} // Pass recalculated value
          />
        </ColorModeProvider>
      </div>
    </>
  );
}
