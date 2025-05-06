/**
 * @param {object} props
 * @param {array} [props.modifiers] - Additional CSS classes
 * @param {string} [props.labelOptional] - The optional label of the text input
 * @param {boolean} [props.compact = false] - The compact state
 * @param {string} [props.errorMessage] - The error message
 * @param {string} [props.title] - The title of the text input group
 * @param {string} [props.hint] - The hint of the text input group
 * @param {boolean} [props.titleRequired] - The optional label of the text input
 * @param {string} [props.filledArea] - The optional label of the text input
 * @param {string} [props.placeholder] - The optional placeholder of the text input
 */

export function TextInputComponent({
  modifiers = [],
  title,
  hint,
  titleRequired,
  compact = false,
  errorMessage,
  filledArea = '',
  placeholder = '',
}) {
  const required = `<span class="tds-fieldset__required">*</span>`;
  const html = String.raw;
  const errorClass = errorMessage ? 'tds-form-group--error' : '';

  const closeIcon = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4.99991 3.58578L11.9999 10.5858L18.9999 3.58578L20.4141 5L13.4141 12L20.4141 19L18.9999 20.4142L11.9999 13.4142L4.99991 20.4142L3.58569 19L10.5857 12L3.58569 5L4.99991 3.58578Z"
      fill="#1C1F22"
    />
  </svg>`;

  return html`
    <div
      class="tds-form-group ${compact
        ? 'tds-form-group--compact'
        : ''} ${errorClass}"
    >
      ${title
        ? `<label class="tds-label ${compact ? 'tds-label--compact' : ''}" for="event-name">${title}${titleRequired ? required : ''}</label>`
        : ''}
      ${hint
        ? `<div id="event-name-hint" class="tds-label__hint ${compact ? 'tds-hint--compact' : ''}">${hint}</div>`
        : ''}
      ${modifiers.includes('is-error')
        ? `<div class="tds-error-message ${compact ? 'tds-error-message--compact' : ''}">${errorMessage}</div>`
        : ''}
        <input
          class="tds-input ${modifiers.includes('is-error') ? 'tds-input--error' : ''}"
          id="event-name"
          name="eventName"
          type="text"
          aria-describedby="event-name-hint"
          ${placeholder ? `placeholder="${placeholder}"` : ''}
          ${filledArea ? `value="${filledArea}"` : ''}
        />
    </div>
  `;
}

export default TextInputComponent;
