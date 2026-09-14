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
import { useDocTitle } from '@site/src/hooks/useDocTitle';
import { useScriptSources } from './useScriptSources';

const CODE_TABS = [
  { id: 'html', label: 'HTML' },
  { id: 'js', label: 'JavaScript' },
];

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
 * @param {boolean} [props.hideScriptCode = false] - Hide the JavaScript tab (for demo-only scripts that are not part of the component)
 * @param {string} [props.title] - Accessible name of the example iframe; defaults to the caption or "Component example"
 * @param {string} [props.htmlLang = 'en'] - Language of the example markup ('et' for Estonian examples, WCAG 3.1.2)
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
  hideScriptCode = false,
  title,
  htmlLang = 'en',
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
  const docTitle = useDocTitle();
  const [isCodeVisible, setIsCodeVisible] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(mobilePreview);
  const [isDarkTheme, setIsDarkTheme] = React.useState(colorMode === 'dark');
  const [activeCodeTab, setActiveCodeTab] = React.useState('html');
  const tabIdPrefix = React.useId();

  // Same merge rule as CodePreviewIframe, so the snippet lists exactly what
  // the iframe loads.
  const allScripts = React.useMemo(
    () => [...(scriptPath ? [scriptPath] : []), ...(scriptPaths ?? [])],
    [scriptPath, scriptPaths],
  );
  const showScriptTab = !hideScriptCode && allScripts.length > 0;
  const scriptSources = useScriptSources(
    allScripts,
    isCodeVisible && showScriptTab,
  );

  // Derive the stylesheet path synchronously so the very first srcDoc already
  // links the right CSS. Computing it in an effect meant the first render
  // produced href="undefined" and relied on the browser re-navigating the
  // iframe when srcDoc changed; on a normal reload Chrome sometimes drops that
  // second navigation, leaving the example unstyled.
  const computedCssPath =
    cssPath ??
    `/tds${
      currentVersion
        ? currentVersion === 'Canary 🚧'
          ? '-next'
          : `-${currentVersion}`
        : `-${latestVersion}`
    }.min.css`;

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
      title={
        title ??
        (caption
          ? `${caption} example`
          : docTitle
            ? `${docTitle} example`
            : 'Component example')
      }
      htmlLang={htmlLang}
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
        hideScriptCode,
        title,
        htmlLang,
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
                  type="button"
                  className={styles.codePreview_iframeButton}
                  onClick={() => setIsCodeVisible(!isCodeVisible)}
                  aria-expanded={isCodeVisible}
                  aria-controls={`${tabIdPrefix}-code`}
                >
                  {isCodeVisible ? 'Hide Code' : 'Show Code'}
                  <ArrowDownSvg
                    aria-hidden="true"
                    focusable="false"
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
                          isActive={isMobile}
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
                      type="button"
                      onClick={openFullWidthPreview}
                      className={styles.codePreview_iframeButton}
                    >
                      View full screen
                    </button>
                  )}
                </div>
              </div>
            )}
            {isCodeVisible && !hideCode && !showScriptTab && (
              <div id={`${tabIdPrefix}-code`}>
                <CodeBlock language={lang} className="code-block">
                  {codeArr[0]?.code}
                </CodeBlock>
              </div>
            )}
            {isCodeVisible && !hideCode && showScriptTab && (
              <div id={`${tabIdPrefix}-code`}>
                <div
                  className={styles.codeTabs}
                  role="tablist"
                  aria-label="Example code"
                  onKeyDown={(event) => {
                    const index = CODE_TABS.findIndex(
                      (tab) => tab.id === activeCodeTab,
                    );
                    const last = CODE_TABS.length - 1;
                    const nextIndex = {
                      ArrowRight: index === last ? 0 : index + 1,
                      ArrowLeft: index === 0 ? last : index - 1,
                      Home: 0,
                      End: last,
                    }[event.key];
                    if (nextIndex === undefined) {
                      return;
                    }
                    event.preventDefault();
                    const next = CODE_TABS[nextIndex].id;
                    setActiveCodeTab(next);
                    document.getElementById(`${tabIdPrefix}-tab-${next}`)?.focus();
                  }}
                >
                  {CODE_TABS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      id={`${tabIdPrefix}-tab-${id}`}
                      aria-selected={activeCodeTab === id}
                      aria-controls={`${tabIdPrefix}-panel`}
                      tabIndex={activeCodeTab === id ? 0 : -1}
                      className={clsx(styles.codeTab, {
                        [styles.codeTabActive]: activeCodeTab === id,
                      })}
                      onClick={() => setActiveCodeTab(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div
                  id={`${tabIdPrefix}-panel`}
                  role="tabpanel"
                  aria-labelledby={`${tabIdPrefix}-tab-${activeCodeTab}`}
                  tabIndex={0}
                >
                  {activeCodeTab === 'html' ? (
                    <CodeBlock language={lang} className="code-block">
                      {codeArr[0]?.code}
                    </CodeBlock>
                  ) : (
                    <CodeBlock language="js" className="code-block">
                      {scriptSources.text}
                    </CodeBlock>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default CodePreview;
