/**
 * @param {object} props
 * @param {array} [props.modifiers] - Additional CSS classes
 * @param {string} [props.title=''] - The title of the notification
 * @param {boolean} [props.dismissible = false] - Whether the notification is dismissible
 * @param {array} [props.buttons=[]] - The buttons for the notification
 * @param {boolean} [props.iconSuccess=false] - Whether the notification has a success icon
 * @param {boolean} [props.iconDanger=false] - Whether the notification has a danger icon
 * @param {boolean} [props.iconNeutral=false] - Whether the notification has a neutral icon
 * @param {string} [props.ariaLabel=''] - Custom aria-label for accessibility
 */

export function NotificationComponent({
  modifiers = [],
  title = '',
  dismissible = false,
  buttons = [],
  iconSuccess = false,
  iconDanger = false,
  iconNeutral = false,
  ariaLabel = '',
}) {
  const html = String.raw;

  const buttonItems = buttons
    .map(
      (button, index) =>
        html`<a
          key=${index}
          href="${button.link}"
          class="tds-button tds-button--tertiary-neutral"
          >${button.text}</a
        >`,
    )
    .join('');

  const successIcon = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
  >
    <circle cx="16" cy="16" r="16" fill="#017E31" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.224 9.86711L14.7406 23.2555L7.48642 16.6058L9.51359 14.3944L14.2594 18.7447L21.776 8.13306L24.224 9.86711Z"
      fill="white"
    />
  </svg>`;

  const dangerIcon = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="30"
    viewBox="0 0 32 30"
    fill="none"
  >
    <path
      d="M14.2526 1.07143C15.0292 -0.357142 16.9708 -0.357143 17.7474 1.07143L31.7267 26.7857C32.5033 28.2143 31.5325 30 29.9793 30H2.02074C0.467492 30 -0.50329 28.2143 0.273335 26.7857L14.2526 1.07143Z"
      fill="#D51A27"
    />
    <path d="M14.25 10H17.75L17.25 20H14.75L14.25 10Z" fill="white" />
    <path
      d="M16 25C16.9665 25 17.75 24.2165 17.75 23.25C17.75 22.2835 16.9665 21.5 16 21.5C15.0335 21.5 14.25 22.2835 14.25 23.25C14.25 24.2165 15.0335 25 16 25Z"
      fill="white"
    />
  </svg>`;

  const neutralIcon = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
  >
    <circle cx="16" cy="16" r="16" fill="#0072CE" />
    <path
      d="M15.75 11C16.7165 11 17.5 10.2165 17.5 9.25C17.5 8.2835 16.7165 7.5 15.75 7.5C14.7835 7.5 14 8.2835 14 9.25C14 10.2165 14.7835 11 15.75 11Z"
      fill="white"
    />
    <path d="M13.5 13H17.5V21H18.5V23H13.5V21H14.5V15H13.5V13Z" fill="white" />
  </svg>`;

  const role = iconDanger ? 'alert' : 'status';

  const ariaLabelText = iconSuccess
    ? `${title || ''}`.trim()
    : iconDanger
      ? `Critical alert: ${title || ''}`.trim()
      : iconNeutral
        ? `Information: ${title || ''}`.trim()
        : `Notification: ${title || ''}`.trim();

  return html`
    <div
      class="tds-notification ${modifiers.join(' ')} ${dismissible
        ? 'tds-notification-dismissible'
        : ''}"
      role="${role}"
      ${ariaLabelText ? `aria-label="${ariaLabelText}"` : ''}
    >
      ${iconSuccess
        ? `<div class="tds-notification-icon">${successIcon}</div>`
        : ''}
      ${iconDanger
        ? `<div class="tds-notification-icon">${dangerIcon}</div>`
        : ''}
      ${iconNeutral
        ? `<div class="tds-notification-icon">${neutralIcon}</div>`
        : ''}
      <div class="tds-notification-content">
        ${title
          ? `<p class="tds-notification-title" id="notification-title">${title}</p>`
          : ''}
        ${buttons.length > 0
          ? `<div class="tds-notification-buttons">${buttonItems}</div>`
          : ''}
      </div>
      ${dismissible
        ? `  <button
      type="button"
      class="tds-button--icon-neutral tds-button--icon--compact tds-notification-close"
      aria-label="Sulge"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99974 11.1785L4.75566 16.4226L3.57715 15.2441L8.82123 9.99998L3.57715 4.7559L4.75566 3.57739L9.99974 8.82147L15.2438 3.57739L16.4223 4.7559L11.1782 9.99998L16.4223 15.2441L15.2438 16.4226L9.99974 11.1785Z" fill="#131416"/>
      </svg>
    </button>`
        : ''}
    </div>
  `;
}

export default NotificationComponent;
