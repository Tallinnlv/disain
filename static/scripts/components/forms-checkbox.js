/**
 * Checkbox group: "select all".
 *
 * Every checkbox with `data-select-all` controls the other checkboxes in its
 * group (the closest `.tds-checkboxes`, or fieldset). Both directions stay in
 * sync; when only some options are checked the select-all checkbox is set to
 * the native indeterminate state.
 */
(function () {
  function activeItems(items) {
    return items.filter((item) => !item.disabled);
  }

  function syncSelectAll(selectAll, items) {
    const active = activeItems(items);
    const checkedCount = active.filter((item) => item.checked).length;
    const allChecked = active.length > 0 && checkedCount === active.length;

    selectAll.checked = allChecked;
    selectAll.indeterminate = checkedCount > 0 && !allChecked;
    selectAll.classList.toggle(
      'tds-checkboxes__input--minus',
      selectAll.indeterminate,
    );
  }

  function init() {
    document
      .querySelectorAll('input[type="checkbox"][data-select-all]')
      .forEach((selectAll) => {
        if (selectAll.dataset.selectAllInitialised) return;

        const group =
          selectAll.closest('.tds-checkboxes') || selectAll.closest('fieldset');
        if (!group) return;

        const items = Array.from(
          group.querySelectorAll('input[type="checkbox"]'),
        ).filter(
          (item) => item !== selectAll && !item.hasAttribute('data-select-all'),
        );
        if (items.length === 0) return;
        selectAll.dataset.selectAllInitialised = 'true';

        // True while select-all is applying its state to the items, so the
        // change events it dispatches do not re-sync select-all halfway.
        let applying = false;

        selectAll.addEventListener('change', () => {
          const checked = selectAll.checked;
          applying = true;
          activeItems(items).forEach((item) => {
            if (item.checked === checked) return;
            item.checked = checked;
            // Let other listeners (validation, forms) know the value changed.
            item.dispatchEvent(new Event('change', { bubbles: true }));
          });
          applying = false;
          syncSelectAll(selectAll, items);
        });

        items.forEach((item) => {
          item.addEventListener('change', () => {
            if (!applying) syncSelectAll(selectAll, items);
          });
        });

        syncSelectAll(selectAll, items);
      });
  }

  init();
})();
