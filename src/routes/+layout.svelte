<script lang="ts">
  import '../app.css';
  import Toasts from '$lib/components/Toast.svelte';
</script>

<div class="app">
  <header >
    <div class="header-content">
      <h1 class="site-title">Shopping App</h1>
    </div>
  </header>
  
  <main>
    <Toasts position="bottom-right"/>
    <slot />
  </main>
  
  <footer>
    <p>© {new Date().getFullYear()} Shopping App. All rights reserved.</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  header {
    background-color: #333;
    color: white;
    padding: 1rem 0;
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .site-title {
    margin: 0;
    font-size: 1.5rem;
  }
  
  main {
    flex: 1;
    padding: 2rem 0;
  }
  
  footer {
    background-color: #f1f1f1;
    padding: 1rem 0;
    text-align: center;
    margin-top: auto;
  }
</style>