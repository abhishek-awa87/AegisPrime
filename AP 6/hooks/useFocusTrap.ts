import { useEffect, useCallback } from 'react';

export const useFocusTrap = (ref: React.RefObject<HTMLElement>, active: boolean) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) { // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else { // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }, [ref]);

  useEffect(() => {
    if (active) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the first element in the trap when it becomes active
      const firstFocusable = ref.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, handleKeyDown, ref]);
};
