<template>
  <div class="p-8 max-w-[90rem] mx-auto min-h-screen">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-heading-1 text-cafe mb-2">Fila da <span class="text-moca">Cozinha</span></h1>
        <p class="text-body-lg text-bege-torrado">Gerencie a produção em tempo real</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 bg-branco px-4 py-2 rounded-xl border border-bege-soft shadow-sm">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span class="text-xs font-bold text-cafe-dark uppercase tracking-wider">Ao Vivo</span>
        </div>
        <button 
          class="px-4 py-2 rounded-xl border border-bege-torrado text-cafe hover:bg-bege-cream transition-colors font-bold text-sm tracking-wide flex items-center gap-2"
          @click="fetchPedidosAtualizados" 
          :disabled="loading"
        >
          <span v-if="loading" class="animate-spin w-4 h-4 border-2 border-cafe/30 border-t-cafe rounded-full"></span>
          Atualizar
        </button>
      </div>
    </div>

    <!-- Grid de Pedidos -->
    <div v-if="pedidosAtivos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="pedido in pedidosAtivos" :key="pedido.id"
        class="bg-branco rounded-3xl overflow-hidden border-2 transition-all duration-300 shadow-premium flex flex-col group relative"
        :class="pedido.status === 'em_preparo' ? 'border-moca shadow-xl scale-[1.02] z-10' : 'border-bege-soft hover:border-moca/50'"
      >
        <!-- Faixa de Status Lateral -->
        <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="pedido.status === 'em_preparo' ? 'bg-moca' : 'bg-green-500'"></div>

        <!-- Header do Card -->
        <div class="p-6 flex justify-between items-start border-b border-bege-soft bg-bege-cream/20">
          <div class="pl-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-black text-bege-torrado uppercase tracking-widest">Pedido</span>
              <span class="text-heading-2 text-cafe">#{{ String(pedido.numero_sequencial).padStart(3, '0') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 bg-cafe text-branco text-[10px] font-black rounded-lg uppercase tracking-wide shadow-sm">
                Mesa {{ pedido.mesa?.numero || '?' }}
              </span>
              <span class="text-[10px] text-bege-torrado font-bold uppercase flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {{ formatTimeAgo(pedido.criado_em) }}
              </span>
            </div>
          </div>
          <span 
            class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border"
            :class="pedido.status === 'em_preparo' ? 'bg-moca text-white border-moca' : 'bg-green-100 text-green-700 border-green-200'"
          >
            {{ getStatusLabel(pedido.status) }}
          </span>
        </div>

        <!-- Itens do Pedido -->
        <div class="p-6 flex-grow space-y-5">
          <div v-for="(item, idx) in pedido.itens" :key="idx" class="flex gap-4 items-start pl-2">
            <div class="h-8 w-8 bg-bege-cream rounded-lg flex items-center justify-center font-black text-cafe text-sm shrink-0 border border-bege-soft shadow-sm mt-0.5">
              {{ item.quantidade }}
            </div>
            <div class="flex-grow min-w-0">
              <h4 class="font-bold text-cafe-dark leading-tight mb-1">
                {{ getItemName(item) }}
              </h4>
              <p class="text-xs text-bege-torrado leading-relaxed font-medium">
                {{ getItemDescription(item) }}
              </p>
              <div v-if="item.observacoes" class="mt-2 p-2.5 bg-red-50 rounded-xl border border-red-100 relative">
                <div class="absolute -top-1.5 left-3 bg-red-100 text-[9px] text-red-600 px-1.5 rounded font-black uppercase tracking-wider">Obs</div>
                <p class="text-[11px] text-red-700 font-medium leading-tight mt-1">{{ item.observacoes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="p-4 bg-gray-50 mt-auto border-t border-bege-soft">
          <button 
            v-if="pedido.status === 'novo'"
            class="w-full py-3.5 rounded-xl bg-moca hover:bg-moca-light text-white font-black tracking-widest text-xs shadow-lg shadow-moca/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            @click="handleUpdateStatus(pedido.id, 'em_preparo')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
            INICIAR PREPARO
          </button>
          <button 
            v-if="pedido.status === 'em_preparo'"
            class="w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black tracking-widest text-xs shadow-lg shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            @click="handleUpdateStatus(pedido.id, 'pronto')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            MARCAR PRONTO
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center opacity-60">
      <div class="w-32 h-32 bg-branco rounded-[2.5rem] shadow-premium border border-bege-soft flex items-center justify-center text-6xl mb-8 transform rotate-3">
        🍳
      </div>
      <h3 class="text-heading-2 text-cafe-dark">Cozinha em repouso</h3>
      <p class="text-body text-bege-torrado max-w-sm mt-3">Não há pedidos pendentes no momento. Aproveite para organizar a bancada!</p>
      <button 
        class="mt-8 px-8 py-3 rounded-xl border-2 border-bege-soft text-cafe font-bold hover:bg-white hover:border-moca hover:text-moca transition-all"
        @click="fetchPedidosAtualizados"
      >
        Consultar Pedidos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';

const { pedidos, fetchPedidos, atualizarStatusPedido, setupRealtimePedidos, loading } = usePedidos();
const toast = useToast();
const realtimeChannel = ref<any>(null);

// Filtra apenas pedidos que a cozinha precisa ver
const pedidosAtivos = computed(() => {
    return (pedidos.value as any[]).filter(p => ['novo', 'em_preparo'].includes(p.status));
});

onMounted(async () => {
    // 1. Busca inicial dos dados
    await fetchPedidosAtualizados();
    
    // 2. Configura o Realtime para ouvir novos pedidos ou mudanças de status instantaneamente
    realtimeChannel.value = setupRealtimePedidos(() => {
        fetchPedidosAtualizados();
    });
});

onUnmounted(() => {
    // Limpa a conexão realtime ao sair da página
    if (realtimeChannel.value) {
        realtimeChannel.value.unsubscribe();
    }
});

const fetchPedidosAtualizados = async () => {
    try {
        await fetchPedidos({ status: ['novo', 'em_preparo'] });
    } catch (error) {
        toast.error('Erro ao buscar pedidos');
    }
};

const handleUpdateStatus = async (pedidoId: string, status: string) => {
    try {
        await atualizarStatusPedido(pedidoId, status);
        toast.success(status === 'em_preparo' ? 'Produção iniciada!' : 'Pedido pronto para entrega!');
        
        // Se mudou para pronto, ele sairá da lista da cozinha automaticamente via computed
    } catch (error) {
        toast.error('Não foi possível atualizar o status');
    }
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        'novo': 'Aguardando',
        'em_preparo': 'No Fogo',
        'pronto': 'Pronto',
    };
    return labels[status] || status;
};

const getStatusVariant = (status: string) => {
    if (status === 'novo') return 'info';
    if (status === 'em_preparo') return 'warning';
    return 'default';
};

const getItemName = (item: any) => {
    if (item.tamanho) return `Pastel ${item.tamanho.nome}`;
    
    // Para bebidas e outros itens simples
    if (item.produto_simples) {
        const p = item.produto_simples;
        // Se for suco, garante que o nome do suco apareça
        if (p.tipo_bebida === 'suco' || p.sabor) return p.sabor || 'Suco';
        if (p.tipo_bebida === 'refrigerante') return p.sabor || 'Refrigerante';
        if (p.tipo_bebida === 'agua') return p.sabor || 'Água';
    }
    
    return 'Produto';
};

const getItemDescription = (item: any) => {
    if (item.sabores && Array.isArray(item.sabores) && item.sabores.length > 0) {
        return item.sabores.map((s: any) => s.nome).join(' + ');
    }
    
    // Para bebidas e itens simples
    if (item.produto_simples) {
        const p = item.produto_simples;
        const detalhes = [];
        
        // Se for suco, o preparo é essencial para a cozinha
        if (p.tipo_preparo) detalhes.push(p.tipo_preparo === 'agua' ? 'Com Água' : 'Com Leite');
        
        if (p.tamanho) detalhes.push(p.tamanho);
        if (p.volume_ml) detalhes.push(`${p.volume_ml}ml`);
        if (p.tipo_gas) detalhes.push(p.tipo_gas === 'com_gas' ? 'C/ Gás' : 'S/ Gás');
        
        return detalhes.join(' • ');
    }
    
    return '';
};

const formatTimeAgo = (dateStr: string) => {
    const min = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (min < 1) return 'Agora';
    if (min < 60) return `Há ${min} min`;
    return `Há ${Math.floor(min / 60)}h`;
};
</script>

<style scoped>
/* Estilos específicos para a visualização da cozinha */
</style>
