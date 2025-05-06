const html = (strings, ...values) => {
  const raw = String.raw(strings, ...values);

  return raw
    .split('\n')
    .filter(line => line.trim())
    .join('\n');
};

/**
 *
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.hint]
 * @param {array} [props.disabledDates]
 * @param {string} [props.value]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.titleRequired]
 * @param {string} [props.errorMessage]
 * @param {array} [props.modifiers = []]
 */

const DatePickerComponent = ({
  title,
  hint,
  disabledDates,
  value,
  placeholder,
  titleRequired,
  errorMessage,
  modifiers = [],
}) => {
  const required = `<span class="tds-fieldset__required">*</span>`;
  const errorClass = errorMessage ? ' tds-form-group--error' : '';

  return (
      html`
  <div class="tds-date-picker">
    <div class="tds-form-group${errorClass}">
      ${title
          ? `<label class="tds-label" for="event-name">${title}${titleRequired ? required : ''}</label>`
          : ''}
      ${hint
          ? `<div id="event-name-hint" class="tds-label__hint">${hint}</div>`
          : ''}
      ${modifiers.includes('is-error')
          ? `<div class="tds-error-message">${errorMessage}</div>`
          : ''}
      <input autocomplete="off" class="tds-input${modifiers.includes('is-error') ? ' tds-input--error' : ''}" id="event-name" name="eventName" type="text" aria-describedby="event-name-hint"${placeholder ? ` placeholder="${placeholder}"` : ''}${value ? ` value="${value}"` : ''} />
    </div>
    <button class="tds-date-picker--button${modifiers.includes('is-error') ? ' tds-input--error' : ''}" type="button" aria-label="Open calendar" aria-haspopup="dialog" aria-expanded="false">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4H16V2H18V4H20C21.1046 4 22 4.89543 22 6V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V6C2 4.89543 2.89543 4 4 4H6V2H8V4ZM4 6H20V8H4V6ZM4 10V20H20V10H4ZM9 12V14H7V12H9ZM9 18V16H7V18H9ZM11 12H13V14H11V12ZM13 16H11V18H13V16ZM17 12V14H15V12H17ZM17 18V16H15V18H17Z" fill="currentColor"/>
      </svg>
    </button>
  </div>`
  );
};

export default DatePickerComponent;
