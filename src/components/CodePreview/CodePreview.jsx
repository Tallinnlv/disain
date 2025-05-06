import * as React from 'react';
import clsx from 'clsx';
import { useColorMode } from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';
import { useHistory } from 'react-router-dom';
import styles from './CodePreview.module.scss';
import Toggle from '../Toggle/Toggle';
import ArrowDownSvg from '@site/static/img/icons/chevron-down.svg';
import UsageGuideline from '@site/src/components/UsageGuideline';
import CodePreviewIframe from '@site/src/components/CodePreviewIframe';
import { useCurrentVersion } from '@site/src/hooks/useCurrentVersion';
import { useLatestVersion } from '@site/src/hooks/useLatestVersion';

/**
 * @typedef {Object} Code
 * @property {string} code - HTML code or any other code to be rendered inside the iframe
 */

/**
 * @param {object} props
 * @param {string  | Code[]} [props.code] - The source code to be rendered inside the iframe
 * @param {string} [props.scriptPath] - Path to the script file
 * @param {array} [props.scriptPaths] - Paths to the script files
 * @param {string} [props.svgPath] - Path to the svg file
 * @param {string} [props.customSvgWidth] - custom SVG width
 * @param {string} [props.customGap] - custom gap size for the showcase container
 * @param {string} [props.lang = html] - The language of the code
 * @param {boolean} [props.hideCode = false] - Whether to hide the code block
 * @param {boolean} [props.darkBg = false] - Whether to use a dark background on showcase
 * @param {string} [props.minHeight] - Min height for iFrame container
 * @param {object} [props.style] - Inline style for the showcase container
 * @param {string} [props.width] - Inline width for the showcase container
 * @param {boolean} [props.orientationVertical] - Vertical orientation for the showcase container
 * @param {boolean} [props.showToggle] - Show toggle for Mobile or Desktop switch view
 * @param {boolean} [props.mobilePreview] - Make mobile preview as default
 * @param {boolean} [props.noPaddingInBody] - Remove padding in body
 * @param {string} [props.caption] - Caption for the code preview
 * @param {boolean} [props.displayBlock] - Display block for showcase container
 * @param {boolean} [props.displayNone] - Display none for showcase container
 * @param {boolean} [props.borderNone] - Border none for showcase container
 * @param {boolean} [props.setBorderBottom] - Border bottom for showcase container
 * @param {'permitted'|'prohibited'} [props.guideline] - Show usage guideline
 * @param {boolean} [props.showDimensions] - Show dimensions of showcase container
 * @param {boolean} [props.showElementButtons] - Show buttons of showcase container (mobile/desktop/darkmode)
 * @param {boolean} [props.showOpenFullWidth] - Show open full width of showcase container
 * @param {string} [props.cssPath] - Show open full width of showcase container
 * @param {string} [props.latestVersion] - Show open full width of showcase container
 * @param {string} [props.currentVersion] - Show open full width of showcase container
 */
export function CodePreview({
  code,
  lang = 'html',
  hideCode = false,
  darkBg,
  minHeight = '130px',
  scriptPath,
  svgPath,
  showDimensions,
  customSvgWidth,
  customGap,
  width,
  displayBlock,
  displayNone,
  mobilePreview = false,
  caption,
  guideline,
  cssPath,
  setBorderBottom,
  borderNone = false,
  noPaddingInBody = false,
  orientationVertical = false,
  showOpenFullWidth = true,
  showElementButtons = false,
  scriptPaths,
}) {
  const { colorMode } = useColorMode();
  const history = useHistory();

  const currentVersion = useCurrentVersion();
  const latestVersion = useLatestVersion();
  const [isCodeVisible, setIsCodeVisible] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(mobilePreview);
  const [isDarkTheme, setIsDarkTheme] = React.useState(colorMode === 'dark');
  const [computedCssPath, setCssPath] = React.useState(cssPath);

  React.useEffect(() => {
    if (cssPath) {
      return; // Skip recalculation if cssPath is provided
    }
    const newCssPath = `/tds${
      currentVersion
        ? currentVersion === 'Canary 🚧'
          ? '-next'
          : `-${currentVersion}`
        : `-${latestVersion}`
    }.min.css`;

    setCssPath(newCssPath);
  }, [currentVersion, latestVersion]);

  React.useEffect(() => {
    const updateThemeFromSystem = () => {
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setIsDarkTheme(systemPrefersDark);
    };

    updateThemeFromSystem();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateThemeFromSystem);

    return () => {
      mediaQuery.removeEventListener('change', updateThemeFromSystem);
    };
  }, []);

  const codeArr = Array.isArray(code) ? code : [{ title: 'Default', code }];

  const iframe = (
    <CodePreviewIframe
      isMobile={isMobile}
      theme={isDarkTheme ? 'dark' : 'light'}
      minHeight={minHeight}
      width={width}
      code={codeArr[0]?.code}
      svgPath={svgPath}
      customSvgWidth={customSvgWidth}
      scriptPath={scriptPath}
      scriptPaths={scriptPaths}
      darkBg={darkBg}
      customGap={customGap}
      noPaddingInBody={noPaddingInBody}
      orientationVertical={orientationVertical}
      displayBlock={displayBlock}
      displayNone={displayNone}
      setBorderBottom={setBorderBottom}
      showDimensions={showDimensions}
      cssPath={computedCssPath}
      style={{
        border: borderNone ? 'none' : undefined,
      }}
    />
  );

  const openFullWidthPreview = () => {
    sessionStorage.setItem(
      'iframeContent',
      JSON.stringify({
        iframeContent: codeArr[0]?.code,
        theme: isDarkTheme ? 'dark' : 'light',
        cssPath,
        darkBg,
        minHeight,
        scriptPath,
        scriptPaths,
        width,
        customGap,
        showDimensions,
        orientationVertical,
        showElementButtons,
        currentVersion,
        latestVersion,
      }),
    );
    history.push('/full-screen-preview');
  };

  return (
    <>
      {guideline ? (
        <UsageGuideline permitted={guideline === 'permitted'}>
          {iframe}
        </UsageGuideline>
      ) : (
        <>
          {caption && (
            <p className={styles.codePreview_description}>{caption}</p>
          )}
          <div className={styles.codePreviewWrapper}>
            {iframe}
            {!hideCode && (
              <div className={styles.codePreviewFooter}>
                <button
                  className={styles.codePreview_iframeButton}
                  onClick={() => setIsCodeVisible(!isCodeVisible)}
                >
                  {isCodeVisible ? 'Hide Code' : 'Show Code'}
                  <ArrowDownSvg
                    className={clsx(styles.arrowIcon, {
                      [styles.arrowDown]: isCodeVisible,
                    })}
                  />
                </button>
                <div style={{ display: 'flex', gap: '32px' }}>
                  {showElementButtons && (
                    <div className={styles.codePreview_iframeButtons}>
                      <div className={styles.codePreview_screenSizes}>
                        <Toggle
                          toggleType="view"
                          onChange={(isMobileView) => {
                            setIsMobile(isMobileView);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <Toggle
                    toggleType="theme"
                    onChange={(isDarkMode) => {
                      setIsDarkTheme(isDarkMode); // Update local theme state
                    }}
                    isActive={isDarkTheme} // Sync with local theme state
                  />

                  {showOpenFullWidth && (
                    <button
                      onClick={openFullWidthPreview}
                      className={styles.codePreview_iframeButton}
                      formTarget="_blank"
                    >
                      View full screen
                    </button>
                  )}
                </div>
              </div>
            )}
            {isCodeVisible && !hideCode && (
              <CodeBlock language={lang} className="code-block">
                {codeArr[0]?.code}
              </CodeBlock>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default CodePreview;
