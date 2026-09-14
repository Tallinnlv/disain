import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * Phone input with a country-code selector. The selector is marked up as a
 * WAI-ARIA "select-only combobox": the flag button is the combobox, the list
 * is a listbox and the highlighted option is announced via
 * aria-activedescendant. Focus never leaves the button.
 *
 * @param {object} props
 * @param {string} [props.id] - Base id; derived ids are `${id}-hint`, `${id}-error`, `${id}-country`, `${id}-listbox`, `${id}-option-N`, `${id}-prefix`
 * @param {array} [props.modifiers] - Additional CSS classes (`'is-error'` switches on the error state)
 * @param {string} [props.title] - The visible label of the phone input
 * @param {string} [props.hint] - The hint of the phone input
 * @param {string} [props.errorMessage] - The error message of the phone input
 * @param {string} [props.countryLabel='Country code'] - Accessible name of the country-code selector (it has no visible text, only a flag)
 * @param {array} [props.countries] - `{ name, code, flag }` entries; the first one is preselected and separated from the rest. `flag` is one of `ee`, `fi`, `lv`, `lt`
 * @param {boolean} [props.compact=false] - The compact mode of phone input
 * @param {boolean} [props.showCountryCodeOnly=false] - Show only the country code, without the selector
 * @param {boolean} [props.titleRequired=false] - The required indicator for the phone input
 * @param {boolean} [props.isDisabled=false] - Disabled state
 */

const FLAGS = {
  ee: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true" focusable="false">
              <path d="M24 0H0V17.9212H24V0Z" fill="black" />
              <path d="M24 12.0264H0V18.0001H24V12.0264Z" fill="white" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H24V5.97375H0V0Z" fill="#1291FF" />
            </svg>`,
  fi: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true" focusable="false">
              <path d="M0 0H24V18H0V0Z" fill="white" />
              <path d="M0 6.54541H24V11.4545H0V6.54541Z" fill="#003580" />
              <path d="M6.5791 0H11.4882V18H6.5791V0Z" fill="#003580" />
            </svg>`,
  lv: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true" focusable="false">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H24V18.0001H0V0Z" fill="white" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H24V7.20004H0V0ZM0 10.8001H24V18.0001H0V10.8001Z" fill="#AB231D" />
            </svg>`,
  lt: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true" focusable="false">
              <path d="M24.0003 0H0V17.9213H24.0003V0Z" fill="#007308" />
              <path d="M24.0003 12.0264H0V18.0001H24.0003V12.0264Z" fill="#BF0000" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H24V5.97368H0V0Z" fill="#FFB300" />
            </svg>`,
};

const DEFAULT_COUNTRIES = [
  { name: 'Estonia', code: '+372', flag: 'ee' },
  { name: 'Finland', code: '+358', flag: 'fi' },
  { name: 'Latvia', code: '+371', flag: 'lv' },
  { name: 'Lithuania', code: '+370', flag: 'lt' },
];

const PhoneInputComponent = (props = {}) => {
  const {
    id: customId,
    modifiers = [],
    title,
    hint,
    errorMessage,
    countryLabel = 'Country code',
    countries = DEFAULT_COUNTRIES,
    compact = false,
    titleRequired = false,
    showCountryCodeOnly = false,
    isDisabled = false,
  } = props;

  const id = customId ?? uid('phone', props);
  const isError = modifiers.includes('is-error');
  const selected = countries[0] || DEFAULT_COUNTRIES[0];

  const describedBy = [hint && `${id}-hint`, isError && errorMessage && `${id}-error`]
    .filter(Boolean)
    .join(' ');

  const options = countries
    .map((country, index) => {
      const option = `<li id="${id}-option-${index + 1}" role="option" class="tds-dropdown-phone__option" data-value="${country.code}" aria-selected="${index === 0}">
          <span class="tds-dropdown-phone__country">
            ${FLAGS[country.flag] || ''}
            ${country.name}
          </span>
          <span class="tds-dropdown-phone__country-code">${country.code}</span>
        </li>`;

      // The first (default) country is separated from the rest of the list.
      return index === 0 && countries.length > 1
        ? `${option}\n        <li class="tds-dropdown-phone__option--separator" role="presentation"></li>`
        : option;
    })
    .join('\n        ');

  const required = `<span class="tds-fieldset__required">*</span>`;

  return html`
<div class="tds-form-group${isError ? ` tds-form-group--error` : ''}">
  ${title ? `<label class="tds-label${compact ? ' tds-label--compact' : ''}" for="${id}">${title}${titleRequired ? required : ''}</label>` : ''}
  ${hint ? `<div id="${id}-hint" class="tds-label__hint${compact ? ' tds-label__hint--compact' : ''}">${hint}</div>` : ''}
  ${isError && errorMessage ? `<div id="${id}-error" class="tds-error-message${compact ? ' tds-error-message--compact' : ''}">${errorMessage}</div>` : ''}
  <div class="tds-phone-form${isError ? ' tds-input--error' : ''}${isDisabled ? ' is-disabled' : ''}">
    ${showCountryCodeOnly ? '' : `
    <div class="tds-select-phone">
      <button
        type="button"
        id="${id}-country"
        class="tds-phone-control${compact ? ' tds-phone-control--compact' : ''}"
        role="combobox"
        aria-label="${countryLabel}"
        aria-haspopup="listbox"
        aria-controls="${id}-listbox"
        aria-expanded="false"${isDisabled ? `
        disabled` : ''}
      >
        <span class="tds-phone-control__placeholder">
          ${FLAGS[selected.flag] || ''}
        </span>
        <span class="tds-visually-hidden">${selected.name} (${selected.code})</span>
        <span class="tds-select__icon${compact ? ' tds-select__icon--compact' : ''}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.25269 8.16436L4.7475 6.83563L12.0001 14.9948L19.2527 6.83563L20.7475 8.16436L12.0001 18.0052L3.25269 8.16436Z" fill="currentColor" />
          </svg>
        </span>
      </button>
      <ul
        class="tds-dropdown-phone${compact ? ' tds-dropdown--compact' : ''}"
        id="${id}-listbox"
        role="listbox"
        aria-label="${countryLabel}"
        tabindex="-1"
        hidden
      >
        ${options}
      </ul>
    </div>`}
    <div class="tds-phone-field${isError ? ' tds-phone-field--error' : ''}${compact ? ' tds-phone-field--compact' : ''}">
      <span class="tds-phone-field__prefix" id="${id}-prefix">${selected.code}</span>
      <input
        class="tds-phone-input"
        required
        type="tel"
        id="${id}"
        name="phone"
        autocomplete="tel-national"${describedBy ? `
        aria-describedby="${describedBy}"` : ''}${isError ? `
        aria-invalid="true"` : ''}${isDisabled ? `
        disabled` : ''}
      />
    </div>
  </div>
</div>
  `;
};

export default PhoneInputComponent;
