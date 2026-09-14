/*
 * Date picker — configures vanillajs-datepicker for every `.tds-date-picker`.
 *
 * Keyboard use follows the library: the calendar is driven from the text
 * input (arrow keys move the focused day, Enter picks it, Escape closes,
 * Ctrl+ArrowUp switches month/year view). The calendar button opens the
 * picker and puts focus in the input; ArrowDown, Space or Enter in the
 * input open it as well.
 */
(function () {
  if (typeof Datepicker !== 'function') return;

  Datepicker.locales.et = {
    days: ['Pühapäev', 'Esmaspäev', 'Teisipäev', 'Kolmapäev', 'Neljapäev', 'Reede', 'Laupäev'],
    daysShort: ['P', 'E', 'T', 'K', 'N', 'R', 'L'],
    daysMin: ['P', 'E', 'T', 'K', 'N', 'R', 'L'],
    months: [
      'Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni',
      'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember',
    ],
    monthsShort: [
      'Jaan', 'Veebr', 'Märts', 'Apr', 'Mai', 'Juuni',
      'Juuli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dets',
    ],
    today: 'Täna',
    weekStart: 1,
    clear: 'Tühista',
    format: 'dd.mm.yyyy',
  };

  const ARROW_PREV = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.7648 3.5575L13.902 4.77592L8.30471 10L13.902 15.2242L12.7648 16.4426L5.86206 10L12.7648 3.5575Z" fill="currentColor"/>
</svg>`;
  const ARROW_NEXT = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.6954 10L6.09814 4.77592L7.23534 3.5575L14.1381 10L7.23534 16.4426L6.09814 15.2242L11.6954 10Z" fill="currentColor"/>
</svg>`;

  // Library view ids: 0 = days, 1 = months, 2 = years, 3 = decades.
  const MONTHS_VIEW = 1;
  const YEARS_VIEW = 2;

  function createHeaderButton(className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    // Like the library's own header buttons: mouse targets that keep
    // keyboard focus in the input (Ctrl+ArrowUp switches views there).
    button.tabIndex = -1;
    button.setAttribute('aria-pressed', 'false');
    return button;
  }

  function initDatePicker(element) {
    if (element.dataset.datePickerInitialised) return;

    const input = element.querySelector('input');
    if (!input) return;

    element.dataset.datePickerInitialised = 'true';

    const button = element.querySelector('.tds-date-picker--button');

    const datepicker = new Datepicker(input, {
      autohide: true,
      format: 'dd.mm.yyyy',
      updateOnBlur: true,
      language: 'et',
      showOnClick: false,
      showOnFocus: false,
      todayHighlight: true,
      // Escape only closes (the library default toggles it open as well).
      shortcutKeys: { toggle: null, hide: { key: 'Escape' } },
      prevArrow: ARROW_PREV,
      nextArrow: ARROW_NEXT,
    });

    const picker = datepicker.pickerElement || element.querySelector('.datepicker');
    if (!picker) return;

    // Expose the popup as a labelled dialog that the button controls.
    picker.setAttribute('role', 'dialog');
    picker.setAttribute('aria-label', element.dataset.calendarLabel || 'Kalender');
    if (input.id) {
      picker.id = `${input.id}-calendar`;
      if (button) button.setAttribute('aria-controls', picker.id);
    }

    // Replace the library's single view-switch with month + year buttons.
    const header = picker.querySelector('.datepicker-header');
    const viewSwitch = picker.querySelector('.view-switch');
    const monthButton = createHeaderButton('custom-month-button');
    const yearButton = createHeaderButton('custom-year-button');
    let viewId = 0;

    if (header && viewSwitch) {
      const nav = document.createElement('div');
      nav.className = 'tds-date-picker--nav';
      header.querySelectorAll('.prev-button, .next-button').forEach((arrow) => {
        // The library renders these with an icon only.
        arrow.setAttribute(
          'aria-label',
          arrow.classList.contains('prev-button') ? 'Eelmine' : 'Järgmine',
        );
        nav.appendChild(arrow);
      });

      // Kept (hidden) because the library's view switching goes through it.
      viewSwitch.style.display = 'none';
      header.replaceChildren(monthButton, yearButton, nav, viewSwitch);

      monthButton.addEventListener('click', () => {
        goToView(viewId === MONTHS_VIEW ? 0 : MONTHS_VIEW);
      });
      yearButton.addEventListener('click', () => {
        goToView(viewId === YEARS_VIEW ? 0 : YEARS_VIEW);
      });
    }

    // Views can only be climbed one step at a time via the view switch;
    // going down means resetting to the day view first. Each step fires
    // the library's `changeView` event, which keeps `viewId` current.
    function goToView(target) {
      if (viewId > target) {
        datepicker.setFocusedDate(datepicker.getFocusedDate(), true);
      }
      for (let step = 0; step < YEARS_VIEW && viewId < target; step += 1) {
        viewSwitch.click();
      }
    }

    function updateLabels() {
      const date = datepicker.getFocusedDate() || new Date();
      monthButton.textContent = Datepicker.locales.et.months[date.getMonth()];
      yearButton.textContent = String(date.getFullYear());
    }

    function updateView(event) {
      viewId = event.detail.viewId;
      monthButton.classList.toggle('active-view', viewId === MONTHS_VIEW);
      monthButton.setAttribute('aria-pressed', String(viewId === MONTHS_VIEW));
      yearButton.classList.toggle('active-view', viewId === YEARS_VIEW);
      yearButton.setAttribute('aria-pressed', String(viewId === YEARS_VIEW));
    }

    updateLabels();
    input.addEventListener('changeMonth', updateLabels);
    input.addEventListener('changeYear', updateLabels);
    input.addEventListener('changeView', updateView);

    input.addEventListener('show', (event) => {
      updateLabels();
      updateView(event);
      input.classList.add('picker-open');
      if (button) {
        button.classList.add('in-edit');
        button.setAttribute('aria-expanded', 'true');
      }
    });

    input.addEventListener('hide', () => {
      input.classList.remove('picker-open');
      if (button) {
        button.classList.remove('in-edit');
        button.setAttribute('aria-expanded', 'false');
      }
    });

    // ArrowDown opens via the library; Space and Enter open here. The state
    // is read in the capture phase, before the library's own keydown handler
    // runs, so that Enter picking a day (which auto-hides) does not reopen.
    let wasActive = false;
    element.addEventListener(
      'keydown',
      () => {
        wasActive = datepicker.active;
      },
      true,
    );

    input.addEventListener('keydown', (event) => {
      if (wasActive || datepicker.active) return;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        datepicker.show();
      }
    });

    if (button) {
      // The library closes the picker on any outside mousedown; stop that
      // here so the button can act as a real toggle.
      button.addEventListener('mousedown', (event) => event.stopPropagation());

      button.addEventListener('click', () => {
        if (datepicker.active) {
          datepicker.hide();
        } else {
          // show() also moves focus to the input, which drives the calendar.
          datepicker.show();
        }
      });
    }
  }

  function init() {
    document.querySelectorAll('.tds-date-picker').forEach(initDatePicker);
  }

  init();
})();
