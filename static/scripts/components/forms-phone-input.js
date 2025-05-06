(function () {
  document
    .querySelector('.tds-phone-control')
    .addEventListener('click', function () {
      const div = document.querySelector('.tds-select-phone');
      const ul = document.querySelector('#phone-dropdown');

      div.classList.toggle('tds-select-phone--expand');
      this.setAttribute(
        'aria-expanded',
        div.classList.contains('tds-select-phone--expand'),
      );

      if (ul.hasAttribute('hidden')) {
        ul.removeAttribute('hidden');
      } else {
        ul.setAttribute('hidden', '');
      }
    });
})();
