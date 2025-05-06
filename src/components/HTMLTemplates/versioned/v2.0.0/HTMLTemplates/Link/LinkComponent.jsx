import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {string} [props.content] - The content before the link
 * @param {string} [props.linkTitle] - The title of the link
 * @param {string} [props.linkModifiers] - Additional CSS classes
 * @param {boolean} [props.iconLeft = false] - Default icon on the left
 * @param {boolean } [props.iconRight = false] - Default icon on the right
 * @param {boolean} [props.compact = false] - Compact size of link
 * @param {boolean} [props.isDisabled = false] - Link disabled
 * @param {boolean} [props.asButton = false] - Render as button
 * @param {string} [props.customIconLeft] - Custom left icon
 * @param {string} [props.customIconRight] - Custom right icon
 * @param {string} [props.bodySize] - Size of body text
 */

const LinkComponent = ({
  linkModifiers = '',
  iconLeft = false,
  iconRight = false,
  compact = false,
  isDisabled = false,
  asButton = false,
  bodySize,
  customIconLeft,
  customIconRight,
  linkTitle,
  content,
}) => {
  const isTertiary =
    linkModifiers.includes('tds-link--tertiary') ||
    linkModifiers.includes('tds-link--tertiary-neutral');
  const isIcon = linkModifiers.includes('tds-link--tds-icon');

  const bodyClass =
    bodySize === 'lg'
      ? 'tds-body-lg'
      : bodySize === 'md'
        ? 'tds-body-md'
        : bodySize === 'sm'
          ? 'tds-body-sm'
          : 'tds-body-md';

  const shouldShowDiv = (bodySize && bodyClass) || content;

  const linkHtml = html`
<a class="${!isIcon ? asButton ? 'tds-button' : 'tds-link' : ''} ${linkModifiers}${!isTertiary && iconLeft ? asButton ? ' tds-button--icon-left' : ' tds-link--icon-left' : ''}${!isTertiary && iconRight ? asButton ? ' tds-button--icon-right' : ' tds-link--icon-right' : ''}${compact ? asButton ? ' tds-button--compact' : ' tds-link--compact' : ''}${isDisabled ? ' is-disabled' : ''}"${isDisabled ? ' aria-disabled="true"' : ''} href="javascript:void(0);" target="_self">
  ${customIconLeft
  ? customIconLeft
  : iconLeft
    ? html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13 14.5858V2H11V14.5858L5.70712 9.29289L4.29291 10.7071L12 18.4142L19.7071 10.7071L18.2929 9.29289L13 14.5858ZM4 22H20V20H4V22Z" fill="#0060AD" />
  </svg>` : ''}
  ${shouldShowDiv ? `  ${linkTitle}` : linkTitle}
  ${customIconRight
  ? customIconRight
  : iconRight
    ? html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5858 11L11.2929 5.70706L12.7071 4.29285L20.4142 12L12.7071 19.7071L11.2929 18.2928L16.5858 13H3V11H16.5858Z" fill="#0060AD" />
  </svg>`
    : ''}
${shouldShowDiv ? `  </a>` : `</a>`}
  `;

  if (shouldShowDiv) {
    return html`
<div class="${bodyClass}">
  ${content ? `<span class="tds-body-content">${content}</span>` : ''}
  ${linkHtml}
</div>
    `;
  }

  return linkHtml;
};

export default LinkComponent;
