<template>
  <div class="p-6 max-w-7xl mx-auto font-primary min-h-screen bg-gray-50 pb-20">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-black text-gray-900">Fila da <span class="text-orange-500">Cozinha</span></h1>
        <p class="text-gray-400 text-sm font-medium mt-1">Gerencie a produção em tempo real</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Live</span>
        </div>
        <BaseButton variant="outline" size="small" @click="fetchPedidosAtualizados" :loading="loading">
          Atualizar
        </BaseButton>
      </div>
    </div>

    <!-- Grid de Pedidos -->
    <div v-if="pedidosAtivos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="pedido in pedidosAtivos" :key="pedido.id"
        class="bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all duration-300 shadow-sm flex flex-col"
        :class="pedido.status === 'em_preparo' ? 'border-orange-500' : 'border-gray-100'"
      >
        <!-- Header do Card -->
        <div class="p-5 flex justify-between items-start border-b border-gray-50">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Pedido</span>
              <span class="text-xl font-black text-gray-900">#{{ String(pedido.numero_sequencial).padStart(3, '0') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-gray-900 text-white text-[10px] font-black rounded-lg uppercase">
                Mesa {{ pedido.mesa?.numero || '?' }}
              </span>
              <span class="text-[10px] text-gray-400 font-bold uppercase">
                {{ formatTimeAgo(pedido.criado_em) }}
              </span>
            </div>
          </div>
          <BaseBadge :variant="getStatusVariant(pedido.status)">
            {{ getStatusLabel(pedido.status) }}
          </BaseBadge>
        </div>

        <!-- Itens do Pedido -->
        <div class="p-5 flex-grow space-y-4">
          <div v-for="(item, idx) in pedido.itens" :key="idx" class="flex gap-4">
            <div class="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center font-black text-gray-400 text-sm shrink-0">
              {{ item.quantidade }}x
            </div>
            <div class="flex-grow min-w-0">
              <h4 class="font-bold text-gray-800 leading-tight mb-0.5 truncate">
                {{ getItemName(item) }}
              </h4>
              <p class="text-xs text-gray-500 leading-relaxed italic">
                {{ getItemDescription(item) }}
              </p>
              <div v-if="item.observacoes" class="mt-2 p-2 bg-red-50 rounded-lg border border-red-100">
                <p class="text-[10px] text-red-600 font-black uppercase mb-0.5">Observação:</p>
                <p class="text-[11px] text-red-700 font-medium leading-tight">{{ item.observacoes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="p-4 bg-gray-50 mt-auto border-t border-gray-100 grid grid-cols-1 gap-2">
          <BaseButton 
            v-if="pedido.status === 'novo'"
            variant="primary" 
            class="w-full !rounded-2xl shadow-lg shadow-orange-100 py-4 font-black"
            @click="handleUpdateStatus(pedido.id, 'em_preparo')"
          >
            INICIAR PREPARO
          </BaseButton>
          <BaseButton 
            v-if="pedido.status === 'em_preparo'"
            variant="primary" 
            class="w-full !rounded-2xl !bg-green-500 hover:!bg-green-600 shadow-lg shadow-green-100 py-4 font-black"
            @click="handleUpdateStatus(pedido.id, 'pronto')"
          >
            MARCAR COMO PRONTO
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 flex items-center justify-center text-5xl mb-8 border border-gray-50">
        🍳
      </div>
      <h3 class="text-2xl font-black text-gray-800">Cozinha em repouso</h3>
      <p class="text-gray-400 max-w-xs mt-3 font-medium">Não há pedidos pendentes no momento. Aproveite para organizar a bancada!</p>
      <BaseButton variant="outline" class="mt-8 !rounded-2xl" @click="fetchPedidosAtualizados">Consultar Pedidos</BaseButton>
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
