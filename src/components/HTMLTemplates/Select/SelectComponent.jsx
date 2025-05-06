import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {string} [props.title=''] - The title of the select component
 * @param {string} [props.hintTitle=''] - The hint title of the select component
 * @param {array} [props.selectOptions] - The options for the select
 * @param {string} [props.selectCustomText=''] - The custom text for the select component
 * @param {boolean} [props.focused=false] - If the select component is focused
 * @param {boolean} [props.isError=false] - If the select component is focused
 * @param {boolean} [props.compact = false] - If the select component is compact
 * @param {boolean} [props.titleRequired = false] - If the title is required
 * @param {boolean} [props.isDisabled = false] - if dropdown disabled
 *
 */

const SelectComponent = ({
  title = '',
  hintTitle = '',
  compact = false,
  selectOptions = [],
  titleRequired = false,
  focused = false,
  selectCustomText = '',
  isError = false,
  isDisabled = false,
}) => {
  const options = selectOptions
    .map(
      (option) =>
        `<li role="option" value="${option.value}" class="${option.value === 'option2' && focused ? 'tds-dropdown__option tds-dropdown__option--focused' : 'tds-dropdown__option'}" aria-selected="${option.value === 'option2' ? 'true' : 'false'}">${option.label}</li>`,
    )
    .join('');

  const required = titleRequired
    ? `<span class="tds-fieldset__required">*</span>`
    : '';

  return html`
<div class="tds-form-group${isError ? ` tds-form-group--error` : ''}${compact ? ' tds-form-group--compact' : ''}">
  ${title ? `<label class="tds-label${compact ? ' tds-label--compact' : ''}" for="location">${title}${required}</label>` : ''}
  ${hintTitle ? `<div id="location-hint" class="tds-label__hint${compact ? ' tds-label__hint--compact' : ''}">${hintTitle}</div>` : ''}
  ${isError ? `<div class="tds-error-message${compact ? ' tds-error-message--compact' : ''}">Error message</div>` : ''}
  <div class="tds-select${isDisabled ? ' is-disabled' : ''}">
    <button
      class="tds-form-control${isError ? ' tds-form-control--error' : ''}${compact ? ' tds-form-control--compact' : ''}"
      aria-label="Valikukast"
      aria-expanded="false" ${isDisabled ? ' disabled' : ''}
    >
      <span class="tds-form-control__placeholder">${selectCustomText ? selectCustomText : 'Default option'}</span>
      <span class="tds-select__icon${compact ? ' tds-select__icon--compact' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.25269 8.16436L4.7475 6.83563L12.0001 14.9948L19.2527 6.83563L20.7475 8.16436L12.0001 18.0052L3.25269 8.16436Z" fill="#1C1F22" />
        </svg>
      </span>
    </button>
    <ul class="tds-dropdown${compact ? ' tds-dropdown--compact' : ''}" id="location" aria-describedby="location-hint" role="listbox" hidden>
      ${options}
    </ul>
  </div>
</div>
  `;
};

export default SelectComponent;
