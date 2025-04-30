<!-- Modal.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let show = false;
  export let title = '';
  export let message = '';
  export let confirmText = 'Confirm';
  export let cancelText = 'Cancel';
  export let confirmButtonClass = 'danger';
  
  const dispatch = createEventDispatcher();
  
  function handleClose() {
    dispatch('close');
  }
  
  function handleConfirm() {
    dispatch('confirm');
    handleClose();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && show) {
      handleClose();
    }
  }
  
  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if show}
  <div class="modal-overlay" onclick={handleClose}>
    <!-- <div class="modal-container" on:click|stopPropagation> -->
    <div class="modal-container" >
      <div class="modal-header">
        <h3>{title}</h3>
        <button class="close-button" onclick={handleClose} aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body">
        <p>{message}</p>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" onclick={handleClose}>{cancelText}</button>
        <button class={`confirm-button ${confirmButtonClass}`} onclick={handleConfirm}>{confirmText}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-container {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: modal-appear 0.3s ease-out;
  }
  
  @keyframes modal-appear {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modal-header {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ecf0f1;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #2c3e50;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }
  
  .close-button:hover {
    background-color: #f1f2f6;
    color: #2c3e50;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-body p {
    margin: 0;
    color: #2c3e50;
    line-height: 1.5;
  }
  
  .modal-footer {
    padding: 16px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid #ecf0f1;
  }
  
  .cancel-button {
    background: none;
    color: #7f8c8d;
    padding: 8px 16px;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .cancel-button:hover {
    background-color: #f1f2f6;
    color: #2c3e50;
  }
  
  .confirm-button {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }
  
  .confirm-button.danger {
    background-color: #e74c3c;
    color: white;
  }
  
  .confirm-button.danger:hover {
    background-color: #c0392b;
  }
  
  .confirm-button.primary {
    background-color: #3498db;
    color: white;
  }
  
  .confirm-button.primary:hover {
    background-color: #2980b9;
  }
</style>