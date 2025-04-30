import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timeout?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function addToast(message: string, type: ToastType = 'info', timeout: number = 3000) {
    const id = Date.now().toString();
    
    update(toasts => [
      ...toasts,
      { id, message, type, timeout }
    ]);

    if (timeout) {
      setTimeout(() => {
        removeToast(id);
      }, timeout);
    }
    
    return id;
  }

  function removeToast(id: string) {
    update(toasts => toasts.filter(toast => toast.id !== id));
  }

  function clearToasts() {
    update(() => []);
  }

  return {
    subscribe,
    add: addToast,
    remove: removeToast,
    clear: clearToasts,
    success: (message: string, timeout?: number) => addToast(message, 'success', timeout),
    error: (message: string, timeout?: number) => addToast(message, 'error', timeout),
    info: (message: string, timeout?: number) => addToast(message, 'info', timeout),
    warning: (message: string, timeout?: number) => addToast(message, 'warning', timeout)
  };
}

export const toasts = createToastStore();