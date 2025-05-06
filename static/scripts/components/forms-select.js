document.addEventListener('DOMContentLoaded', () => {
  const formControl = document.querySelector('.tds-form-control');
  const dropdown = document.querySelector('#location');
  const options = Array.from(
    dropdown.querySelectorAll('.tds-dropdown__option'),
  );
  const iconContainer = document.querySelector('.tds-select__icon'); // Icon container
  let currentIndex = -1;

  // Open dropdown
  function openDropdown() {
    formControl.setAttribute('aria-expanded', 'true');
    dropdown.hidden = false;
    toggleArrow(true); // Add "arrow-up" class

    // Ensure currentIndex points to the already selected option or defaults to 0
    currentIndex = options.findIndex(
      (option) => option.getAttribute('aria-selected') === 'true',
    );

    // If no option is selected, start at the first option
    if (currentIndex === -1) {
      currentIndex = 0;
    }

    focusOption(currentIndex);
  }

  // Close dropdown
  function closeDropdown() {
    formControl.setAttribute('aria-expanded', 'false');
    dropdown.hidden = true;
    toggleArrow(false); // Remove "arrow-up" class
    currentIndex = -1; // Reset index
  }

  // Focus a specific option
  function focusOption(index) {
    options.forEach((option, i) => {
      if (i === index) {
        option.classList.add('focused');
        option.setAttribute('aria-selected', 'true');
        option.scrollIntoView({ block: 'nearest' });
        option.focus(); // Ensure the option receives keyboard focus
      } else {
        option.classList.remove('focused');
        option.setAttribute('aria-selected', 'false');
      }
    });
  }

  // Select a specific option
  function selectOption(index) {
    if (index >= 0 && index < options.length) {
      const selectedOption = options[index];
      formControl.querySelector('.tds-form-control__placeholder').innerText =
        selectedOption.innerText;

      // Update aria-selected for all options
      options.forEach((option) =>
        option.setAttribute('aria-selected', 'false'),
      );
      selectedOption.setAttribute('aria-selected', 'true');
    }
  }

  // Toggle arrow direction using class
  function toggleArrow(isOpen) {
    if (isOpen) {
      iconContainer.classList.add('arrow-up'); // Add the class when open
    } else {
      iconContainer.classList.remove('arrow-up'); // Remove the class when closed
    }
  }

  // Handle button click
  formControl.addEventListener('click', () => {
    const isExpanded = formControl.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Handle keyboard navigation
  formControl.addEventListener('keydown', (event) => {
    if (dropdown.hidden) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        openDropdown();
        event.preventDefault();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        currentIndex = (currentIndex + 1) % options.length; // Move to the next option
        focusOption(currentIndex);
        event.preventDefault();
        break;

      case 'ArrowUp':
        currentIndex = (currentIndex - 1 + options.length) % options.length; // Move to the previous option
        focusOption(currentIndex);
        event.preventDefault();
        break;

      case 'Enter':
        selectOption(currentIndex);
        closeDropdown();
        event.preventDefault();
        break;

      case 'Escape':
        closeDropdown();
        event.preventDefault();
        break;

      default:
        break;
    }
  });

  // Handle click on options
  options.forEach((option, index) => {
    option.addEventListener('click', () => {
      selectOption(index);
      closeDropdown();
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (
      !formControl.contains(event.target) &&
      !dropdown.contains(event.target)
    ) {
      closeDropdown();
    }
  });
});
