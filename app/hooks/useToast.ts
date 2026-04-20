import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toastListeners: Set<(toasts: Toast[]) => void> = new Set();
let toastList: Toast[] = [];

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Subscribe to global toast updates
  if (typeof window !== 'undefined' && toastListeners.size === 0) {
    toastListeners.add(setToasts);
  }

  const addToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration: number = 3000
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, duration };
    
    toastList = [...toastList, newToast];
    toastListeners.forEach(listener => listener(toastList));

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    toastList = toastList.filter(toast => toast.id !== id);
    toastListeners.forEach(listener => listener(toastList));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
  };
};
