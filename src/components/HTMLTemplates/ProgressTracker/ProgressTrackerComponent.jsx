import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {array} [props.steps] - Array of step objects with {label, tooltip}
 * @param {number} [props.activeStep=0] - Current active step (0-based index)
 * @param {boolean} [props.interactive=false] - Whether the progress tracker is interactive
 * @param {boolean} [props.showBackButton=false] - Show back button for mobile view
 * @param {boolean} [props.enableTooltips=false] - Whether to enable tooltips for steps with tooltip content
 */

const ProgressTrackerComponent = ({
  steps = [],
  activeStep = 0,
  interactive = false,
  showBackButton = false,
  enableTooltips = false
}) => {

  if (!Array.isArray(steps) || steps.length === 0) {
    steps = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }];
  }

  let stepsWithConnectorsHtml = '';

  steps.forEach((step, index) => {
    const isCompleted = index < activeStep;
    const isActive = index === activeStep;
    const stepNumber = index + 1;
    const hasTooltip = enableTooltips && !!step.tooltip;

    let stepClass = 'tds-progress-tracker__step';
    if (isActive) stepClass += ' tds-progress-tracker__step--active';
    if (isCompleted) stepClass += ' tds-progress-tracker__step--completed';
    if (interactive) stepClass += ' tds-progress-tracker__step--interactive';

    const stepIndicator = isCompleted 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="tds-progress-tracker__icon--completed">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6506 4.57803L8.20248 12.2695C7.73851 12.9245 6.80519 13.0241 6.21348 12.4817L2.49219 9.0705L3.84364 7.59619L7.00751 10.4964L12.0186 3.422L13.6506 4.57803Z" fill="white"/>
          </svg>`
      : isActive
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="tds-progress-tracker__icon--active">
            <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" stroke="#0072CE" stroke-width="4"/>
            <circle cx="12" cy="12" r="4" fill="#0072CE"/>
          </svg>
        `
        : `<div class="tds-progress-tracker__empty-indicator"></div>`;


    // Tooltip icon - only added if enableTooltips=true and step has tooltip content
    const tooltipIcon = hasTooltip ? `<div class="tds-progress-tracker__tooltip-trigger tooltip-target" aria-describedby="tooltip-step-${index}" tabindex="0" role="button" aria-label="Info about ${step.label || `Step ${stepNumber}`}">
          <span class="tds-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none" class="tds-progress-tracker__tooltip-icon tds-icon--info">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3333 3.33329C6.65144 3.33329 3.66667 6.31806 3.66667 9.99996C3.66667 13.6819 6.65144 16.6666 10.3333 16.6666C14.0152 16.6666 17 13.6819 17 9.99996C17 6.31806 14.0152 3.33329 10.3333 3.33329ZM2 9.99996C2 5.39759 5.73096 1.66663 10.3333 1.66663C14.9357 1.66663 18.6667 5.39759 18.6667 9.99996C18.6667 14.6023 14.9357 18.3333 10.3333 18.3333C5.73096 18.3333 2 14.6023 2 9.99996ZM11.2917 6.87496C11.2917 7.45026 10.8253 7.91663 10.25 7.91663C9.6747 7.91663 9.20833 7.45026 9.20833 6.87496C9.20833 6.29966 9.6747 5.83329 10.25 5.83329C10.8253 5.83329 11.2917 6.29966 11.2917 6.87496ZM11.1667 8.74996H9.08333V10.4166H9.5V12.4999H9.08333V14.1666H11.5833V12.4999H11.1667V8.74996Z" fill="#131416"/>
            </svg>
          </span>
        <div id="tooltip-step-${index}" role="tooltip" class="tds-tooltip" data-position="top">
          ${step.tooltip}
        </div>
      </div>
    ` : '';

    stepsWithConnectorsHtml += `<div class="${stepClass}"${interactive ? ` data-step-index="${index}" tabindex="0" role="button" aria-label="${isCompleted ? `Go back to ${step.label || `Step ${stepNumber}`}` : ''}"` : ''}>
      <div class="tds-progress-tracker__step-container">
        <div class="tds-progress-tracker__indicator">
          ${stepIndicator}
        </div>
      </div>
      <div class="tds-progress-tracker__label-container">
        <div class="tds-progress-tracker__label">
          ${step.label || `Step ${stepNumber}`}
        </div>
        ${tooltipIcon}
      </div>
    </div>
    `;
  });
  
  const backButton = showBackButton && interactive && activeStep > 0 
    ? `
    <button type="button" class="tds-progress-tracker__back-button tds-button--compact-m tds-button--tertiary-neutral tds-button--icon-left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.41087 3.57739L10.5894 4.7559L6.17864 9.16665H17.5001V10.8333H6.17864L10.5894 15.2441L9.41087 16.4226L2.98828 9.99998L9.41087 3.57739Z" fill="#131416"/>
            </svg>
       ${steps[activeStep - 1].label || `Step ${activeStep}`}
    </button>`
    : '';
  
  return html`
<div class="tds-progress-tracker" role="progressbar" aria-valuemin="1" aria-valuemax="${steps.length}" aria-valuenow="${activeStep + 1}" aria-label="Progress: Step ${activeStep + 1} of ${steps.length}">
  ${backButton}
  <div class="tds-progress-tracker__steps">
    ${stepsWithConnectorsHtml}
  </div>
</div>
  `;
};

export default ProgressTrackerComponent;
