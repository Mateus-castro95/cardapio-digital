<template>
  <!-- Barra lateral de navegação fixa - visível em todas as páginas -->
  <aside id="sidebar" class="sidebar">
    <!-- Cabeçalho com o nome do estabelecimento -->
    <header class="sidebar-header">
      <h1>Pastel Hora</h1>
    </header>
    
    <!-- Menu de navegação principal do sistema -->
    <nav class="sidebar-nav">

      <NuxtLink to="/" class="nav-button">
        Dashboard
      </NuxtLink>
      
      <NuxtLink to="/pedidos" class="nav-button">
        Pedidos
      </NuxtLink>
      
      <NuxtLink to="/fechar-mesa" class="nav-button">
        Fechar Mesa
      </NuxtLink>
      
      <NuxtLink to="/produtos" class="nav-button">
        Produtos
      </NuxtLink>
      
      <NuxtLink to="/cardapio" class="nav-button">
        Cardápio
      </NuxtLink>
      
      <NuxtLink to="/mesas" class="nav-button">
        Mesas
      </NuxtLink>
      
      <NuxtLink to="/configuracoes" class="nav-button">
        Configurações
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.sidebar-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #f59e0b;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  gap: 0.5rem;
}

.nav-button {
  display: block;
  width: 100%;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.nav-button::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: #f59e0b;
  transition: height 0.3s ease;
}

.nav-button:hover {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.nav-button:hover::before {
  height: 70%;
}

.nav-button:active {
  transform: scale(0.98);
}

.nav-button.router-link-active {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.nav-button.router-link-active::before {
  height: 70%;
}
</style>
