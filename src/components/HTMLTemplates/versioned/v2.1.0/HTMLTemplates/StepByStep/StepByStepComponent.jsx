import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {Array <{number: string, title: string, description: string}>} [props.steps]
 * @param {number} [props.headingLevel = 3] - Heading level of the step titles (1-6)
 */

const StepByStepComponent = ({
  steps = [],
  headingLevel = 3,
}) => {
  const level = Math.min(6, Math.max(1, Number(headingLevel) || 3));
  const heading = `h${level}`;

  let stepHtml = '';

  // The list itself numbers the steps for assistive technology, so the
  // visible number is decorative.
  steps.forEach((step) => {
    stepHtml += `
  <li class="tds-step-by-step__group">
    <div class="tds-step-by-step__list">
      <div class="tds-step-by-step__number" aria-hidden="true">${step.number}</div>
      <div class="tds-step-by-step__line"></div>
    </div>
    <div class="tds-step-by-step__content">
      <${heading} class="tds-step-by-step__title">${step.title}</${heading}>
      ${step.description ? `<div class="tds-step-by-step__description">${step.description}</div>` : ''}
    </div>
  </li>
    `;
  })

  return html`
<ol class="tds-step-by-step">
  ${stepHtml}
</ol>
  `;
};

export default StepByStepComponent;
