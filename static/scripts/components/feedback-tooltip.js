(function () {
  // Hide functions for all tooltips, used for dismissing with Escape
  const hideFunctions = [];

  // Select all elements with the tooltip-target class
  document.querySelectorAll('.tooltip-target').forEach((element) => {
    const tooltip = document.getElementById(
      element.getAttribute('aria-describedby'),
    );

    if (!tooltip) return;

    // Initialize Popper.js
    const popperInstance = window.Popper.createPopper(element, tooltip, {
      placement: tooltip.dataset.position || 'top',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8], // Adjust tooltip position
          },
        },
        {
          name: 'preventOverflow', // Prevent overflow
          options: {
            boundary: 'viewport', // Adjust inside viewport
          },
        },
        {
          name: 'flip', // Disable flipping
          options: {
            fallbackPlacements: [], // No fallback placements allowed
          },
        },
      ],
    });

    // Show tooltip
    function showTooltip() {
      tooltip.classList.add('tds-tooltip--visible'); // Add visible class
      popperInstance.update(); // Adjust position dynamically
    }

    // Hide tooltip
    function hideTooltip() {
      tooltip.classList.remove('tds-tooltip--visible'); // Remove visible class
    }

    // Add mouse and focus events
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
    element.addEventListener('focusin', showTooltip);
    element.addEventListener('focusout', hideTooltip);
    
    // Add keyboard accessibility - show/hide tooltip on Enter or Space key
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (tooltip.classList.contains('tds-tooltip--visible')) {
          hideTooltip();
        } else {
          showTooltip();
        }
      }
    });

    hideFunctions.push(hideTooltip);
  });

  // Dismiss tooltips with the Escape key (WCAG 1.4.13). Listens on the
  // document so it also works when the tooltip is shown by hovering an
  // element that does not have keyboard focus.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideFunctions.forEach((hide) => hide());
    }
  });
})();
