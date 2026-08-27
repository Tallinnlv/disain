import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { validateDesignSystem } from './designValidator';

/**
 * Creates an interactive validation console that displays in the browser
 */

export function createValidationConsole() {
    // Skip all DOM operations during server-side rendering
    if (!ExecutionEnvironment.canUseDOM) {
        return {
            // Return empty mock methods that do nothing during SSR
            log: () => {},
            warn: () => {},
            error: () => {},
            success: () => {},
            // Add any other methods your console uses
        };
    }
    
    // Only show validation console in development
    if (process.env.NODE_ENV !== 'development') {
      const existingConsole = document.getElementById('tds-validation-console');
      if (existingConsole) existingConsole.remove();
      return;
    }
    
    // Singleton pattern - return existing console if already created
    if (window._tdsValidationConsole) {
      return window._tdsValidationConsole;
    }
    
    // Check if console element already exists
    const existingConsole = document.getElementById('tds-validation-console');
    if (existingConsole) {
      return window._tdsValidationConsole;
    }
    
    // Create console container with tabs for different validation types
    const consoleElement = document.createElement('div');
    consoleElement.id = 'tds-validation-console';
    consoleElement.innerHTML = `
      <style>
        #tds-validation-console {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 350px;
          max-height: 350px;
          background: #222;
          color: #eee;
          font-family: monospace;
          z-index: 9999;
          overflow: hidden;
          border-top-left-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          font-size: 12px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        #tds-validation-header {
          padding: 5px 10px;
          background: #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #555;
          cursor: move;
        }
        #tds-validation-tabs {
          display: flex;
          background: #2a2a2a;
          border-bottom: 1px solid #444;
        }
        .tds-tab {
          padding: 5px 10px;
          cursor: pointer;
          border-right: 1px solid #444;
          position: relative;
        }
        .tds-tab.active {
          background: #333;
          border-bottom: 2px solid #5f9fff;
        }
        .tds-tab-count {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #ff5f5f;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          display: none;
        }
        .tds-tab-content {
          padding: 5px 0;
          max-height: 250px;
          overflow-y: auto;
          display: none;
        }
        .tds-tab-content.active {
          display: block;
        }
        .tds-validation-error-item {
          padding: 5px 10px;
          border-bottom: 1px solid #444;
          word-break: break-word;
          cursor: pointer;
        }
        .tds-validation-error-item:hover {
          background: #2a2a2a;
        }
        .tds-error {
          color: #ff5f5f;
        }
        .tds-warning {
          color: #ffaa5f;
        }
        .tds-info {
          color: #5f9fff;
        }
        .tds-success {
          color: #5fff5f;
        }
        .tds-button-console {
          background: #555;
          border: none;
          color: white;
          padding: 2px 5px;
          border-radius: 3px;
          cursor: pointer;
          margin-left: 5px;
        }
        .tds-button-console:hover {
          background: #666;
        }
        .tds-hidden {
          display: none;
        }
        .tds-validation-count {
          display: inline-block;
          background: #ff5f5f;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          text-align: center;
          line-height: 18px;
          font-size: 10px;
          margin-right: 5px;
        }
        .tds-component-info {
          font-style: italic;
          color: #aaa;
          margin-left: 10px;
        }
        .tds-error-context {
          font-family: monospace;
          background: #333;
          padding: 5px;
          margin: 5px 10px;
          border-left: 2px solid #ff5f5f;
          white-space: pre-wrap;
          display: none;
        }
        .tds-validation-error-item.expanded .tds-error-context {
          display: block;
        }
        @keyframes tds-success-pulse {
          0% { background-color: rgba(95, 255, 95, 0.2); }
          50% { background-color: rgba(95, 255, 95, 0.3); }
          100% { background-color: transparent; }
        }
        
        .tds-success {
          color: #5fff5f;
          border-left: 3px solid #5fff5f;
        }
        .tds-a11y-tip {
          background: #2a2a2a;
          padding: 8px;
          margin: 8px 10px;
          border-left: 3px solid #5f9fff;
          font-size: 11px;
        }
        .tds-a11y-tip h4 {
          margin: 0 0 5px 0;
          font-size: 12px;
          color: #5f9fff;
        }
        .tds-a11y-tip p {
          margin: 0 0 5px 0;
        }
        .tds-a11y-tip a {
          color: #5f9fff;
          text-decoration: none;
        }
        .tds-a11y-tip a:hover {
          text-decoration: underline;
        }
        .tds-action-buttons {
          display: flex;
          justify-content: space-between;
          padding: 5px 10px;
          background: #2a2a2a;
          border-top: 1px solid #444;
        }
        
        .tds-run-button {
          background: #5f9fff;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .tds-run-button:hover {
          background: #4a8fef;
        }
      </style>
      <div id="tds-validation-header">
        <span>Design System Validation <span id="tds-error-count" class="tds-validation-count">0</span></span>
        <div>
          <button class="tds-button-console" id="tds-validation-clear" title="Clear all messages">🗑️</button>
        </div>
      </div>
      <div id="tds-validation-tabs">
        <div class="tds-tab active" data-tab="html">HTML <span class="tds-tab-count" id="tds-html-count">0</span></div>
        <div class="tds-tab" data-tab="a11y">Accessibility <span class="tds-tab-count" id="tds-a11y-count">0</span></div>
        <div class="tds-tab" data-tab="design">Design System <span class="tds-tab-count" id="tds-design-count">0</span></div>
      </div>
      <div id="tds-tab-html" class="tds-tab-content active"></div>
      <div id="tds-tab-a11y" class="tds-tab-content">
        <div class="tds-a11y-tip">
          <h4>Accessibility Tips</h4>
          <p>Ensure all images have meaningful alt text</p>
          <p>Use semantic HTML elements (h1-h6, nav, main, etc.)</p>
          <p>Check color contrast (4.5:1 for normal text)</p>
          <p><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank">Learn more about WCAG</a></p>
        </div>
      </div>
      <div id="tds-tab-design" class="tds-tab-content"></div>
      <div class="tds-action-buttons">
        <button id="tds-run-validation" class="tds-run-button">Run Validation</button>
      </div>
    `;
    
    document.body.appendChild(consoleElement);
    
    // Make the console draggable
    makeDraggable(consoleElement, document.getElementById('tds-validation-header'));
    
    // Tab switching
    const tabs = document.querySelectorAll('.tds-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Hide all tab contents
        document.querySelectorAll('.tds-tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Deactivate all tabs
        document.querySelectorAll('.tds-tab').forEach(t => {
          t.classList.remove('active');
        });
        
        // Activate clicked tab
        tab.classList.add('active');
        
        // Show corresponding content
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(`tds-tab-${tabId}`).classList.add('active');
      });
    });
    
    
    document.getElementById('tds-validation-clear').addEventListener('click', () => {
      document.querySelectorAll('.tds-tab-content').forEach(container => {
        container.innerHTML = '';
      });
      
      // Reset counts
      updateCounts();
      
      // Restore the a11y tips
      const a11yContainer = document.getElementById('tds-tab-a11y');
      if (!a11yContainer.querySelector('.tds-a11y-tip')) {
        a11yContainer.innerHTML = `
          <div class="tds-a11y-tip">
            <h4>Accessibility Tips</h4>
            <p>Ensure all images have meaningful alt text</p>
            <p>Use semantic HTML elements (h1-h6, nav, main, etc.)</p>
            <p>Check color contrast (4.5:1 for normal text)</p>
            <p><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank">Learn more about WCAG</a></p>
          </div>
        `;
      }
    });
    
    // Run validation button handler
    document.getElementById('tds-run-validation').addEventListener('click', () => {
      // Clear previous results so repeated runs stay comparable
      consoleAPI.clear();

      dsConsole.info('Running validation on all components...');

      // The examples live in same-origin iframes (CodePreviewIframe), so
      // scan those documents as well as the top page.
      const documents = [document];
      document.querySelectorAll('iframe').forEach((frame) => {
        try {
          if (frame.contentDocument) documents.push(frame.contentDocument);
        } catch (error) {
          // Cross-origin iframe - not one of ours, skip it
        }
      });

      // Collect root design system components. Skip elements nested inside
      // another tds-* element so each component is validated once, and
      // exclude the console's and validator widget's own tds-* classed UI.
      const components = [];
      documents.forEach((doc) => {
        doc.querySelectorAll('[class*="tds-"]').forEach((element) => {
          if (
            element.closest('#tds-validation-console') ||
            element.closest('#tds-validator-widget')
          ) {
            return;
          }
          const parent = element.parentElement;
          if (parent && parent.closest('[class*="tds-"]')) return;
          components.push(element);
        });
      });

      if (components.length === 0) {
        dsConsole.warn('No design system components found on the page.');
        return;
      }

      const frameCount = documents.length - 1;
      dsConsole.info(
        `Found ${components.length} components on the page and in ${frameCount} example frames.`,
      );

      let a11yErrors = 0;
      let a11yWarnings = 0;

      components.forEach((element) => {
        try {
          const componentName = detectComponentTypeFromElement(element);

          const a11yResult = runBasicA11yChecks(element, componentName);
          a11yErrors += a11yResult.errors;
          a11yWarnings += a11yResult.warnings;

          validateDesignSystem(element.outerHTML, componentName);
        } catch (error) {
          dsConsole.error(`Error validating component: ${error.message}`, error.stack);
        }
      });

      // Per-tab summaries so a run is never silent
      dsConsole.info(
        `HTML: ${components.length} components scanned. The live DOM is always well-formed - source markup is validated automatically when examples render.`,
      );
      if (a11yErrors === 0 && a11yWarnings === 0) {
        dsConsole.a11y.success(
          `Accessibility: ${components.length} components checked, no basic issues found ✓`,
        );
      } else {
        dsConsole.a11y.warn(
          `Accessibility: ${components.length} components checked - ${a11yErrors} errors, ${a11yWarnings} warnings (details above).`,
        );
      }
      dsConsole.design.info(
        `Design system: checking ${components.length} components, results follow...`,
      );
    });
    
    // Helper function to detect component type from a DOM element
    function detectComponentTypeFromElement(element) {
      const classNames = Array.from(element.classList || []);
      
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
    
    // Basic a11y checks directly in the validation console.
    // Returns issue counts; the run handler prints one summary line instead
    // of a success line per component.
    function runBasicA11yChecks(element, componentName) {
      let errors = 0;
      let warnings = 0;

      // Check for images without alt
      const imagesWithoutAlt = element.querySelectorAll('img:not([alt])');
      if (imagesWithoutAlt.length > 0) {
        errors += imagesWithoutAlt.length;
        dsConsole.a11y.error(`Found ${imagesWithoutAlt.length} images without alt text`,
          imagesWithoutAlt[0].outerHTML, componentName);
      }

      // Check for empty buttons without aria-label
      const emptyButtons = element.querySelectorAll('button:empty:not([aria-label]):not([aria-labelledby])');
      if (emptyButtons.length > 0) {
        errors += emptyButtons.length;
        dsConsole.a11y.error(`Found ${emptyButtons.length} empty buttons without accessible name`,
          emptyButtons[0].outerHTML, componentName);
      }

      // Check for form elements without labels. An input counts as labeled
      // when it has aria-label/aria-labelledby, a wrapping <label>, or a
      // <label for="..."> pointing at its id anywhere in its document.
      const unlabeledInputs = Array.from(
        element.querySelectorAll('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])'),
      ).filter((input) => {
        if (input.closest('label')) return false;
        const id = input.getAttribute('id');
        if (id && input.ownerDocument.querySelector(`label[for="${CSS.escape(id)}"]`)) return false;
        return true;
      });
      if (unlabeledInputs.length > 0) {
        warnings += unlabeledInputs.length;
        dsConsole.a11y.warn(`Found ${unlabeledInputs.length} form elements that might need labels`,
          unlabeledInputs[0].outerHTML, componentName);
      }

      return { errors, warnings };
    }
    
    // Create the console API
    const consoleAPI = {
      log: (message, type = 'info', context = null, componentName = null, category = 'html') => {
        const tabContainer = document.getElementById(`tds-tab-${category}`);
        if (!tabContainer) return;
        
        const messageItem = document.createElement('div');
        messageItem.className = `tds-validation-error-item tds-${type}`;
        
        // Render the message as text, not HTML: messages often contain tag
        // names like </span>, which innerHTML would parse and swallow.
        messageItem.textContent = message;
        if (componentName) {
          const info = document.createElement('span');
          info.className = 'tds-component-info';
          info.textContent = `(${componentName})`;
          messageItem.appendChild(info);
        }
        
        if (context) {
          const contextElement = document.createElement('div');
          contextElement.className = 'tds-error-context';
          contextElement.textContent = context;
          messageItem.appendChild(contextElement);
          
          // Toggle expanded state on click
          messageItem.addEventListener('click', () => {
            messageItem.classList.toggle('expanded');
          });
        }
        
        tabContainer.appendChild(messageItem);
        
        // Scroll to bottom
        tabContainer.scrollTop = tabContainer.scrollHeight;
        
        // Update counts
        updateCounts();
        
        // If it's an error or warning, highlight the tab
        if (type === 'error' || type === 'warning') {
          const tabCountElement = document.getElementById(`tds-${category}-count`);
          if (tabCountElement) {
            tabCountElement.style.display = 'flex';
          }
        }
      },
      
      error: (message, context = null, componentName = null, category = 'html') => {
        consoleAPI.log(message, 'error', context, componentName, category);
      },
      
      warn: (message, context = null, componentName = null, category = 'html') => {
        consoleAPI.log(message, 'warning', context, componentName, category);
      },
      
      info: (message, context = null, componentName = null, category = 'html') => {
        consoleAPI.log(message, 'info', context, componentName, category);
      },
      
      success: (message, context = null, componentName = null, category = 'html') => {
        consoleAPI.log(message, 'success', context, componentName, category);
      },
      
      a11y: {
        error: (message, context = null, componentName = null) => {
          consoleAPI.error(message, context, componentName, 'a11y');
        },
        warn: (message, context = null, componentName = null) => {
          consoleAPI.warn(message, context, componentName, 'a11y');
        },
        info: (message, context = null, componentName = null) => {
          consoleAPI.info(message, context, componentName, 'a11y');
        },
        success: (message, context = null, componentName = null) => {
          consoleAPI.success(message, context, componentName, 'a11y');
        }
      },
      
      design: {
        error: (message, context = null, componentName = null) => {
          consoleAPI.error(message, context, componentName, 'design');
        },
        warn: (message, context = null, componentName = null) => {
          consoleAPI.warn(message, context, componentName, 'design');
        },
        info: (message, context = null, componentName = null) => {
          consoleAPI.info(message, context, componentName, 'design');
        },
        success: (message, context = null, componentName = null) => {
          consoleAPI.success(message, context, componentName, 'design');
        }
      },
      
      clear: () => {
        document.querySelectorAll('.tds-tab-content').forEach(container => {
          container.innerHTML = '';
        });
        
        // Reset counts
        updateCounts();
        
        // Restore the a11y tips
        const a11yContainer = document.getElementById('tds-tab-a11y');
        a11yContainer.innerHTML = `
          <div class="tds-a11y-tip">
            <h4>Accessibility Tips</h4>
            <p>Ensure all images have meaningful alt text</p>
            <p>Use semantic HTML elements (h1-h6, nav, main, etc.)</p>
            <p>Check color contrast (4.5:1 for normal text)</p>
            <p><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank">Learn more about WCAG</a></p>
          </div>
        `;
      },
      
      show: () => {
        consoleElement.style.display = 'flex';
      },
      
      hide: () => {
        consoleElement.style.display = 'none';
      }
    };
    
    // Helper to update all error counts
    function updateCounts() {
      // Update main error count
      const totalErrors = document.querySelectorAll('.tds-validation-error-item.tds-error').length;
      const countElement = document.getElementById('tds-error-count');
      countElement.textContent = totalErrors;
      countElement.style.display = totalErrors > 0 ? 'inline-block' : 'none';
      
      // Update tab-specific counts
      const categories = ['html', 'a11y', 'design'];
      categories.forEach(cat => {
        const container = document.getElementById(`tds-tab-${cat}`);
        const errors = container.querySelectorAll('.tds-validation-error-item.tds-error').length;
        const warnings = container.querySelectorAll('.tds-validation-error-item.tds-warning').length;
        const count = errors + warnings;
        
        const countElement = document.getElementById(`tds-${cat}-count`);
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'flex' : 'none';
      });
    }
    
    // Add default accessibility checks explanation
    consoleAPI.a11y.info('Accessibility checks enabled', 
      'Components will be scanned for accessibility issues. Click the "Run Validation" button to check existing components.', 
      'A11y Scanner');
    
    // Make console draggable
    function makeDraggable(element, handle) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      
      handle.onmousedown = dragMouseDown;
      
      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get mouse position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves
        document.onmousemove = elementDrag;
      }
      
      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate new position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.right = 'auto';
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.bottom = 'auto';
      }
      
      function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
    
    // Store the console API as a singleton
    window._tdsValidationConsole = consoleAPI;
    
    // Make sure the console API is available globally
    if (typeof window !== 'undefined') {
      window.dsConsole = consoleAPI;
      
      // Add a simple test method for debugging
      window.testValidationConsole = function() {
        consoleAPI.info('Testing validation console');
        consoleAPI.error('Test error message');
        consoleAPI.warn('Test warning message');
        consoleAPI.success('Test success message');
        return 'Validation console test completed';
      };
    }
    
    return consoleAPI;
  }
  
  // For singleton instance, wrap in ExecutionEnvironment check
  export const dsConsole = ExecutionEnvironment.canUseDOM 
      ? createValidationConsole() 
      : {
          log: () => {},
          warn: () => {},
          error: () => {},
          success: () => {},
          // Add any other methods your console provides
      };
