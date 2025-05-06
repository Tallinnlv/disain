/**
 * @param {object} props
 * @param {array} [props.modifiers] - Additional CSS classes
 * @param {string} [props.title] - The title of the phone input
 * @param {string} [props.hint] - The hint of the phone input
 * @param {string} [props.errorMessage] - The error message of the phone input
 * @param {boolean} [props.compact = false] - The compact mode of phone input
 * @param {boolean} [props.showCountryCodeOnly = false] - Show only the country code of the phone input
 * @param {string} [props.labelOptional] - The optional label of the phone input
 * @param {boolean} [props.titleRequired = false] - The required indicator for the phone input
 * @param {boolean} [props.isDisabled = false] - Disabled state
 */

function SelectComponent({
  modifiers = [],
  title,
  hint,
  errorMessage,
  compact = false,
  titleRequired = false,
  showCountryCodeOnly = false,
  isDisabled = false,
}) {
  const html = String.raw;
  const SvgEstonia = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
  >
    <path d="M24 0H0V17.9212H24V0Z" fill="black" />
    <path d="M24 12.0264H0V18.0001H24V12.0264Z" fill="white" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0 0H24V5.97375H0V0Z"
      fill="#1291FF"
    />
  </svg>`;

  const SvgFinland = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
  >
    <g clip-path="url(#clip0_7139_4028)">
      <path d="M0 0H24V18H0V0Z" fill="white" />
      <path d="M0 6.54541H24V11.4545H0V6.54541Z" fill="#003580" />
      <path d="M6.5791 0H11.4882V18H6.5791V0Z" fill="#003580" />
    </g>
    <defs>
      <clipPath id="clip0_7139_4028">
        <rect width="24" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>`;

  const SvgLatvia = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0 0H24V18.0001H0V0Z"
      fill="white"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0 0H24V7.20004H0V0ZM0 10.8001H24V18.0001H0V10.8001Z"
      fill="#AB231D"
    />
  </svg>`;

  const SvgLithuania = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
  >
    <path d="M24.0003 0H0V17.9213H24.0003V0Z" fill="#007308" />
    <path d="M24.0003 12.0264H0V18.0001H24.0003V12.0264Z" fill="#BF0000" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0 0H24V5.97368H0V0Z"
      fill="#FFB300"
    />
  </svg>`;

  const forAttribute = errorMessage ? 'phone-input-with-error' : 'phone';
  const required = `<span class="tds-fieldset__required">*</span>`;

  return html`
    <div
      class="tds-form-group ${modifiers.includes('is-error')
        ? `tds-form-group--error`
        : ''}"
    >
      ${title
        ? `<label class="tds-label ${compact ? 'tds-label--compact' : ''}" for="phone-input">${title}${titleRequired ? required : ''}</label>`
        : ''}
      ${hint
        ? `<div id="phone-number-hint" class="tds-label__hint ${compact ? 'tds-label__hint--compact' : ''}">${hint}</div>`
        : ''}
      ${modifiers.includes('is-error')
        ? `<div class="tds-error-message ${compact ? 'tds-error-message--compact' : ''}">${errorMessage}</div>`
        : ''}
      <div
        class="tds-phone-form ${modifiers.includes('is-error')
          ? 'tds-input--error'
          : ''} ${isDisabled ? 'is-disabled' : ''}"
        id="${forAttribute}"
      >
        ${showCountryCodeOnly
          ? ''
          : `
        <div class="tds-select-phone">
          <button
            class="tds-phone-control ${
              compact ? 'tds-phone-control--compact' : ''
            }"
            aria-label="phone selection"
            aria-expanded="false"
            aria-controls="phone-dropdown"
            ${isDisabled ? 'disabled' : ''}
          >
            <span class="tds-phone-control__placeholder">${SvgEstonia}</span>
            <span
              class="tds-select__icon ${
                compact ? 'tds-select__icon--compact' : ''
              }"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.25269 8.16436L4.7475 6.83563L12.0001 14.9948L19.2527 6.83563L20.7475 8.16436L12.0001 18.0052L3.25269 8.16436Z"
                  fill="#1C1F22"
                /></svg
            ></span>
          </button>
          <ul
            class="tds-dropdown-phone ${compact ? 'tds-dropdown--compact' : ''}"
            id="phone-dropdown"
            role="listbox"
            aria-labelledby="phone-input-label"
            aria-activedescendant="option-1"
            aria-hidden="true"
            hidden
          >
            <li value="option" class="tds-dropdown-phone__option" aria-selected="false" tabindex="0">
              <span class="tds-dropdown-phone__country">${SvgEstonia}Estonia</span>
              <span class="tds-dropdown-phone__country-code">+372</span>
            </li>
            <li class="tds-dropdown-phone__option--separator"></li>
             <li value="option" class="tds-dropdown-phone__option" aria-selected="false" tabindex="0">
              <span class="tds-dropdown-phone__country">${SvgFinland}Finland</span>
              <span class="tds-dropdown-phone__country-code">+358</span>
            </li>
             <li value="option" class="tds-dropdown-phone__option" aria-selected="false" tabindex="0">
              <span class="tds-dropdown-phone__country">${SvgLatvia}Latvia</span>
              <span class="tds-dropdown-phone__country-code">+371</span>
            </li>
             <li value="option" class="tds-dropdown-phone__option" aria-selected="false" tabindex="0">
              <span class="tds-dropdown-phone__country">${SvgLithuania}Lithuania</span>
              <span class="tds-dropdown-phone__country-code">+370</span>
            </li>
             <li value="option" class="tds-dropdown-phone__option" aria-selected="false" tabindex="0">
              <span class="tds-dropdown-phone__country">${SvgFinland}Finland</span>
              <span class="tds-dropdown-phone__country-code">+358</span>
            </li>
  <li value="option" class="tds-dropdown-phone__option" aria-selected="false" tabindex="0">
              <span class="tds-dropdown-phone__country">${SvgLatvia}Latvia</span>
              <span class="tds-dropdown-phone__country-code">+371</span>
            </li>
          </ul>
        </div>`}
        <div
          class="tds-phone-field ${modifiers.includes('is-error')
            ? 'tds-phone-field--error'
            : ''} ${compact ? 'tds-phone-field--compact' : ''}"
        >
          <span class="tds-phone-field__prefix">+372</span>
          <input
            class="tds-phone-input"
            required
            type="tel"
            id="phone-input"
            name="phone"
            aria-describedby="work-phone"
            autocomplete="tel"
            ${isDisabled ? 'disabled' : ''}
          />
        </div>
      </div>
    </div>
  `;
}

export default SelectComponent;
