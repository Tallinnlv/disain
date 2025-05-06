/**
 * Accessible Modal Dialog Component
 *
 * @param {object} props
 * @param {string} props.title - The title of the modal
 * @param {string} props.content - The content of the modal
 * @param {boolean} [props.isOpen] - Whether the modal is open
 * @param {string} [props.size] - The size of the modal ('small', 'medium', 'large')
 * @param {string} [props.scrollType] - The type of scrolling ('body', 'viewport', or 'none')
 * @param {string} [props.secondaryLabel] - The label for the close button
 * @param {string} [props.primaryLabel] - The label for the accept button
 * @param {boolean} [props.secondaryButton] - The secondary button
 * @param {boolean} [props.dangerButton] - The danger button
 * @param {boolean}  [props.closeButton] - The close button
 */
export function ModalDialog({
  title,
  content,
  isOpen = true,
  size = 'medium',
  secondaryLabel = 'Close',
  primaryLabel = 'Accept',
  scrollType = 'none',
  secondaryButton = true,
  closeButton = false,
  dangerButton = false,
}) {
  const id = 'modal-default';
  const html = String.raw;

  let scrollClass = '';
  if (scrollType === 'body') {
    scrollClass = 'tds-dialog--scroll-body';
  } else if (scrollType === 'viewport') {
    scrollClass = 'tds-dialog--scroll-viewport';
  }

  const modalHtml = html`
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="${id}-title"
      aria-describedby="${id}-content"
      class="tds-dialog-overlay ${isOpen ? 'is-visible' : ''}  ${scrollClass
        ? scrollClass === 'tds-dialog--scroll-body'
          ? ''
          : 'is-scrollable'
        : ''}"
      tabindex="-1"
    >
      <div class="tds-dialog tds-dialog--${size} ${scrollClass}">
        <div class="tds-dialog__header">
          <h2 id="${id}-title" class="tds-dialog__title">${title}</h2>
          ${closeButton
            ? `<button
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
        <div id="${id}-content" class="tds-dialog__body">
          <p>${content}</p>
        </div>
        <div class="tds-dialog__footer">
          ${secondaryButton
            ? `<button
        type="button"
        class="tds-button tds-button--secondary-neutral"
        aria-label="${secondaryLabel}"
        data-modal-close
      >
        ${secondaryLabel}
      </button>`
            : ''}
          ${dangerButton
            ? `<button
        type="button"
        class="tds-button tds-button--danger"
        aria-label="${primaryLabel}"
        data-modal-accept
      >
        ${primaryLabel}
      </button>`
            : `<button
        type="button"
        class="tds-button tds-button--primary"
        aria-label="${primaryLabel}"
        data-modal-accept
      >
        ${primaryLabel}
      </button>`}
        </div>
      </div>
    </div>
  `;

  return modalHtml;
}

export default ModalDialog;
