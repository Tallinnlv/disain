/**
 * Modal Dialog Logic
 *
 * Handles opening, closing, and accessibility features for the modal dialog.
 */

function initializeModal(triggerSelector, modalElement, onClose) {
  const triggerButton = document.querySelector(triggerSelector);
  const closeButtons = modalElement.querySelectorAll('[data-modal-close]');

  // Helper function to open modal
  const openModal = () => {
    modalElement.classList.remove('modal--closed');
    modalElement.classList.add('modal--open');
    modalElement.focus();
  };

  // Helper function to close modal
  const closeModal = () => {
    modalElement.classList.remove('modal--open');
    modalElement.classList.add('modal--closed');
    if (onClose) {
      onClose();
    }
  };

  // Open the modal when clicking the trigger button
  triggerButton.addEventListener('click', openModal);

  // Close the modal when clicking on overlay or close button
  closeButtons.forEach((button) =>
    button.addEventListener('click', closeModal),
  );

  // Close the modal on 'Escape' key press
  modalElement.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  // Ensure focus is trapped within the modal
  modalElement.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Backward Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Forward Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

// Expose the function to the global scope
window.initializeModal = initializeModal;
