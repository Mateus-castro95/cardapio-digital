<template>
  <!-- Container principal da aplicação -->
  <div class="app-container" :class="{ 'sidebar-collapsed': isCollapsed, 'is-public': isPublicRoute }">
    <!-- Componente de acessibilidade para anunciar mudanças de rota -->
    <NuxtRouteAnnouncer />
    <VitePwaManifest />
    
    <!-- Header Móvel (visível apenas em telas pequenas e rotas não públicas) -->
    <header 
      v-if="!isPublicRoute"
      class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111114] border-b border-[rgba(212,175,55,0.15)] flex items-center justify-between px-6 z-[1100] shadow-md"
    >
      <div class="flex items-center gap-3 min-w-0">
        <img 
          src="/logo-adega.webp" 
          alt="Adega Canoinhas" 
          class="h-9 w-auto object-contain shrink-0 logo-adega-gold" 
          style="filter: brightness(0) saturate(100%) invert(84%) sepia(28%) saturate(1088%) hue-rotate(357deg) brightness(97%) contrast(92%) !important;"
        />
        <h1 class="text-sm font-black uppercase tracking-wider text-[#E8C86A] truncate">Adega Canoinhas</h1>
      </div>
      <button 
        @click="isMobileOpen = !isMobileOpen"
        class="p-2 text-[#B89758] hover:text-[#E5C158] hover:bg-white/5 rounded-lg transition-colors"
      >
        <Bars3Icon v-if="!isMobileOpen" class="w-6 h-6" />
        <XMarkIcon v-else class="w-6 h-6" />
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
    <main class="main-content flex flex-col" :class="{ 'ml-0 lg:ml-0 w-full lg:w-full pt-0': isPublicRoute }">
      <div class="flex-1 w-full">
        <NuxtPage />
      </div>

      <!-- Footer Global -->
      <footer class="w-full py-6 mt-auto bg-[#0A0A0C] border-t border-white/5 flex flex-col items-center justify-center gap-1.5 z-10 print:hidden">
        <p class="text-sm text-[#B89758]/70 font-medium">
          © {{ new Date().getFullYear() }} - Todos os direitos reservados.
        </p>
        <a 
          href="https://mateuscastro-dev.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-sm font-black text-[#E8C86A] hover:text-[#F3D781] transition-colors drop-shadow-[0_0_8px_rgba(232,200,106,0.4)]"
        >
          Desenvolvido por Mateus Castro
        </a>
      </footer>
    </main>

    <!-- Notificações globais -->
    <BaseToast />
    <BaseLoading />
    <BaseImageLightbox />
  </div>
</template>

<script setup lang="ts">
/**
 * App.vue - Shell principal da aplicação
 **/
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
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
  if (route.path.startsWith('/imprimir-mesas')) return true;
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
  background-color: #0A0A0C;
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
