import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * Date input: two or three text fields (day, month, year) grouped in a
 * fieldset whose legend is the title. Hint and error text describe the
 * group; each visible field label ("Päev", "Kuu", "Aasta") is the field's
 * accessible name.
 *
 * @param {object} props
 * @param {string} [props.id] - Base id; derived ids are `${id}-hint`, `${id}-error`, `${id}-day`, `${id}-month`, `${id}-year`
 * @param {string} [props.title] - Title of the Date Input (rendered as the legend)
 * @param {string} [props.hint] - Hint message of the Date Input
 * @param {boolean} [props.showDay] - Determines whether to show Day input field
 * @param {string} [props.errorMessage] - Error message to be shown
 * @param {boolean} [props.isRequired] - Determines whether to show an asterisk next to the title to indicate that Date Input is required
 * @param {string} [props.valueDay] - Default value of the Day input field
 * @param {string} [props.valueMonth] - Default value of the Month input field
 * @param {string} [props.valueYear] - Default value of the Year input field
 * @param {boolean} [props.errorDay] - Determines whether the Day field is in error (red border, aria-invalid) when errorMessage is set
 * @param {boolean} [props.errorMonth] - Determines whether the Month field is in error when errorMessage is set
 * @param {boolean} [props.errorYear] - Determines whether the Year field is in error when errorMessage is set
 * @param {string} [props.labelDay='Päev'] - Visible label of the Day field
 * @param {string} [props.labelMonth='Kuu'] - Visible label of the Month field
 * @param {string} [props.labelYear='Aasta'] - Visible label of the Year field
 */

const DateInputComponent = (props = {}) => {
  const {
    id: customId,
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
    labelDay = 'Päev',
    labelMonth = 'Kuu',
    labelYear = 'Aasta',
  } = props;

  const id = customId ?? uid('date-input', props);

  const describedBy = [hint && `${id}-hint`, errorMessage && `${id}-error`]
    .filter(Boolean)
    .join(' ');

  const field = ({ part, label, value, isError, extraClass = '' }) => {
    const fieldId = `${id}-${part}`;
    const hasError = Boolean(errorMessage && isError);
    return `<div class="tds-date-input__field${extraClass}">
      <label class="tds-date-input__label" for="${fieldId}">${label}</label>
      <input class="tds-input${hasError ? ' tds-input--error' : ''}" id="${fieldId}" name="${fieldId}" type="text" inputmode="numeric" autocomplete="off"${hasError ? ' aria-invalid="true"' : ''}${value ? ` value="${value}"` : ''} />
    </div>`;
  };

  return html`
<fieldset class="tds-fieldset tds-form-group tds-date-input${errorMessage ? ' tds-form-group--error' : ''}"${describedBy ? ` aria-describedby="${describedBy}"` : ''}>
  <legend class="tds-date-input__title">${title}${isRequired ? '<span class="tds-fieldset__required">*</span>' : ''}</legend>
  ${hint || errorMessage ? `<div class="tds-date-input__header">
    ${hint ? `<div id="${id}-hint" class="tds-date-input__hint">${hint}</div>` : ''}
    ${errorMessage ? `<div id="${id}-error" class="tds-error-message">${errorMessage}</div>` : ''}
  </div>` : ''}
  <div class="tds-date-input__fields">
    ${showDay ? field({ part: 'day', label: labelDay, value: valueDay, isError: errorDay }) : ''}
    ${field({ part: 'month', label: labelMonth, value: valueMonth, isError: errorMonth })}
    ${field({ part: 'year', label: labelYear, value: valueYear, isError: errorYear, extraClass: ' year' })}
  </div>
</fieldset>
  `;
};

export default DateInputComponent;
