/**
 * Accordion
 *
 * Progressive enhancement for `.tds-accordion`: toggles sections, keeps
 * `aria-expanded` in sync and adds the WAI-ARIA accordion keyboard pattern
 * (Up/Down/Home/End move between the section headers).
 */
(function () {
  // The panel a header button controls. Falls back to the section's own
  // panel when the `aria-controls` id does not resolve.
  const getContent = (button) => {
    const target = document.getElementById(
      button.getAttribute('aria-controls') || '',
    );
    if (target) return target;
    const section = button.closest('.tds-accordion__section');
    return section
      ? section.querySelector('.tds-accordion__section-content')
      : null;
  };

  const setExpanded = (button, expanded) => {
    const section = button.closest('.tds-accordion__section');
    const content = getContent(button);
    const chevron = button.querySelector('.tds-accordion-nav__chevron');

    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');

    if (section) {
      section.classList.toggle('tds-accordion__section--expanded', expanded);
    }

    if (content) {
      // `until-found` keeps collapsed text reachable with find-in-page.
      if (expanded) {
        content.removeAttribute('hidden');
      } else {
        content.setAttribute('hidden', 'until-found');
      }
    }

    if (chevron) {
      chevron.classList.toggle('tds-accordion-nav__chevron--up', expanded);
      chevron.classList.toggle('tds-accordion-nav__chevron--down', !expanded);
    }
  };

  const initAccordion = (accordion) => {
    if (accordion.dataset.accordionInitialised) return;
    accordion.dataset.accordionInitialised = 'true';

    // Only this accordion's own headers, not those of a nested accordion.
    const buttons = Array.from(
      accordion.querySelectorAll('.tds-accordion__section-button'),
    ).filter((button) => button.closest('.tds-accordion') === accordion);

    buttons.forEach((button, index) => {
      // Make classes and `hidden` consistent with the initial aria-expanded.
      setExpanded(button, button.getAttribute('aria-expanded') === 'true');

      button.addEventListener('click', () => {
        setExpanded(button, button.getAttribute('aria-expanded') !== 'true');
      });

      button.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowDown') {
          next = (index + 1) % buttons.length;
        } else if (event.key === 'ArrowUp') {
          next = (index - 1 + buttons.length) % buttons.length;
        } else if (event.key === 'Home') {
          next = 0;
        } else if (event.key === 'End') {
          next = buttons.length - 1;
        } else {
          return;
        }
        event.preventDefault();
        buttons[next].focus();
      });

      // Find-in-page reveals a collapsed section: the browser removes the
      // `hidden` attribute itself, the rest of the state is synced here.
      const content = getContent(button);
      if (content) {
        content.addEventListener('beforematch', () => {
          setExpanded(button, true);
        });
      }
    });
  };

  document.querySelectorAll('.tds-accordion').forEach(initAccordion);
})();
