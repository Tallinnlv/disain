document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('#table-component');
  const headers = table.querySelectorAll('.tds-table__header--sortable');
  let currentSortConfig = { key: '', direction: 'asc' };

  headers.forEach((header) => {
    // Add tabindex for focusability
    header.setAttribute('tabindex', '0');

    // Handle click for mouse interaction
    header.addEventListener('click', () => handleSort(header));

    // Handle keydown for keyboard interaction
    header.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling for Space key
        handleSort(header);
      }
    });
  });

  function handleSort(header) {
    const key = header.getAttribute('data-key');
    const isSortable = header.getAttribute('data-sortable') === 'true';

    if (isSortable) {
      // Determine if the clicked column is different from the current column
      if (currentSortConfig.key !== key) {
        // If a new column is clicked, reset to 'asc'
        currentSortConfig = { key, direction: 'asc' };
      } else {
        // If the same column is clicked, toggle the direction
        currentSortConfig.direction =
          currentSortConfig.direction === 'asc' ? 'desc' : 'asc';
      }

      // Sort the table and update header icons
      sortTableData(table, key, currentSortConfig.direction);
      updateHeaderIcons(header, currentSortConfig.direction);
    }
  }

  function sortTableData(table, key, direction) {
    const rowsArray = Array.from(
      table.querySelectorAll('.tds-table__row'),
    ).slice(1);
    const sortedRows = rowsArray.sort((a, b) => {
      const cellA =
        a.querySelector(`[data-key="${key}"]`)?.innerText.trim() || '';
      const cellB =
        b.querySelector(`[data-key="${key}"]`)?.innerText.trim() || '';

      if (cellA < cellB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (cellA > cellB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const tbody = table.querySelector('.tds-table__body');
    tbody.innerHTML = '';
    sortedRows.forEach((row) => tbody.appendChild(row));
  }

  function updateHeaderIcons(activeHeader, direction) {
    headers.forEach((header) => {
      header.querySelector('.tds-table__icon').innerHTML = `<svg
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
                    </svg>`; // Reset icon for all headers
    });

    // Clear icon classes from all header icons
    document.querySelectorAll('.tds-table__icon').forEach((icon) => {
      icon.classList.remove('sort-asc', 'sort-desc');
    });

    let iconSpan = activeHeader.querySelector('.tds-table__icon');
    if (!iconSpan) {
      iconSpan = document.createElement('span');
      iconSpan.classList.add('tds-table__icon');
      activeHeader.appendChild(iconSpan);
    }

    iconSpan.innerHTML = `
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
            d="M8.66704 2.3335V11.3907L12.1956 7.86209L13.1384 8.8049L8.00038 13.943L2.8623 8.8049L3.80511 7.86209L7.33371 11.3907V2.3335H8.66704Z"
            fill="#131416"
          />
        </svg>
      `;

    if (direction === 'asc') {
      iconSpan.classList.add('sort-asc');
      iconSpan.classList.remove('sort-desc');
    } else {
      iconSpan.classList.add('sort-desc');
      iconSpan.classList.remove('sort-asc');
    }
  }
});
