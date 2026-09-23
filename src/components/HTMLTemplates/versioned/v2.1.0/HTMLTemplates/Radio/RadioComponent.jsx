import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

const required = `<span class="tds-fieldset__required">*</span>`;

const classes = (...names) => names.filter(Boolean).join(' ');

/**
 * One radio item.
 * @param {object} radio - option definition (label, checked, disabled, hint, required,
 *   radioHasError, errorMessage)
 * @param {string} optionId - id of the input; hint/error ids derive from it
 * @param {string} name - name attribute (shared by the whole column)
 * @param {string|string[]} modifiers - group modifiers
 * @param {boolean} groupHasError - whether the whole group is in error state
 */
const createRadio = (radio, optionId, name, modifiers, groupHasError) => {
  const hasError = Boolean(radio.radioHasError);
  const disabled = radio.disabled || modifiers.includes('is-disabled');
  const hintId = `${optionId}-hint`;
  const errorId = `${optionId}-error`;

  const label = radio.label
    ? `<label for="${optionId}" class="tds-label tds-radios__label">${radio.label}${radio.required ? required : ''}</label>`
    : '';
  const hint = radio.hint
    ? `<div id="${hintId}" class="tds-radio-hint">${radio.hint}</div>`
    : '';
  const errorMessage = hasError
    ? `<div id="${errorId}" class="tds-fieldset__notice--error-text-below">${radio.errorMessage || 'Error message'}</div>`
    : '';

  const describedBy = [radio.hint ? hintId : '', hasError ? errorId : '']
    .filter(Boolean)
    .join(' ');

  const attributes = [
    'type="radio"',
    `id="${optionId}"`,
    'class="tds-radios__input"',
    `name="${name}"`,
    radio.checked ? 'checked' : '',
    disabled ? 'disabled' : '',
    hasError || groupHasError ? 'aria-invalid="true"' : '',
    describedBy ? `aria-describedby="${describedBy}"` : '',
  ]
    .filter(Boolean)
    .join('\n        ');

  return html`
    <div class="${classes('tds-radios__item', hasError && 'tds-radios__item--error', radio.disabled && 'is-disabled')}">
      <input
        ${attributes}
      />
      ${label} ${hint} ${errorMessage}
    </div>
  `;
};

const createFieldset = ({
  id,
  items,
  modifiers,
  title,
  hintTitle,
  errorMessage,
  titleRequired,
  compact,
  inline,
}) => {
  const isError = modifiers.includes('is-error');
  const titleText = Array.isArray(title) ? title[0] : title;
  const hintTitleText = Array.isArray(hintTitle) ? hintTitle[0] : hintTitle;
  const errorMessageText = Array.isArray(errorMessage)
    ? errorMessage[0]
    : errorMessage;

  const legendId = `${id}-legend`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const titleHTML = titleText
    ? html`<legend id="${legendId}" class="tds-fieldset__text">
        ${titleText}${titleRequired ? required : ''}
      </legend>`
    : '';
  const hintTitleHTML = hintTitleText
    ? html`<div id="${hintId}" class="tds-fieldset__text--hint">
        ${hintTitleText}
      </div>`
    : '';
  const errorMessageHTML = isError
    ? html`<div id="${errorId}" class="tds-fieldset__notice">
        ${errorMessageText}
      </div>`
    : '';

  const describedBy = [hintTitleText ? hintId : '', isError ? errorId : '']
    .filter(Boolean)
    .join(' ');

  const attributes = [
    `id="${id}"`,
    `class="${classes('tds-fieldset', isError && 'tds-fieldset--error', compact && 'tds-fieldset--compact')}"`,
    titleText ? `aria-labelledby="${legendId}"` : '',
    describedBy ? `aria-describedby="${describedBy}"` : '',
  ]
    .filter(Boolean)
    .join('\n      ');

  return html`
    <fieldset
      ${attributes}
    >
      <div class="tds-fieldset__column">
        ${titleHTML} ${hintTitleHTML} ${errorMessageHTML}
        <div class="${classes('tds-radios', inline && 'tds-radios--inline')}">
          ${items}
        </div>
      </div>
    </fieldset>
  `;
};

/**
 * @param {object} props
 * @param {string} [props.id] - Id prefix for the group; every option, hint and error id derives from it. Generated when omitted.
 * @param {string} [props.name] - Name attribute of the inputs (defaults to the id; columns after the first get a numeric suffix)
 * @param {string|string[]} [props.modifiers=''] - Additional CSS classes
 * @param {string|string[]} [props.title=''] - The title of the radio group
 * @param {string|string[]} [props.hintTitle=''] - The hint of the radio group
 * @param {array} [props.radios=[]] - Columns of options
 * @param {string|string[]} [props.errorMessage=''] - The error message for the radio group
 * @param {boolean} [props.titleRequired = false] - The required indicator for the radio group
 * @param {boolean} [props.compact = false] - The compact state
 * @param {boolean} [props.inline = false] - The inline layout of the radio group
 * @param {array} [props.subRadios=[]] - Columns of sub-options rendered in an indented wrapper
 */

export function RadioComponent(props = {}) {
  const {
    modifiers = '',
    title = '',
    hintTitle = '',
    errorMessage = '',
    compact = false,
    radios = [],
    titleRequired = false,
    inline = false,
    name,
  } = props;
  const subRadios = Array.isArray(props.subRadios) ? props.subRadios : [];

  const id = props.id ?? uid('radio', props);
  const groupName = name ?? id;
  const groupHasError = modifiers.includes('is-error');
  const multiColumn = radios.length > 1;

  const radioItems = radios
    .map((radioColumn, columnIndex) => {
      const columnName = multiColumn
        ? `${groupName}-${columnIndex + 1}`
        : groupName;
      const optionPrefix = multiColumn ? `${id}-${columnIndex + 1}` : id;

      const mainRadios = radioColumn
        .map((radio, index) =>
          createRadio(
            radio,
            `${optionPrefix}-option-${index + 1}`,
            columnName,
            modifiers,
            groupHasError,
          ),
        )
        .join('');

      const subRadioItems = (subRadios[columnIndex] || [])
        .map((subRadio, subIndex) =>
          createRadio(
            subRadio,
            `${optionPrefix}-sub-${subIndex + 1}`,
            columnName,
            modifiers,
            groupHasError,
          ),
        )
        .join('');

      return html`
        ${mainRadios}
        ${subRadioItems
          ? `<div class="tds-radios__sub-category-wrapper">${subRadioItems}</div>`
          : ''}
      `;
    })
    .join('');

  if (!title && !hintTitle && !errorMessage) {
    const isMultiple = radios.length > 1 || (radios[0] || []).length > 1;
    return isMultiple
      ? html`
          <div class="${classes('tds-radios', inline && 'tds-radios--inline')}">
            ${radioItems}
          </div>
        `
      : radioItems;
  }

  return createFieldset({
    id,
    items: radioItems,
    modifiers,
    title,
    hintTitle,
    errorMessage,
    titleRequired,
    compact,
    inline,
  });
}

export default RadioComponent;
