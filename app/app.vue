<template>
  <!-- Container principal da aplicação -->
  <div class="app-container" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- Componente de acessibilidade para anunciar mudanças de rota -->
    <NuxtRouteAnnouncer />
    
    <!-- Barra lateral de navegação (fixa em todas as páginas) -->
    <SideBar :is-collapsed="isCollapsed" @toggle="isCollapsed = !isCollapsed" />
    
    <!-- Área de conteúdo principal onde as páginas são renderizadas -->
    <main class="main-content">
      <NuxtPage />
    </main>

    <!-- Notificações globais -->
    <BaseToast />
    <BaseLoading />
  </div>
</template>

<script setup lang="ts">
/**
 * App.vue - Shell principal da aplicação
 **/
import { ref } from 'vue';
import SideBar from '~/components/SideBar.vue';

// Estado para controlar se o sidebar está recolhido
const isCollapsed = useState('sidebar-collapsed', () => false);
</script>

<style>
.app-container {
  @apply flex min-h-screen;
}

.main-content {
  @apply ml-[250px] w-[calc(100%-250px)] min-h-screen bg-bege-cream transition-all duration-300 ease-out;
}

/* Ajuste quando o sidebar está recolhido */
.app-container.sidebar-collapsed .main-content {
  @apply ml-20 w-[calc(100%-5rem)];
}
</style>
