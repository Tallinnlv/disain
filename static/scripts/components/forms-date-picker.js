(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof Datepicker !== 'function') return;

    Datepicker.locales.et = {
      days: ["Pühapäev", "Esmaspäev", "Teisipäev", "Kolmapäev", "Neljapäev", "Reede", "Laupäev"],
      daysShort: ["P", "E", "T", "K", "N", "R", "L"],
      daysMin: ["P", "E", "T", "K", "N", "R", "L"],
      months: [
        "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni",
        "Juuli", "August", "September", "Oktoober", "November", "Detsember"
      ],
      monthsShort: [
        "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni",
        "Juuli", "August", "September", "Oktoober", "November", "Detsember"
      ],
      today: "Täna",
      weekStart: 1,
      clear: "Tühista",
      format: "dd.mm.yyyy"
    };

    const getCurrentView = (el) => {
      const view = el.querySelector('.datepicker-view');

      if (view.classList.contains('months')) return 'months';
      if (view.classList.contains('years')) return 'years';
      if (!view.classList.contains('months') && !view.classList.contains('years') && !view.classList.contains('decades')) return 'days';

      return '';
    }

    const updateMonthYearLabels = (datepicker, monthBtn, yearBtn) => {
      const date = datepicker.getFocusedDate() || new Date();
      monthBtn.textContent = date.toLocaleString('et', { month: 'long' });
      yearBtn.textContent = date.getFullYear();
    };

    document.querySelectorAll('.tds-date-picker').forEach((element) => {
      const input = element.querySelector('input');
      const inputButton = element.querySelector('.tds-date-picker--button');
      if (!input) return;

      const datepicker = new Datepicker(input, {
        autohide: true,
        format: 'dd.mm.yyyy',
        updateOnBlur: true,
        language: 'et',
        showOnClick: false,
        showOnFocus: false,
        todayHighlight: true,
        prevArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.7648 3.5575L13.902 4.77592L8.30471 10L13.902 15.2242L12.7648 16.4426L5.86206 10L12.7648 3.5575Z" fill="currentColor"/>
</svg>`,
        nextArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.6954 10L6.09814 4.77592L7.23534 3.5575L14.1381 10L7.23534 16.4426L6.09814 15.2242L11.6954 10Z" fill="currentColor"/>
</svg>`,
      });

      inputButton.addEventListener('click', () => datepicker.show());

      input.addEventListener('focus', () => datepicker.hide());

      inputButton.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === ' ') {
          e.preventDefault();
          datepicker.show();
        }
      });

      input.addEventListener('hide', () => {
        inputButton.setAttribute('aria-expanded', 'false');
        inputButton.classList.remove('in-edit');
        input.classList.remove('picker-open');
      });

      input.addEventListener('show', () => {
        input.classList.add('picker-open');
        inputButton.classList.add('in-edit');
        inputButton.setAttribute('aria-expanded', 'true');
        const pickerElem = element.querySelector('.datepicker');
        const header = pickerElem.querySelector('.datepicker-header');
        const internalSwitch = header.querySelector('.view-switch');
        const navButtons = header.querySelectorAll('.prev-button, .next-button');

        const monthBtn = document.createElement('button');
        const yearBtn = document.createElement('button');
        Object.assign(monthBtn, {
          className: 'custom-month-button',
          type: 'button'
        });
        Object.assign(yearBtn, {
          className: 'custom-year-button',
          type: 'button'
        });
        updateMonthYearLabels(datepicker, monthBtn, yearBtn);

        const navWrapper = document.createElement('div');
        navWrapper.className = 'tds-date-picker--nav';
        navButtons.forEach(btn => navWrapper.appendChild(btn));

        internalSwitch.style.display = 'none';
        header.replaceChildren(monthBtn, yearBtn, navWrapper, internalSwitch);

        monthBtn.addEventListener('click', () => {
          if (getCurrentView(pickerElem) === 'days') internalSwitch.click();
        });

        yearBtn.addEventListener('click', () => {
          const currentView = getCurrentView(pickerElem);

          if (currentView === 'days') {
            internalSwitch.click();
            setTimeout(() => internalSwitch.click(), 1);
          } else if (currentView === 'months') {
            internalSwitch.click();
          }
        });

        const handleViewChange = () => {
          const view = getCurrentView(pickerElem);
          monthBtn.classList.toggle('active-view', view === 'months');
          yearBtn.classList.toggle('active-view', view === 'years');
        };

        input.addEventListener('changeMonth', () => updateMonthYearLabels(datepicker, monthBtn, yearBtn));
        input.addEventListener('changeYear', () => updateMonthYearLabels(datepicker, monthBtn, yearBtn));
        input.addEventListener('changeView', () => handleViewChange);
      });
    });
  });
})();
