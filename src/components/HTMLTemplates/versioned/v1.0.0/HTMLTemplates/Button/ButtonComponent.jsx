/**
 * @param {object} props
 * @param {string} [props.content] - The content of the button
 * @param {string} [props.buttonModifiers] - Additional CSS classes
 * @param {boolean} [props.iconLeft = false] - Icon on the left
 * @param {boolean} [props.iconRight = false] - Icon on the right
 * @param {boolean} [props.compact = false] - Compact size of button
 * @param {boolean} [props.compactM = false] - Compact size of button tertiary
 * @param {boolean} [props.isLoading = false] - Loading state of button
 * @param {boolean} [props.isDisabled = false] - Button disabled
 * @param {string} [props.iconAriaLabel] - Icon aria label
 */

function ButtonComponent({
  buttonModifiers,
  iconLeft = false,
  iconRight = false,
  compact = false,
  compactM = false,
  isLoading = false,
  isDisabled = false,
  iconAriaLabel = 'Sulge',
  content,
}) {
  const html = String.raw;

  const isTertiary =
    buttonModifiers.includes('tds-button--tertiary') ||
    buttonModifiers.includes('tds-button--tertiary-neutral');
  const isIcon = buttonModifiers.includes('tds-button--icon');
  const isLoadingA11y = buttonModifiers.includes('is-loading');
  const isDisabledA11y = buttonModifiers.includes('is-disabled');

  return html`
    <button
      type="button"
      class="${!isIcon ? 'tds-button' : ''} ${buttonModifiers} ${iconLeft
        ? 'tds-button--icon-left'
        : ''} ${iconRight ? 'tds-button--icon-right' : ''} ${compact
        ? 'tds-button--compact'
        : ''} ${compactM ? 'tds-button--compact-m' : ''} ${isLoading
        ? 'is-loading'
        : ''} ${isDisabled ? 'is-disabled' : ''}"
      ${isIcon ? `aria-label="${iconAriaLabel}"` : ''}
      ${isLoadingA11y
        ? html`aria-label="Laadimine, palun oodake" aria-busy="true"`
        : ''}
      ${isDisabledA11y ? html`aria-disabled="true"` : ''}
    >
      ${iconLeft
        ? html`<svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            role="presentation"
            aria-hidden="true"
            focusable="false"
          >
            <title id="leftIconTitle">Left Icon</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 11V4H13V11H20V13H13V20H11V13H4V11H11Z"
              fill="white"
            />
          </svg>`
        : ''}
      ${content}
      ${iconRight
        ? html`
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              role="presentation"
              aria-hidden="true"
              focusable="false"
            >
              <title id="rightIconTitle">Right Icon</title>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.5858 11L13.2929 5.70706L14.7071 4.29285L22.4142 12L14.7071 19.7071L13.2929 18.2928L18.5858 13H2V11H18.5858Z"
                fill="white"
              />
            </svg>
          `
        : ''}
    </button>
  `;
}

export default ButtonComponent;
