import { html } from '@site/src/utils/formatHtml';
import { uid } from '@site/src/utils/uid';

/**
 * @param {object} props
 * @param {string} [props.id] - Unique identifier for the switch. Generated when omitted.
 * @param {string} [props.name] - Name attribute for the switch input
 * @param {boolean} [props.checked] - Whether the switch is checked
 * @param {function} [props.onChange] - Handler for change events
 * @param {boolean} [props.disabled] - Whether the switch is disabled
 * @param {string} [props.label] - Text label for the switch
 * @param {string} [props.hint] - Hint text that appears below the label
 * @param {string} [props.align = 'left'] - Alignment of the switch ('left' or 'right')
 * @param {boolean} [props.isMaster] - Whether this is a master switch that controls nested switches.
 *   Its `aria-controls` points at the nested group container (`controls`, or `${id}-group`).
 * @param {boolean} [props.isNested] - Whether this switch sits inside a master's nested group
 * @param {string|string[]} [props.nested] - Rendered nested switches; wrapped in
 *   `<div class="tds-switch-nested" id="${id}-group">` right after the master switch
 * @param {string} [props.controls] - Id of an existing nested group container to control
 *   (when the nested switches are rendered elsewhere)
 * @param {boolean} [props.withDivider] - Whether to show a divider below the switch (for right-aligned groups)
 * @param {string} [props.ariaLabel] - Custom aria-label for the switch (overrides default label)
 * @param {string} [props.ariaLabelledBy] - ID of an element that labels the switch (alternative to ariaLabel)
 * @param {string} [props.ariaDescribedBy] - ID of an element that describes the switch
 */

const SwitchComponent = (props = {}) => {
  const {
    name,
    checked = false,
    onChange,
    disabled = false,
    label,
    hint,
    align = 'left',
    isMaster = false,
    isNested = false,
    nested,
    controls,
    withDivider = false,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
  } = props;

  const uniqueId = props.id ?? uid('switch', props);
  const hintId = hint ? `${uniqueId}-hint` : '';
  const labelId = `${uniqueId}-label`;

  const nestedItems = Array.isArray(nested) ? nested.join('') : nested || '';
  const hasNestedGroup = Boolean(nestedItems);
  const controlsMaster = isMaster || hasNestedGroup;
  const groupId = controls || `${uniqueId}-group`;

  const switchClasses = [
    'tds-switch',
    disabled ? 'tds-switch--disabled' : '',
    controlsMaster ? 'tds-switch--master' : '',
    isNested ? 'tds-switch--nested' : '',
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

  const describedBy = [ariaDescribedBy, hintId].filter(Boolean).join(' ');
  if (describedBy) {
    ariaAttrs.push(`aria-describedby="${describedBy}"`);
  }

  if (controlsMaster) {
    ariaAttrs.push(`aria-controls="${groupId}"`);
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

  // A native checkbox with role="switch": the checked state comes from the
  // input itself, so no aria-checked is needed (or kept in sync).
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
        ${ariaAttrs.join(' ')}
      />
      <span class="tds-switch__track">
        <span class="tds-switch__thumb"></span>
      </span>
    </div>
  `;

  const content = `
    <div class="tds-switch-content">
      <div class="tds-label tds-label--switch">
        ${labelText}
        ${hintElement}
      </div>
    </div>
  `;

  // The nested group follows the master switch and carries the id its
  // aria-controls points at.
  const nestedGroup = hasNestedGroup
    ? `<div class="tds-switch-nested" id="${groupId}">${nestedItems}</div>`
    : '';

  return html`
<div class="${wrapperClasses}">
  <label for="${uniqueId}" class="tds-switch-container">
    ${align === 'left' ? switchElement : content}
    ${align === 'left' ? content : switchElement}
  </label>
</div>
${nestedGroup}
  `;
};

export default SwitchComponent;
