import { useCurrentVersion } from '@site/src/hooks/useCurrentVersion';
import { useLatestVersion } from '@site/src/hooks/useLatestVersion';
import * as CanaryComponents from './canary'; // Import Canary components from canary.js
import * as VersionedV1_0_0Components from './versioned/v1.0.0/HTMLTemplates'; // Import versioned components
import * as VersionedV2_0_0Components from './versioned/v2.0.0/HTMLTemplates'; // Import versioned components

// NB! Currently, HTMLTemplates versioning is done manually, dynamic rendering is not supported yet

/**
 * Resolves components based on the current version.
 */
export const useResolvedComponents = () => {
  const currentVersion = useCurrentVersion();
  const latestVersion = useLatestVersion();
  const resolvedVersion = currentVersion || latestVersion;

  if (resolvedVersion === 'Canary 🚧') {
    return CanaryComponents;
  } else if (resolvedVersion === '1.0.0') {
    return VersionedV1_0_0Components;
  } else if (resolvedVersion === '2.0.0') {
    return VersionedV2_0_0Components;
  } else {
    console.error(`Version ${resolvedVersion} is not recognized.`);
    throw new Error(`Version ${resolvedVersion} is not recognized.`);
  }
};

/**
 * Creates a function that renders a component as a raw HTML string.
 */
const createStringComponent = (componentName) => (props) => {
  const Components = useResolvedComponents();
  const Component = Components[componentName];

  if (!Component) {
    console.error(`Component ${componentName} not found.`);
    return '';
  }

  // Convert React component to raw HTML string if needed
  return Component(props); // If raw HTML is needed, call renderToStaticMarkup here
};

// Export components dynamically
export const ButtonComponent = createStringComponent('ButtonComponent');
export const CheckboxComponent = createStringComponent('CheckboxComponent');
export const NotificationComponent = createStringComponent(
  'NotificationComponent',
);
export const TooltipComponent = createStringComponent('TooltipComponent');
export const BreadcrumbsComponent = createStringComponent(
  'BreadcrumbsComponent',
);
export const PasswordInputComponent = createStringComponent(
  'PasswordInputComponent',
);
export const TextareaComponent = createStringComponent('TextareaComponent');
export const PaginationComponent = createStringComponent('PaginationComponent');
export const RadioComponent = createStringComponent('RadioComponent');
export const SelectComponent = createStringComponent('SelectComponent');
export const PhoneInputComponent = createStringComponent('PhoneInputComponent');
export const TextInputComponent = createStringComponent('TextInputComponent');
export const AccordionComponent = createStringComponent('AccordionComponent');
export const TabsComponent = createStringComponent('TabsComponent');
export const ModalDialog = createStringComponent('ModalDialog');
export const LinkComponent = createStringComponent('LinkComponent');
export const TableComponent = createStringComponent('TableComponent');
export const TypographyComponent = createStringComponent('TypographyComponent');
export const BadgeComponent = createStringComponent('BadgeComponent');
export const ChipComponent = createStringComponent('ChipComponent');
export const ProgressTrackerComponent = createStringComponent('ProgressTrackerComponent');
export const DatePickerComponent = createStringComponent('DatePickerComponent');
export const DateInputComponent = createStringComponent('DateInputComponent');
export const CardComponent = createStringComponent('CardComponent');
export const StepByStepComponent = createStringComponent('StepByStepComponent');
export const PopoverComponent = createStringComponent('PopoverComponent');
export const SwitchComponent = createStringComponent('SwitchComponent');
