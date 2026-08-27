import React from 'react';
import styles from './CodePreviewIframe.module.scss';
import { useCurrentVersion } from '@site/src/hooks/useCurrentVersion';
import { useLatestVersion } from '@site/src/hooks/useLatestVersion';
import { html as htmlCode } from '@site/src/utils/html';

const IFRAME_WIDTH = {
  MOBILE: '590px',
  DESKTOP: '100%',
};

/**
 * @param {object} props
 * @param {boolean} [props.isMobile=false] - Indicator of whether the preview is mobile or not.
 * @param {string} [props.theme='light'] - Theme of the iframe
 * @param {object} [props.style] - className for the showcase container
 * @param {string} [props.minHeight] - Min height for iFrame container
 * @param {string} [props.width] - Inline width for the showcase container
 * @param {string} [props.code] - HTML code or any other code to be rendered inside the iframe
 * @param {string} [props.scriptPath] - Path to the script file
 * @param {array} [props.scriptPaths] - Array path to the script files
 * @param {string} [props.svgPath] - Path to the SVG file
 * @param {string} [props.customSvgWidth] - custom SVG width
 * @param {string} [props.customGap] - Custom gap size for the showcase container
 * @param {boolean} [props.darkBg = false] - Whether to use a dark background on showcase
 * @param {boolean} [props.orientationVertical] - Vertical orientation for the showcase container
 * @param {boolean} [props.noPaddingInBody] - Remove padding in body
 * @param {boolean} [props.displayBlock] - Display block for showcase container
 * @param {boolean} [props.displayNone] - Display none for showcase container
 * @param {boolean} [props.setBorderBottom] - Set border bottom for showcase container
 * @param {boolean} [props.hideCode] - Display block for showcase container
 * @param {boolean} [props.showDimensions] - Show dimensions of showcase container
 * @param {string} [props.cssPath] - Show dimensions of showcase container
 */
const CodePreviewIframe = ({
  isMobile,
  theme = 'light',
  minHeight = '130px',
  width,
  code,
  scriptPath,
  scriptPaths = [],
  svgPath,
  customSvgWidth,
  darkBg,
  noPaddingInBody,
  orientationVertical,
  customGap,
  style,
  displayBlock,
  displayNone,
  cssPath,
  setBorderBottom,
  showDimensions = false,
}) => {
  const html = String.raw;

  // Only process (and validate) actual markup: some previews have no code
  // prop, and htmlCode`${undefined}` would produce the literal string
  // "undefined", which the validators then flag as a fake component.
  if (code != null) {
    code = htmlCode`${code}`;
  }

  // Merge single scriptPath into scriptPaths for backward compatibility
  const allScripts = [...(scriptPath ? [scriptPath] : []), ...scriptPaths];

  return (
    <div
      style={{
        borderBottom: setBorderBottom ? '2px solid #dcdfe0' : undefined,
      }}
    >
      <iframe
        className={styles.root}
        width={isMobile ? IFRAME_WIDTH.MOBILE : IFRAME_WIDTH.DESKTOP}
        style={{
          background: darkBg ? '#002652' : '#FFFFFF',
          height: parseInt(minHeight) < 111 ? '140px' : undefined, // default value for height if minHeight is < 110px
          minHeight: parseInt(minHeight) >= 111 ? minHeight : undefined,
          display: displayNone ? 'none' : undefined,
          ...style,
        }}
        srcDoc={html`
          <!doctype html>
          <html lang="en" data-ts-theme="${theme}" style="overflow: hidden">
            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>Sandbox</title>
              <link href="${cssPath}" rel="stylesheet" />
              ${allScripts
                .map(
                  (scriptUrl) => `<script defer src="${scriptUrl}"></script>`,
                )
                .join('\n')}
              <style>
                body {
                  margin: 0;
                  padding: ${noPaddingInBody
                  ? '0'
                  : svgPath
                    ? '0'
                    : '3rem 1.5rem'};
                  display: block;
                  font-size: 1.125rem;
                  box-sizing: border-box;
                  background-color: ${theme === 'dark'
                  ? svgPath
                    ? '#ffffff'
                    : '#1b1b1d'
                  : '#ffffff'};
                      ${showDimensions
                  ? `.dimension-display {
                  position: absolute;
                  margin-top: -40px;
                  font-family: 'Lab Grotesque';
                  font-size: 16px;
                  color: var(--color-content-default);
                  }`
                  : ''}
                }
              </style>
            </head>
            <body>
              ${showDimensions
                ? '<div class="dimension-display" id="dimensionDisplay"></div>'
                : ''}
              <div
                style="${displayBlock
                  ? 'display: block;'
                  : 'display: flex;'} justify-content: center; align-items: center; ${orientationVertical
                  ? `gap: ${customGap || '12px'}; flex-direction: column; align-items: center;`
                  : `gap: ${customGap || '32px'};`}"
              >
                ${width
                  ? `<div style="width: ${width}">${svgPath ? `<img src="${svgPath}" alt="SVG Image" />` : code}</div>`
                  : svgPath
                    ? `<img src="${svgPath}"  style="width: ${customSvgWidth ? customSvgWidth : '100%'}; height: auto;"  height: auto;" alt="SVG Image" />`
                    : code}
              </div>
              <script>
                function updateDimensions() {
                  const dimensionDisplay =
                    document.getElementById('dimensionDisplay');
                  if (dimensionDisplay) {
                    dimensionDisplay.textContent =
                      'Width: ' + document.documentElement.clientWidth + 'px';
                  }
                }

                ${showDimensions
                  ? `updateDimensions(); window.addEventListener('resize', updateDimensions);`
                  : ''};
              </script>
            </body>
          </html>
        `}
      ></iframe>
    </div>
  );
};

export default CodePreviewIframe;
