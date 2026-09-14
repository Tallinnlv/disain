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

  function init() {
    document.querySelectorAll('.tds-select').forEach(initSelect);
  }

  init();
})();
