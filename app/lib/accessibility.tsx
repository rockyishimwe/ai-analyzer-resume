// Accessibility improvements and best practices for the LMS project

import React from 'react';

/**
 * Accessibility Utilities and Guidelines
 * 
 * This file documents accessibility improvements made across the project.
 */

/**
 * ARIA Labels and Descriptions
 * - Use aria-label for icon-only buttons
 * - Use aria-describedby for complex form fields
 * - Use aria-live for dynamic content updates
 */

/**
 * Keyboard Navigation
 * - All interactive elements should be focusable
 * - Tab order should be logical
 * - Escape key should close modals/dialogs
 */

/**
 * Focus Management
 * - Focus should be visible (:focus-visible)
 * - Focus should move to new content when modals open
 * - Focus should return to trigger when modals close
 */

/**
 * Semantic HTML
 * - Use button for clickable elements (not div)
 * - Use appropriate heading levels
 * - Use label elements for form fields
 * - Use nav, main, footer semantic elements
 */

/**
 * Color Contrast
 * - Minimum 4.5:1 for normal text
 * - Minimum 3:1 for large text (18pt+)
 * - Don't rely on color alone to convey information
 */

/**
 * Text Alternatives
 * - All images should have alt text
 * - Use aria-label for icons
 * - Provide transcripts for videos
 */

// Accessible form input wrapper
export const AccessibleFormInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
  }
>(({ label, error, helperText, required, id, ...props }, ref) => {
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span aria-label="required" className="text-red-500">*</span>}
      </label>
      <input
        ref={ref}
        id={id}
        aria-describedby={`${helperText ? descriptionId : ''} ${error ? errorId : ''}`}
        aria-invalid={!!error}
        {...props}
      />
      {helperText && <p id={descriptionId} className="form-helper">{helperText}</p>}
      {error && <p id={errorId} className="form-error">{error}</p>}
    </div>
  );
});

// Focus trap hook for modals
export const useFocusTrap = (containerRef: React.RefObject<HTMLElement>) => {
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    firstElement?.focus();
    container.addEventListener('keydown', handleKeyDown);

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef]);
};

/**
 * Skip to main content link
 * Should be visible when focused
 */
export const SkipToMainContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
  >
    Skip to main content
  </a>
);

/**
 * Screen reader only text utility
 * Use for content that should only be read by screen readers
 */
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);
