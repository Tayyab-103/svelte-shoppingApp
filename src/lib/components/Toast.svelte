<!-- Toast.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';
  
  export let message = 'Removed successfully'; 
  export let type = 'success'; 
  export let duration = 2000; 
  export let show = false;
  
  let timer: number;
  
  $: if (show) {
    startTimer();
  }
  
  function startTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      show = false;
    }, duration);
  }
  
  onDestroy(() => {
    clearTimeout(timer);
  });
</script>

{#if show}
  <div class="toast-container {type}" transition:slide={{ duration: 300 }}>
    <div class="toast-icon">
      {#if type === 'success'}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      {:else if type === 'error'}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
      {:else if type === 'warning'}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      {/if}
    </div>
    <div class="toast-message">{message}</div>
    <button class="toast-close" on:click={() => show = false} aria-label="Close toast">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    top: 20px; 
    right: 20px;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 90%;
    z-index: 1001;
    animation: slide-in 0.3s ease-out;
  }
  
  @keyframes slide-in {
    from {
      transform: translateY(-100%); 
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .toast-container.success {
    background-color: #d4edda;
    color: #155724;
    border-left: 5px solid #28a745;
  }
  
  .toast-container.error {
    background-color: #f8d7da;
    color: #721c24;
    border-left: 5px solid #dc3545;
  }
  
  .toast-container.warning {
    background-color: #fff3cd;
    color: #856404;
    border-left: 5px solid #ffc107;
  }
  
  .toast-container.info {
    background-color: #d1ecf1;
    color: #0c5460;
    border-left: 5px solid #17a2b8;
  }
  
  .toast-icon {
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .toast-message {
    flex-grow: 1;
    font-size: 0.95rem;
  }
  
  .toast-close {
    background: none;
    border: none;
    color: inherit;
    opacity: 0.5;
    cursor: pointer;
    padding: 4px;
    margin-left: 8px;
    border-radius: 4px;
    transition: opacity 0.2s ease;
  }
  
  .toast-close:hover {
    opacity: 1;
  }
  
  /* Animation */
  [transition] {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
</style>