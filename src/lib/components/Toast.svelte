<script lang="ts">
  import { onMount } from 'svelte';
  import { toasts, type Toast } from '$lib/toastStore';
  import { fly, fade } from 'svelte/transition';

  export let position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
    return () => {
      mounted = false;
    };
  });
  
  function getPositionClass() {
    switch (position) {
      case 'top-left': return 'top-0 left-0';
      case 'bottom-right': return 'bottom-0 right-0';
      case 'bottom-left': return 'bottom-0 left-0';
      case 'top-right':
      default: return 'top-0 right-0';
    }
  }
  
  function getIconForType(type: Toast['type']) {
    switch (type) {
      case 'success':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      case 'error':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      case 'warning':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
      case 'info':
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
  }
</script>

{#if mounted}
  <div class="toast-container {getPositionClass()}">
    {#each $toasts as toast (toast.id)}
      <div 
        class="toast toast-{toast.type}"
        in:fly={{ y: position.startsWith('top') ? -20 : 20, duration: 300 }}
        out:fade={{ duration: 200 }}
      >
        <div class="toast-icon" aria-hidden="true">
          {@html getIconForType(toast.type)}
        </div>
        <div class="toast-content">
          {toast.message}
        </div>
        <button 
          class="toast-close" 
          on:click={() => toasts.remove(toast.id)}
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .toast-container {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9999;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 100%;
    width: 350px;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: white;
    pointer-events: auto;
  }

  .toast-success {
    background-color: #10b981;
  }

  .toast-error {
    background-color: #ef4444;
  }

  .toast-warning {
    background-color: #f59e0b;
  }

  .toast-info {
    background-color: #3b82f6;
  }

  .toast-icon {
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-content {
    flex: 1;
    font-size: 14px;
  }

  .toast-close {
    background: none;
    border: none;
    color: white;
    opacity: 0.7;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
  }

  .toast-close:hover {
    opacity: 1;
  }
</style>