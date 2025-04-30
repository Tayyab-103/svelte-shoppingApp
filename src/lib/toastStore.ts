// toastStore.ts
import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastSettings {
  message: string;
  type: ToastType;
  duration?: number;
}

// Create a writable store with initial values
const createToastStore = () => {
  const { subscribe, update, set } = writable({
    show: false,
    message: '',
    type: 'success' as ToastType,
    duration: 3000
  });

  return {
    subscribe,
    show: (settings: ToastSettings) => {
      update(state => ({
        show: true,
        message: settings.message,
        type: settings.type,
        duration: settings.duration || 3000
      }));
    },
    success: (message: string, duration = 3000) => {
      update(state => ({
        show: true,
        message,
        type: 'success',
        duration
      }));
    },
    error: (message: string, duration = 3000) => {
      update(state => ({
        show: true,
        message,
        type: 'error',
        duration
      }));
    },
    warning: (message: string, duration = 3000) => {
      update(state => ({
        show: true,
        message,
        type: 'warning',
        duration
      }));
    },
    info: (message: string, duration = 3000) => {
      update(state => ({
        show: true,
        message,
        type: 'info',
        duration
      }));
    },
    hide: () => {
      update(state => ({ ...state, show: false }));
    }
  };
};

export const toast = createToastStore();