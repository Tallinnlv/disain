/**
 * @param {object} props
 * @param {number} props.page - The current page number
 * @param {number} props.total - The total number of pages
 * @param {boolean} [props.showPrev] - Whether to show the previous page link
 * @param {boolean} [props.showNext] - Whether to show the next page link
 * @param {boolean} [props.truncated] - Whether the pagination is truncated
 * @param {number} props.activePage - The active page number
 * @param {number[]} [props.pages] - Whether to show the next page link
 * @param {boolean} [props.currentPageMargin] - Adding class for current page margin
 */

export function PaginationComponent({
  page,
  total,
  showPrev = true,
  showNext = true,
  truncated = false,
  pages = [1, 7, 8, 9, 10, 11, total],
  activePage,
  currentPageMargin = false,
}) {
  const modifiedPages = pages.reduce((acc, currentValue, i, array) => {
    const nextValue = array[i + 1];
    if (nextValue - currentValue > 1) {
      acc.push(currentValue, '...');
    } else {
      acc.push(currentValue);
    }
    return acc;
  }, []);

  const html = String.raw;

  /**
   *
   * @param {'previous' | 'next'} direction
   * @param {boolean} show
   * @param {number} page
   * @param {number} total
   * @returns
   */
  function createButton(direction, show, page, total) {
    const isPrev = direction === 'previous';
    const isNext = direction === 'next';
    const shouldShow =
      (isPrev && show && page) || (isNext && show && page !== total);
    if (!shouldShow) return '';
    const svgPath = isPrev
      ? 'M11.793 4.29297L13.2073 5.70718L7.91436 11.0001H21.5002V13.0001H7.91437L13.2073 18.293L11.793 19.7072L4.08594 12.0001L11.793 4.29297Z'
      : 'M17.0858 11.0001L11.7929 5.70718L13.2071 4.29297L20.9142 12.0001L13.2071 19.7072L11.7929 18.293L17.0858 13.0001H3.5V11.0001H17.0858Z';

    return (
      shouldShow &&
      html` <div class="tds-pagination__${direction}">
        <a
          class="tds-pagination__link tds-button--tertiary"
          href="javascript:void(0);"
          rel="${direction}"
        >
          ${isPrev
            ? html`
                <svg
                  class="tds-pagination__icon tds-pagination__icon--${direction}"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  width="24"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                >
                  <path d="${svgPath}"></path>
                </svg>
              `
            : ''}
          <span class="tds-pagination__link-title">
            ${direction.replace(/^(.)/, (match, firstLetter) =>
              firstLetter.toUpperCase(),
            )}<span class="tds-visually-hidden"></span>
          </span>
          ${isNext
            ? html`
                <svg
                  class="tds-pagination__icon tds-pagination__icon--${direction}"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  width="24"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                >
                  <path d="${svgPath}"></path>
                </svg>
              `
            : ''}
        </a>
      </div>`
    );
  }

  const prevBtn = createButton('previous', showPrev, page, total);
  const nextBtn = createButton('next', showNext, page, total);

  const isFirstThreeItems = activePage === 1 && total > 2;
  const isLastThreeItems = activePage === total && total > 2;

  return html`<nav
    class="tds-pagination ${isFirstThreeItems
      ? 'tds-pagination--first-three-items-on-mobile'
      : ''} ${isLastThreeItems
      ? 'tds-pagination--last-three-items-on-mobile'
      : ''} ${truncated ? 'truncated' : ''}"
    aria-label="Pagination"
  >
    ${prevBtn}
    <ul class="tds-pagination__list">
      ${modifiedPages
        .map((pageNumber) => {
          if (pageNumber === '...') {
            return html`<li
              class="tds-pagination__item tds-pagination__item--ellipses"
            >
              ...
            </li>`;
          } else {
            return html` <li
              class="tds-pagination__item ${pageNumber === activePage
                ? `tds-pagination__item--current ${
                    currentPageMargin
                      ? 'tds-pagination__item--mobile-margin'
                      : ''
                  }`
                : ''} "
            >
              <a
                class="tds-link tds-pagination__link"
                href="javascript:void(0);"
                aria-label="Page ${pageNumber}"
                ${pageNumber === activePage ? 'aria-current="page"' : ''}
              >
                ${pageNumber}
              </a>
            </li>`;
          }
        })
        .join('')}
    </ul>
    ${nextBtn}
  </nav>`;
}

export default PaginationComponent;
