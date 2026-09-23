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
 * @param {string} [props.ariaLabel] - Text read by screen readers instead of the visible badge text (rendered as visually hidden text)
 * @param {boolean} [props.isHidden = false] - Whether to hide the badge from screen readers
 * @param {boolean} [props.live = false] - Announce changes of the badge content (adds role="status")
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
  live = false,
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

  // A static badge is not a live region; role="status" is opt-in. A badge
  // with neither text nor a screen reader label is decorative.
  const hidden = isHidden || (!badgeText && !ariaLabel);
  const a11yAttributes = hidden
    ? ' aria-hidden="true"'
    : live
      ? ' role="status"'
      : '';

  const badgeClass = `tds-badge tds-badge--${badgeColor}${badgeDot ? ' tds-badge--dot' : ''}${dotSize}${badgeSize ? ` tds-badge--${badgeSize}` : ''}`;

  // Screen reader text: the visible text, or the ariaLabel override rendered
  // as visually hidden text (aria-label is not allowed on a plain span).
  const srText = ariaLabel && !hidden
    ? `<span class="tds-visually-hidden">${ariaLabel}</span>`
    : '';

  const textHtml = badgeText
    ? `<span class="tds-badge__text${fontSize}${fontBold}">${srText ? `<span aria-hidden="true">${badgeText}</span>${srText}` : badgeText}</span>`
    : srText;

  const badgeElement = html`
<span class="${badgeClass}"${a11yAttributes}>${textHtml ? `
  ${textHtml}
` : ''}</span>`;

  if (badgeWithIcon) {
    return html`
<span class="${badgeClass}"${a11yAttributes}>
  ${iconSvg ? `<span class="tds-icon" aria-hidden="true">
    ${iconSvg}
  </span>` : ''}
  ${textHtml}
</span>
    `;
  }

  if (!iconSvg) {
    return badgeElement;
  }

  return html`
<div style="position: relative; display: inline-flex; align-items: center;" data-demo-style="">
  <div style="display: block;" data-demo-style="">${iconSvg}</div>
  <span style="position: absolute; ${getPositionStyle(iconPosition)}" data-demo-style="">
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
