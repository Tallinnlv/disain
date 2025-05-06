document.addEventListener('DOMContentLoaded', function () {
  const accordions = document.querySelectorAll(
    '.tds-accordion__section-button',
  );

  accordions.forEach((button) => {
    button.addEventListener('click', function () {
      const contentId = this.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      const section = this.closest('.tds-accordion__section');

      // Toggle the expanded state
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.setAttribute(
        'aria-label',
        isExpanded ? 'Show this section' : 'Hide this section',
      );
      if (isExpanded) {
        content.setAttribute('hidden', 'until-found');
        section.classList.remove('tds-accordion__section--expanded');
      } else {
        content.removeAttribute('hidden');
        section.classList.add('tds-accordion__section--expanded');
      }

      // Toggle the chevron direction
      const chevron = this.querySelector('.tds-accordion-nav__chevron');
      if (chevron) {
        chevron.classList.toggle(
          'tds-accordion-nav__chevron--down',
          isExpanded,
        );
        chevron.classList.toggle('tds-accordion-nav__chevron--up', !isExpanded);
      }
    });
  });
});
