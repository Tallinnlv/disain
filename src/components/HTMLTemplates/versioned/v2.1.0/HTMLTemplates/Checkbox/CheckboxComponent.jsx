import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

const required = `<span class="tds-fieldset__required">*</span>`;

const classes = (...names) => names.filter(Boolean).join(' ');

/**
 * One checkbox item.
 * @param {object} checkbox - option definition (label, checked, disabled, hint, required,
 *   checkboxHasError, errorMessage, ariaLabel, selectAll)
 * @param {string} optionId - id of the input; hint/error ids derive from it
 * @param {string} name - name attribute
 * @param {string|string[]} modifiers - group modifiers
 * @param {boolean} groupHasError - whether the whole group is in error state
 */
const createCheckbox = (checkbox, optionId, name, modifiers, groupHasError) => {
  const hasError = Boolean(checkbox.checkboxHasError);
  const disabled = checkbox.disabled || modifiers.includes('is-disabled');
  const hintId = `${optionId}-hint`;
  const errorId = `${optionId}-error`;

  const label = checkbox.label
    ? `<label for="${optionId}" class="tds-checkboxes__label">${checkbox.label}${checkbox.required ? required : ''}</label>`
    : '';
  const hint = checkbox.hint
    ? `<div id="${hintId}" class="tds-item-hint">${checkbox.hint}</div>`
    : '';
  const errorMessage = hasError
    ? `<div id="${errorId}" class="tds-fieldset__notice--error-text-below">${checkbox.errorMessage || 'Error message'}</div>`
    : '';

  const describedBy = [checkbox.hint ? hintId : '', hasError ? errorId : '']
    .filter(Boolean)
    .join(' ');

  const attributes = [
    'type="checkbox"',
    `id="${optionId}"`,
    'class="tds-checkboxes__input"',
    `name="${name}"`,
    checkbox.checked ? 'checked' : '',
    disabled ? 'disabled' : '',
    hasError || groupHasError ? 'aria-invalid="true"' : '',
    describedBy ? `aria-describedby="${describedBy}"` : '',
    // A checkbox without a visible label still needs an accessible name
    !checkbox.label
      ? `aria-label="${checkbox.ariaLabel || 'Description of checkbox'}"`
      : '',
    checkbox.selectAll ? 'data-select-all="true"' : '',
  ]
    .filter(Boolean)
    .join('\n        ');

  return html`
    <div class="${classes('tds-checkboxes__item', hasError && 'tds-checkboxes__item--error', checkbox.disabled && 'is-disabled')}">
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
        <div class="${classes('tds-checkboxes', inline && 'tds-checkboxes--inline')}">
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
 * @param {string|string[]} [props.title=''] - The title of the checkbox group
 * @param {string|string[]} [props.hintTitle=''] - The hint of the checkbox group
 * @param {array} [props.checkboxes=[]] - Columns of options. An option with `selectAll: true`
 *   is rendered with `data-select-all="true"` and controls the column's sub-options via the script.
 *   For backwards compatibility a first option labelled exactly "Vali kõik" that has sub-options
 *   is treated as select-all too.
 * @param {string|string[]} [props.errorMessage=''] - The error message for the checkbox group
 * @param {boolean} [props.titleRequired = false] - The required indicator for the checkbox group
 * @param {boolean} [props.compact = false] - The compact size of the checkbox group
 * @param {boolean} [props.inline = false] - The inline layout of the checkbox group
 * @param {array} [props.subCheckboxes=[]] - Columns of sub-options rendered in an indented wrapper
 */

const CheckboxComponent = (props = {}) => {
  const {
    modifiers = '',
    title = '',
    hintTitle = '',
    errorMessage = '',
    compact = false,
    checkboxes = [],
    titleRequired = false,
    inline = false,
    name,
  } = props;
  const subCheckboxes = Array.isArray(props.subCheckboxes)
    ? props.subCheckboxes
    : [];

  const id = props.id ?? uid('checkbox', props);
  const groupName = name ?? id;
  const groupHasError = modifiers.includes('is-error');
  const multiColumn = checkboxes.length > 1;

  const checkboxItems = checkboxes
    .map((checkboxColumn, columnIndex) => {
      const columnName = multiColumn
        ? `${groupName}-${columnIndex + 1}`
        : groupName;
      const optionPrefix = multiColumn ? `${id}-${columnIndex + 1}` : id;
      const subs = subCheckboxes[columnIndex] || [];

      const mainCheckboxes = checkboxColumn
        .map((checkbox, index) => {
          const isLegacySelectAll =
            index === 0 &&
            subs.length > 0 &&
            typeof checkbox.label === 'string' &&
            checkbox.label.trim() === 'Vali kõik';
          return createCheckbox(
            { ...checkbox, selectAll: checkbox.selectAll || isLegacySelectAll },
            `${optionPrefix}-option-${index + 1}`,
            columnName,
            modifiers,
            groupHasError,
          );
        })
        .join('');

      const subCheckboxItems = subs
        .map((subCheckbox, subIndex) =>
          createCheckbox(
            subCheckbox,
            `${optionPrefix}-sub-${subIndex + 1}`,
            columnName,
            modifiers,
            groupHasError,
          ),
        )
        .join('');

      return html`
        ${mainCheckboxes}
        ${subCheckboxItems
          ? `<div class="tds-checkboxes__sub-category-wrapper">${subCheckboxItems}</div>`
          : ''}
      `;
    })
    .join('');

  if (!title && !hintTitle && !errorMessage) {
    // Wrap in tds-checkboxes div only if there are multiple checkbox items
    const isMultiple =
      checkboxes.length > 1 || (checkboxes[0] || []).length > 1;
    return isMultiple
      ? html`
          <div class="${classes('tds-checkboxes', inline && 'tds-checkboxes--inline')}">
            ${checkboxItems}
          </div>
        `
      : checkboxItems; // Return only the checkbox items if there is a single checkbox item
  }

  return createFieldset({
    id,
    items: checkboxItems,
    modifiers,
    title,
    hintTitle,
    errorMessage,
    titleRequired,
    compact,
    inline,
  });
};

export default CheckboxComponent;
