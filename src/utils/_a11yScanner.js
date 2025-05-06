import { dsConsole } from './validationConsole';

/**
 * Simple accessibility scanner for HTML components
 * @param {string} html - HTML string to scan
 * @param {string} componentName - Name of the component being scanned
 */
export function scanForA11y(html, componentName) {
    console.log('Scanning for accessibility issues...', componentName);
  // Run asynchronously to not block rendering
  setTimeout(() => {
    try {
      dsConsole.a11y.info(`Running accessibility scan...`, null, componentName);
      
      // Create a temporary container to parse the HTML
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.innerHTML = html;
      document.body.appendChild(tempContainer);
      
      // First try to use axe-core if available
      if (typeof window.axe !== 'undefined') {
        runAxeScan(tempContainer, componentName);
      } else {
        // Fallback to basic checks
        const issues = runBasicA11yChecks(tempContainer);
        
        // Report results
        if (issues.length > 0) {
          dsConsole.a11y.warn(`Found ${issues.length} accessibility issues`, 
                          formatA11yIssues(issues), componentName);
        } else {
          dsConsole.a11y.success(`Accessibility scan passed ✓`, 'No basic issues found.', componentName);
        }
        
        // Clean up
        document.body.removeChild(tempContainer);
      }
    } catch (error) {
      dsConsole.a11y.error(`Accessibility scan error: ${error.message}`, error.stack, componentName);
    }
  }, 0);
}

/**
 * Run accessibility scan using axe-core library
 */
function runAxeScan(container, componentName) {
  window.axe.run(container)
    .then(results => {
      // Clean up the temporary element
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      
      // Process the results
      if (results.violations.length > 0) {
        const issues = results.violations.map(violation => ({
          impact: violation.impact,
          description: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.map(node => ({
            html: node.html,
            impact: node.impact,
            failureSummary: node.failureSummary
          }))
        }));
        
        dsConsole.a11y.warn(`Found ${issues.length} accessibility issues with axe`, 
                       formatAxeIssues(issues), componentName);
      } else {
        dsConsole.a11y.success(`Accessibility scan passed ✓`, 'No issues found with axe.', componentName);
      }
    })
    .catch(error => {
      dsConsole.a11y.error(`Axe scan error: ${error.message}`, error.stack, componentName);
      
      // Clean up on error
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
}

/**
 * Run basic accessibility checks without external libraries
 * @returns {Array} Array of accessibility issues
 */
function runBasicA11yChecks(container) {
  const issues = [];
  
  // Check 1: Images without alt text
  const imagesWithoutAlt = container.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      description: 'Images must have alt attributes',
      elements: Array.from(imagesWithoutAlt),
      impact: 'serious',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/image-alt'
    });
  }
  
  // Check 2: Empty links and buttons
  const emptyButtons = container.querySelectorAll('button:empty:not([aria-label]):not([aria-labelledby])');
  if (emptyButtons.length > 0) {
    issues.push({
      description: 'Buttons must have discernible text or accessible name',
      elements: Array.from(emptyButtons),
      impact: 'serious',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/button-name'
    });
  }
  
  const emptyLinks = container.querySelectorAll('a:empty:not([aria-label]):not([aria-labelledby])');
  if (emptyLinks.length > 0) {
    issues.push({
      description: 'Links must have discernible text or accessible name',
      elements: Array.from(emptyLinks),
      impact: 'serious',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/link-name'
    });
  }
  
  // Check 3: Color contrast (basic check for known problematic color classes)
  const lowContrastElements = container.querySelectorAll('[class*="--light-on-light"], [class*="--white-on-light"]');
  if (lowContrastElements.length > 0) {
    issues.push({
      description: 'Potential low color contrast detected',
      elements: Array.from(lowContrastElements),
      impact: 'moderate',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/color-contrast'
    });
  }
  
  // Check 4: Form elements without labels
  const inputsWithoutLabels = container.querySelectorAll('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])');
  const inputsWithLabels = Array.from(inputsWithoutLabels).filter(input => {
    // Check if this input has an associated label
    const id = input.getAttribute('id');
    return id ? container.querySelector(`label[for="${id}"]`) === null : true;
  });
  
  if (inputsWithLabels.length > 0) {
    issues.push({
      description: 'Form elements must have labels',
      elements: inputsWithLabels,
      impact: 'serious',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/label'
    });
  }
  
  // Check 5: Missing landmarks for screen readers
  if (!container.querySelector('header, [role="banner"]') && 
      container.querySelectorAll('*').length > 50) {
    issues.push({
      description: 'Large interface should include proper landmarks (header, nav, main, etc.)',
      impact: 'moderate',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/landmark-banner-is-top-level'
    });
  }
  
  // Check 6: Heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length > 1) {
    let previousLevel = 0;
    let skippedHeadingFound = false;
    
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.substring(1), 10);
      
      if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        skippedHeadingFound = true;
      }
      
      previousLevel = currentLevel;
    });
    
    if (skippedHeadingFound) {
      issues.push({
        description: 'Heading levels should not be skipped (e.g., h1 to h3)',
        elements: Array.from(headings),
        impact: 'moderate',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/heading-order'
      });
    }
  }
  
  // Check 7: Check for ARIA roles, states and properties
  const elementsWithARIA = container.querySelectorAll('[role], [aria-*]');
  elementsWithARIA.forEach(el => {
    const role = el.getAttribute('role');
    if (role) {
      // Check if role is valid
      const validRoles = [
        'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 
        'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 
        'contentinfo', 'definition', 'dialog', 'directory', 'document', 
        'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 
        'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 
        'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 
        'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation', 
        'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 
        'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 
        'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 
        'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 
        'tooltip', 'tree', 'treegrid', 'treeitem'
      ];
      
      if (!validRoles.includes(role)) {
        issues.push({
          description: `Invalid ARIA role: ${role}`,
          elements: [el],
          impact: 'moderate',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/aria-roles'
        });
      }
    }
  });
  
  return issues;
}

/**
 * Format accessibility issues for display
 */
function formatA11yIssues(issues) {
  return issues.map(issue => {
    let result = `Impact: ${issue.impact.toUpperCase()}\n`;
    result += `Issue: ${issue.description}\n`;
    
    if (issue.elements && issue.elements.length > 0) {
      result += `Elements affected: ${issue.elements.length}\n`;
      result += `Example: ${issue.elements[0].outerHTML.substring(0, 100)}${issue.elements[0].outerHTML.length > 100 ? '...' : ''}\n`;
    }
    
    if (issue.helpUrl) {
      result += `More info: ${issue.helpUrl}`;
    }
    
    return result;
  }).join('\n\n');
}

/**
 * Format axe-core results for display
 */
function formatAxeIssues(issues) {
  return issues.map(issue => {
    let result = `Impact: ${issue.impact.toUpperCase()}\n`;
    result += `Issue: ${issue.description}\n`;
    
    if (issue.nodes && issue.nodes.length > 0) {
      result += `Elements affected: ${issue.nodes.length}\n`;
      
      // Show details of the first node
      const firstNode = issue.nodes[0];
      result += `Example HTML: ${firstNode.html.substring(0, 100)}${firstNode.html.length > 100 ? '...' : ''}\n`;
      
      if (firstNode.failureSummary) {
        result += `Failure summary: ${firstNode.failureSummary}\n`;
      }
    }
    
    if (issue.helpUrl) {
      result += `More info: ${issue.helpUrl}`;
    }
    
    return result;
  }).join('\n\n');
}

/**
 * Check if axe-core is available, and if not, load it
 */
export function loadAxeIfNeeded() {
  return new Promise((resolve, reject) => {
    if (typeof window.axe !== 'undefined') {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.4.3/axe.min.js';
    script.integrity = 'sha512-hMDRZ6NY0qGLSCjpzqQXxvEsXNQaUwfKGJUFWvMjlGJQGpR+/pWfP+NVmSk32qlN59Y0sTYUxUwmLMlY3kJ4A==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.onload = () => {
      dsConsole.a11y.info('axe-core loaded for accessibility testing');
      resolve();
    };
    script.onerror = () => {
      dsConsole.a11y.warn('Failed to load axe-core, falling back to basic accessibility checks');
      reject();
    };
    
    document.head.appendChild(script);
  });
}

// Configuration
export const enableA11yScan = () => { window.TDS_SCAN_A11Y = true; };
export const disableA11yScan = () => { window.TDS_SCAN_A11Y = false; };