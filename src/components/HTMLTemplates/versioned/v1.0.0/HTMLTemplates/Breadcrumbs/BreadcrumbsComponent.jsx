/**
 * @param {object} props
 * @param {string} props.link - The link to the breadcrumb
 * @param {array} props.breadcrumbsTitles - The breadcrumbs titles
 * @param {boolean} [props.collapseOnMobile=false] -  First and last items will be shown, the rest will be hidden
 * @param {boolean} [props.secondaryColor=false] -  Secondary color for breadcrumbs
 */

export function BreadcrumbsComponent({
  breadcrumbsTitles,
  link,
  collapseOnMobile = false,
  secondaryColor = false,
}) {
  const breadcrumbItems = breadcrumbsTitles
    .map(
      (breadcrumb, index) =>
        `<li class="tds-breadcrumbs__list-item" key=${index}>
        <a href="${link}" class="tds-breadcrumbs__link">${breadcrumb}</a>
         ${index === 0 ? '<span class="ellipsis">...</span>' : ''}
        </li>`,
    )
    .join('');

  const collapseClass = collapseOnMobile
    ? ' tds-breadcrumbs--collapse-on-mobile'
    : '';
  return `
  <nav class="tds-breadcrumbs${collapseClass} ${secondaryColor ? 'tds-breadcrumbs--secondary-color' : ''}" aria-label="breadcrumb">
        <ol class="tds-breadcrumbs__list">
          ${breadcrumbItems}
        </ol>
      </nav>`;
}

export default BreadcrumbsComponent;
