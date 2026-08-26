import { dsConsole } from './validationConsole';

const safeDesignConsole = {
  error: (message, context, componentName) => {
    console.error(`[Design:${componentName || 'Component'}] ${message}`);
    if (typeof window !== 'undefined' && window.dsConsole) {
      if (window.dsConsole.design && typeof window.dsConsole.design.error === 'function') {
        window.dsConsole.design.error(message, context, componentName);
      } else if (typeof window.dsConsole.error === 'function') {
        window.dsConsole.error(`[Design] ${message}`, context, componentName);
      }
    }
  },
  warn: (message, context, componentName) => {
    console.warn(`[Design:${componentName || 'Component'}] ${message}`);
    if (typeof window !== 'undefined' && window.dsConsole) {
      if (window.dsConsole.design && typeof window.dsConsole.design.warn === 'function') {
        window.dsConsole.design.warn(message, context, componentName);
      } else if (typeof window.dsConsole.warn === 'function') {
        window.dsConsole.warn(`[Design] ${message}`, context, componentName);
      }
    }
  },
  info: (message, context, componentName) => {
    if (typeof window !== 'undefined' && window.dsConsole) {
      if (window.dsConsole.design && typeof window.dsConsole.design.info === 'function') {
        window.dsConsole.design.info(message, context, componentName);
      } else if (typeof window.dsConsole.info === 'function') {
        window.dsConsole.info(`[Design] ${message}`, context, componentName);
      }
    }
  },
  success: (message, context, componentName) => {
    if (typeof window !== 'undefined' && window.dsConsole) {
      if (window.dsConsole.design && typeof window.dsConsole.design.success === 'function') {
        window.dsConsole.design.success(message, context, componentName);
      } else if (typeof window.dsConsole.success === 'function') {
        window.dsConsole.success(`[Design] ${message}`, context, componentName);
      }
    }
  }
};

/**
 * Validates a component against design system rules
 */
export function validateDesignSystem(html, componentName) {
  if (process.env.NODE_ENV !== 'development' || 
      (typeof window !== 'undefined' && 
       window.location.hostname !== 'localhost' && 
       window.location.hostname !== '127.0.0.1')) {
    return;
  }

  setTimeout(() => {
    try {
      safeDesignConsole.info(`Checking ${componentName} against design system rules...`, null, componentName);
      
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;
      
      const issues = [];
      
      // Check for common design system issues
      
      // 1. Check for consistent class naming patterns
      if (!html.includes('tds-')) {
        issues.push({
          severity: 'error',
          message: 'Component does not use design system classes (tds-*)',
          context: html
        });
      }
      
      // 2. Check for proper component variants
      if (componentName === 'Button' && !html.match(/tds-button--[a-z]/)) {
        issues.push({
          severity: 'error',
          message: 'Button must have a variant class (tds-button--primary, tds-button--secondary, etc.)',
          context: html
        });
      }
      
      if (componentName === 'Badge' && !html.match(/tds-badge--[a-z]/)) {
        issues.push({
          severity: 'warning',
          message: 'Badge should have a variant class (tds-badge--primary, etc.)',
          context: html
        });
      }
      
      // 3. Check for inline styles (discouraged in design system).
      // Ignore elements whose inline style is purely positioning: Popper.js
      // (and similar runtime positioning) writes position/inset/transform
      // inline on tooltips and popovers, which is not an authored violation.
      const positioningProps = [
        'position', 'inset', 'top', 'right', 'bottom', 'left',
        'margin', 'transform', 'z-index',
      ];
      const isRuntimePositioningOnly = (el) =>
        Array.from(el.style).length > 0 &&
        Array.from(el.style).every((prop) =>
          positioningProps.some(
            (allowed) => prop === allowed || prop.startsWith(`${allowed}-`),
          ),
        );
      const elementsWithInlineStyles = Array.from(
        tempContainer.querySelectorAll('[style]'),
      ).filter((el) => !isRuntimePositioningOnly(el));
      if (elementsWithInlineStyles.length > 0) {
        issues.push({
          severity: 'warning',
          message: `Found ${elementsWithInlineStyles.length} elements with inline styles. Use design system classes instead.`,
          context: elementsWithInlineStyles.map(el => el.outerHTML).join('\n')
        });
      }
      
      // 4. Check for proper text sizing
      const elementsWithCustomFontSize = tempContainer.querySelectorAll('[style*="font-size"]');
      if (elementsWithCustomFontSize.length > 0) {
        issues.push({
          severity: 'warning',
          message: 'Custom font sizes detected. Use design system typography classes instead.',
          context: Array.from(elementsWithCustomFontSize).map(el => el.outerHTML).join('\n')
        });
      }
      
      // Report findings
      if (issues.length > 0) {
        issues.forEach(issue => {
          if (issue.severity === 'error') {
            safeDesignConsole.error(issue.message, issue.context, componentName);
          } else {
            safeDesignConsole.warn(issue.message, issue.context, componentName);
          }
        });
      } else {
        safeDesignConsole.success(`${componentName} follows design system standards ✓`, null, componentName);
      }
      
    } catch (error) {
      safeDesignConsole.error(`Design system validation error: ${error.message}`, error.stack, componentName);
    }
  }, 0);
} 