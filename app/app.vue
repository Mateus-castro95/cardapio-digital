<template>
  <!-- Container principal da aplicação -->
  <div class="app-container">
    <!-- Componente de acessibilidade para anunciar mudanças de rota -->
    <NuxtRouteAnnouncer />
    
    <!-- Barra lateral de navegação (fixa em todas as páginas) -->
    <SideBar />
    
    <!-- Área de conteúdo principal onde as páginas são renderizadas -->
    <main class="main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * App.vue - Shell principal da aplicação
**/

// Importa o componente de navegação lateral
import SideBar from '~/components/SideBar.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
  min-height: 100vh;
  background: #f8fafc;
}
</style>
