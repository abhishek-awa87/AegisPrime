import { useEffect, useCallback } from 'react';

export const useKeyPress = (targetKey: string, callback: () => void) => {
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Do not trigger if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }
      
      if (event.key.toLowerCase() === targetKey.toLowerCase()) {
        event.preventDefault();
        memoizedCallback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [targetKey, memoizedCallback]);
};
