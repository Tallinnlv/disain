/**
 * Popover
 *
 * Progressive enhancement for `.tds-popover`:
 * - `<button data-popover-toggle="<popover id>" aria-expanded="false">`
 *   opens/closes it and keeps `aria-expanded` in sync,
 * - `[data-popover-close]` closes it,
 * - with a toggle present, Escape and clicking outside also close it and
 *   focus returns to the toggle.
 * A popover without a toggle (like the documentation examples) stays
 * visible until its close button is used.
 */
(function () {
  const FOCUSABLE =
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const initPopover = (popover) => {
    if (popover.dataset.popoverInitialised) return;
    popover.dataset.popoverInitialised = 'true';

    const toggle = popover.id
      ? document.querySelector('[data-popover-toggle="' + popover.id + '"]')
      : null;
    // `[data-popover-close]`, or the icon button of older markup.
    const closeButtons = popover.querySelectorAll(
      '[data-popover-close], .tds-popover > .tds-button--icon',
    );

    const isOpen = () => !popover.hidden;

    const setOpen = (open) => {
      // The stylesheet gives `.tds-popover` `display: flex`, which wins over
      // the `hidden` attribute on its own, so both are set.
      popover.hidden = !open;
      popover.style.display = open ? '' : 'none';
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const open = () => {
      setOpen(true);
      const first = popover.querySelector(FOCUSABLE);
      (first || popover).focus();
    };

    const close = (returnFocus) => {
      setOpen(false);
      if (returnFocus && toggle) toggle.focus();
    };

    closeButtons.forEach((button) => {
      button.addEventListener('click', () => close(true));
    });

    // Without a toggle there is nothing to reopen the popover with, so it is
    // left as the markup renders it.
    if (!toggle) return;

    if (!toggle.hasAttribute('aria-controls')) {
      toggle.setAttribute('aria-controls', popover.id);
    }
    // Start in the state the toggle's markup declares (closed by default).
    setOpen(toggle.getAttribute('aria-expanded') === 'true');

    toggle.addEventListener('click', () => {
      if (isOpen()) {
        close(true);
      } else {
        open();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        event.preventDefault();
        close(true);
      }
    });

    // Click outside the popover and its toggle closes it.
    document.addEventListener('click', (event) => {
      if (!isOpen()) return;
      const target = event.target;
      if (popover.contains(target) || toggle.contains(target)) return;
      close(false);
    });
  };

  document.querySelectorAll('.tds-popover').forEach(initPopover);
})();
