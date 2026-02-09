<template>
  <!-- Barra lateral de navegação fixa - visível em todas as páginas -->
  <aside 
    id="sidebar" 
    class="fixed top-0 left-0 h-screen bg-gradient-to-b from-cafe-dark to-preto text-branco flex flex-col shadow-premium z-[1000] transition-all duration-300 ease-out overflow-x-hidden" 
    :class="isCollapsed ? 'w-20' : 'w-[250px]'"
  >
    <!-- Cabeçalho com o nome do estabelecimento e botão de toggle -->
    <header 
      class="border-b border-white/10 bg-black/20 flex items-center h-20 transition-all"
      :class="isCollapsed ? 'justify-center p-4' : 'justify-between p-6'"
    >
      <h1 v-show="!isCollapsed" class="text-heading-3 font-bold m-0 text-bege-claro uppercase tracking-wide whitespace-nowrap overflow-hidden">
        Pastel Hora
      </h1>
      <button 
        class="bg-white/5 border border-white/10 text-bege-claro cursor-pointer p-1.5 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-bege-torrado/20 hover:scale-105" 
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
    </header>
    
    <!-- Menu de navegação principal do sistema -->
    <nav class="flex flex-col py-4 gap-1">
      <NuxtLink to="/" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'justify-center px-4' : 'px-6'" title="Dashboard">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
        <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        </span>
        <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed">Dashboard</span>
      </NuxtLink>
      
      <NuxtLink to="/pedidos" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'justify-center px-4' : 'px-6'" title="Pedidos">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
        <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
        </span>
        <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed">Pedidos</span>
      </NuxtLink>

      <NuxtLink to="/cozinha" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'justify-center px-4' : 'px-6'" title="Cozinha">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
        <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
        </span>
        <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed">Cozinha</span>
      </NuxtLink>
      
      <NuxtLink to="/fechar-mesa" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'justify-center px-4' : 'px-6'" title="Fechar Mesa">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
        <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5V6.5"/></svg>
        </span>
        <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed">Fechar Mesa</span>
      </NuxtLink>
      
      <NuxtLink to="/produtos" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'justify-center px-4' : 'px-6'" title="Produtos">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
        <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
        </span>
        <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed">Produtos</span>
      </NuxtLink>
      
      <NuxtLink to="/cardapio" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'justify-center px-4' : 'px-6'" title="Cardápio">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
        <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 15h2"/><path d="M12 9v3"/><path d="M21 3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3Z"/><path d="M9 18h6"/></svg>
        </span>
        <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed">Cardápio</span>
      </NuxtLink>
      
      <NuxtLink to="/mesas" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'justify-center px-4' : 'px-6'" title="Mesas">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
        <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
        </span>
        <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed">Mesas</span>
      </NuxtLink>

      <NuxtLink to="/financeiro" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'justify-center px-4' : 'px-6'" title="Financeiro">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
        <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </span>
        <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed">Financeiro</span>
      </NuxtLink>
      
      <NuxtLink to="/configuracoes" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'justify-center px-4' : 'px-6'" title="Configurações">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
        <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </span>
        <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed">Configurações</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
/**
 * SideBar.vue - Componente de navegação lateral
 **/
defineProps<{
  isCollapsed: boolean
}>();

defineEmits<{
  (e: 'toggle'): void
}>();
</script>
