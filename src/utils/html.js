import { validateDesignSystem } from './designValidator';

// Enhanced environment detection
const isClient = typeof window !== 'undefined';
const isDevelopment = isClient && (
  process.env.NODE_ENV === 'development' || 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
);

// Only load validation tools in development
if (isClient && isDevelopment && window.TDS_SCAN_A11Y) {
  loadAxeIfNeeded().catch(() => {
    // Will fall back to basic checks if loading fails
  });
}

// Create a safety wrapper for dsConsole
const safeConsole = {
  error: (message, context, componentName) => {
    // Only log to console in development
    if (isDevelopment) {
      console.error(`[${componentName || 'Component'}] ${message}`);
    }
    
    if (isClient && isDevelopment && 
        window.dsConsole && 
        typeof window.dsConsole.error === 'function') {
      window.dsConsole.error(message, context, componentName);
    }
  },
  warn: (message, context, componentName) => {
    // Only log to console in development
    if (isDevelopment) {
      console.warn(`[${componentName || 'Component'}] ${message}`);
    }
    
    if (isClient && isDevelopment && 
        window.dsConsole && 
        typeof window.dsConsole.warn === 'function') {
      window.dsConsole.warn(message, context, componentName);
    }
  },
  info: (message, context, componentName) => {
    if (isClient && isDevelopment && 
        window.dsConsole && 
        typeof window.dsConsole.info === 'function') {
      window.dsConsole.info(message, context, componentName);
    }
  },
  success: (message, context, componentName) => {
    if (isClient && isDevelopment && 
        window.dsConsole && 
        typeof window.dsConsole.success === 'function') {
      window.dsConsole.success(message, context, componentName);
    }
  }
};

/**
 * Enhanced HTML template tag that normalizes class attributes, formats HTML,
 * and validates HTML structure using W3C standards
 * @param {TemplateStringsArray} strings - Template string parts
 * @param {...any} values - Values to interpolate
 * @returns {string} - Normalized, formatted and validated HTML string
 */
export function html(strings, ...values) {
  let componentName = 'Unknown Component';
  
  try {
    // First, get the raw HTML using String.raw
    const rawHTML = String.raw(strings, ...values);
    
    // Try to detect component name from the context
    componentName = detectComponentName(rawHTML);
    
    // Normalize all class attributes
    let processedHTML = rawHTML.replace(/class="([^"]+)"/g, (match, classContent) => {
      const normalizedClasses = classContent
        .split(/\s+/)     // Split on any whitespace
        .filter(Boolean)  // Remove empty strings
        .join(' ');       // Join with single spaces
      
      return `class="${normalizedClasses}"`;
    });
    
    // Use safeConsole instead of directly accessing window.dsConsole
    safeConsole.info(`Processing HTML for ${componentName}`);
    
    // Basic HTML structure validation - this will always run
    const structureValid = validateHTMLStructure(processedHTML, componentName);
    
    // Only run browser-specific features when in browser environment
    if (isClient) {
      // Run accessibility scan if enabled
      if (window.TDS_SCAN_A11Y) {
        scanForA11y(processedHTML, componentName);
      }
      
      // Always run design system validation - now a core feature
      validateDesignSystem(processedHTML, componentName);
      
      // Apply formatting if enabled
      if (window.TDS_FORMAT_HTML) {
        processedHTML = formatHTML(processedHTML);
      }
    }
    
    // Always log a success message if structure is valid
    if (structureValid) {
      safeConsole.success(`HTML structure validation passed ✓`, null, componentName);
    }
    
    return processedHTML;
  } catch (error) {
    // Only log errors in development mode
    if (isDevelopment) {
      safeConsole.error(`HTML processing error: ${error.message}`, null, componentName);
    }
    
    // Fallback to basic String.raw in all environments
    return String.raw(strings, ...values);
  }
}

/**
 * Simple HTML structure validation to catch obvious errors
 * @returns {boolean} Whether validation passed
 */
function validateHTMLStructure(html, componentName) {
  // Skip validation in production
  if (!isDevelopment) return true;
  
  try {
    const tagStack = [];
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
                         'link', 'meta', 'param', 'source', 'track', 'wbr'];
    
    // Simple tag regex
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[a-zA-Z0-9-]+(?:=(?:"[^"]*"|'[^']*'|[^'"<>\s]+))?)*)\s*\/?>/g;
    
    let match;
    let valid = true;
    
    while ((match = tagRegex.exec(html)) !== null) {
      const [fullTag, tagName, attributes] = match;
      const isSelfClosing = fullTag.endsWith('/>') || voidElements.includes(tagName.toLowerCase());
      const isClosingTag = fullTag.startsWith('</');
      
      if (isClosingTag) {
        // Check if this closing tag matches the last opening tag
        if (tagStack.length === 0) {
          const nearbyCode = html.substring(Math.max(0, match.index - 20), match.index + fullTag.length + 20);
          safeConsole.error(`Closing tag </${tagName}> without matching opening tag`, nearbyCode, componentName);
          valid = false;
          continue;
        }
        
        const lastOpenTag = tagStack.pop();
        if (lastOpenTag.toLowerCase() !== tagName.toLowerCase()) {
          const nearbyCode = html.substring(Math.max(0, match.index - 20), match.index + fullTag.length + 20);
          safeConsole.error(`Mismatched tags: opening <${lastOpenTag}> and closing </${tagName}>`, nearbyCode, componentName);
          valid = false;
        }
      } else if (!isSelfClosing) {
        // Add opening tag to the stack
        tagStack.push(tagName);
      }
    }
    
    // Check if any tags remain unclosed
    if (tagStack.length > 0) {
      safeConsole.error(`Unclosed tags: ${tagStack.join(', ')}`, html.slice(-50), componentName);
      valid = false;
    }
    
    return valid;
  } catch (error) {
    safeConsole.error(`HTML structure validation error: ${error.message}`, error.stack, componentName);
    return false;
  }
}

/**
 * Validates HTML using the official W3C validator API
 * Note: Requires a CORS browser extension to bypass restrictions in development
 */
async function validateWithW3C(html, componentName) {
  if (!isClient) return false; // Skip in server environment
  
  console.log(`[W3C] Starting validation for ${componentName}...`);
  
  try {
    // Wrap the HTML fragment in a full document if it's not already
    let fullHtml = html;
    if (!html.includes('<!DOCTYPE html>')) {
      fullHtml = `<!DOCTYPE html><html><head><title>Validation</title></head><body>${html}</body></html>`;
    }
    
    // Direct API call to W3C validator (requires CORS extension)
    const validatorUrl = 'https://validator.w3.org/nu/?out=json';
    
    console.log(`[W3C] Sending HTML to validator (make sure your CORS extension is enabled)`);
    
    const response = await fetch(validatorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Accept': 'application/json'
      },
      body: fullHtml
    });
    
    if (!response.ok) {
      throw new Error(`Validator responded with status ${response.status}`);
    }
    
    const validationResult = await response.json();
    console.log(`[W3C] Full validation results:`, validationResult);
    
    const { messages } = validationResult;
    
    // Process validation messages
    if (messages && messages.length > 0) {
      // Group messages by type
      const errors = messages.filter(msg => msg.type === 'error');
      const warnings = messages.filter(msg => msg.type !== 'error');
      
      // Log to console
      console.log(`[W3C] Validation found ${errors.length} errors and ${warnings.length} warnings`);
      
      // Log to validation console
      if (isClient && window.dsConsole) {
        errors.forEach(error => {
          const location = error.lastLine ? `Line ${error.lastLine}` : '';
          const message = `${error.message} ${location}`;
          window.dsConsole.error(`[W3C] ${message}`, error.extract, componentName);
        });
        
        warnings.forEach(warning => {
          const location = warning.lastLine ? `Line ${warning.lastLine}` : '';
          const message = `${warning.message} ${location}`;
          window.dsConsole.warn(`[W3C] ${message}`, warning.extract, componentName);
        });
        
        if (errors.length === 0 && warnings.length === 0) {
          window.dsConsole.success(`W3C validation passed for ${componentName}`, null, componentName);
        }
      }
      
      return errors.length === 0; // Return true if no errors (warnings are okay)
    } else {
      // No messages means validation passed
      console.log(`[W3C] Validation passed for ${componentName}`);
      
      if (isClient && window.dsConsole) {
        window.dsConsole.success(`W3C validation passed for ${componentName}`, null, componentName);
      }
      
      return true;
    }
  } catch (error) {
    console.error(`[W3C] Validation error:`, error);
    
    if (isClient && window.dsConsole) {
      window.dsConsole.error(
        `[W3C] Validation error: ${error.message}. Make sure your CORS extension is enabled.`, 
        null, 
        componentName
      );
    }
    
    return false;
  }
}

/**
 * Detect component name based on HTML content
 */
function detectComponentName(html) {
  // Map of component types to their identifier patterns
  const componentPatterns = [
    { pattern: /tds-badge/, name: 'Badge' },
    { pattern: /tds-button/, name: 'Button' },
    { pattern: /tds-card/, name: 'Card' },
    { pattern: /tds-alert/, name: 'Alert' },
    { pattern: /tds-modal/, name: 'Modal' },
    { pattern: /tds-input/, name: 'Input' },
    { pattern: /tds-form/, name: 'Form' },
    { pattern: /tds-table/, name: 'Table' },
    { pattern: /tds-dropdown/, name: 'Dropdown' },
    { pattern: /tds-select/, name: 'Select' },
    { pattern: /tds-checkbox/, name: 'Checkbox' },
    { pattern: /tds-radio/, name: 'Radio' },
    { pattern: /tds-toggle/, name: 'Toggle' },
    { pattern: /tds-tooltip/, name: 'Tooltip' },
    { pattern: /tds-tab/, name: 'Tab' }
  ];
  
  for (const { pattern, name } of componentPatterns) {
    if (pattern.test(html)) {
      return name;
    }
  }
  
  return 'Unknown Component';
}

/**
 * Format HTML with proper indentation (simplified version)
 */
function formatHTML(html) {
  try {
    // Very simple formatting to avoid errors
    let formatted = '';
    let indentLevel = 0;
    const indent = '  '; // 2 spaces
    const isVoidElement = tag => /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tag);
    
    // Simple lexer
    let inTag = false;
    let tagName = '';
    let isClosingTag = false;
    
    for (let i = 0; i < html.length; i++) {
      const char = html[i];
      
      if (char === '<') {
        inTag = true;
        isClosingTag = html[i + 1] === '/';
        tagName = '';
        
        if (isClosingTag) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        if (formatted && !/\s$/.test(formatted)) {
          formatted += '\n';
        }
        
        formatted += indent.repeat(indentLevel) + '<';
      } else if (inTag && char === '>') {
        formatted += '>';
        inTag = false;
        
        const isSelfClosing = formatted.endsWith('/>') || isVoidElement(tagName);
        
        if (!isClosingTag && !isSelfClosing) {
          indentLevel++;
        }
      } else if (inTag) {
        formatted += char;
        
        // Track tag name for the first few characters after <
        if (/[a-zA-Z0-9]/.test(char) && (!tagName || tagName.length < 10)) {
          tagName += char;
        }
      } else {
        formatted += char;
      }
    }
    
    return formatted;
  } catch (error) {
    safeConsole.error(`HTML formatting error: ${error.message}`, error.stack);
    return html; // Return unformatted on error
  }
}

// Only enable these flags in development environment
if (isClient) {
  window.TDS_FORMAT_HTML = isDevelopment;
}

// Make the html function work like String.raw for backward compatibility
html.raw = html;

// Define configuration functions - only use window if in browser
const enableW3CValidation = () => { 
  if (isClient) window.TDS_VALIDATE_W3C = true; 
};
const disableW3CValidation = () => { 
  if (isClient) window.TDS_VALIDATE_W3C = false; 
};
const enableHTMLFormatting = () => { 
  if (isClient) window.TDS_FORMAT_HTML = true; 
};
const disableHTMLFormatting = () => { 
  if (isClient) window.TDS_FORMAT_HTML = false; 
};

// Export everything in one place to avoid duplicates
export {
  enableW3CValidation,
  disableW3CValidation,
  enableHTMLFormatting,
  disableHTMLFormatting
};

export default html;
