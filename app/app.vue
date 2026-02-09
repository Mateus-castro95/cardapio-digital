<template>
  <!-- Container principal da aplicação -->
  <div class="app-container" :class="{ 'sidebar-collapsed': isCollapsed, 'is-public': isPublicRoute }">
    <!-- Componente de acessibilidade para anunciar mudanças de rota -->
    <NuxtRouteAnnouncer />
    
    <!-- Header Móvel (visível apenas em telas pequenas e rotas não públicas) -->
    <header 
      v-if="!isPublicRoute"
      class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-cafe-dark text-branco flex items-center justify-between px-6 z-[1100] shadow-md"
    >
      <h1 class="text-lg font-black uppercase tracking-wider text-bege-claro">Pastel Hora</h1>
      <button 
        @click="isMobileOpen = !isMobileOpen"
        class="p-2 text-bege-claro hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg v-if="!isMobileOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </header>

    <!-- Barra lateral de navegação (oculta em rotas públicas) -->
    <SideBar 
      v-if="!isPublicRoute"
      :is-collapsed="isCollapsed" 
      :is-mobile-open="isMobileOpen"
      @toggle="isCollapsed = !isCollapsed" 
      @close-mobile="isMobileOpen = false"
    />
    
    <!-- Área de conteúdo principal onde as páginas são renderizadas -->
    <main class="main-content" :class="{ 'ml-0 lg:ml-0 w-full lg:w-full pt-0': isPublicRoute }">
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
import SideBar from '~/components/SideBar.vue';
import { useAuthStore } from '~/stores/auth';
import { onMounted } from 'vue';

const route = useRoute();
const user = useSupabaseUser();
const authStore = useAuthStore();

// Carregar perfil inicial se já houver usuário
onMounted(() => {
  if (user.value) authStore.fetchPerfil();
});

// Vigiar mudanças de usuário (login/logout)
watch(user, (newUser) => {
  if (newUser) {
    authStore.fetchPerfil();
  } else {
    authStore.perfil = null;
  }
}, { immediate: true });

// A rota é considerada pública (sem sidebar) se:
// 1. For a página de Login
// 2. For o Cardápio e NÃO houver um usuário logado (visão do cliente)
const isPublicRoute = computed(() => {
  if (route.path.startsWith('/login')) return true;
  if (route.path.startsWith('/cardapio') && !user.value) return true;
  return false;
});

// Estado para controlar se o sidebar está recolhido (desktop)
const isCollapsed = useState('sidebar-collapsed', () => false);

// Estado para controlar o menu em dispositivos móveis
const isMobileOpen = ref(false);

// Fechar o menu móvel automaticamente ao mudar de rota
watch(() => route.fullPath, () => {
  isMobileOpen.value = false;
});
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  /* No mobile, ocupa tudo e tem padding superior p/ o header fixo */
  width: 100%;
  padding-top: 4rem; /* h-16 */
  min-height: 100vh;
  background-color: #FDFBFA; /* bege-cream */
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

@media (min-width: 1024px) {
  .main-content {
    padding-top: 0;
    margin-left: 250px;
    width: calc(100% - 250px);
  }
}

/* Ajuste quando o sidebar está recolhido (Desktop apenas) */
@media (min-width: 1024px) {
  .app-container.sidebar-collapsed:not(.is-public) .main-content {
    margin-left: 5rem;
    width: calc(100% - 5rem);
  }
}

/* Reset total para rotas públicas */
.app-container.is-public .main-content {
  margin-left: 0 !important;
  width: 100% !important;
  padding-top: 0 !important;
}

/* Esconder barra de rolagem em certas situações se necessário */
.overflow-hidden {
  overflow: hidden;
}
</style>
