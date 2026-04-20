import React, { memo, useCallback, useMemo } from 'react';

/**
 * Performance Optimization Utilities
 * 
 * This file contains utilities and hooks for optimizing performance
 */

/**
 * useMemoized: Memoized value hook
 * Prevents unnecessary recalculations
 */
export const useMemoized = <T,>(value: T, deps: React.DependencyList): T => {
  return useMemo(() => value, deps);
};

/**
 * useCallbackMemo: Memoized callback hook
 * Prevents unnecessary function recreations
 */
export const useCallbackMemo = <Args extends any[], Return>(
  callback: (...args: Args) => Return,
  deps: React.DependencyList
) => {
  return useCallback(callback, deps);
};

/**
 * lazyLoadImage: Lazy load images with IntersectionObserver
 */
export const useLazyLoadImage = (ref: React.RefObject<HTMLImageElement>) => {
  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
};

/**
 * debounce: Debounce function calls
 * Useful for search, resize events, etc.
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * throttle: Throttle function calls
 * Useful for scroll events, resize, etc.
 */
export const useThrottle = <T,>(value: T, interval: number): T => {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastUpdated = React.useRef<number>(Date.now());

  React.useEffect(() => {
    const now = Date.now();

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const handler = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(handler);
    }
  }, [value, interval]);

  return throttledValue;
};

/**
 * MemoizedComponent: Component wrapper for memoization
 * Prevents re-renders when props haven't changed
 */
export const createMemoComponent = <P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return memo(Component, propsAreEqual);
};

/**
 * Virtual scrolling optimization
 * For rendering large lists efficiently
 */
export const useVirtualScroll = (itemCount: number, itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
  const visibleRange = { start: startIndex, end: Math.min(endIndex, itemCount) };

  return { visibleRange, setScrollTop, offsetY: startIndex * itemHeight };
};

/**
 * RequestAnimationFrame hook for smooth animations
 */
export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number>(Date.now());

  const animate = React.useCallback(() => {
    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    callback(deltaTime);
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

/**
 * Code splitting helper for dynamic imports
 */
export const useDynamicImport = <T extends {}>(
  importFunc: () => Promise<{ default: T }>
) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [module, setModule] = React.useState<T | null>(null);

  React.useEffect(() => {
    importFunc()
      .then((m) => {
        setModule(m.default);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e);
        setIsLoading(false);
      });
  }, [importFunc]);

  return { isLoading, error, module };
};
