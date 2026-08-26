/**
 * @param {object} props
 * @param {string} [props.contentBefore] - The text before the tooltip
 * @param {boolean} [props.isButton] - Button rendered
 * @param {boolean} [props.isText] - Text rendered
 * @param {string} [props.contentAfter] - The text after the tooltip
 * @param {string} props.tooltipText - The tooltip content
 * @param {string} [props.position='top'] - Tooltip position ('top', 'bottom', 'left', 'right')
 * @param {boolean} [props.tooltipVisible=false] - Tooltip visibility
 */
export function TooltipComponent({
  contentBefore = '',
  isButton,
  contentAfter = '',
  tooltipText,
  position = 'top',
  tooltipVisible = false,
  isText,
}) {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  return `
    <div class="container">
      ${
        isButton
          ? `<button
      type="button"
      class="tooltip-target tds-button tds-button--icon-neutral      "
      aria-label="Muuda"
      aria-describedby="${tooltipId}"
    >
        <span class="tds-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4142 6.99991L17 2.58569L4.09706 15.4887L3.02988 19.7574C2.94468 20.0981 3.04453 20.4586 3.29291 20.707C3.54129 20.9554 3.90178 21.0552 4.24256 20.97L8.51127 19.9029L21.4142 6.99991ZM5.37439 18.6255L5.90299 16.5112L17 5.41412L18.5858 6.99991L7.48877 18.0969L5.37439 18.6255ZM12 20.9999H20V18.9999H12V20.9999Z" fill="currentColor"/>
          </svg>
        </span>

    </button>`
          : ''
      }

      ${
        isText
          ? `<div  class="tooltip-target tds-body-md tds-color-content-default" aria-describedby="${tooltipId}"
      data-position="${position}">GDPR</div>`
          : ''
      }
       
      <div 
        id="${tooltipId}" 
        class="tds-tooltip ${tooltipVisible ? `tds-tooltip--visible` : ''}" 
        role="tooltip" 
        data-position="${position}"
      >
        ${tooltipText}
      </div>
    </div>
  `;
}

export default TooltipComponent;
