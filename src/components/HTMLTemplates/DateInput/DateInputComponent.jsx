const html = (strings, ...values) => {
  const raw = String.raw(strings, ...values);

  return raw
    .split('\n')
    .filter(line => line.trim())
    .join('\n');
};

/**
 * @param {object} props
 * @param {string} [props.title] - Title of the Date Input
 * @param {string} [props.hint] - Hint message of the Date Input
 * @param {boolean} [props.showDay] - Determines whether to show Day input field
 * @param {string} [props.errorMessage] - Error message to be shown
 * @param {boolean} [props.isRequired] - Determines whether to show an asterisk next to the title to indicate that Date Input is required
 * @param {string} [props.valueDay] - Default value of the Day input field
 * @param {string} [props.valueMonth] - Default value of the Month input field
 * @param {string} [props.valueYear] - Default value of the Year input field
 * @param {boolean} [props.errorDay] - Determines whether to show red error border around the Day input field
 * @param {boolean} [props.errorMonth] - Determines whether to show red error border around the Month input field
 * @param {boolean} [props.errorYear] - Determines whether to show red error border around the Year input field
 * @param {string} [props.labelDay] - Aria label to show to screen readers
 * @param {string} [props.labelMonth] - Aria label to show to screen readers
 * @param {string} [props.labelYear] - Aria label to show to screen readers
 */

const DateInputComponent = ({
  title,
  hint,
  showDay = false,
  errorMessage,
  isRequired = false,
  valueDay = '',
  valueMonth = '',
  valueYear = '',
  errorDay = true,
  errorMonth = true,
  errorYear = true,
  labelDay,
  labelMonth,
  labelYear,
}) => {
  const randomString = Math.random().toString(36).slice(2, 11);

  return html`
<div class="tds-form-group tds-date-input${errorMessage ? ' tds-form-group--error' : ''}">
  <div class="tds-date-input__header">
    <div class="tds-date-input__title">${title}${isRequired ? '<span class="tds-fieldset__required">*</span>' : ''}</div>
    ${hint ? `<div class="tds-date-input__hint">${hint}</div>` : ''}
    ${errorMessage ? `<div class="tds-error-message">${errorMessage}</div>` : ''}
  </div>
  <div class="tds-date-input__fields">
    ${showDay ? `<div class="tds-date-input__field">
      <label class="tds-date-input__label" for="day-${randomString}" aria-label="${labelDay}">Päev</label>
      <input class="tds-input${errorMessage && errorDay ? ' tds-input--error' : ''}" id="day-${randomString}" name="day-${randomString}" type="text" autocomplete="off"${valueDay ? ` value="${valueDay}"` : ''} />
    </div>` : ''}
    <div class="tds-date-input__field">
      <label class="tds-date-input__label" for="month-${randomString}" aria-label="${labelMonth}">Kuu</label>
      <input class="tds-input${errorMessage && errorMonth ? ' tds-input--error' : ''}" id="month-${randomString}" name="month-${randomString}" type="text" autocomplete="off"${valueMonth ? ` value="${valueMonth}"` : ''} />
    </div>
    <div class="tds-date-input__field year">
      <label class="tds-date-input__label" for="year-${randomString}" aria-label="${labelYear}">Aasta</label>
      <input class="tds-input${errorMessage && errorYear ? ' tds-input--error' : ''}" id="year-${randomString}" name="year-${randomString}" type="text" autocomplete="off"${valueYear ? ` value="${valueYear}"` : ''} />
    </div>
  </div>
</div>
  `;
};

export default DateInputComponent;
