/**
 * Initialize character counters for textareas
 */
function initCharacterCounters() {
  // Select all textareas with data-counter attribute but without data-word-counter
  const textareas = document.querySelectorAll('textarea[data-counter]:not([data-word-counter])');
  
  textareas.forEach(textarea => {
    const counterId = textarea.getAttribute('data-counter-id');
    const counter = document.getElementById(counterId);
    
    if (!counter) return;
    
    // Set initial count
    counter.textContent = textarea.value.length;
    
    // Update count on input
    textarea.addEventListener('input', function() {
      counter.textContent = this.value.length;
    });
  });
}

/**
 * Initialize word counters for textareas
 */
function initWordCounters() {
  const textareas = document.querySelectorAll('textarea[data-word-counter]');
  
  textareas.forEach(textarea => {
    const counterId = textarea.getAttribute('data-counter-id');
    const counter = document.getElementById(counterId);
    
    if (!counter) return;
    
    // Word count function
    const countWords = text => {
      const words = text.trim().split(/\s+/);
      return words.length > 0 && words[0] !== '' ? words.length : 0;
    };
    
    // Set initial count
    counter.textContent = countWords(textarea.value);
    
    // Update count on input
    textarea.addEventListener('input', function() {
      counter.textContent = countWords(this.value);
    });
  });
}

// Initialize counters when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initCharacterCounters();
  initWordCounters();
});