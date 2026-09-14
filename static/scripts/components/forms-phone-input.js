/*
 * Phone input — country-code selector, WAI-ARIA "select-only combobox".
 *
 * Focus stays on the flag button; the highlighted option is announced via
 * aria-activedescendant. Choosing a country updates the flag, the hidden
 * value text and the visible "+372" prefix. Every `.tds-select-phone` on
 * the page is initialised; the "country code only" variant has none.
 */
(function () {
  const HIGHLIGHT_CLASS = 'tds-dropdown-phone__option--focused';
  const TYPEAHEAD_TIMEOUT = 500;

  function initPhoneSelect(root) {
    if (root.dataset.phoneSelectInitialised) return;

    const button = root.querySelector('.tds-phone-control');
    const listbox = root.querySelector('[role="listbox"]');
    if (!button || !listbox) return;

    root.dataset.phoneSelectInitialised = 'true';

    const options = Array.from(listbox.querySelectorAll('[role="option"]'));
    const flag = button.querySelector('.tds-phone-control__placeholder');
    const valueText = button.querySelector('.tds-visually-hidden');
    const form = root.closest('.tds-phone-form');
    const prefix = form && form.querySelector('.tds-phone-field__prefix');
    let activeIndex = -1;
    let searchString = '';
    let searchTimer = null;

    const isOpen = () => !listbox.hidden;

    const selectedIndex = () =>
      options.findIndex(
        (option) => option.getAttribute('aria-selected') === 'true',
      );

    const countryName = (option) => {
      const country = option.querySelector('.tds-dropdown-phone__country');
      return (country || option).textContent.trim();
    };

    const countryCode = (option) => {
      const code = option.querySelector('.tds-dropdown-phone__country-code');
      return code ? code.textContent.trim() : option.dataset.value || '';
    };

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
      root.classList.add('tds-select-phone--expand');
      button.setAttribute('aria-expanded', 'true');
      highlight(Math.max(selectedIndex(), 0));
    }

    function close() {
      if (!isOpen()) return;
      listbox.hidden = true;
      root.classList.remove('tds-select-phone--expand');
      button.setAttribute('aria-expanded', 'false');
      highlight(-1);
    }

    function select(index) {
      if (index < 0 || index >= options.length) return;
      const option = options[index];

      options.forEach((item, i) => {
        item.setAttribute('aria-selected', String(i === index));
      });

      const svg = option.querySelector('svg');
      if (flag && svg) flag.replaceChildren(svg.cloneNode(true));
      if (valueText) {
        valueText.textContent = `${countryName(option)} (${countryCode(option)})`;
      }
      if (prefix) prefix.textContent = countryCode(option);
    }

    // Jump to the next country whose name starts with the typed characters;
    // repeating the same character cycles through countries starting with it.
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
        if (countryName(options[index]).toLowerCase().startsWith(query)) {
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

    // Close when focus or a click lands outside the selector.
    root.addEventListener('focusout', (event) => {
      if (!root.contains(event.relatedTarget)) close();
    });

    document.addEventListener('click', (event) => {
      if (!root.contains(event.target)) close();
    });
  }

  function init() {
    document.querySelectorAll('.tds-select-phone').forEach(initPhoneSelect);
  }

  init();
})();
