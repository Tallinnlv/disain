import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

const TRUNCATE_AT = 20;

const getIconInputSvg = (size) => {
  if (size === 'medium') {
    return html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="tds-chip--input__icon" aria-hidden="true" focusable="false">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00038 8.94282L3.80511 13.1381L2.8623 12.1953L7.05757 8.00001L2.8623 3.80475L3.80511 2.86194L8.00038 7.0572L12.1956 2.86194L13.1384 3.80475L8.94318 8.00001L13.1384 12.1953L12.1956 13.1381L8.00038 8.94282Z" fill="currentColor"/>
    </svg>`;
  } else if (size === 'small') {
    return html`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" class="tds-chip--input__icon" aria-hidden="true" focusable="false">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.00004 6.70708L2.85359 9.85353L2.14648 9.14642L5.29293 5.99998L2.14648 2.85353L2.85359 2.14642L6.00004 5.29287L9.14649 2.14642L9.85359 2.85353L6.70714 5.99998L9.85359 9.14642L9.14649 9.85353L6.00004 6.70708Z" fill="currentColor"/>
    </svg>`;
  }

  return html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="tds-chip--input__icon" aria-hidden="true" focusable="false">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99974 11.1785L4.75566 16.4226L3.57715 15.2441L8.82123 9.99998L3.57715 4.7559L4.75566 3.57739L9.99974 8.82147L15.2438 3.57739L16.4223 4.7559L11.1782 9.99998L16.4223 15.2441L15.2438 16.4226L9.99974 11.1785Z" fill="currentColor"/>
    </svg>`;
};

const getTooltip = (content, id) => {
  return html`<div id="${id}" class="tds-tooltip" role="tooltip" data-position="top" style="z-index: 1000;" data-demo-style="">${content}</div>`;
};

/**
 * Chip label. When truncated, the shortened text is shown visually and the
 * full text stays available to assistive technology.
 */
const getText = (content, truncated, customTextStyle) => {
  const styleAttr = customTextStyle ? ` style="${customTextStyle}" data-demo-style=""` : '';

  if (!truncated) {
    return html`<span class="tds-chip--text"${styleAttr}>${content}</span>`;
  }

  return html`<span class="tds-chip--text"${styleAttr}><span aria-hidden="true">${content.slice(0, TRUNCATE_AT)}...</span><span class="tds-visually-hidden">${content}</span></span>`;
};

/**
 * @param {object} props
 * @param {string} [props.id] - Base id for the tooltip (generated when omitted)
 * @param {string} [props.chipSize = 'large'] - The size variant of the Chip ('large', 'medium', 'small')
 * @param {string} [props.variant] - The variant of the Chip ('selection', 'input')
 * @param {boolean} [props.selected] - Determines whether the Selection Chip state is selected or not
 * @param {boolean} [props.iconLeft] - Determines whether to show icon on left side
 * @param {string} [props.customIcon] - Custom icon svg to be shown on the left side
 * @param {boolean} [props.truncate = true] - Determines whether long content text should be truncated and tooltip shown or not
 * @param {string} [props.customTextStyle] - Custom style to be used on the tds-chip--text element
 * @param {string} [props.content] - The content/label/title of the Chip
 * @param {string} [props.removeLabel = 'Eemalda'] - Accessible name prefix of the input chip's remove button
 */

const ChipComponent = (props) => {
  const {
    chipSize = 'large',
    selected,
    variant,
    iconLeft,
    customIcon,
    truncate = true,
    customTextStyle,
    content = '',
    removeLabel = 'Eemalda',
  } = props;

  const id = props.id ?? uid('chip', props);
  const truncated = truncate && content.length > TRUNCATE_AT;
  const tooltipId = truncated ? `${id}-tooltip` : '';

  if (variant === 'selection') {
    return html`
<button type="button" class="tds-chip tds-chip--selection tds-chip--selection-${chipSize}${selected ? ' tds-chip--selected' : ''}${tooltipId ? ' tooltip-target' : ''}" aria-pressed="${selected ? 'true' : 'false'}"${tooltipId ? ` aria-describedby="${tooltipId}" data-position="top"` : ''}>
  ${iconLeft && customIcon && chipSize !== 'small' ? customIcon : ''}
  ${content ? getText(content, truncated, customTextStyle) : ''}
</button>
${tooltipId ? getTooltip(content, tooltipId) : ''}
  `;
  }

  return html`
<div class="tds-chip tds-chip--input tds-chip--input-${chipSize}${tooltipId ? ' tooltip-target' : ''}"${tooltipId ? ` aria-describedby="${tooltipId}" data-position="top"` : ''}>
  ${iconLeft && customIcon && chipSize !== 'small' ? customIcon : ''}
  ${content ? getText(content, truncated, customTextStyle) : ''}
  <button type="button" class="tds-chip--input__button" aria-label="${removeLabel}${content ? ` ${content}` : ''}">
    ${getIconInputSvg(chipSize)}
  </button>
</div>
${tooltipId ? getTooltip(content, tooltipId) : ''}
  `;
};

export default ChipComponent;
