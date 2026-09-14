import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * @param {object} props
 * @param {string} [props.id] - Id of the popover; derived from the props when omitted.
 *   A `<button data-popover-toggle="<id>" aria-expanded="false">` on the page opens/closes it.
 * @param {string} [props.title] - Popover title
 * @param {string} [props.content] - Popover content
 * @param {string} [props.position] - Popover pointer position ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'left-top', 'left-center', 'left-bottom', 'right-top', 'right-center', 'right-bottom']
 * @param {string} [props.customStyle] - Custom styles for displaying on docusaurus
 * @param {boolean} [props.showLink] - Determines whether to show standalone Link in the Popover footer
 * @param {boolean} [props.showButtons] - Determines whether to show buttons in the Popover footer
 * @param {string} [props.href] - Target of the footer link
 * @param {string} [props.closeLabel] - Accessible name of the close button
 */

const PopoverComponent = (props) => {
  const {
    title,
    content,
    position = 'bottom-center',
    customStyle = '',
    showLink = false,
    showButtons = false,
    href = '#',
    closeLabel = 'Close popover',
  } = props;
  const id = props.id ?? uid('popover', props);
  const titleId = `${id}-title`;
  const contentId = `${id}-content`;

  return html`
  <div class="tds-popover" id="${id}" role="dialog" aria-labelledby="${title ? titleId : contentId}" tabindex="-1"${customStyle ? ` style="${customStyle}" data-demo-style=""` : ''}>
    <div class="tds-popover__wrapper">
      ${title ? `<div class="tds-popover__title" id="${titleId}">${title}</div>` : ''}
      <div class="tds-popover__content" id="${contentId}">${content}</div>
    </div>
    <button type="button" class="tds-button tds-button--icon" aria-label="${closeLabel}" data-popover-close>
      <span class="tds-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" aria-hidden="true" focusable="false">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0007 11.6785L4.75664 16.9226L3.57812 15.7441L8.8222 10.5L3.57812 5.2559L4.75664 4.07739L10.0007 9.32147L15.2448 4.07739L16.4233 5.2559L11.1792 10.5L16.4233 15.7441L15.2448 16.9226L10.0007 11.6785Z" fill="currentColor"/>
        </svg>
      </span>
    </button>
    ${showLink ? `<div class="tds-popover__footer_link">
      <a class="tds-link tds-link--standalone" href="${href}">Action</a>
    </div>` : ''}
    ${showButtons ? `<div class="tds-popover__footer_buttons">
      <button type="button" class="tds-button tds-button--tertiary-neutral">Cancel</button>
      <button type="button" class="tds-button tds-button--primary">Action</button>
    </div>` : ''}
    <svg class="tds-popover__pointer ${position}" xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M2 16L10 8L2 0L2 16Z" fill="currentColor"/>
      <path d="M0 15L7 8L0 1L0 15Z" fill="currentColor"/>
    </svg>
  </div>
  `;
};

export default PopoverComponent;
