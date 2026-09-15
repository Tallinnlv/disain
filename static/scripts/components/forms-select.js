/*
 * Select (custom listbox) — WAI-ARIA "select-only combobox" pattern.
 *
 * Focus always stays on the combobox button; the highlighted option is
 * announced through aria-activedescendant. Every `.tds-select` on the page
 * is initialised independently.
 */
(function () {
  const HIGHLIGHT_CLASS = 'tds-dropdown__option--focused';
  const TYPEAHEAD_TIMEOUT = 500;

  function initSelect(root) {
    if (root.dataset.selectInitialised) return;

    const button = root.querySelector('.tds-form-control');
    const listbox = root.querySelector('[role="listbox"]');
    if (!button || !listbox) return;

    root.dataset.selectInitialised = 'true';

    const options = Array.from(listbox.querySelectorAll('[role="option"]'));
    const valueText = button.querySelector('.tds-form-control__placeholder');
    const icon = button.querySelector('.tds-select__icon');
    let activeIndex = -1;
    let searchString = '';
    let searchTimer = null;

    const isOpen = () => !listbox.hidden;

    const selectedIndex = () =>
      options.findIndex(
        (option) => option.getAttribute('aria-selected') === 'true',
      );

    // Move the visual + aria-activedescendant highlight (no real focus move).
    function highlight(index) {
      activeIndex = index;
      options.forEach((option, i) => {
        option.classList.toggle(HIGHLIGHT_CLASS, i === index);
      });

      if (index > -1 && options[index].id) {
        button.setAttribute('aria-activedescendant', options[index].id);
      } else {
        button.removeAttribute('aria-activedescendant');
      }
      if (index > -1) options[index].scrollIntoView({ block: 'nearest' });
    }

    function open() {
      if (isOpen() || options.length === 0) return;
      listbox.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      if (icon) icon.classList.add('arrow-up');
      highlight(Math.max(selectedIndex(), 0));
    }

    function close() {
      if (!isOpen()) return;
      listbox.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      if (icon) icon.classList.remove('arrow-up');
      highlight(-1);
    }

    function select(index) {
      if (index < 0 || index >= options.length) return;
      options.forEach((option, i) => {
        option.setAttribute('aria-selected', String(i === index));
      });
      if (valueText) valueText.textContent = options[index].textContent.trim();
    }

    // Jump to the next option whose label starts with the typed characters;
    // repeating the same character cycles through options starting with it.
    function typeahead(character) {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        searchString = '';
      }, TYPEAHEAD_TIMEOUT);
      searchString += character.toLowerCase();

      const sameCharacter = searchString
        .split('')
        .every((c) => c === searchString[0]);
      const query = sameCharacter ? searchString[0] : searchString;
      const start = activeIndex + 1;

      for (let i = 0; i < options.length; i += 1) {
        const index = (start + i) % options.length;
        const label = options[index].textContent.trim().toLowerCase();
        if (label.startsWith(query)) {
          highlight(index);
          return;
        }
      }
    }

    // `key` can be missing on the fake keydown Chromium fires for autofill.
    const isPrintable = (event) =>
      (event.key || '').length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey;

    button.addEventListener('click', () => {
      if (isOpen()) {
        close();
      } else {
        open();
      }
    });

    button.addEventListener('keydown', (event) => {
      const key = event.key || '';
      const last = options.length - 1;

      if (!isOpen()) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(key)) {
          event.preventDefault();
          open();
          if (key === 'Home') highlight(0);
          if (key === 'End') highlight(last);
        } else if (isPrintable(event)) {
          event.preventDefault();
          open();
          typeahead(key);
        }
        return;
      }

      switch (key) {
        case 'ArrowDown':
          highlight(Math.min(activeIndex + 1, last));
          break;
        case 'ArrowUp':
          highlight(Math.max(activeIndex - 1, 0));
          break;
        case 'PageDown':
          highlight(Math.min(activeIndex + 10, last));
          break;
        case 'PageUp':
          highlight(Math.max(activeIndex - 10, 0));
          break;
        case 'Home':
          highlight(0);
          break;
        case 'End':
          highlight(last);
          break;
        case 'Enter':
        case ' ':
          select(activeIndex);
          close();
          break;
        case 'Escape':
          close();
          break;
        case 'Tab':
          // Commit and close, but let focus move on.
          select(activeIndex);
          close();
          return;
        default:
          if (!isPrintable(event)) return;
          typeahead(key);
      }
      event.preventDefault();
    });

    // Keep focus on the button while clicking inside the list.
    listbox.addEventListener('mousedown', (event) => event.preventDefault());

    listbox.addEventListener('click', (event) => {
      const option = event.target.closest('[role="option"]');
      if (!option) return;
      select(options.indexOf(option));
      close();
      button.focus();
    });

    // Close when focus or a click lands outside the component.
    root.addEventListener('focusout', (event) => {
      if (!root.contains(event.relatedTarget)) close();
    });

    document.addEventListener('click', (event) => {
      if (!root.contains(event.target)) close();
    });
  }

  /*
   * Searchable select — the button opens a panel whose search field is an
   * editable combobox (aria-autocomplete="list"). Focus moves into the field;
   * options that don't contain the typed text are hidden and skipped by the
   * arrow keys.
   */
  function initSearchableSelect(root) {
    if (root.dataset.selectInitialised) return;

    const button = root.querySelector('.tds-form-control');
    const panel = root.querySelector('.tds-select__panel');
    const input = root.querySelector('.tds-select__search-input');
    const clear = root.querySelector('.tds-select__search-clear');
    const listbox = root.querySelector('[role="listbox"]');
    const noResults = root.querySelector('.tds-select__no-results');
    const status = root.querySelector('[role="status"]');
    if (!button || !panel || !input || !listbox) return;

    root.dataset.selectInitialised = 'true';

    const options = Array.from(listbox.querySelectorAll('[role="option"]'));
    const valueText = button.querySelector('.tds-form-control__placeholder');
    const icon = button.querySelector('.tds-select__icon');
    const STATUS_DELAY = 500;
    let visible = options;
    let activeIndex = -1;
    let statusTimer = null;

    const isOpen = () => !panel.hidden;

    function highlight(index) {
      activeIndex = index;
      options.forEach((option) => option.classList.remove(HIGHLIGHT_CLASS));

      const option = visible[index];
      if (option) {
        option.classList.add(HIGHLIGHT_CLASS);
        if (option.id) input.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    function announce(count) {
      clearTimeout(statusTimer);
      if (!status) return;
      statusTimer = setTimeout(() => {
        const template =
          count === 1 ? root.dataset.resultText : root.dataset.resultsText;
        status.textContent = count === 0 && noResults
          ? noResults.textContent.trim()
          : (template || '{count}').replace('{count}', count);
      }, STATUS_DELAY);
    }

    // Case-insensitive "contains" match, so "mäe" finds both Lasnamäe and
    // Mustamäe (the select-only variant uses "starts with" for typeahead).
    function filter() {
      const query = input.value.trim().toLowerCase();
      visible = options.filter((option) => {
        const match = option.textContent.trim().toLowerCase().includes(query);
        option.hidden = !match;
        return match;
      });

      if (clear) clear.hidden = input.value === '';
      if (noResults) noResults.hidden = visible.length > 0;

      const selected = visible.findIndex(
        (option) => option.getAttribute('aria-selected') === 'true',
      );
      highlight(visible.length ? (query ? 0 : Math.max(selected, 0)) : -1);
      if (query) announce(visible.length);
    }

    function open(initialQuery = '') {
      if (isOpen() || options.length === 0) return;
      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      if (icon) icon.classList.add('arrow-up');
      input.value = initialQuery;
      filter();
      input.focus();
    }

    function close({ returnFocus = false } = {}) {
      if (!isOpen()) return;
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      if (icon) icon.classList.remove('arrow-up');
      clearTimeout(statusTimer);
      if (status) status.textContent = '';
      input.value = '';
      filter();
      highlight(-1);
      if (returnFocus) button.focus();
    }

    function select(option) {
      if (!option) return;
      options.forEach((item) => {
        item.setAttribute('aria-selected', String(item === option));
      });
      if (valueText) valueText.textContent = option.textContent.trim();
    }

    const isPrintable = (event) =>
      (event.key || '').length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey;

    button.addEventListener('click', () => {
      if (isOpen()) {
        close({ returnFocus: true });
      } else {
        open();
      }
    });

    button.addEventListener('keydown', (event) => {
      if (isOpen()) return;
      const key = event.key || '';
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault();
        open();
      } else if (isPrintable(event)) {
        // Start searching straight from the closed button.
        event.preventDefault();
        open(key);
      }
    });

    input.addEventListener('input', filter);

    input.addEventListener('keydown', (event) => {
      const last = visible.length - 1;

      switch (event.key) {
        case 'ArrowDown':
          highlight(Math.min(activeIndex + 1, last));
          break;
        case 'ArrowUp':
          highlight(Math.max(activeIndex - 1, 0));
          break;
        case 'PageDown':
          highlight(Math.min(activeIndex + 10, last));
          break;
        case 'PageUp':
          highlight(Math.max(activeIndex - 10, 0));
          break;
        case 'Enter':
          select(visible[activeIndex]);
          close({ returnFocus: true });
          break;
        case 'Escape':
          close({ returnFocus: true });
          break;
        case 'Tab':
          // Leave without changing the value. Shift+Tab lands on the button,
          // so close now; for Tab, hiding the panel during keydown would make
          // the browser restart focus navigation from the button, so let
          // focus move on first and close from the focusout handler.
          if (event.shiftKey) close();
          return;
        default:
          // Home/End and everything else edit the text as usual.
          return;
      }
      event.preventDefault();
    });

    if (clear) {
      clear.addEventListener('mousedown', (event) => event.preventDefault());
      clear.addEventListener('click', () => {
        input.value = '';
        filter();
        input.focus();
      });
    }

    // Keep focus in the search field while clicking inside the list.
    listbox.addEventListener('mousedown', (event) => event.preventDefault());

    listbox.addEventListener('click', (event) => {
      const option = event.target.closest('[role="option"]');
      if (!option) return;
      select(option);
      close({ returnFocus: true });
    });

    root.addEventListener('focusout', (event) => {
      if (!root.contains(event.relatedTarget)) close();
    });

    document.addEventListener('click', (event) => {
      if (!root.contains(event.target)) close();
    });
  }

  function init() {
    document.querySelectorAll('.tds-select').forEach((root) => {
      if (root.classList.contains('tds-select--searchable')) {
        initSearchableSelect(root);
      } else {
        initSelect(root);
      }
    });
  }

  init();
})();
