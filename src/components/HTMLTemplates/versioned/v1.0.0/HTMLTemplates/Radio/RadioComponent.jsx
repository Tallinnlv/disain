/**
 * @param {object} props
 * @param {array} [props.modifiers] - Additional CSS classes
 * @param {array} [props.title=['', '']] - The title of the radio group
 * @param {array} [props.hintTitle=['', '']] - The hint of the radio group
 * @param {array} [props.radios] - The options for the radios
 * @param {array} [props.errorMessage=['','']] - The error message
 * @param {boolean} [props.compact = false] - The compact state
 */

const html = String.raw;

const required = `<span class="tds-fieldset__required">*</span>`;

const createRadio = (radio, columnIndex, index, modifiers) => {
  const radioHasError = radio.radioHasError ? 'tds-radios__item--error' : '';
  const isDisabled = radio.disabled ? 'is-disabled' : '';
  const isChecked = radio.checked ? 'checked' : '';
  const isRequired = radio.required ? required : '';
  const disabled =
    radio.disabled || modifiers.includes('is-disabled') ? 'disabled' : '';
  const label = radio.label
    ? `<label for="radio${columnIndex}-${index}" class="tds-label tds-radios__label">${radio.label}${isRequired}</label>`
    : '';
  const hint = radio.hint
    ? `<div id="radio${columnIndex}-${index}-hint" class="tds-radio-hint">${radio.hint}</div>`
    : '';
  const errorMessage = radio.radioHasError
    ? `<div id="radio${columnIndex}-${index}-error" class="tds-fieldset__notice--error-text-below">Error message</div>`
    : '';

  const ariaDescribedBy = [
    hint ? `radio${columnIndex}-${index}-hint` : '',
    radio.radioHasError ? `radio${columnIndex}-${index}-error` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return html`
    <div class="tds-radios__item ${radioHasError} ${isDisabled}">
      <input
        type="radio"
        id="radio${columnIndex}-${index}"
        class="tds-radios__input"
        ${isChecked}
        ${disabled}
        ${radio.radioHasError ? 'aria-invalid="true"' : ''}
        ${ariaDescribedBy ? `aria-describedby="${ariaDescribedBy}"` : ''}
        name="radioGroup${columnIndex}"
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
  radios,
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
        <div class="tds-radios ${inline ? 'tds-radios--inline' : ''}">
          ${items}
        </div>
      </div>
    </fieldset>
  `;
};

export function RadioComponent({
  modifiers = '',
  title = '',
  hintTitle = '',
  errorMessage = '',
  compact = false,
  radios = [],
  titleRequired = false,
  inline = false,
  subRadios = [],
}) {
  subRadios = Array.isArray(subRadios) ? subRadios : [];

  const radioItems = radios
    .map((radioColumn, columnIndex) => {
      const mainRadios = radioColumn
        .map((radio, index) =>
          createRadio(radio, columnIndex, index, modifiers),
        )
        .join('');

      const subRadioItems = subRadios[columnIndex]
        ? subRadios[columnIndex]
            .map((subRadio, subIndex) =>
              createRadio(subRadio, columnIndex, `sub-${subIndex}`, modifiers),
            )
            .join('')
        : '';

      return html`
        ${mainRadios}
        ${subRadioItems
          ? `<div class="tds-radios__sub-category-wrapper">${subRadioItems}</div>`
          : ''}
      `;
    })
    .join('');

  if (!title && !hintTitle && !errorMessage) {
    const isMultiple = radios.length > 1 || radios[0].length > 1;
    return isMultiple
      ? html`
          <div class="tds-radios ${inline ? 'tds-radios--inline' : ''}">
            ${radioItems}
          </div>
        `
      : radioItems;
  }

  return createFieldset(
    radioItems,
    0,
    modifiers,
    title,
    hintTitle,
    errorMessage,
    titleRequired,
    compact,
    radios,
    inline,
  );
}

export default RadioComponent;
