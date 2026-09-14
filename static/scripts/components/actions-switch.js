/**
 * Switch: master switch enabling / disabling a nested group.
 *
 * Every `.tds-switch--master` input is initialised on its own. Its
 * `aria-controls` names the nested group container; the switches inside are
 * disabled while the master is off. The inputs are native checkboxes with
 * role="switch", so their checked state needs no aria-checked bookkeeping.
 */
(function () {
  function setNestedState(nestedSwitches, enabled) {
    nestedSwitches.forEach((nestedSwitch) => {
      nestedSwitch.disabled = !enabled;
      const wrapper = nestedSwitch.closest('.tds-switch');
      if (wrapper) wrapper.classList.toggle('tds-switch--disabled', !enabled);
    });
  }

  function init() {
    document
      .querySelectorAll('.tds-switch--master .tds-switch__input')
      .forEach((master) => {
        if (master.dataset.switchInitialised) return;

        const group = document.getElementById(
          master.getAttribute('aria-controls') || '',
        );
        if (!group) return;

        const nestedSwitches = Array.from(
          group.querySelectorAll('.tds-switch__input'),
        ).filter((nestedSwitch) => nestedSwitch !== master);
        if (nestedSwitches.length === 0) return;
        master.dataset.switchInitialised = 'true';

        setNestedState(nestedSwitches, master.checked);
        master.addEventListener('change', () => {
          setNestedState(nestedSwitches, master.checked);
        });
      });
  }

  init();
})();
