import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * @param {object} props
 * @param {string} [props.id] - Id of the input; hint and error ids derive from it. Generated when omitted.
 * @param {string} [props.name] - Name attribute of the input (defaults to the id)
 * @param {array} [props.modifiers] - Additional CSS classes
 * @param {boolean} [props.compact = false] - The compact state
 * @param {string} [props.errorMessage] - The error message
 * @param {string} [props.title] - The title of the text input group
 * @param {string} [props.hint] - The hint of the text input group
 * @param {boolean} [props.titleRequired] - The optional label of the text input
 * @param {string} [props.filledArea] - The optional label of the text input
 * @param {string} [props.placeholder] - The optional placeholder of the text input
 * @param {boolean} [props.disabled] - The disabled state
 * @param {string} [props.autocomplete] - Autocomplete token (e.g. 'name', 'email'). Omitted when not given.
 */

const TextInputComponent = (props = {}) => {
  const {
    modifiers = [],
    title,
    hint,
    titleRequired,
    compact = false,
    errorMessage,
    filledArea = '',
    placeholder = '',
    disabled = false,
    name,
    autocomplete,
  } = props;

  const id = props.id ?? uid('text-input', props);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const required = `<span class="tds-fieldset__required">*</span>`;
  const hasError = modifiers.includes('is-error') || Boolean(errorMessage);
  const showError = hasError && Boolean(errorMessage);

  const describedBy = [hint ? hintId : '', showError ? errorId : '']
    .filter(Boolean)
    .join(' ');

  const inputAttributes = [
    `class="tds-input${hasError ? ' tds-input--error' : ''}"`,
    `id="${id}"`,
    `name="${name ?? id}"`,
    'type="text"',
    autocomplete ? `autocomplete="${autocomplete}"` : '',
    describedBy ? `aria-describedby="${describedBy}"` : '',
    hasError ? 'aria-invalid="true"' : '',
    placeholder ? `placeholder="${placeholder}"` : '',
    filledArea ? `value="${filledArea}"` : '',
    disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return html`
<div class="tds-form-group${compact ? ' tds-form-group--compact' : ''}${hasError ? ' tds-form-group--error' : ''}">
  ${title
    ? `<label class="tds-label${compact ? ' tds-label--compact' : ''}" for="${id}">
    ${title}
    ${titleRequired ? required : ''}
  </label>`
    : ''}
  ${hint
    ? `<div id="${hintId}" class="tds-label__hint${compact ? ' tds-hint--compact' : ''}">${hint}</div>`
    : ''}
  ${showError
    ? `<div id="${errorId}" class="tds-error-message${compact ? ' tds-error-message--compact' : ''}">${errorMessage}</div>`
    : ''}
  <input ${inputAttributes} />
</div>
  `;
};

export default TextInputComponent;
