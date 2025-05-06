/**
 * @param {object} props
 * @param {string} [props.modifiers=''] - Additional CSS classes
 * @param {string|string[]} [props.title=''] - The title of the checkbox group
 * @param {string|string[]} [props.hintTitle=''] - The hint of the checkbox group
 * @param {array} [props.checkboxes=[]] - The options for the checkboxes
 * @param {string|string[]} [props.errorMessage=''] - The error message for the checkbox group
 * @param {boolean} [props.titleRequired = false] - The required indicator for the checkbox group
 * @param {boolean} [props.compact = false] - The compact size of the checkbox group
 * @param {boolean} [props.inline = false] - The inline layout of the checkbox group
 * @param {array} [props.subCheckboxes=[]] - The sub-options for the checkboxes
 */

const html = String.raw;

const required = `<span class="tds-fieldset__required">*</span>`;

const createCheckbox = (checkbox, columnIndex, index, modifiers) => {
  const checkboxHasError = checkbox.checkboxHasError
    ? 'tds-checkboxes__item--error'
    : '';
  const isDisabled = checkbox.disabled ? 'is-disabled' : '';
  const isChecked = checkbox.checked ? 'checked' : '';
  const isRequired = checkbox.required ? required : '';
  const isMinusChecked = index === 2 ? 'tds-checkboxes__input--minus' : '';
  const disabled =
    checkbox.disabled || modifiers.includes('is-disabled') ? 'disabled' : '';

  // Modify to handle aria-label if there's no visible label
  const label = checkbox.label
    ? `<label for="checkbox${columnIndex}-${index}" class="tds-checkboxes__label">${checkbox.label}${isRequired}</label>`
    : '';
  const ariaLabel = !checkbox.label
    ? `aria-label="${checkbox.ariaLabel || 'Description of checkbox'}"`
    : '';

  const hint = checkbox.hint
    ? `<div id="checkbox${columnIndex}-${index}-hint" class="tds-item-hint">${checkbox.hint}</div>`
    : '';
  const errorMessage = checkbox.checkboxHasError
    ? `<div id="checkbox${columnIndex}-${index}-error" class="tds-fieldset__notice--error-text-below">Error message</div>`
    : '';

  const ariaDescribedBy = [
    hint ? `checkbox${columnIndex}-${index}-hint` : '',
    checkbox.checkboxHasError ? `checkbox${columnIndex}-${index}-error` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return html`
    <div class="tds-checkboxes__item ${checkboxHasError} ${isDisabled}">
      <input
        type="checkbox"
        id="checkbox${columnIndex}-${index}"
        class="tds-checkboxes__input ${isMinusChecked}"
        ${isChecked}
        ${disabled}
        ${checkbox.checkboxHasError ? 'aria-invalid="true"' : ''}
        ${ariaDescribedBy ? `aria-describedby="${ariaDescribedBy}"` : ''}
        ${ariaLabel}
        name="checkboxGroup${columnIndex}"
      />
      ${label} ${hint} ${errorMessage}
    </div>
  `;
};

const createFieldset = (
  items,
  index,
  modifiers,
  title,
  hintTitle,
  errorMessage,
  titleRequired,
  compact,
  inline,
) => {
  const isError = modifiers.includes('is-error') ? 'tds-fieldset--error' : '';
  const isCompact = compact ? 'tds-fieldset--compact' : '';
  const titleText = Array.isArray(title) ? title[index] : title;
  const hintTitleText = Array.isArray(hintTitle) ? hintTitle[index] : hintTitle;
  const errorMessageText = Array.isArray(errorMessage)
    ? errorMessage[index]
    : errorMessage;

  const titleHTML = titleText
    ? html`<legend id="fieldset-title-${index}" class="tds-fieldset__text">
        ${titleText}${titleRequired ? required : ''}
      </legend>`
    : '';
  const hintTitleHTML = hintTitleText
    ? html`<div id="fieldset-hint-${index}" class="tds-fieldset__text--hint">
        ${hintTitleText}
      </div>`
    : '';
  const errorMessageHTML = isError
    ? html`<div id="fieldset-error-${index}" class="tds-fieldset__notice">
        ${errorMessageText}
      </div>`
    : '';

  const ariaDescribedBy = [
    hintTitleText ? `fieldset-hint-${index}` : '',
    isError ? `fieldset-error-${index}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return html`
    <fieldset
      class="tds-fieldset ${isError} ${isCompact}"
      aria-labelledby="${titleText ? `fieldset-title-${index}` : ''}"
      ${ariaDescribedBy ? `aria-describedby="${ariaDescribedBy}"` : ''}
    >
      <div class="tds-fieldset__column">
        ${titleHTML} ${hintTitleHTML} ${errorMessageHTML}
        <div class="tds-checkboxes ${inline ? 'tds-checkboxes--inline' : ''}">
          ${items}
        </div>
      </div>
    </fieldset>
  `;
};

export function CheckboxComponent({
  modifiers = '',
  title = '',
  hintTitle = '',
  errorMessage = '',
  compact = false,
  checkboxes = [],
  titleRequired = false,
  inline = false,
  subCheckboxes = [],
}) {
  subCheckboxes = Array.isArray(subCheckboxes) ? subCheckboxes : [];

  const checkboxItems = checkboxes
    .map((checkboxColumn, columnIndex) => {
      const mainCheckboxes = checkboxColumn
        .map((checkbox, index) =>
          createCheckbox(checkbox, columnIndex, index, modifiers),
        )
        .join('');

      const subCheckboxItems = subCheckboxes[columnIndex]
        ? subCheckboxes[columnIndex]
            .map((subCheckbox, subIndex) =>
              createCheckbox(
                subCheckbox,
                columnIndex,
                `sub-${subIndex}`,
                modifiers,
              ),
            )
            .join('')
        : '';

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
    const isMultiple = checkboxes.length > 1 || checkboxes[0].length > 1;
    return isMultiple
      ? html`
          <div class="tds-checkboxes ${inline ? 'tds-checkboxes--inline' : ''}">
            ${checkboxItems}
          </div>
        `
      : checkboxItems; // Return only the checkbox items if there is a single checkbox item
  }

  return createFieldset(
    checkboxItems,
    0,
    modifiers,
    title,
    hintTitle,
    errorMessage,
    titleRequired,
    compact,
    inline,
  );
}

export default CheckboxComponent;
