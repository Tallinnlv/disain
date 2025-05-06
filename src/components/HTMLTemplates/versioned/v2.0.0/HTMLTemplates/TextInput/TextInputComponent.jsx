import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {array} [props.modifiers] - Additional CSS classes
 * @param {boolean} [props.compact = false] - The compact state
 * @param {string} [props.errorMessage] - The error message
 * @param {string} [props.title] - The title of the text input group
 * @param {string} [props.hint] - The hint of the text input group
 * @param {boolean} [props.titleRequired] - The optional label of the text input
 * @param {string} [props.filledArea] - The optional label of the text input
 * @param {string} [props.placeholder] - The optional placeholder of the text input
 * @param {boolean} [props.disabled] - The disabled state
 */

const TextInputComponent = ({
  modifiers = [],
  title,
  hint,
  titleRequired,
  compact = false,
  errorMessage,
  filledArea = '',
  placeholder = '',
  disabled = false,
}) => {
  const required = `<span class="tds-fieldset__required">*</span>`;
  const errorClass = errorMessage ? ' tds-form-group--error' : '';

  return html`
<div class="tds-form-group${compact ? ' tds-form-group--compact' : ''}${errorClass}">
  ${title
    ? `<label class="tds-label${compact ? ' tds-label--compact' : ''}" for="event-name">
    ${title}
    ${titleRequired ? required : ''}
  </label>`
    : ''}
  ${hint
    ? `<div id="event-name-hint" class="tds-label__hint${compact ? ' tds-hint--compact' : ''}">${hint}</div>`
    : ''}
  ${modifiers.includes('is-error')
    ? `<div class="tds-error-message${compact ? ' tds-error-message--compact' : ''}">${errorMessage}</div>`
    : ''}
  <input autocomplete="off" class="tds-input${modifiers.includes('is-error') ? ' tds-input--error' : ''}" id="event-name" name="eventName" type="text" aria-describedby="event-name-hint"${placeholder ? ` placeholder="${placeholder}"` : ''}${filledArea ? ` value="${filledArea}"` : ''}${disabled ? ' disabled' : ''} />
</div>
  `;
};

export default TextInputComponent;
