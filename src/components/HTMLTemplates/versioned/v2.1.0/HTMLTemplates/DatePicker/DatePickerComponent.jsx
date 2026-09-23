import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * Date picker: a text input plus a calendar button. The calendar popup itself
 * is rendered by vanillajs-datepicker and wired up by
 * `/scripts/components/forms-date-picker.js`, which turns it into a labelled
 * dialog controlled by the button.
 *
 * @param {object} props
 * @param {string} [props.id] - Base id; derived ids are `${id}-hint`, `${id}-error` (and `${id}-calendar` once the script runs)
 * @param {string} [props.name] - Input name, defaults to the id
 * @param {string} [props.title] - The visible label
 * @param {string} [props.hint] - Hint text under the label
 * @param {array} [props.disabledDates] - Reserved for the consuming page; not rendered
 * @param {string} [props.value] - Initial value, e.g. "01.01.2025"
 * @param {string} [props.placeholder] - Placeholder, e.g. "PP.KK.AAAA"
 * @param {boolean} [props.titleRequired] - Show the required indicator
 * @param {string} [props.errorMessage] - Error text, shown when modifiers include 'is-error'
 * @param {array} [props.modifiers=[]] - `'is-error'` switches on the error state
 * @param {string} [props.buttonLabel='Ava kalender'] - Accessible name of the calendar button
 * @param {string} [props.calendarLabel='Kalender'] - Accessible name of the calendar dialog
 */

const DatePickerComponent = (props = {}) => {
  const {
    id: customId,
    name,
    title,
    hint,
    value,
    placeholder,
    titleRequired,
    errorMessage,
    modifiers = [],
    buttonLabel = 'Ava kalender',
    calendarLabel = 'Kalender',
  } = props;

  const id = customId ?? uid('date-picker', props);
  const isError = modifiers.includes('is-error');
  const required = `<span class="tds-fieldset__required">*</span>`;
  const errorClass = errorMessage ? ' tds-form-group--error' : '';

  const describedBy = [hint && `${id}-hint`, isError && errorMessage && `${id}-error`]
    .filter(Boolean)
    .join(' ');

  return html`
  <div class="tds-date-picker" data-calendar-label="${calendarLabel}">
    <div class="tds-form-group${errorClass}">
      ${title
        ? `<label class="tds-label" for="${id}">${title}${titleRequired ? required : ''}</label>`
        : ''}
      ${hint
        ? `<div id="${id}-hint" class="tds-label__hint">${hint}</div>`
        : ''}
      ${isError && errorMessage
        ? `<div id="${id}-error" class="tds-error-message">${errorMessage}</div>`
        : ''}
      <input autocomplete="off" class="tds-input${isError ? ' tds-input--error' : ''}" id="${id}" name="${name || id}" type="text"${describedBy ? ` aria-describedby="${describedBy}"` : ''}${isError ? ' aria-invalid="true"' : ''}${placeholder ? ` placeholder="${placeholder}"` : ''}${value ? ` value="${value}"` : ''} />
    </div>
    <button class="tds-date-picker--button${isError ? ' tds-input--error' : ''}" type="button" aria-label="${buttonLabel}" aria-haspopup="dialog" aria-expanded="false">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4H16V2H18V4H20C21.1046 4 22 4.89543 22 6V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V6C2 4.89543 2.89543 4 4 4H6V2H8V4ZM4 6H20V8H4V6ZM4 10V20H20V10H4ZM9 12V14H7V12H9ZM9 18V16H7V18H9ZM11 12H13V14H11V12ZM13 16H11V18H13V16ZM17 12V14H15V12H17ZM17 18V16H15V18H17Z" fill="currentColor"/>
      </svg>
    </button>
  </div>`;
};

export default DatePickerComponent;
