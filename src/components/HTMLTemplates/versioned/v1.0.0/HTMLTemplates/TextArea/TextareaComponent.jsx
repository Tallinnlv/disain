/**
 * @param {object} props
 * @param {string} [props.label] - The label of the textarea
 * @param {string} [props.filledArea] - The filled area of the textarea
 * @param {string} [props.placeholder] - The placeholder text
 * @param {boolean} [props.hint] - The hint text
 * @param {boolean} [props.error] - The error message
 * @param {boolean} [props.disabled] - Is disabled
 * @param {boolean} [props.compact] - The compact state
 * @param {boolean} [props.titleRequired] - The optional label of the textarea
 */

export function TextareaComponent({
  label = '',
  filledArea = '',
  hint,
  error,
  titleRequired,
  compact,
  disabled,
  placeholder = '',
}) {
  const required = `<span class="tds-fieldset__required">*</span>`;
  const html = String.raw;
  return html`
    <div
      class="tds-form-group ${error ? 'tds-form-group--error' : ''} ${compact
        ? 'tds-form-group--compact'
        : ''}"
    >
      <label class="tds-label" for="more-detail"
        >${label}${titleRequired ? required : ''}</label
      >
      ${hint
        ? html`<p class="tds-label__hint" id="more-detail-hint">Hint text</p>`
        : ''}
      ${error ? html`<p class="tds-error-message">Error message</p>` : ''}
      <textarea
        class="tds-textarea ${error ? 'tds-textarea--error' : ''}"
        id="more-detail"
        rows="5"
        aria-describedby="more-detail-hint"
        placeholder="${placeholder}"
        ${disabled ? 'disabled' : ''}
      >
${filledArea}</textarea
      >
    </div>
  `;
}

export default TextareaComponent;
