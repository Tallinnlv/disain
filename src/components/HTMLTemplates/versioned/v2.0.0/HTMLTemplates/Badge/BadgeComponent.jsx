import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {string} [props.badgeText] - The text of the badge
 * @param {string} [props.badgeColor] - The color of the badge
 * @param {string} [props.badgeSize] - The size of the badge
 * @param {boolean} [props.badgeDot] - The bade is dot or not
 * @param {string} [props.badgeDotSize = 'large'] - The size of the dot
 * @param {string} [props.iconSvg] - Source URL for an icon to display with the badge
 * @param {string} [props.iconPosition = 'right'] - Position of the badge relative to the icon ('left', 'right', 'top', 'bottom')
 * @param {boolean} [props.badgeWithIcon] - Position of the badge relative to the icon ('left', 'right', 'top', 'bottom')
 * @param {string} [props.ariaLabel] - Accessible label for screen readers
 * @param {boolean} [props.isHidden = false] - Whether to hide the badge from screen readers
 */

const BadgeComponent = ({
  badgeText,
  badgeColor,
  badgeSize,
  badgeDot = false,
  badgeDotSize = 'large',
  iconSvg,
  iconPosition = 'default',
  badgeWithIcon = false,
  ariaLabel,
  isHidden = false,
}) => {
  const fontSize =
    badgeSize === 'xsmall'
      ? ' tds-badge__text--xsmall'
      : badgeSize === 'small'
        ? ' tds-badge__text--small'
        : badgeSize === 'medium'
          ? ' tds-badge__text--medium'
          : '';

  let fontBold = '';

  if (badgeSize === 'xsmall' || badgeSize === 'small') {
    fontBold = ' tds-badge__text--bold';
  }

  const dotSize = badgeDotSize === 'small' ? ' tds-badge--dot-small' : '';

  const a11yAttributes = ariaLabel
    ? ` role="status" aria-label="${ariaLabel}"`
    : isHidden
      ? ' aria-hidden="true"'
      : badgeText
        ? ''
        : ' aria-hidden="true"';

  const badgeElement = html`
    <span class="tds-badge tds-badge--${badgeColor}${badgeDot ? ' tds-badge--dot' : ''}${dotSize}${badgeSize ? ` tds-badge--${badgeSize}` : ''}"${a11yAttributes}>${!badgeText ? `</span>` : ''}
      ${badgeText ? `<span class="tds-badge__text${fontSize}${fontBold}">${badgeText}</span>` : ''}
    ${badgeText ? `</span>` : ''}`;

  if (badgeWithIcon) {
    return html`
<span class="tds-badge tds-badge--${badgeColor}${badgeDot ? ' tds-badge--dot' : ''}${dotSize}${badgeSize ? ` tds-badge--${badgeSize}` : ''}"${a11yAttributes}>
  ${iconSvg ? `<span class="tds-icon" aria-hidden="true">
    ${iconSvg}
  </span>` : ''}
  ${badgeText ? `<span class="tds-badge__text${fontSize}${fontBold}">${badgeText}</span>` : ''}
</span>
    `;
  }

  if (!iconSvg) {
    return badgeElement;
  }

  return html`
<div style="position: relative; display: inline-flex; align-items: center;">
  <div style="display: block;" aria-hidden="${!!ariaLabel}">${iconSvg}</div>
  <span style="position: absolute; ${getPositionStyle(iconPosition)}"${a11yAttributes}>
    ${badgeElement}
  </span>
</div>
  `;
};

const getPositionStyle = (position) => {
  switch (position) {
    default:
      return 'top: -4px; right: 5px;';
  }
};

export default BadgeComponent;
