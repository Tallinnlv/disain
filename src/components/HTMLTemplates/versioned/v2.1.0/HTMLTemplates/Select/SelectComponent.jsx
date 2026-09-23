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
 * @param {string} [props.ariaLabel=''] - Accessible name of the select when there is no visible title
 * @param {boolean} [props.searchable=false] - Add a search field above the options. Focus moves into the field when the list opens; the field is then the combobox.
 * @param {string} [props.searchPlaceholder='Search'] - Placeholder of the search field
 * @param {string} [props.clearSearchLabel='Clear search'] - Accessible name of the clear button
 * @param {string} [props.noResultsText='No results'] - Shown when no option matches the search
 * @param {string} [props.resultText='1 result'] - Announced to screen readers when one option matches
 * @param {string} [props.resultsText='{count} results'] - Announced to screen readers otherwise; `{count}` is replaced
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
    ariaLabel = '',
    searchable = false,
    searchPlaceholder = 'Search',
    clearSearchLabel = 'Clear search',
    noResultsText = 'No results',
    resultText = '1 result',
    resultsText = '{count} results',
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

  const icon = `<span class="tds-select__icon${compact ? ' tds-select__icon--compact' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.25269 8.16436L4.7475 6.83563L12.0001 14.9948L19.2527 6.83563L20.7475 8.16436L12.0001 18.0052L3.25269 8.16436Z" fill="currentColor" />
        </svg>
      </span>`;

  if (searchable) {
    const accessibleName = title
      ? `aria-labelledby="${labelId}"`
      : ariaLabel
        ? `aria-label="${ariaLabel}"`
        : '';

    // The button opens the panel; the search field inside it is the combobox
    // (focus moves there), so the button is a plain button and its name reads
    // as "label, current value".
    return html`
<div class="tds-form-group${isError ? ` tds-form-group--error` : ''}${compact ? ' tds-form-group--compact' : ''}">
  ${title ? `<label class="tds-label${compact ? ' tds-label--compact' : ''}" id="${labelId}" for="${id}">${title}${required}</label>` : ''}
  ${hintTitle ? `<div id="${id}-hint" class="tds-label__hint${compact ? ' tds-label__hint--compact' : ''}">${hintTitle}</div>` : ''}
  ${isError ? `<div id="${id}-error" class="tds-error-message${compact ? ' tds-error-message--compact' : ''}">${errorMessage}</div>` : ''}
  <div class="tds-select tds-select--searchable${isDisabled ? ' is-disabled' : ''}" data-result-text="${resultText}" data-results-text="${resultsText}">
    <button
      type="button"
      id="${id}"
      class="tds-form-control${isError ? ' tds-form-control--error' : ''}${compact ? ' tds-form-control--compact' : ''}"
      aria-haspopup="listbox"
      aria-controls="${id}-panel"
      aria-expanded="false"${title ? `
      aria-labelledby="${labelId} ${id}-value"` : ariaLabel ? `
      aria-label="${ariaLabel}"` : ''}${describedBy ? `
      aria-describedby="${describedBy}"` : ''}${isError ? `
      aria-invalid="true"` : ''}${isDisabled ? `
      disabled` : ''}
    >
      <span class="tds-form-control__placeholder" id="${id}-value">${buttonText}</span>
      ${icon}
    </button>
    <div class="tds-select__panel${compact ? ' tds-select__panel--compact' : ''}" id="${id}-panel" hidden>
      <div class="tds-select__search">
        <input
          type="text"
          id="${id}-search"
          class="tds-select__search-input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls="${listboxId}"
          ${accessibleName}
          placeholder="${searchPlaceholder}"
          autocomplete="off"
          spellcheck="false"
        />
        <button type="button" class="tds-select__search-clear" aria-label="${clearSearchLabel}" tabindex="-1" hidden>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 13.4142L5.70711 19.7071L4.29289 18.2929L10.5858 12L4.29289 5.70711L5.70711 4.29289L12 10.5858L18.2929 4.29289L19.7071 5.70711L13.4142 12L19.7071 18.2929L18.2929 19.7071L12 13.4142Z" fill="currentColor" />
          </svg>
        </button>
        <span class="tds-select__search-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false">
            <path d="M11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2619 15.0766 18.0303 16.6162L22.207 20.793L20.793 22.207L16.6162 18.0303C15.0766 19.2619 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2ZM11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4Z" fill="currentColor" />
          </svg>
        </span>
      </div>
      <ul class="tds-dropdown${compact ? ' tds-dropdown--compact' : ''}" id="${listboxId}" role="listbox" ${accessibleName} tabindex="-1">
        ${options}
      </ul>
      <div class="tds-select__no-results" hidden>${noResultsText}</div>
      <div class="tds-visually-hidden" role="status" aria-live="polite"></div>
    </div>
  </div>
</div>
    `;
  }

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
      aria-labelledby="${labelId}"` : ariaLabel ? `
      aria-label="${ariaLabel}"` : ''}${describedBy ? `
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
    <ul class="tds-dropdown${compact ? ' tds-dropdown--compact' : ''}" id="${listboxId}" role="listbox"${title ? ` aria-labelledby="${labelId}"` : ariaLabel ? ` aria-label="${ariaLabel}"` : ''} tabindex="-1" hidden>
      ${options}
    </ul>
  </div>
</div>
  `;
};

export default SelectComponent;
