/**
 * Textarea: character / word counter.
 *
 * Every `textarea[data-counter]` is initialised on its own. The visible counter
 * (`data-counter-id`) updates on every keystroke; the visually-hidden live
 * region next to it is updated at most once per second of inactivity, and
 * immediately when the limit is reached, so screen readers are not flooded.
 */
(function () {
  const ANNOUNCE_DELAY = 1000;

  function countWords(text) {
    const words = text.trim().split(/\s+/);
    return words[0] === '' ? 0 : words.length;
  }

  function init() {
    document.querySelectorAll('textarea[data-counter]').forEach((textarea) => {
      if (textarea.dataset.counterInitialised) return;

      const counter = document.getElementById(textarea.dataset.counterId || '');
      if (!counter) return;
      textarea.dataset.counterInitialised = 'true';

      const value = counter.querySelector('[data-counter-value]') || counter;
      const byWords = textarea.hasAttribute('data-word-counter');
      const limit = byWords
        ? Number(textarea.dataset.maxWords)
        : textarea.maxLength;

      // Live region: use the one shipped with the markup, or create it.
      let status = document.getElementById(`${counter.id}-status`);
      if (!status) {
        status = document.createElement('div');
        status.className = 'tds-visually-hidden';
        status.setAttribute('aria-live', 'polite');
        counter.insertAdjacentElement('afterend', status);
      }

      let timer = null;

      function announce() {
        clearTimeout(timer);
        timer = null;
        const text = counter.textContent.trim().replace(/\s+/g, ' ');
        if (status.textContent !== text) status.textContent = text;
      }

      function update() {
        const count = byWords ? countWords(textarea.value) : textarea.value.length;
        value.textContent = count;

        if (limit > 0 && count >= limit) {
          announce();
          return;
        }
        clearTimeout(timer);
        timer = setTimeout(announce, ANNOUNCE_DELAY);
      }

      // Show the current count without announcing it on load.
      value.textContent = byWords
        ? countWords(textarea.value)
        : textarea.value.length;

      textarea.addEventListener('input', update);
    });
  }

  init();
})();
