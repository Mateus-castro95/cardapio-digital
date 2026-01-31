<template>
  <!-- Barra lateral de navegação fixa - visível em todas as páginas -->
  <aside id="sidebar" class="sidebar">
    <!-- Cabeçalho com o nome do estabelecimento -->
    <header class="sidebar-header">
      <h1>Pastel Hora</h1>
    </header>
    
    <!-- Menu de navegação principal do sistema -->
    <nav class="sidebar-nav">
      <!-- Botão: Página inicial com visão geral do sistema -->
      <button class="nav-button">
        Dashboard
      </button>
      
      <!-- Botão: Gerenciamento de pedidos ativos -->
      <button class="nav-button">
        Pedidos
      </button>
      
      <!-- Botão: Finalização e fechamento de contas de mesas -->
      <button class="nav-button">
        Fechar Mesa
      </button>
      
      <!-- Botão: Cadastro e gerenciamento de produtos -->
      <button class="nav-button">
        Produtos
      </button>
      
      <!-- Botão: Visualização e edição do cardápio digital -->
      <button class="nav-button">
        Cardápio
      </button>
      
      <!-- Botão: Gerenciamento de mesas do estabelecimento -->
      <button class="nav-button">
        Mesas
      </button>
      
      <!-- Botão: Configurações gerais do sistema -->
      <button class="nav-button">
        Configurações
      </button>
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
  width: 100%;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
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
</style>
