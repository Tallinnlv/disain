import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * @param {object} props
 * @param {string} [props.id] - Id of the textarea; hint, error and counter ids derive from it. Generated when omitted.
 * @param {string} [props.name] - Name attribute of the textarea (defaults to the id)
 * @param {string} [props.label] - The label of the textarea
 * @param {string} [props.filledArea] - The filled area of the textarea
 * @param {string} [props.placeholder] - The placeholder text
 * @param {boolean|string} [props.hint] - The hint text
 * @param {boolean|string} [props.error] - The error message
 * @param {boolean} [props.disabled] - Is disabled
 * @param {number} [props.maxlength] - Limit shown by the counter. Characters by default
 *   (rendered as the native `maxlength`); words when `wordCount` is set (rendered as
 *   `data-max-words`, because the browser cannot enforce a word limit).
 * @param {boolean} [props.compact] - The compact state
 * @param {boolean} [props.titleRequired] - The optional label of the textarea
 * @param {string} [props.value] - The value of the textarea (alternative to filledArea)
 * @param {boolean} [props.showCounter] - Show the counter (needs `maxlength`)
 * @param {boolean} [props.wordCount] - Count words instead of characters
 * @param {boolean} [props.resizable] - Allow resizing of the textarea
 * @param {number} [props.rows = 5] - Visible rows
 */

const countWords = (text) => {
  const words = text.trim().split(/\s+/);
  return words[0] === '' ? 0 : words.length;
};

const TextareaComponent = (props = {}) => {
  const {
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
    showCounter = false,
    wordCount = false,
    resizable = false,
    rows = 5,
    name,
  } = props;

  const id = props.id ?? uid('textarea', props);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;
  const statusId = `${id}-counter-status`;

  const required = `<span class="tds-fieldset__required">*</span>`;

  // Use value if provided, otherwise use filledArea
  const textareaContent = value || filledArea;

  const hasCounter = Boolean(maxlength && showCounter);
  const unit = wordCount ? 'words' : 'characters';
  const initialCount = wordCount
    ? countWords(textareaContent)
    : textareaContent.length;

  // The visible counter is referenced by aria-describedby (so the limit is read on
  // focus). The separate visually-hidden live region is updated by the script,
  // debounced, so screen readers are not interrupted on every keystroke.
  const counterMarkup = hasCounter
    ? html`
  <div class="tds-textarea-counter" id="${counterId}">
    <span data-counter-value>${initialCount}</span>/${maxlength} ${unit}
  </div>
  <div class="tds-visually-hidden" id="${statusId}" aria-live="polite"></div>`
    : '';

  const describedBy = [
    hint ? hintId : '',
    error ? errorId : '',
    hasCounter ? counterId : '',
  ]
    .filter(Boolean)
    .join(' ');

  const textareaAttributes = [
    `class="tds-textarea${error ? ' tds-textarea--error' : ''}${resizable ? ' tds-textarea--resizable' : ''}"`,
    `id="${id}"`,
    `name="${name ?? id}"`,
    `rows="${rows}"`,
    describedBy ? `aria-describedby="${describedBy}"` : '',
    error ? 'aria-invalid="true"' : '',
    placeholder ? `placeholder="${placeholder}"` : '',
    disabled ? 'disabled' : '',
    maxlength && !wordCount ? `maxlength="${maxlength}"` : '',
    maxlength && wordCount ? `data-max-words="${maxlength}"` : '',
    hasCounter ? 'data-counter="true"' : '',
    hasCounter && wordCount ? 'data-word-counter="true"' : '',
    hasCounter ? `data-counter-id="${counterId}"` : '',
  ]
    .filter(Boolean)
    .join('\n    ');

  return html`
<div class="tds-form-group${error ? ' tds-form-group--error' : ''}${compact ? ' tds-form-group--compact' : ''}">
  <label class="tds-label" for="${id}">${label}${titleRequired ? required : ''}</label>
  ${hint ? html`<p class="tds-label__hint" id="${hintId}">${typeof hint === 'string' ? hint : 'Hint text'}</p>` : ''}
  ${error ? html`<p class="tds-error-message" id="${errorId}">${typeof error === 'string' ? error : 'Error message'}</p>` : ''}
  <textarea
    ${textareaAttributes}
  >${textareaContent}</textarea>
  ${counterMarkup}
</div>
  `;
};

export default TextareaComponent;
