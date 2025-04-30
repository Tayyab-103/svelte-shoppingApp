<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Product } from '$lib/types';
  import Modal from '../../lib/components/Modal.svelte';
  import { toasts } from '$lib/toastStore';
  
  type CartItem = Product & { quantity: number };
  let cartItems: CartItem[] = [];
  let checkoutComplete = false;
  
  let showModal = false;
  let productToRemove: number | null = null;

  onMount(() => {
    const storedCart = sessionStorage.getItem('cart');
    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
        cartItems = cartItems.map(item => ({
          ...item,
          quantity: item.quantity || 1
        }));
      } catch (e) {
        console.error("Failed to parse cart data:", e);
        cartItems = [];
      }
    }
  });

  function updateQuantity(productId: number, newQty: number) {
    console.log(`Updating product ${productId} to quantity ${newQty}`);
    cartItems = cartItems.map(item => {
      if (item.id === productId) {
        const updatedItem = { ...item, quantity: Math.max(1, newQty) };
        console.log("Updated item:", updatedItem);
        return updatedItem;
      }
      return item;
    });
    
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
  }

  function openRemoveModal(productId: number) {
    productToRemove = productId;
    showModal = true;
  }
  
  function handleModalClose() {
    showModal = false;
    productToRemove = null;
  }
  
  function handleConfirmRemove() {
    if (productToRemove !== null) {
      removeFromCart(productToRemove);
    }
  }

  function removeFromCart(productId: number) {
    const itemName = cartItems.find(item => item.id === productId)?.title || 'Item';
    
    cartItems = cartItems.filter(item => item.id !== productId);
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
    toasts.error(`successfully removed from cart`);
  }

  function calculateTotal(): number {
    return cartItems.reduce((total, item) => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
      return total + (item.price * quantity);
    }, 0);
  }

  function completeCheckout() {
    checkoutComplete = true;
    cartItems = [];
    sessionStorage.removeItem('cart');
    toasts.success(`Order successfully placed!`);
  }

  function goBack() {
    goto('/');
  }
</script>

<main class="container checkout">
  <div class="header">
    <h1>Your Shopping Cart</h1>
    <button class="back-button" onclick={goBack}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      Go Back
    </button>
  </div>

  {#if checkoutComplete}
    <div class="success-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <h2>Thank you for your order!</h2>
      <p>Your order has been successfully placed and is being processed.</p>
      <div class="button-container">
        <button class="primary-button" onclick={goBack}>Return to Home</button>
      </div>
    </div>
  {:else if cartItems.length === 0}
    <div class="empty-cart-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="empty-cart-icon"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any products to your cart yet.</p>
      <button class="browse-button primary-button" onclick={() => goto('/products')}>
        Browse Products
      </button>
    </div>
  {:else}
    <div class="cart-table-container">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each cartItems as item (item.id)}
            <tr>
              <td>
                <div class="product-cell">
                  <div class="product-image">
                    <img src={item.image || "/placeholder.svg"} alt={item.title} />
                  </div>
                  <div class="product-title">
                    {item.title}
                  </div>
                </div>
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <div class="quantity-control">
                  <button 
                    class="quantity-btn" 
                    onclick={() => {
                      const newQty = Math.max(1, item.quantity - 1);
                      updateQuantity(item.id, newQty);
                    }}
                    aria-label="Decrease quantity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                  <span class="quantity-display">{item.quantity || 1}</span>
                  <button 
                    class="quantity-btn" 
                    onclick={() => {
                      const newQty = (item.quantity || 1) + 1;
                      updateQuantity(item.id, newQty);
                    }}
                    aria-label="Increase quantity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              </td>
              <td class="item-total">${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button class="remove-button" onclick={() => openRemoveModal(item.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trash-icon"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  Remove
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="total-label">Total:</td>
            <td class="total-amount">${calculateTotal().toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="checkout-actions">
      <button class="continue-shopping" onclick={() => goto('/products')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Continue Shopping
      </button>
      <button class="complete-order-button checkout-button" onclick={completeCheckout}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        Complete Order
      </button>
    </div>
  {/if}
  
  <Modal 
    show={showModal} 
    title="Remove Item"
    message="Are you sure you want to remove this item from your cart?"
    confirmText="Remove"
    cancelText="Cancel"
    confirmButtonClass="danger"
    on:close={handleModalClose}
    on:confirm={handleConfirmRemove}
  />

</main>

<style>
  .checkout {
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  h1 {
    font-size: 2rem;
    color: #2c3e50;
    margin: 0;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: #2c3e50;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    color: #3498db;
    font-weight: 500;
    padding: 8px 16px;
    border: 1px solid #3498db;
    border-radius: 4px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .back-button:hover {
    background-color: #3498db;
    color: white;
  }

  .success-message {
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .success-icon {
    color: #28a745;
    margin-bottom: 20px;
  }

  .empty-cart-message {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    color: #495057;
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .empty-cart-icon {
    color: #6c757d;
    margin-bottom: 20px;
  }

  .browse-button {
    background-color: #3498db;
    color: white;
    margin-top: 15px;
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .browse-button:hover {
    background-color: #2980b9;
  }

  .cart-table-container {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .cart-table {
    width: 100%;
    border-collapse: collapse;
  }

  .cart-table th,
  .cart-table td {
    padding: 18px 15px;
    text-align: left;
    border-bottom: 1px solid #ecf0f1;
  }

  .cart-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
  }

  .product-cell {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .product-image {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #ecf0f1;
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-title {
    font-weight: 500;
    color: #2c3e50;
  }

  .quantity-control {
    display: flex;
    align-items: center;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    width: fit-content;
  }

  .quantity-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    color: #2c3e50;
  }

  .quantity-btn:hover {
    background-color: #e9ecef;
  }

  .quantity-display {
    padding: 0 15px;
    min-width: 40px;
    text-align: center;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
  }

  .item-total {
    font-weight: 500;
    color: #2c3e50;
  }

  .remove-button {
    color: #e74c3c;
    background: none;
    padding: 8px 12px;
    border: 1px solid #e74c3c;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .remove-button:hover {
    background-color: #e74c3c;
    color: white;
  }

  .trash-icon {
    stroke: currentColor;
  }

  .total-label {
    text-align: right;
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
  }

  .total-amount {
    font-weight: 700;
    font-size: 1.2rem;
    color: #2c3e50;
  }

  .checkout-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }

  .continue-shopping {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    color: #3498db;
    font-weight: 500;
    padding: 12px 20px;
    border: 1px solid #3498db;
    border-radius: 4px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .continue-shopping:hover {
    background-color: #3498db;
    color: white;
  }

  .complete-order-button {
    background-color: #2ecc71;
    color: white;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 4px;
    display: flex;
    align-items: center;
    border: 2px solid #2ecc71;
    gap: 8px;
    transition: background-color 0.2s ease;
    cursor: pointer;
  }

  .complete-order-button:hover {
    background-color: #27ae60;
  }

  .button-container{
    margin-top: 20px;
  }

  .primary-button {
    background-color: #3498db;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.2s ease;
    border: 2px solid #3498db;
  }

  .primary-button:hover {
    background-color: #2980b9;
  }

  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    .cart-table {
      display: block;
      overflow-x: auto;
    }

    .cart-table th,
    .cart-table td {
      padding: 12px 10px;
    }

    .product-title {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .checkout-actions {
      flex-direction: column;
      gap: 15px;
    }

    .continue-shopping, 
    .complete-order-button {
      width: 100%;
      justify-content: center;
    }
  }
</style>