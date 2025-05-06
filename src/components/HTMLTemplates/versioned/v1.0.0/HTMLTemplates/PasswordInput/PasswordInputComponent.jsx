/**
 * @param {object} props
 * @param {boolean} [props.hint] - The hint text
 * @param {boolean} [props.error] - The error message
 * @param {string} [props.passwordFilled] - The optional label of the password typed
 * @param {boolean} [props.isOpened] - The optional label of the eye icon
 */

export function PasswordInputComponent({
  hint,
  error,
  isOpened = true,
  passwordFilled,
}) {
  const errorClass = error ? 'tds-form-group--error' : '';
  const forAttribute = error ? 'password-input-with-error' : 'password-input';
  let valueAttribute = passwordFilled ? `value="${passwordFilled}"` : '';

  const svgEyeOpened = isOpened
    ? `<svg xmlns="http://www.w3.org/2000/svg" class="eye" role="img" aria-label="eye" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z" fill="#242424"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7328 7.81955C20.5955 8.74863 21.2558 9.67374 21.7005 10.3655C22.0401 10.8937 22.3374 11.4388 22.618 12C22.3375 12.5611 22.04 13.1064 21.7005 13.6345C21.2559 14.3263 20.5955 15.2514 19.7328 16.1805C18.0279 18.0165 15.4058 20 12 20C8.59419 20 5.97214 18.0165 4.2672 16.1805C3.40449 15.2514 2.74414 14.3263 2.29944 13.6345C1.95994 13.1064 1.66274 12.561 1.38196 12C1.57233 11.6193 1.89513 10.9944 2.29944 10.3655C2.74414 9.67374 3.40449 8.74863 4.2672 7.81955C5.97214 5.98347 8.59419 4 12 4C15.4058 4 18.0279 5.98347 19.7328 7.81955ZM3.9818 12.553C3.84532 12.3407 3.73191 12.1535 3.64224 12C3.73191 11.8465 3.84532 11.6593 3.9818 11.447C4.38085 10.8263 4.97051 10.0014 5.73279 9.18045C7.27786 7.51653 9.40582 6 12 6C14.5942 6 16.7221 7.51653 18.2672 9.18045C19.0295 10.0014 19.6191 10.8263 20.0182 11.447C20.1547 11.6593 20.2681 11.8465 20.3577 12C20.2681 12.1535 20.1547 12.3407 20.0182 12.553C19.6191 13.1737 19.0295 13.9986 18.2672 14.8195C16.7221 16.4835 14.5942 18 12 18C9.40582 18 7.27786 16.4835 5.73279 14.8195C4.97051 13.9986 4.38085 13.1737 3.9818 12.553Z" fill="#242424"/>
  </svg></span>`
    : `<svg xmlns="http://www.w3.org/2000/svg" class="eye-crossed" role="img" aria-label="eye" aria-hidden="true" width="22" height="20" viewBox="0 0 22 20" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.4141 18.0002L2.99988 0.585938L1.58566 2.00015L4.34698 4.76147C3.95322 5.10959 3.59229 5.46734 3.26513 5.81967C2.40241 6.74875 1.74207 7.67386 1.29737 8.36561C0.893057 8.99454 0.570257 9.61938 0.379883 10.0001C0.660662 10.5611 0.957864 11.1065 1.29737 11.6346C1.74207 12.3264 2.40241 13.2515 3.26513 14.1806C4.97006 16.0167 7.59211 18.0001 10.9979 18.0001C12.9431 18.0001 14.6326 17.3531 16.0416 16.4561L18.9999 19.4144L20.4141 18.0002ZM14.5853 14.9998C13.5209 15.6063 12.3199 16.0001 10.9979 16.0001C8.40374 16.0001 6.27579 14.4836 4.73072 12.8197C3.96843 11.9987 3.37877 11.1739 2.97972 10.5531C2.84325 10.3408 2.72984 10.1536 2.64017 10.0001C2.72984 9.84663 2.84325 9.65942 2.97972 9.44713C3.37877 8.82638 3.96843 8.00149 4.73072 7.18057C5.05051 6.83618 5.39528 6.4981 5.76398 6.17847L7.55246 7.96695C7.20013 8.56273 6.99792 9.25781 6.99792 10.0001C6.99792 12.2093 8.78879 14.0001 10.9979 14.0001C11.7402 14.0001 12.4353 13.7979 13.0311 13.4456L14.5853 14.9998ZM11.5175 11.932L9.06607 9.48056C9.02163 9.64624 8.99792 9.82041 8.99792 10.0001C8.99792 11.1047 9.89336 12.0001 10.9979 12.0001C11.1776 12.0001 11.3518 11.9764 11.5175 11.932Z" fill="#1C1F22"/>
    <path d="M17.6347 12.4065C18.2202 11.7273 18.6841 11.0696 19.0161 10.5531C19.1526 10.3408 19.266 10.1536 19.3557 10.0001C19.266 9.84663 19.1526 9.65942 19.0161 9.44713C18.6171 8.82638 18.0274 8.00149 17.2651 7.18057C15.7201 5.51665 13.5921 4.00012 10.9979 4.00012C10.4502 4.00012 9.92326 4.06773 9.4182 4.19005L7.82368 2.59554C8.78915 2.22587 9.84894 2.00012 10.9979 2.00012C14.4037 2.00012 17.0258 3.98359 18.7307 5.81967C19.5934 6.74875 20.2538 7.67386 20.6985 8.36561C21.0381 8.89385 21.3353 9.43889 21.616 10.0001C21.3354 10.5612 21.038 11.1065 20.6985 11.6346C20.3107 12.2378 19.7591 13.0183 19.0523 13.8242L17.6347 12.4065Z" fill="#1C1F22"/>
  </svg> `;

  return `
      <div class="tds-password-input ${errorClass}" data-module="tds-password-input">
      <label class="tds-label" for="${forAttribute}">Password</label>
        ${hint ? `<p class="tds-label__hint" id="password-input-hint">Hint text</p>` : ''}
        ${error ? `<p id="password-input-error" class="tds-error-message">Enter a password</p>` : ''}
       <div class="tds-input__wrapper  ${error ? `tds-input--error` : ''} tds-password-input__wrapper">
        <input class="tds-input-password ${error ? 'tds-input-password--error' : ''} tds-password-input__input" type="${isOpened ? 'password' : 'text'}" id="${forAttribute}" name="${forAttribute}" type="password" spellcheck="false" autocomplete="current-password" ${valueAttribute} autocapitalize="none" />
        <div class="tds-password-input__sr-status tds-visually-hidden" aria-live="polite">
        </div>
        <div class="tds-password-toggle-icon-wrapper">
        <button class="tds-button tds-button--icon-neutral tds-password-toggle-icon" type="button" data-module="tds-button" aria-controls="${forAttribute}" aria-label="${isOpened ? 'Show password' : 'Hide password'}" aria-controls="password-input">
         <span class="tds-icon">
        ${svgEyeOpened}
        </span>
        </button>
        </div>
    </div>
    `;
}

export default PasswordInputComponent;
