/**
 * Password input: show/hide toggle.
 *
 * Every `.tds-password-input` on the page is initialised on its own. The
 * button toggles the input type, its own `aria-pressed` state and which of the
 * two shipped icons is visible; a live region announces the new state.
 */
(function () {
  function init() {
    document.querySelectorAll('.tds-password-input').forEach((root) => {
      if (root.dataset.passwordInputInitialised) return;

      const input = root.querySelector('.tds-password-input__input');
      const button = root.querySelector('.tds-password-toggle-icon');
      if (!input || !button) return;
      root.dataset.passwordInputInitialised = 'true';

      const status = root.querySelector('.tds-password-input__sr-status');
      const showIcon = button.querySelector('[data-password-icon="show"]');
      const hideIcon = button.querySelector('[data-password-icon="hide"]');
      const shownText = root.dataset.statusShown || 'Password is shown';
      const hiddenText = root.dataset.statusHidden || 'Password is hidden';

      // Reflect the actual input type; announce only on user action.
      function render(announce) {
        const visible = input.type === 'text';
        button.setAttribute('aria-pressed', visible ? 'true' : 'false');
        if (showIcon) showIcon.hidden = visible;
        if (hideIcon) hideIcon.hidden = !visible;
        if (announce && status) {
          status.textContent = visible ? shownText : hiddenText;
        }
      }

      button.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        render(true);
      });

      render(false);
    });
  }

  init();
})();
