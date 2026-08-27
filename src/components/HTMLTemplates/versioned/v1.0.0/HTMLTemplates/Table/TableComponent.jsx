/**
 * @param {object} props
 * @param {Array} props.columns - Array of objects representing table headers
 * @param {Array} props.data - Array of objects representing table data
 * @param {boolean} [props.borderIcons] - Optional boolean to render border icons instead of color icons
 * @param {Array} [props.colors] - Optional array of objects representing light and dark mode colors
 * @param {string} [props.caption] - The table caption for accessibility
 * @param {boolean} [props.compact] - Compact mode for table
 * @param {boolean} [props.sortable] - Enable sorting functionality
 * @param {boolean} [props.multiSelect] - Enable multi-select functionality
 * @param {boolean} [props.alignRight] - Align text to the right to the whole table
 * @param {boolean} [props.headerAlignRight] - Align text to the right to specific column
 * @param {boolean} [props.alignRightLastColumn] - Align text to the right to last column
 * @param {boolean} [props.hasHeader]  - Render the table with or without headers
 * @param {boolean} [props.collapsed]  - Table collapsed variant for small and simple tables (mobile).
 * @returns {string} HTML string representing the table component
 */

export function TableComponent({
  columns,
  data,
  colors = [], // Default to an empty array if not provided
  caption,
  compact = false,
  sortable = false,
  collapsed = false,
  alignRightLastColumn = false,
  multiSelect = false,
  borderIcons = false,
  alignRight = false,
  hasHeader = true,
}) {
  const id = 'table-component';
  const html = String.raw;

  const renderTableHeaders = () => {
    return columns
      .map((column, index) => {
        return html`
          <th
            class="tds-table__header ${alignRight && index % 2 !== 0
              ? 'tds-table__header--right'
              : ''} ${column.headerAlignRight
              ? 'tds-table__header--right'
              : ''} ${column.sortable ? 'tds-table__header--sortable' : ''}"
            data-key="${column.key}"
            ${column.sortable ? 'data-sortable="true"' : ''}
            scope="col"
          >
            <div>
              <span> ${column.label}</span>

              ${column.sortable
                ? html` <span class="tds-table__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.47178 5.52837L4.66704 1.72363L0.862305 5.52837L1.80511 6.47118L4.00038 4.27592V13.3331H5.33371V4.27592L7.52897 6.47118L8.47178 5.52837ZM15.1384 10.4712L11.3337 14.2759L7.52897 10.4712L8.47178 9.52837L10.667 11.7236V2.66645H12.0004V11.7236L14.1956 9.52837L15.1384 10.4712Z"
                        fill="#777A7E"
                      />
                    </svg>
                  </span>`
                : ''}
            </div>
          </th>
        `;
      })
      .join('');
  };

  // Helper function to render table rows
  const renderTableRows = () => {
    return data
      .map(
        (row, rowIndex) => html`
          <tr
            class="tds-table__row  ${row.multiSelect === 'checked'
              ? `tds-table__row--selected`
              : ''}"
          >
            ${multiSelect
              ? html`<td class="tds-table__cell">
                  <div
                    class="tds-checkboxes__item tds-checkboxes__item--compact"
                  >
                    <input
                      type="checkbox"
                      id="checkbox0-0"
                      class="tds-checkboxes__input"
                      name="checkboxGroup0"
                      ${row.multiSelect === 'checked' ? `checked` : ''}
                    />
                  </div>
                </td>`
              : ''}
            ${columns
              .map(
                (column, columnIndex) => html`
                  <td
                    class="tds-table__cell ${alignRight && columnIndex % 2 !== 0
                      ? 'tds-table__cell--right'
                      : ''} ${alignRightLastColumn &&
                    columnIndex === columns.length - 1
                      ? 'tds-table__cell--right'
                      : ''} ${column.alignRight
                      ? 'tds-table__cell--right'
                      : ''}"
                    ${column.key === 'darkMode'
                      ? 'style="background-color: #131416; color: white;" data-demo-style=""'
                      : ''}
                    data-title="${column.label}"
                    data-key="${column.key}"
                  >
                    ${column.key === 'lightMode' && colors[rowIndex]
                      ? html`
                          <div style="display: flex; align-items: center;" data-demo-style="">
                            ${borderIcons
                              ? html`<span
                                  class="border-icon"
                                  style="border-color: ${colors[rowIndex]
                                    .light}; margin-right: 8px;" data-demo-style=""
                                  aria-label="Light mode border color for ${row[
                                    column.key
                                  ]}"
                                  role="img"
                                ></span>`
                              : html`<span
                                  class="color-icon"
                                  style="background-color: ${colors[rowIndex]
                                    .light}; margin-right: 8px;" data-demo-style=""
                                  aria-label="Light mode color for ${row[
                                    column.key
                                  ]}"
                                  role="img"
                                ></span>`}
                            ${row[column.key]}
                          </div>
                        `
                      : column.key === 'darkMode' && colors[rowIndex]
                        ? html`
                            <div style="display: flex; align-items: center;" data-demo-style="">
                              ${borderIcons
                                ? html`<span
                                    class="border-icon"
                                    style="border-color: ${colors[rowIndex]
                                      .dark}; margin-right: 8px;" data-demo-style=""
                                    aria-label="Dark mode border color for ${row[
                                      column.key
                                    ]}"
                                    role="img"
                                  ></span>`
                                : html`<span
                                    class="color-icon"
                                    style="background-color: ${colors[rowIndex]
                                      .dark}; margin-right: 8px;" data-demo-style=""
                                    aria-label="Dark mode color for ${row[
                                      column.key
                                    ]}"
                                    role="img"
                                  ></span>`}
                              ${row[column.key]}
                            </div>
                          `
                        : row[column.key]}
                  </td>
                `,
              )
              .join('')}
          </tr>
        `,
      )
      .join('');
  };

  const tableHtml = html`
    <div
      class="tds-table-container ${compact
        ? 'tds-table-container--compact'
        : ''}"
    >
      ${multiSelect
        ? `<div class="tds-table-container__multiselect-container">`
        : ''}
      ${caption
        ? html`<div class="tds-table-container__caption">${caption}</div>`
        : ''}
      ${multiSelect
        ? `<div class="tds-table-container__selection">
        <span class="tds-table-container__selection-counter">2 rows selected</span>
        <button
      type="button"
      class="tds-button tds-button--compact-m tds-button--tertiary-neutral tds-button--icon-left"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.33301 3C7.41253 3 6.66634 3.74619 6.66634 4.66667V5.5H3.33301V7.16667H4.19779L4.52199 15.5961C4.57361 16.9384 5.67681 18 7.02014 18H12.9792C14.3225 18 15.4257 16.9384 15.4774 15.5961L15.8016 7.16667H16.6664V5.5H13.333V4.66667C13.333 3.74619 12.5868 3 11.6663 3H8.33301ZM11.6663 5.5V4.66667H8.33301V5.5H11.6663ZM6.18742 15.532L5.86569 7.16667H14.1337L13.8119 15.532C13.7947 15.9795 13.427 16.3333 12.9792 16.3333H7.02014C6.57236 16.3333 6.20463 15.9795 6.18742 15.532ZM7.49967 14.6666V8.83331H9.16634L9.16634 14.6666H7.49967ZM10.833 8.83333V14.6667H12.4997V8.83333H10.833Z" fill="#131416"/>
</svg>
     Delete
    </button>
        </div>
        `
        : ''}
      ${multiSelect ? html`</div>` : ''}
      <table
        class="tds-table ${compact ? 'tds-table--compact' : ''} ${collapsed
          ? 'tds-table--collapsed'
          : ''}"
        id="${id}"
      >
        ${hasHeader
          ? html` <thead class="tds-table__head">
              <tr class="tds-table__row">
                ${multiSelect
                  ? html`<th class="tds-table__header" scope="col">
                      <div
                        class="tds-checkboxes__item tds-checkboxes__item--compact"
                      >
                        <input
                          type="checkbox"
                          id="checkbox0-0"
                          class="tds-checkboxes__input tds-checkboxes__input--minus"
                          name="checkboxGroup0"
                          checked
                        />
                      </div>
                    </th>`
                  : ''}
                ${renderTableHeaders()}
              </tr>
            </thead>`
          : ''}
        <tbody class="tds-table__body">
          ${renderTableRows()}
        </tbody>
      </table>
      ${data.length === 0
        ? html`<div class="tds-table-container__empty-state" role="status">
            <span class="tds-table-container__empty-state__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
              >
                <path
                  d="M8 30V46H56V30M8 30H25L26 34H38L39 30H56M8 30L20 19H44L56 30"
                  stroke="#131416"
                  stroke-width="2"
                />
              </svg>
            </span>
            Andmed puuduvad
          </div>`
        : ''}
    </div>
  `;

  return tableHtml;
}

export default TableComponent;
