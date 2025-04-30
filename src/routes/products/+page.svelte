<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Product } from '$lib/types';
  import cartIcon from '$lib/assets/Cart-Icon.svg';
  
  let products: Product[] = [];
  let filteredProducts: Product[] = [];
  let cart: Product[] = [];
  let loading = true;
  let productInCart: Record<number, boolean> = {};
  let searchTerm = '';

  let animate = false;

$: if (cart.length > 0) {
  animate = true;
  setTimeout(() => {
    animate = false;
  }, 400); 
}

$: if (products.length > 0) {
  filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
  
  onMount(async () => {
    try {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        cart = JSON.parse(savedCart);
        cart.forEach(item => {
          productInCart[item.id] = true;
        });
      }
      
      setTimeout(async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        filteredProducts = products;
        loading = false;
      }, 1500); 
    } catch (error) {
      console.error('Error fetching products:', error);
      loading = false;
    }
  });
  
  function toggleCart(product: Product) {
    if (productInCart[product.id]) {
      cart = cart.filter(item => item.id !== product.id);
      productInCart[product.id] = false;
      productInCart = {...productInCart}; 
    } else {
      cart = [...cart, product];
      productInCart[product.id] = true;
      productInCart = {...productInCart}; 
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }
  
  function goBack() {
    goto('/');
  }

  function handleSearch(event: Event) {
    searchTerm = (event.target as HTMLInputElement).value;
  }

  function clearSearch() {
    searchTerm = '';
  }

  const handleRedirect = () => {
    goto("/checkout");
  }
</script>

<main class="container">
  <div class="header">
    <h1>Products</h1>
    <button class="back-button" onclick={goBack}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      Go Back
    </button>
  </div>
  
  <div class="search-container">
    <div class="search-input-wrapper">
      <input 
        type="text" 
        placeholder="Search products by name..." 
        class="search-input" 
        value={searchTerm} 
        oninput={handleSearch}
      />
      {#if searchTerm}
        <button class="clear-search" onclick={clearSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      {/if}
    </div>
  </div>
  
  {#if loading}
    <div class="loader-container">
      <div class="loader"></div>
      <p>Loading products...</p>
    </div>
  {:else if filteredProducts.length === 0}
    <div class="no-results">
      <p>No products found matching "{searchTerm}"</p>
      <button class="reset-search" onclick={clearSearch}>Clear Search</button>
    </div>
  {:else}
    <div class="products-grid">
      {#each filteredProducts as product (product.id)}
        <div class="product-card">
          <img src={product.image || "/placeholder.svg"} alt={product.title} class="product-image" />
          <div class="product-info">
            <h3>{product.title}</h3>
            <p class="product-description">{product.description}</p>
            <p class="product-price">${product.price.toFixed(2)}</p>
            <button 
              class="add-to-cart-button {productInCart[product.id] ? 'added' : ''}" 
              onclick={() => toggleCart(product)}
            >
              {productInCart[product.id] ? 'Remove from Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if cart.length > 0}
    <button class="cart-preview" onclick={handleRedirect}>
      <img
        alt="The project logo"
        src={cartIcon}
        height="50"
        class:bounce={animate}
      />
      <span class="cart-badge">{cart.length}</span>
    </button>
  {/if}
</main>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .search-container {
    margin-bottom: 2rem;
  }
  
  .search-input-wrapper {
    position: relative;
    max-width: 500px;
    /* margin: 0 auto; */
  }
  
  .search-input {
    width: 100%;
    padding: 12px 40px 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
  
  .clear-search {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    padding: 5px;
  }
  
  .clear-search:hover {
    color: #e74c3c;
  }
  
  .no-results {
    text-align: center;
    padding: 3rem 0;
  }
  
  .no-results p {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 1rem;
  }
  
  .reset-search {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
  }
  
  .reset-search:hover {
    background-color: #2980b9;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
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
  }

  .back-button:hover {
    background-color: #3498db;
    color: white;
  }

  
  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
  }
  
  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
  }

  .product-description {
    color: #7f8c8d;
    font-size: 0.9rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .product-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    width: 100%;
    height: 200px;
    object-fit: contain;
    padding: 1rem;
    background-color: #f9f9f9;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .product-info h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 2.4rem;
  }
  
  .product-price {
    font-weight: bold;
    color: #4caf50;
    margin-bottom: 1rem;
  }
  
  .add-to-cart-button {
    width: 100%;
    padding: 0.5rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .add-to-cart-button:hover {
    background-color: #45a049;
  }
  
  .add-to-cart-button.added {
    background-color: #f39c12;
  }
  
  .add-to-cart-button.added:hover {
    background-color: #e67e22;
  }

  .cart-preview {
    position: fixed;
    cursor: pointer;
    bottom: 20px;
    right: 20px;
    color: white;
    border-radius: 8px;
    border: 2px solid white;
    background: transparent;
    padding: 0;
    z-index: 10;
    display: inline-block;
  }

  .cart-preview:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .cart-preview img {
    display: block;
  }

  .cart-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background-color: red;
    color: white;
    font-size: 12px;
    font-weight: bold;
    border-radius: 50%;
    padding: 2px 6px;
    min-width: 20px;
    text-align: center;
    line-height: 1;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  .bounce {
    animation: bounce 0.4s ease;
  }
</style>