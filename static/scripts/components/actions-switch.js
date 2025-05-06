/**
 * Initializes switch groups with master-child relationships
 * Master switches enable/disable their associated child switches
 */
document.addEventListener('DOMContentLoaded', () => {
  // Find all master switches
  const masterSwitches = document.querySelectorAll('.tds-switch--master input[type="checkbox"]');
  
  masterSwitches.forEach(masterSwitch => {
    // Find the wrapper containing this master switch
    const masterWrapper = masterSwitch.closest('.example-section');
    
    if (masterWrapper) {
      // Find the nested group in the same section as the master switch
      const nestedGroup = masterWrapper.querySelector('.tds-switch-nested');
      
      if (nestedGroup) {
        const nestedSwitches = nestedGroup.querySelectorAll('input[type="checkbox"]');
        
        // Set initial state of nested switches based on master
        updateNestedSwitches(nestedSwitches, masterSwitch.checked);
        
        // Add event listener to master switch
        masterSwitch.addEventListener('change', (event) => {
          updateNestedSwitches(nestedSwitches, event.currentTarget.checked);
        });
      }
    }
  });
  
  /**
   * Updates the disabled state of nested switches based on master switch state
   * @param {NodeList} nestedSwitches - Collection of nested switch inputs
   * @param {boolean} masterChecked - Whether the master switch is checked
   */
  function updateNestedSwitches(nestedSwitches, masterChecked) {
    nestedSwitches.forEach(nestedSwitch => {
      // When master is off, disable all child switches
      nestedSwitch.disabled = !masterChecked;
      
      // Update the disabled class on the parent switch element
      const switchElement = nestedSwitch.closest('.tds-switch');
      if (switchElement) {
        if (!masterChecked) {
          switchElement.classList.add('tds-switch--disabled');
        } else {
          switchElement.classList.remove('tds-switch--disabled');
        }
      }
      
      // Update aria-checked attribute to match the checkbox state
      nestedSwitch.setAttribute('aria-checked', nestedSwitch.checked ? 'true' : 'false');
    });
  }
});
