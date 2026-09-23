import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {Array<{label: string, href?: string}>} [props.items] - Breadcrumb items (preferred)
 * @param {string[]} [props.breadcrumbsTitles] - The breadcrumbs titles (legacy, used when items is absent)
 * @param {string[]} [props.links] - Per-item links matching breadcrumbsTitles by index
 * @param {string} [props.link = '#'] - Fallback link for items without their own href
 * @param {boolean} [props.collapseOnMobile=false] -  First and last items will be shown, the rest will be hidden
 * @param {boolean} [props.secondaryColor=false] -  Secondary color for breadcrumbs
 * @param {string} [props.ariaLabel='breadcrumb'] - Accessible name of the navigation landmark
 */

const BreadcrumbsComponent = ({
  items,
  breadcrumbsTitles = [],
  links = [],
  link = '#',
  collapseOnMobile = false,
  secondaryColor = false,
  ariaLabel = 'breadcrumb',
}) => {
  const crumbs = Array.isArray(items) && items.length > 0
    ? items.map((item) => (typeof item === 'string' ? { label: item } : item))
    : breadcrumbsTitles.map((label, index) => ({ label, href: links[index] }));

  let breadcrumbsHtml = '';

  crumbs.forEach((crumb, index) => {
    // The last crumb is the current page (APG: a link with aria-current).
    const isCurrent = index === crumbs.length - 1;

    breadcrumbsHtml += `
    <li class="tds-breadcrumbs__list-item">
      <a href="${crumb.href ?? link}" class="tds-breadcrumbs__link"${isCurrent ? ' aria-current="page"' : ''}>${crumb.label}</a>
      ${index === 0 ? '<span class="ellipsis" aria-hidden="true">...</span>' : ''}
    </li>`;
  });

  const collapseClass = collapseOnMobile
    ? ' tds-breadcrumbs--collapse-on-mobile'
    : '';

  return html`
<nav class="tds-breadcrumbs${collapseClass}${secondaryColor ? ' tds-breadcrumbs--secondary-color' : ''}" aria-label="${ariaLabel}">
  <ol class="tds-breadcrumbs__list">
    ${breadcrumbsHtml}
  </ol>
</nav>`;
};

export default BreadcrumbsComponent;
