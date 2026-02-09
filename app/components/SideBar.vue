<template>
  <div>
    <!-- Backdrop para Mobile (escurece o fundo ao abrir o menu) -->
    <div 
      v-if="isMobileOpen" 
      class="fixed inset-0 bg-preto/60 backdrop-blur-sm z-[950] lg:hidden"
      @click="$emit('close-mobile')"
    ></div>

    <!-- Barra lateral de navegação fixa -->
    <aside 
      id="sidebar" 
      class="fixed top-0 left-0 h-screen bg-gradient-to-b from-cafe-dark to-preto text-branco flex flex-col shadow-premium z-[1000] transition-all duration-300 ease-out overflow-x-hidden" 
      :class="[
        isCollapsed ? 'lg:w-20' : 'lg:w-[250px]',
        isMobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Cabeçalho com o nome do estabelecimento e botão de toggle -->
      <header 
        class="border-b border-white/10 bg-black/20 flex items-center h-20 transition-all px-6"
        :class="isCollapsed ? 'lg:justify-center lg:px-4' : 'justify-between'"
      >
        <h1 v-show="!isCollapsed || isMobileOpen" class="text-heading-3 font-bold m-0 text-bege-claro uppercase tracking-wide whitespace-nowrap overflow-hidden">
          Pastel Hora
        </h1>
        
        <!-- Botão de recolher (visível apenas desktop) -->
        <button 
          class="hidden lg:flex bg-white/5 border border-white/10 text-bege-claro cursor-pointer p-1.5 rounded-lg items-center justify-center transition-all duration-200 hover:bg-bege-torrado/20 hover:scale-105" 
          @click="$emit('toggle')" 
          :title="isCollapsed ? 'Expandir' : 'Recolher'"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="transition-transform duration-300"
            :class="{ 'rotate-180': isCollapsed }"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <!-- Botão de fechar (visível apenas mobile) -->
        <button 
          class="lg:hidden text-bege-claro p-2"
          @click="$emit('close-mobile')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </header>
      
      <!-- Menu de navegação principal do sistema -->
      <nav class="flex flex-col py-4 gap-1 overflow-y-auto flex-1 custom-scrollbar">
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Dashboard">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Dashboard</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/pedidos" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Pedidos">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Pedidos</span>
        </NuxtLink>

        <NuxtLink to="/cozinha" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Cozinha">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Cozinha</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/fechar-mesa" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Fechar Mesa">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2-1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5V6.5"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Fechar Mesa</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/produtos" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Produtos">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Produtos</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/cardapio" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Cardápio">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 15h2"/><path d="M12 9v3"/><path d="M21 3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3Z"/><path d="M9 18h6"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Cardápio</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/mesas" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Mesas">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Mesas</span>
        </NuxtLink>

        <NuxtLink v-if="['super_admin', 'dono', 'caixa'].includes(authStore.cargo || '')" to="/financeiro" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Financeiro">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Financeiro</span>
        </NuxtLink>

        <NuxtLink v-if="authStore.isSuperAdmin" to="/configuracoes" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Configurações">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Configurações</span>
        </NuxtLink>
      </nav>
      
      <!-- Rodapé do Sidebar com Perfil e Logout -->
      <footer class="p-4 border-t border-white/10 bg-black/10 flex flex-col gap-4">
        <!-- Botão Sair (Compacto) -->
        <button 
          @click="handleLogout"
          class="group flex items-center w-full py-2.5 px-4 bg-red-500/5 border border-red-500/10 text-red-400/80 text-[10px] font-black uppercase tracking-[0.15em] text-left no-underline cursor-pointer transition-all duration-300 relative gap-3 whitespace-nowrap hover:bg-red-500/15 hover:text-red-400 active:scale-[0.98] rounded-xl" 
          :class="isCollapsed ? 'justify-center lg:px-0' : ''"
          title="Encerrar Sessão"
        >
          <span class="flex items-center justify-center min-w-5 relative z-10 transition-transform duration-300 group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Sair do sistema</span>
        </button>

        <!-- Card de Perfil do Usuário -->
        <div 
          v-if="authStore.perfil"
          class="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 transition-all duration-300"
          :class="isCollapsed ? 'justify-center px-2' : 'px-4'"
          :title="`${authStore.perfil.nome} (${authStore.perfil.cargo})`"
        >
          <!-- Avatar Estilizado -->
          <div class="shrink-0 w-10 h-10 bg-bege-cream/10 rounded-xl flex items-center justify-center border border-bege-torrado/20 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-bege-claro" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          
          <!-- Infos Nome/Email (Ocultas se recolhido) -->
          <div v-show="!isCollapsed || isMobileOpen" class="flex-1 min-w-0 overflow-hidden">
            <p class="text-[11px] font-black text-bege-claro uppercase tracking-wider truncate mb-0.5">
              {{ authStore.perfil.nome }}
            </p>
            <p class="text-[14px] font-bold text-bege-soft truncate opacity-80">
              {{ authStore.perfil.email }}
            </p>
          </div>
        </div>
      </footer>
    </aside>
  </div>
</template>

<script setup lang="ts">
/**
 * SideBar.vue - Componente de navegação lateral
 **/
import { useSupabaseClient } from '#imports';
import { useRouter } from '#app';
import { useToast } from '~/composables/useToast';
import { useAuthStore } from '~/stores/auth';

defineProps<{
  isCollapsed: boolean,
  isMobileOpen: boolean
}>();

defineEmits<{
  (e: 'toggle'): void,
  (e: 'close-mobile'): void
}>();

const authStore = useAuthStore();
const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success('Até logo!', 'Sessão encerrada.');
    router.push('/login');
  } catch (error) {
    toast.error('Erro ao sair');
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
