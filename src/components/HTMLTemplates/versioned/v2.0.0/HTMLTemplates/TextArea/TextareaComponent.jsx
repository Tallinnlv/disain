import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {string} [props.label] - The label of the textarea
 * @param {string} [props.filledArea] - The filled area of the textarea
 * @param {string} [props.placeholder] - The placeholder text
 * @param {boolean|string} [props.hint] - The hint text
 * @param {boolean|string} [props.error] - The error message
 * @param {boolean} [props.disabled] - Is disabled
 * @param {number} [props.maxlength] - Maximum character length
 * @param {boolean} [props.compact] - The compact state
 * @param {boolean} [props.titleRequired] - The optional label of the textarea
 * @param {string} [props.value] - The value of the textarea (alternative to filledArea)
 * @param {string} [props.id] - Custom ID for the textarea
 * @param {boolean} [props.showCounter] - Show character counter
 * @param {boolean} [props.wordCount] - Use word count instead of character count
 * @param {boolean} [props.resizable] - Allow resizing of the textarea
 */

const TextareaComponent = ({
  label = '',
  filledArea = '',
  hint,
  error,
  titleRequired,
  compact,
  disabled,
  placeholder = '',
  maxlength,
  value = '',
  id = 'more-detail',
  showCounter = false,
  wordCount = false,
  resizable = false,
}) => {
  const required = `<span class="tds-fieldset__required">*</span>`;
  
  // Use value if provided, otherwise use filledArea
  const textareaContent = value || filledArea;
  
  // Determine hint ID
  const hintId = `${id}-hint`;
  
  // Determine counter text based on counting mode
  const counterText = wordCount ? 'words' : 'characters';
  
  // Generate the character counter markup if needed
  const counterMarkup = maxlength && showCounter 
    ? html`<div class="tds-textarea-counter" aria-live="polite">
    <span id="${id}-counter">0</span>/${maxlength} ${counterText}
  </div>` : '';
  
  return html`
<div class="tds-form-group${error ? ' tds-form-group--error' : ''}${compact ? ' tds-form-group--compact' : ''}">
  <label class="tds-label" for="${id}">${label}${titleRequired ? required : ''}</label>
  ${hint ? html`<p class="tds-label__hint" id="${hintId}">${typeof hint === 'string' ? hint : 'Hint text'}</p>` : ''}
  ${error ? html`<p class="tds-error-message">${typeof error === 'string' ? error : 'Error message'}</p>` : ''}
  <textarea
    class="tds-textarea${error ? ' tds-textarea--error' : ''}${resizable ? ' tds-textarea--resizable' : ''}"
    id="${id}"
    rows="5"
    aria-describedby="${hint ? hintId : ''}"
    placeholder="${placeholder}"
    ${disabled ? 'disabled' : ''}
    ${maxlength ? `maxlength="${maxlength}"` : ''}
    ${showCounter ? `data-counter="true"` : ''}
    ${wordCount ? `data-word-counter="true"` : ''}
    data-counter-id="${id}-counter"
  >${textareaContent}</textarea>
  ${counterMarkup}
</div>
  `;
};

export default TextareaComponent;
