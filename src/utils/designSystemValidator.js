import { dsConsole } from './validationConsole';
import { enableW3CValidation, disableW3CValidation } from './html';
import { enableA11yScan, disableA11yScan, loadAxeIfNeeded } from './a11yScanner';

/**
 * Initialize the design system validator with the specified options
 * @param {Object} options - Configuration options
 */
export function initializeValidator(options = {}) {
  // Default options
  const defaults = {
    // Remove enableW3CValidation
    enableLocalValidation: true,
    enableA11yScanning: true,
    enableHTMLFormatting: true
  };
  
  const settings = { ...defaults, ...options };
  
  // Set global flags
  // Remove window.TDS_VALIDATE_W3C
  window.TDS_LOCAL_VALIDATION = settings.enableLocalValidation;
  window.TDS_VALIDATE_A11Y = settings.enableA11yScanning;
  window.TDS_FORMAT_HTML = settings.enableHTMLFormatting;
  
  console.log('Validator initialized with settings:', {
    // Remove W3C
    LocalValidation: window.TDS_LOCAL_VALIDATION,
    A11Y: window.TDS_VALIDATE_A11Y,
    FORMAT: window.TDS_FORMAT_HTML
  });
  
  return settings;
}


/**
 * Create a widget for controlling the validator
 */
export function createValidatorWidget() {
  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'tds-validator-widget';
  widget.innerHTML = `
    <style>
      #tds-validator-widget {
        position: fixed;
        top: 10px;
        right: 10px;
        background: #333;
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: sans-serif;
        font-size: 12px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      #tds-validator-widget h3 {
        margin: 0 0 10px 0;
        font-size: 14px;
      }
      #tds-validator-widget label {
        display: block;
        margin-bottom: 5px;
      }
      #tds-validator-widget button {
        background: #555;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        margin-top: 10px;
      }
      #tds-validator-widget button:hover {
        background: #666;
      }
      .tds-toggle {
        display: inline-block;
        width: 40px;
        height: 20px;
        position: relative;
        margin-left: 10px;
      }
      .tds-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .tds-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
      }
      .tds-toggle-slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      input:checked + .tds-toggle-slider {
        background-color: #4CAF50;
      }
      input:checked + .tds-toggle-slider:before {
        transform: translateX(20px);
      }
    </style>
    <div id="tds-validator-controls">
      <h3>Design System Validator</h3>
      <label>
        W3C Validation
        <span class="tds-toggle">
          <input type="checkbox" id="tds-toggle-w3c">
          <span class="tds-toggle-slider"></span>
        </span>
      </label>
      <label>
        Accessibility Scan
        <span class="tds-toggle">
          <input type="checkbox" id="tds-toggle-a11y" checked>
          <span class="tds-toggle-slider"></span>
        </span>
      </label>
      <label>
        HTML Formatting
        <span class="tds-toggle">
          <input type="checkbox" id="tds-toggle-format" checked>
          <span class="tds-toggle-slider"></span>
        </span>
      </label>
      <button id="tds-validator-run">Run Validation</button>
      <button id="tds-validator-clear">Clear Results</button>
    </div>
  `;
  
  document.body.appendChild(widget);
  
  // Set up event listeners
  document.getElementById('tds-toggle-w3c').addEventListener('change', function() {
    if (this.checked) {
      enableW3CValidation();
    } else {
      disableW3CValidation();
    }
  });
  
  document.getElementById('tds-toggle-a11y').addEventListener('change', function() {
    if (this.checked) {
      enableA11yScan();
    } else {
      disableA11yScan();
    }
  });
  
  document.getElementById('tds-toggle-format').addEventListener('change', function() {
    window.TDS_FORMAT_HTML = this.checked;
  });
  
  document.getElementById('tds-validator-run').addEventListener('click', function() {
    // Re-run validation on all components in the page
    dsConsole.clear();
    dsConsole.info('Running validation on all components...');
    
    // Trigger validation for all components with design system classes.
    // Exclude the console and this widget: their own UI uses tds-* classes.
    const designSystemElements = Array.from(
      document.querySelectorAll('[class*="tds-"]'),
    ).filter(
      element =>
        !element.closest('#tds-validation-console') &&
        !element.closest('#tds-validator-widget'),
    );
    designSystemElements.forEach(element => {
      const html = element.outerHTML;
      const componentName = detectComponentTypeFromElement(element);
      


      if (window.TDS_VALIDATE_W3C) {
        validateWithW3C(html, componentName);
      }
      
      if (window.TDS_SCAN_A11Y) {
        scanForA11y(html, componentName);
      }
    });
  });
  
  document.getElementById('tds-validator-clear').addEventListener('click', function() {
    dsConsole.clear();
  });
  
  return widget;
}


/**
 * Detect component type from a DOM element
 */
function detectComponentTypeFromElement(element) {
  const classNames = element.className.split(/\s+/);
  
  for (const className of classNames) {
    if (className.startsWith('tds-')) {
      const componentPart = className.substring(4); // Remove "tds-"
      if (componentPart) {
        // Handle special cases like tds-badge--primary (extract "badge")
        const basePart = componentPart.split('--')[0];
        return basePart.charAt(0).toUpperCase() + basePart.slice(1);
      }
    }
  }
  
  return 'Unknown Component';
} 

