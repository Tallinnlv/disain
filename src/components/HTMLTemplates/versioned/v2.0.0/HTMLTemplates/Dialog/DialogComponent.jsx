import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * Accessible Modal Dialog Component
 *
 * @param {object} props
 * @param {string} [props.id] - Id of the dialog element (the `[role="dialog"]`); derived from the props when omitted.
 *   A `<button data-dialog-open="<id>">` anywhere on the page opens it.
 * @param {string} props.title - The title of the modal
 * @param {string} props.content - The content of the modal
 * @param {boolean} [props.isOpen] - Whether the modal is open
 * @param {string} [props.size] - The size of the modal ('small', 'medium', 'large', 'fluid')
 * @param {string} [props.scrollType] - The type of scrolling ('body', 'viewport', or 'none')
 * @param {string} [props.secondaryLabel] - The label for the close button
 * @param {string} [props.primaryLabel] - The label for the accept button
 * @param {boolean} [props.secondaryButton] - The secondary button
 * @param {boolean} [props.dangerButton] - The danger button
 * @param {boolean} [props.closeButton] - The close ("X") button
 * @param {string} [props.closeLabel] - Accessible name of the close ("X") button
 * @param {boolean} [props.dismissible] - Whether Escape and clicking the scrim close the dialog
 */

const ModalDialog = (props) => {
  const {
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
    closeLabel = 'Sulge',
    dismissible = true,
  } = props;
  const id = props.id ?? uid('dialog', props);

  let scrollClass = '';
  if (scrollType === 'body') {
    scrollClass = ' tds-dialog--scroll-body';
  } else if (scrollType === 'viewport') {
    scrollClass = ' tds-dialog--scroll-viewport';
  }

  const primaryClass = dangerButton ? 'tds-button--danger' : 'tds-button--primary';

  return html`
<div class="tds-dialog-overlay${isOpen ? ' is-visible' : ''}${scrollType === 'viewport' ? ' is-scrollable' : ''}">
  <div
    id="${id}"
    role="dialog"
    aria-modal="true"
    aria-labelledby="${id}-title"
    aria-describedby="${id}-content"
    class="tds-dialog tds-dialog--${size}${scrollClass}"
    tabindex="-1"${dismissible ? '' : `
    data-dialog-static`}
  >
    <div class="tds-dialog__header">
      <h2 id="${id}-title" class="tds-dialog__title">${title}</h2>
      ${closeButton ? `<button class="tds-button--icon-neutral tds-button--icon--compact tds-notification-close" type="button" aria-label="${closeLabel}" data-dialog-close>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99974 11.1785L4.75566 16.4226L3.57715 15.2441L8.82123 9.99998L3.57715 4.7559L4.75566 3.57739L9.99974 8.82147L15.2438 3.57739L16.4223 4.7559L11.1782 9.99998L16.4223 15.2441L15.2438 16.4226L9.99974 11.1785Z" fill="#131416"/>
        </svg>
      </button>` : ''}
    </div>
    <div id="${id}-content" class="tds-dialog__body"${scrollType === 'body' ? ' tabindex="0"' : ''}>
      <p>${content}</p>
    </div>
    <div class="tds-dialog__footer">
      ${secondaryButton ? `<button class="tds-button tds-button--secondary-neutral" type="button" data-modal-close data-dialog-close>
        ${secondaryLabel}
      </button>` : ''}
      <button class="tds-button ${primaryClass}" type="button" data-modal-accept>
        ${primaryLabel}
      </button>
    </div>
  </div>
</div>
  `;
};

export default ModalDialog;
