<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Product } from '$lib/types';
  
  let cart: Product[] = [];
  
  onMount(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  });
  
  function goToProducts() {
    goto('/products');
  }
  
  function goToCheckout() {
    goto('/checkout');
  }
  
  function getCartTotal() {
    return cart.reduce((total, item) => total + item.price, 0);
  }
</script>

<main class="container">
  <div class="home">
    <h2>Welcome to our Shop</h2>
    <p class="subtitle">
      Browse our products or check out your cart
    </p>
    <div class="button-group">
      <button class="primary-button" on:click={goToProducts}>
        Search Products
      </button>
      <button 
        class="secondary-button" 
        on:click={goToCheckout} 
        disabled={cart.length === 0}
      >
        Checkout ({cart.length})
      </button>
    </div>
    
    {#if cart.length > 0}
      <div class="cart-summary">
        <h3>Your Cart Summary</h3>
        <p>{cart.length} items - Total: ${getCartTotal().toFixed(2)}</p>
      </div>
    {/if}
  </div>
</main>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    text-align: center;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  .subtitle {
    color: #7f8c8d;
    max-width: 500px;
    margin-bottom: 30px;
  }

  .button-group {
    display: flex;
    gap: 15px;
    margin-top: 20px;
  }

  button {
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .primary-button {
    background-color: #3498db;
    color: white;
    padding: 12px 24px;
    font-size: 16px;
  }

  .primary-button:hover {
    background-color: #2980b9;
  }

  .secondary-button {
    background-color: #2ecc71;
    color: white;
    padding: 12px 24px;
    font-size: 16px;
  }

  .secondary-button:hover:not(:disabled) {
    background-color: #27ae60;
  }

  .cart-summary {
    margin-top: 30px;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    min-width: 300px;
  }

  .cart-summary h3 {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  .cart-summary p {
    color: #7f8c8d;
  }

  @media (max-width: 600px) {
    .button-group {
      flex-direction: column;
    }
  }
</style>