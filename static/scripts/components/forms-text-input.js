(function () {
  var closeIcon = document.querySelector('.password-toggle-icon');
  var inputField = document.querySelector('.tds-password-input__input');

  closeIcon.addEventListener('click', function () {
    // Clear the input field
    inputField.value = '';
  });
})();
