const html = (strings, ...values) => {
  const raw = String.raw(strings, ...values);
  return raw
    .split('\n')
    .filter(line => line.trim())
    .join('\n');
};

/**
 * @param {object} props
 * @param {Array <{number: string, title: string, description: string}>} [props.steps]
 */

const StepByStepComponent = ({
  steps,
}) => {
  let stepHtml = '';

  steps.forEach((step) => {
    stepHtml += `
  <div class="tds-step-by-step__group">
    <div class="tds-step-by-step__list">
      <div class="tds-step-by-step__number">${step.number}</div>
      <div class="tds-step-by-step__line"></div>
    </div>
    <div class="tds-step-by-step__content">
      <div class="tds-step-by-step__title">${step.title}</div>
      <div class="tds-step-by-step__description">${step.description}</div>
    </div>
  </div>
    `;
  })

  return html`
<div class="tds-step-by-step">
  ${stepHtml}
</div>
  `;
};

export default StepByStepComponent;
