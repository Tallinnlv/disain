import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * @param {object} props
 * @param {string} [props.id] - Id of the tabs; derived from the props when omitted
 * @param {Array} props.sections - The sections of the tabs
 * @param {object} props.sections[] - A section of the tabs
 * @param {string} props.sections[].heading - The heading of the section
 * @param {string} props.sections[].content - The content of the section
 * @param {boolean} [props.sections[].disabled] - Whether the tab is disabled
 * @param {boolean} [props.sections[].selected] - Whether the tab is initially selected (defaults to the first enabled tab)
 * @param {boolean} props.scrollable - Whether the tabs are scrollable
 * @param {boolean} [props.borderless] - Component borderless
 * @param {boolean} [props.content] - Whether the content is displayed
 * @param {boolean} [props.compact] - Compact state for tabs
 * @param {string} [props.scrollLeftLabel] - Accessible name of the "scroll left" arrow
 * @param {string} [props.scrollRightLabel] - Accessible name of the "scroll right" arrow
 */

const TabsComponent = (props) => {
  const {
    sections = [],
    scrollable = false,
    borderless = false,
    content = true,
    compact = false,
    scrollLeftLabel = 'Scroll left',
    scrollRightLabel = 'Scroll right',
  } = props;
  const id = props.id ?? uid('tabs', props);

  // Initially selected tab: the first enabled one marked `selected`,
  // otherwise the first enabled tab.
  const isEnabled = (section) => section.disabled !== true;
  let selectedIndex = sections.findIndex(
    (section) => section.selected === true && isEnabled(section),
  );
  if (selectedIndex === -1) selectedIndex = sections.findIndex(isEnabled);
  // The roving tabindex needs one tabbable tab even if every tab is disabled.
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex;

  let tabsListHtml = '';
  let tabPanelsHtml = '';

  sections.forEach((section, index) => {
    const tabId = `${id}-tab-${index + 1}`;
    const panelId = `${id}-panel-${index + 1}`;
    const isDisabled = section.disabled === true;
    const isSelected = index === selectedIndex;

    tabsListHtml += `
        <li role="presentation">
          <button type="button" class="tds-tabs__tab-button${isDisabled ? ' tds-tabs__tab-button--disabled' : ''}" role="tab" id="${tabId}"${content ? ` aria-controls="${panelId}"` : ''} aria-selected="${isSelected ? 'true' : 'false'}" tabindex="${index === tabbableIndex ? '0' : '-1'}"${isDisabled ? ' aria-disabled="true"' : ''}>${section.heading}</button>
        </li>
    `;

    tabPanelsHtml += content ? `
  <div class="tds-tabs__panel" role="tabpanel" id="${panelId}" aria-labelledby="${tabId}" tabindex="0"${isSelected ? '' : ' hidden'}>
    <p class="tds-body-content">${section.content}</p>
  </div>
        ` : '';
  });

  return html`
<div class="tds-tabs${compact ? ' tds-tabs--compact' : ''}" id="${id}" data-module="tds-tabs">
  <div class="tds-tabs__scroll-container">
    <button type="button" class="tds-tabs__scroll-button tds-tabs__scroll-left" aria-label="${scrollLeftLabel}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" aria-hidden="true" focusable="false">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.3184 4.76904L16.6831 6.23115L9.96634 12.5001L16.6831 18.769L15.3184 20.2312L7.03516 12.5001L15.3184 4.76904Z" fill="#2A2C2D" />
      </svg>
    </button>
    <div class="tds-tabs__list-container">
      <ul class="tds-tabs__list${scrollable ? ' tds-tabs__list--scrollable' : ''}${borderless ? ' tds-tabs__list--borderless' : ''}" role="tablist">
        ${tabsListHtml}
      </ul>
    </div>
    <button type="button" class="tds-tabs__scroll-button tds-tabs__scroll-right" aria-label="${scrollRightLabel}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" aria-hidden="true" focusable="false">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0351 12.5001L7.31836 6.23115L8.683 4.76904L16.9663 12.5001L8.683 20.2312L7.31836 18.769L14.0351 12.5001Z" fill="#2A2C2D" />
      </svg>
    </button>
  </div>
  ${tabPanelsHtml}
</div>
  `;
};

export default TabsComponent;
