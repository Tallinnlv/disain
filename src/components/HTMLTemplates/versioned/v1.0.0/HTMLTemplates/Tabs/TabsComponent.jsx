/**
 * @param {object} props
 * @param {Array} props.sections - The sections of the tabs
 * @param {object} props.sections[] - A section of the tabs
 * @param {string} props.sections[].heading - The heading of the section
 * @param {string} props.sections[].content - The content of the section
 * @param {boolean} props.scrollable - Whether the tabs are scrollable
 * @param {boolean} [props.borderless] - Component borderless
 * @param {boolean} [props.content] - Whether the content is displayed
 * @param {boolean} [props.compact] - Compact state for tabs
 */

export function TabsComponent({
  sections,
  scrollable,
  borderless,
  content = true,
  compact = false,
}) {
  const id = 'tabs-default';
  const html = String.raw;

  const renderTabList = () => {
    return sections
      .map((section, index) => {
        const tabId = `${id}-tab-${index + 1}`;
        const panelId = `${id}-panel-${index + 1}`;
        return html`
          <li role="presentation">
            <button
              role="tab"
              id="${tabId}"
              aria-controls="${panelId}"
              class="tds-tabs__tab-button"
              aria-selected="${index === 0 ? 'true' : 'false'}"
              tabindex="${index === 0 ? '0' : '-1'}"
            >
              ${section.heading}
            </button>
          </li>
        `;
      })
      .join('');
  };

  const renderTabPanels = () => {
    return sections
      .map((section, index) => {
        const tabId = `${id}-tab-${index + 1}`;
        const panelId = `${id}-panel-${index + 1}`;
        return content
          ? html`
              <div
                role="tabpanel"
                id="${panelId}"
                aria-labelledby="${tabId}"
                class="tds-tabs__panel"
                ${index !== 0 ? 'hidden' : ''}
              >
                <p class="tds-body-content">${section.content}</p>
              </div>
            `
          : '';
      })
      .join('');
  };

  const tabsHtml = html`
    <div
      class="tds-tabs ${compact ? 'tds-tabs--compact' : ''}"
      id="${id}"
      data-module="tds-tabs"
    >
      <div class="tds-tabs__scroll-container">
        <button
          class="tds-tabs__scroll-button tds-tabs__scroll-left"
          aria-label="Scroll left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.3184 4.76904L16.6831 6.23115L9.96634 12.5001L16.6831 18.769L15.3184 20.2312L7.03516 12.5001L15.3184 4.76904Z"
              fill="#2A2C2D"
            />
          </svg>
        </button>
        <div class="tds-tabs__list-container">
          <ul
            role="tablist"
            class="tds-tabs__list ${scrollable
              ? 'tds-tabs__list--scrollable'
              : ''} ${borderless ? 'tds-tabs__list--borderless' : ''}"
          >
            ${renderTabList()}
          </ul>
        </div>
        <button
          class="tds-tabs__scroll-button tds-tabs__scroll-right"
          aria-label="Scroll right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.0351 12.5001L7.31836 6.23115L8.683 4.76904L16.9663 12.5001L8.683 20.2312L7.31836 18.769L14.0351 12.5001Z"
              fill="#2A2C2D"
            />
          </svg>
        </button>
      </div>
      ${renderTabPanels()}
    </div>
  `;

  return tabsHtml;
}

export default TabsComponent;
