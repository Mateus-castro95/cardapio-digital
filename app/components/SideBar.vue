<template>
  <div>
    <!-- Backdrop para Mobile (escurece o fundo ao abrir o menu) -->
    <div 
      v-if="isMobileOpen" 
      class="fixed inset-0 bg-preto/70 backdrop-blur-sm z-[1150] lg:hidden"
      @click="$emit('close-mobile')"
    ></div>

    <!-- Barra lateral de navegação fixa (Direita no Mobile, Esquerda no Desktop) -->
    <aside 
      id="sidebar" 
      class="fixed top-0 right-0 lg:right-auto lg:left-0 h-screen text-branco flex flex-col shadow-premium z-[1200] transition-all duration-300 ease-out overflow-x-hidden" 
      :class="[
        isCollapsed ? 'lg:w-20' : 'lg:w-[250px]',
        isMobileOpen ? 'translate-x-0 w-[280px]' : 'translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Cabeçalho com o nome do estabelecimento e botão de toggle -->
      <header 
        class="border-b border-[#2A2415] bg-black/30 flex items-center h-16 lg:h-20 transition-all px-4"
        :class="isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between'"
      >
        <div class="flex items-center gap-3 min-w-0">
          <img 
            src="/logo-adega.webp" 
            alt="Adega Canoinhas" 
            class="h-10 w-auto object-contain shrink-0 logo-adega-gold" 
          />
          <h1 v-show="!isCollapsed || isMobileOpen" class="text-sm font-black m-0 text-[#E8C86A] uppercase tracking-wider whitespace-nowrap overflow-hidden leading-tight">
            Adega<br><span class="text-xs text-[#B89758] tracking-widest">Canoinhas</span>
          </h1>
        </div>
        
        <!-- Botão de recolher (visível apenas desktop) -->
        <button 
          class="hidden lg:flex bg-white/5 border border-white/10 text-bege-claro cursor-pointer p-1.5 rounded-lg items-center justify-center transition-all duration-200 hover:bg-bege-torrado/20 hover:scale-105" 
          @click="$emit('toggle')" 
          :title="isCollapsed ? 'Expandir' : 'Recolher'"
        >
          <ChevronLeftIcon 
            class="w-5 h-5 transition-transform duration-300" 
            :class="{ 'rotate-180': isCollapsed }" 
          />
        </button>

        <!-- Botão de fechar (visível apenas mobile) -->
        <button 
          class="lg:hidden text-bege-claro p-2"
          @click="$emit('close-mobile')"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </header>
      
      <!-- Menu de navegação principal do sistema -->
      <nav class="flex flex-col pt-0 pb-4 lg:py-4 gap-0.5 overflow-y-auto flex-1 custom-scrollbar">
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Dashboard">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <Squares2X2Icon class="w-5 h-5" />
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Dashboard</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/pedidos" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Pedidos">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <ClipboardDocumentListIcon class="w-5 h-5" />
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Pedidos</span>
        </NuxtLink>

        <NuxtLink to="/cozinha" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Cozinha">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <FireIcon class="w-5 h-5" />
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Cozinha</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/fechar-mesa" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Fechar Mesa">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <BanknotesIcon class="w-5 h-5" />
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Fechar Mesa</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/produtos" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Produtos">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <CubeIcon class="w-5 h-5" />
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Produtos</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/cardapio" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Cardápio">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <BookOpenIcon class="w-5 h-5" />
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Cardápio</span>
        </NuxtLink>
        
        <NuxtLink v-if="authStore.cargo !== 'cozinha'" to="/mesas" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Mesas">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <TableCellsIcon class="w-5 h-5" />
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Mesas</span>
        </NuxtLink>

        <NuxtLink v-if="['super_admin', 'dono', 'caixa'].includes(authStore.cargo || '')" to="/financeiro" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Financeiro">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <CurrencyDollarIcon class="w-5 h-5" />
          </span>
          <span class="transition-opacity duration-200 relative z-10" v-show="!isCollapsed || isMobileOpen">Financeiro</span>
        </NuxtLink>

        <NuxtLink v-if="authStore.isSuperAdmin" to="/configuracoes" class="group flex items-center w-full py-4 bg-transparent border-none text-bege-soft text-body font-medium text-left no-underline cursor-pointer transition-all duration-300 relative gap-4 whitespace-nowrap hover:bg-bege-torrado/10 hover:text-bege-claro active:scale-[0.98] [&.router-link-active]:bg-white/10 [&.router-link-active]:text-branco" :class="isCollapsed ? 'lg:justify-center lg:px-4 px-6' : 'px-6'" title="Configurações">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-bege-claro transition-all duration-300 group-hover:h-[70%] group-[.router-link-active]:h-[70%]"></div>
          <span class="flex items-center justify-center min-w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 group-[.router-link-active]:scale-110">
            <Cog6ToothIcon class="w-5 h-5" />
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
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
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
            <UserIcon class="w-6 h-6 text-bege-claro" />
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
import { 
  Squares2X2Icon, 
  ClipboardDocumentListIcon, 
  FireIcon, 
  BanknotesIcon, 
  CubeIcon, 
  BookOpenIcon, 
  TableCellsIcon, 
  CurrencyDollarIcon, 
  Cog6ToothIcon, 
  ChevronLeftIcon, 
  XMarkIcon, 
  ArrowRightOnRectangleIcon, 
  UserIcon 
} from '@heroicons/vue/24/outline';

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
/* Estilização Dourada Refinada da Barra Lateral da Adega */
#sidebar {
  background: linear-gradient(180deg, #111114 0%, #08080A 100%) !important;
  border-left: 1px solid rgba(212, 175, 55, 0.15);
}

@media (min-width: 1024px) {
  #sidebar {
    border-left: none;
    border-right: 1px solid rgba(212, 175, 55, 0.15);
  }
}

#sidebar header h1 {
  color: #C5A059 !important;
}

#sidebar header button {
  color: #B89758 !important;
  border-color: rgba(212, 175, 55, 0.2) !important;
}

#sidebar header button:hover {
  color: #E5C158 !important;
  background-color: rgba(212, 175, 55, 0.1) !important;
}

/* Links inativos: Dourado mais fechado e sóbrio */
#sidebar nav a {
  color: #B89758 !important;
  transition: all 0.25s ease;
}

#sidebar nav a svg {
  stroke: #B89758 !important;
  transition: stroke 0.25s ease;
}

/* Hover: Dourado nobre iluminado */
#sidebar nav a:hover {
  color: #E5C158 !important;
  background-color: rgba(212, 175, 55, 0.08) !important;
}

#sidebar nav a:hover svg {
  stroke: #E5C158 !important;
}

/* Item Ativo Selecionado: Dourado de destaque (sem branco) */
#sidebar nav a.router-link-active {
  color: #F0CE65 !important;
  background-color: rgba(212, 175, 55, 0.12) !important;
}

#sidebar nav a.router-link-active svg {
  stroke: #F0CE65 !important;
}

/* Faixa indicadora dourada do item ativo */
#sidebar nav a.router-link-active div[class*="absolute left-0"] {
  background-color: #D4AF37 !important;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5) !important;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.2);
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.4);
}
</style>
