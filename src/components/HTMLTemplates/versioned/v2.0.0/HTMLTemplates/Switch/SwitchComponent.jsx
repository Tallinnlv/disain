import { html } from '@site/src/utils/formatHtml';

/**
 * @param {object} props
 * @param {string} [props.id] - Unique identifier for the switch
 * @param {string} [props.name] - Name attribute for the switch input
 * @param {boolean} [props.checked] - Whether the switch is checked
 * @param {function} [props.onChange] - Handler for change events
 * @param {boolean} [props.disabled] - Whether the switch is disabled
 * @param {string} [props.label] - Text label for the switch
 * @param {string} [props.hint] - Hint text that appears below the label
 * @param {string} [props.align = 'left'] - Alignment of the switch ('left' or 'right')
 * @param {boolean} [props.isMaster] - Whether this is a master switch that controls nested switches
 * @param {boolean} [props.withDivider] - Whether to show a divider below the switch (for right-aligned groups)
 * @param {string} [props.ariaLabel] - Custom aria-label for the switch (overrides default label)
 * @param {string} [props.ariaLabelledBy] - ID of an element that labels the switch (alternative to ariaLabel)
 * @param {string} [props.ariaDescribedBy] - ID of an element that describes the switch
 */

const SwitchComponent = ({
  id,
  name,
  checked = false,
  onChange,
  disabled = false,
  label,
  hint,
  align = 'left',
  isMaster = false,
  withDivider = false,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const uniqueId = id || `switch-${Math.random().toString(36).substring(2, 9)}`;
  const hintId = hint ? `${uniqueId}-hint` : '';
  const labelId = `${uniqueId}-label`;
  
  const switchClasses = [
    'tds-switch',
    disabled ? 'tds-switch--disabled' : '',
    isMaster ? 'tds-switch--master' : '',
  ].filter(Boolean).join(' ');
  
  const wrapperClasses = [
    'tds-switch-wrapper',
    `tds-switch-wrapper--${align}`,
    withDivider ? 'tds-switch-wrapper--with-divider' : '',
  ].filter(Boolean).join(' ');

  // Create the appropriate aria attributes
  const ariaAttrs = [];
  if (ariaLabel) {
    ariaAttrs.push(`aria-label="${ariaLabel}"`);
  } else if (ariaLabelledBy) {
    ariaAttrs.push(`aria-labelledby="${ariaLabelledBy}"`);
  } else if (label) {
    ariaAttrs.push(`aria-labelledby="${labelId}"`);
  }
  
  if (ariaDescribedBy && hintId) {
    ariaAttrs.push(`aria-describedby="${ariaDescribedBy} ${hintId}"`);
  } else if (ariaDescribedBy) {
    ariaAttrs.push(`aria-describedby="${ariaDescribedBy}"`);
  } else if (hintId) {
    ariaAttrs.push(`aria-describedby="${hintId}"`);
  }
  
  if (isMaster) {
    ariaAttrs.push(`aria-controls="tds-nested-group-${uniqueId}"`);
  }

  const labelText = label ? `
        <span id="${labelId}" class="tds-label__text">
          ${label}
        </span>
  ` : '';
  
  const hintElement = hint ? `
    <div id="${hintId}" class="tds-label__hint">
      ${hint}
    </div>
  ` : '';

  // The switch element with the switch role
  const switchElement = `
    <div class="${switchClasses}">
      <input
        type="checkbox"
        id="${uniqueId}"
        name="${name || uniqueId}"
        class="tds-switch__input"
        ${checked ? 'checked' : ''}
        ${disabled ? 'disabled' : ''}
        ${onChange ? `onchange="${onChange}"` : ''}
        role="switch"
        aria-checked="${checked ? 'true' : 'false'}"
        ${ariaAttrs.join(' ')}
      />
      <span class="tds-switch__track">
        <span class="tds-switch__thumb"></span>
      </span>
    </div>
  `;

  // For nested groups that depend on a master switch
  const nestedGroupAttr = isMaster ? ` id="tds-nested-group-${uniqueId}"` : '';

  if (align === 'left') {
    return html`
<div class="${wrapperClasses}"${nestedGroupAttr}>
  <label for="${uniqueId}" class="tds-switch-container">
    ${switchElement}
    <div class="tds-switch-content">
      <div class="tds-label tds-label--switch">
        ${labelText}
        ${hintElement}
      </div>
    </div>
  </label>
</div>
    `;
  } else {
    return html`
<div class="${wrapperClasses}"${nestedGroupAttr}>
  <label for="${uniqueId}" class="tds-switch-container">
    <div class="tds-switch-content">
      <div class="tds-label tds-label--switch">
        ${labelText}
        ${hintElement}
      </div>
    </div>
    ${switchElement}
  </label>
</div>
    `;
  }
};

export default SwitchComponent;
