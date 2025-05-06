// Add this script to your page or include it in a separate JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Find all "Select All" checkboxes
    const selectAllCheckboxes = document.querySelectorAll('.tds-checkboxes__item input[id$="-0"]');
    
    selectAllCheckboxes.forEach(selectAllCheckbox => {
      // Only process checkboxes with "Vali kõik" label
      const label = selectAllCheckbox.nextElementSibling;
      if (label && label.textContent.trim() === 'Vali kõik') {
        const fieldset = selectAllCheckbox.closest('.tds-fieldset');
        if (!fieldset) return;
        
        // Find all sub-checkboxes in the same fieldset
        const subCheckboxes = fieldset.querySelectorAll('.tds-checkboxes__sub-category-wrapper input[type="checkbox"]');
        
        // Add event listener for the "Select All" checkbox
        selectAllCheckbox.addEventListener('change', function() {
          const isChecked = this.checked;
          
          // Update all sub-checkboxes
          subCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
          });
        });
        
        // Add event listeners for sub-checkboxes
        subCheckboxes.forEach(checkbox => {
          checkbox.addEventListener('change', function() {
            // If any sub-checkbox is unchecked, uncheck the "Select All" checkbox
            if (!this.checked) {
              selectAllCheckbox.checked = false;
            } 
            // If all sub-checkboxes are checked, check the "Select All" checkbox
            else if (Array.from(subCheckboxes).every(cb => cb.checked)) {
              selectAllCheckbox.checked = true;
            }
          });
        });
      }
    });
  });