import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {string} props.link - The link to the breadcrumb
 * @param {array} props.breadcrumbsTitles - The breadcrumbs titles
 * @param {boolean} [props.collapseOnMobile=false] -  First and last items will be shown, the rest will be hidden
 * @param {boolean} [props.secondaryColor=false] -  Secondary color for breadcrumbs
 */

const BreadcrumbsComponent = ({
  breadcrumbsTitles,
  link,
  collapseOnMobile = false,
  secondaryColor = false,
}) => {
  let breadcrumbsHtml = '';

  breadcrumbsTitles
    .forEach(
      (breadcrumb, index) => {
        breadcrumbsHtml += `
    <li class="tds-breadcrumbs__list-item" key="${index}">
      <a href="${link}" class="tds-breadcrumbs__link">${breadcrumb}</a>
      ${index === 0 ? '<span class="ellipsis">...</span>' : ''}
    </li>`;
      });

  const collapseClass = collapseOnMobile
    ? ' tds-breadcrumbs--collapse-on-mobile'
    : '';

  return html`
<nav class="tds-breadcrumbs${collapseClass}${secondaryColor ? ' tds-breadcrumbs--secondary-color' : ''}" aria-label="breadcrumb">
  <ol class="tds-breadcrumbs__list">
    ${breadcrumbsHtml}
  </ol>
</nav>`;
};

export default BreadcrumbsComponent;
