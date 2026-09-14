import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * Custom select, marked up as a WAI-ARIA "select-only combobox": the trigger
 * button is the combobox (its text is the current value), the list is a
 * listbox whose options are highlighted via aria-activedescendant.
 *
 * @param {object} props
 * @param {string} [props.id] - Base id; derived ids are `${id}-label`, `${id}-hint`, `${id}-error`, `${id}-listbox`, `${id}-option-N`
 * @param {string} [props.title=''] - The visible label of the select
 * @param {string} [props.hintTitle=''] - The hint text under the label
 * @param {string} [props.errorMessage='Error message'] - The error text shown when isError is true
 * @param {array} [props.selectOptions] - The options: `{ value, label }`
 * @param {string} [props.selectedValue=''] - Value of the initially selected option (none by default)
 * @param {string} [props.selectCustomText=''] - Text shown on the button while nothing is selected
 * @param {boolean} [props.focused=false] - Render the selected (or first) option in its keyboard-highlighted state
 * @param {boolean} [props.isError=false] - Error state
 * @param {boolean} [props.compact=false] - Compact size
 * @param {boolean} [props.titleRequired=false] - Show the required indicator
 * @param {boolean} [props.isDisabled=false] - Disabled state
 */

const SelectComponent = (props = {}) => {
  const {
    id: customId,
    title = '',
    hintTitle = '',
    errorMessage = 'Error message',
    compact = false,
    selectOptions = [],
    selectedValue = '',
    titleRequired = false,
    focused = false,
    selectCustomText = '',
    isError = false,
    isDisabled = false,
  } = props;

  const id = customId ?? uid('select', props);
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;

  const selectedIndex = selectOptions.findIndex(
    (option) => option.value === selectedValue,
  );
  const highlightedIndex = focused ? Math.max(selectedIndex, 0) : -1;

  const options = selectOptions
    .map((option, index) => {
      const optionClass = `tds-dropdown__option${index === highlightedIndex ? ' tds-dropdown__option--focused' : ''}`;
      return `<li id="${id}-option-${index + 1}" role="option" class="${optionClass}" data-value="${option.value}" aria-selected="${index === selectedIndex}">${option.label}</li>`;
    })
    .join('\n      ');

  const buttonText =
    selectedIndex > -1
      ? selectOptions[selectedIndex].label
      : selectCustomText || 'Default option';

  const describedBy = [hintTitle && `${id}-hint`, isError && `${id}-error`]
    .filter(Boolean)
    .join(' ');

  const required = titleRequired
    ? `<span class="tds-fieldset__required">*</span>`
    : '';

  return html`
<div class="tds-form-group${isError ? ` tds-form-group--error` : ''}${compact ? ' tds-form-group--compact' : ''}">
  ${title ? `<label class="tds-label${compact ? ' tds-label--compact' : ''}" id="${labelId}" for="${id}">${title}${required}</label>` : ''}
  ${hintTitle ? `<div id="${id}-hint" class="tds-label__hint${compact ? ' tds-label__hint--compact' : ''}">${hintTitle}</div>` : ''}
  ${isError ? `<div id="${id}-error" class="tds-error-message${compact ? ' tds-error-message--compact' : ''}">${errorMessage}</div>` : ''}
  <div class="tds-select${isDisabled ? ' is-disabled' : ''}">
    <button
      type="button"
      id="${id}"
      class="tds-form-control${isError ? ' tds-form-control--error' : ''}${compact ? ' tds-form-control--compact' : ''}"
      role="combobox"
      aria-haspopup="listbox"
      aria-controls="${listboxId}"
      aria-expanded="false"${title ? `
      aria-labelledby="${labelId}"` : ''}${describedBy ? `
      aria-describedby="${describedBy}"` : ''}${isError ? `
      aria-invalid="true"` : ''}${isDisabled ? `
      disabled` : ''}
    >
      <span class="tds-form-control__placeholder">${buttonText}</span>
      <span class="tds-select__icon${compact ? ' tds-select__icon--compact' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.25269 8.16436L4.7475 6.83563L12.0001 14.9948L19.2527 6.83563L20.7475 8.16436L12.0001 18.0052L3.25269 8.16436Z" fill="currentColor" />
        </svg>
      </span>
    </button>
    <ul class="tds-dropdown${compact ? ' tds-dropdown--compact' : ''}" id="${listboxId}" role="listbox"${title ? ` aria-labelledby="${labelId}"` : ''} tabindex="-1" hidden>
      ${options}
    </ul>
  </div>
</div>
  `;
};

export default SelectComponent;
