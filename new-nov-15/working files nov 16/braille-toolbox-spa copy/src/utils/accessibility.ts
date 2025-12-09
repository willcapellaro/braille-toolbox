/**
 * Accessibility utilities and enhancements for Braille Toolbox
 */

// Enhanced ARIA attributes for braille content
export const getBrailleAriaLabel = (character: string, dots: string, description: string): string => {
  return `Braille character ${character}, dots ${dots.split('').join(' ')}, ${description}`;
};

// Keyboard navigation helpers
export const handleKeyboardNavigation = (event: KeyboardEvent, onActivate: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onActivate();
  }
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management for modals and complex interactions
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  firstElement.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// High contrast detection and adaptation
export const adaptForHighContrast = () => {
  const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
  
  if (isHighContrast) {
    document.documentElement.classList.add('high-contrast');
  }
  
  return isHighContrast;
};

// Reduced motion detection
export const respectReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
  }
  
  return prefersReducedMotion;
};