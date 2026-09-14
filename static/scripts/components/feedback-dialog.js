/**
 * Dialog
 *
 * Progressive enhancement for `.tds-dialog-overlay > [role="dialog"]`:
 * - `<button data-dialog-open="<dialog id>">` opens the dialog,
 * - `[data-dialog-close]` buttons, Escape and clicking the scrim close it,
 * - focus moves into the dialog on open, is trapped while it is open and
 *   returns to the opener on close.
 * A dialog whose overlay already has `is-visible` in the markup stays open.
 * Add `data-dialog-static` to a dialog to disable Escape/scrim closing.
 * `window.tdsDialog.open(id)` / `.close(id)` are available for scripts.
 */
(function () {
  // All listeners are delegated to the document, so a second run is a no-op.
  if (document.documentElement.dataset.dialogInitialised) return;
  document.documentElement.dataset.dialogInitialised = 'true';

  const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';
  const openers = new WeakMap(); // dialog -> element to return focus to

  const toElement = (dialogOrId) =>
    typeof dialogOrId === 'string'
      ? document.getElementById(dialogOrId)
      : dialogOrId;

  const overlayOf = (dialog) => dialog.closest('.tds-dialog-overlay');

  // Elements inside the dialog the user can Tab to.
  const focusableIn = (dialog) =>
    Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(
      (el) =>
        !el.disabled &&
        el.getAttribute('tabindex') !== '-1' &&
        el.getAttribute('aria-hidden') !== 'true' &&
        el.getClientRects().length > 0,
    );

  // The open dialog, if any (the last one in the document when several are).
  const openDialog = () => {
    const open = document.querySelectorAll(
      '.tds-dialog-overlay.is-visible [role="dialog"], .tds-dialog-overlay.is-visible[role="dialog"]',
    );
    return open.length ? open[open.length - 1] : null;
  };

  const open = (dialogOrId, opener) => {
    const dialog = toElement(dialogOrId);
    const overlay = dialog && overlayOf(dialog);
    if (!overlay) return;
    if (opener) openers.set(dialog, opener);
    overlay.classList.add('is-visible');
    const first = focusableIn(dialog)[0];
    (first || dialog).focus();
  };

  const close = (dialogOrId) => {
    const dialog = toElement(dialogOrId);
    const overlay = dialog && overlayOf(dialog);
    if (!overlay) return;
    overlay.classList.remove('is-visible');
    const opener = openers.get(dialog);
    openers.delete(dialog);
    if (opener && typeof opener.focus === 'function') opener.focus();
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const opener = target.closest('[data-dialog-open]');
    if (opener) {
      const dialog = document.getElementById(
        opener.getAttribute('data-dialog-open') || '',
      );
      if (dialog) {
        event.preventDefault();
        open(dialog, opener);
      }
      return;
    }

    const closer = target.closest('[data-dialog-close]');
    if (closer) {
      const dialog = closer.closest('[role="dialog"]');
      if (dialog) close(dialog);
      return;
    }

    // Click on the scrim: the overlay itself, outside the dialog box.
    if (target.classList.contains('tds-dialog-overlay')) {
      const dialog = target.matches('[role="dialog"]')
        ? target
        : target.querySelector('[role="dialog"]');
      if (dialog && !dialog.hasAttribute('data-dialog-static')) close(dialog);
    }
  });

  document.addEventListener('keydown', (event) => {
    const dialog = openDialog();
    if (!dialog) return;

    if (event.key === 'Escape') {
      if (!dialog.hasAttribute('data-dialog-static')) {
        event.preventDefault();
        close(dialog);
      }
      return;
    }

    if (event.key !== 'Tab') return;

    // Trap Tab / Shift+Tab inside the dialog. Focus on the overlay or the
    // dialog element itself counts as "before the first element".
    const focusable = focusableIn(dialog);
    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const inside = focusable.indexOf(active) !== -1;

    if (event.shiftKey && (active === first || !inside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !inside)) {
      event.preventDefault();
      first.focus();
    }
  });

  // Focus that lands outside an open dialog (e.g. via the browser UI) is
  // pulled back inside.
  document.addEventListener('focusin', (event) => {
    const dialog = openDialog();
    if (!dialog) return;
    const overlay = overlayOf(dialog);
    if (overlay && overlay.contains(event.target)) return;
    (focusableIn(dialog)[0] || dialog).focus();
  });

  window.tdsDialog = { open, close };
})();
