import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {Array} props.sections - The sections of the accordion
 * @param {object} props.sections[] - A section of the accordion
 * @param {string} props.sections[].heading - The heading of the section
 * @param {string} props.sections[].content - The content of the section
 * @param {boolean} props.sections[].expanded - Whether the section is expanded
 * @param {string|function} props.sections[].suffix - The suffix for the section (text, number, or a render function).
 * @param {boolean} [props.showSuffix] - Whether to show icons in the accordion
 */

const AccordionComponent = ({
  sections,
  showSuffix = false
}) => {
  const id = 'accordion-default';

  const renderSuffix = (suffix) => {
    if (!suffix) return '';

    // If suffix is a function, render the custom element
    if (typeof suffix === 'function') {
      return suffix();
    }

    // Otherwise, render the suffix as text or number
    return `<span class="tds-badge tds-badge--align-left">${suffix}</span>`;
  };

  let sectionsHtml = '';

  sections.forEach((section, index) => {
    const headingId = `${id}-heading-${index + 1}`;
    const contentId = `${id}-content-${index + 1}`;
    sectionsHtml += `
  <div class="tds-accordion__section${section.expanded ? ` tds-accordion__section--expanded` : ''}">
    <div class="tds-accordion__section-header">
      <h2 class="tds-accordion__section-heading">
        <button
          type="button"
          aria-controls="${contentId}"
          class="tds-accordion__section-button"
          aria-expanded="false"
          aria-label="${section.heading}, Show this section"
        >
          <span class="tds-accordion__section-toggle" data-nosnippet="">
            <span class="tds-accordion__section-toggle-focus">
              <span class="tds-accordion-nav__chevron ${section.expanded ? `tds-accordion-nav__chevron--up` : `tds-accordion-nav__chevron--down`}">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.69189 11.5764L7.64137 9.7569L16 18.7125L24.3586 9.7569L26.308 11.5764L16 22.6208L5.69189 11.5764Z" fill="#131416"/>
                </svg>
              </span>
            </span>
            <span class="tds-accordion__section-heading-text" id="${headingId}">
            <span class="tds-accordion__section-heading-text-focus">${section.heading}</span>
          </span>
          ${showSuffix ? renderSuffix(section.suffix) : ''}
          </span>
        </button>
      </h2>
    </div>
    <div id="${contentId}" class="tds-accordion__section-content"${section.expanded ? `` : ` hidden="until-found"`}>
      <p class="tds-body">${section.content}</p>
    </div>
  </div>
    `;
  });

  return html`
<div class="tds-accordion" data-module="tds-accordion" id="${id}">
  ${sectionsHtml}
</div>
  `;
};

export default AccordionComponent;
