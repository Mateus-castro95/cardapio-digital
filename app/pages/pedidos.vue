<template>
  <div class="p-6 max-w-5xl mx-auto font-primary min-h-screen bg-gray-50 pb-20">
    <!-- Cabeçalho Padronizado -->
    <div class="flex justify-between items-end mb-10">
      <div>
        <h1 class="text-3xl font-black text-gray-900">Acompanhar <span class="text-orange-500">Pedidos</span></h1>
        <p class="text-gray-400 text-sm font-medium mt-1">Monitore o status de cada mesa em tempo real</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Monitorando</span>
        </div>
      </div>
    </div>

    <!-- Filtros Rápidos (Opcional para melhorar a UX) -->
    <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
      <button 
        v-for="f in filtros" :key="f.label"
        @click="filtroAtual = f.value"
        class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap"
        :class="filtroAtual === f.value ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Lista de Pedidos em Cards Horizontais -->
    <div v-if="pedidosFiltrados.length > 0" class="space-y-6">
      <div 
        v-for="pedido in pedidosFiltrados" :key="pedido.id"
        class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
      >
        <!-- Conteúdo Principal do Card (Horizontal) -->
        <div class="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          
          <!-- Lado Esquerdo: Mesa -->
          <div class="flex flex-col items-center justify-center bg-gray-900 text-white rounded-[2rem] p-4 min-w-[100px] shrink-0">
            <span class="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Mesa</span>
            <span class="text-4xl font-black">{{ pedido.mesa?.numero || '?' }}</span>
          </div>

          <!-- Centro: Itens do Pedido -->
          <div class="flex-grow min-w-0">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span class="text-sm font-black text-gray-900">Pedido #{{ String(pedido.numero_sequencial).padStart(3, '0') }}</span>
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md">
                  {{ formatTime(pedido.criado_em) }}
                </span>
              </div>

              <!-- Ações Rápidas (Movidas para o cabeçalho) -->
              <div class="shrink-0 bg-white">
                <BaseButton 
                  v-if="pedido.status === 'pronto'"
                  variant="primary" 
                  size="small"
                  class="!rounded-xl !bg-green-500 hover:!bg-green-600 shadow-lg shadow-green-100 !py-2 !px-4 text-[10px]"
                  @click="handleUpdateStatus(pedido.id, 'entregue')"
                >
                  MARCAR ENTREGUE
                </BaseButton>
                <div v-else-if="pedido.status === 'entregue'" class="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Entregue na mesa
                </div>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-3 mt-4">
              <div 
                v-for="(item, idx) in pedido.itens" :key="idx"
                class="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col gap-1 min-w-[140px]"
              >
                <div class="flex items-center gap-2">
                  <span class="font-black text-orange-500 text-[10px]">{{ item.quantidade }}x</span>
                  <span class="text-xs font-black text-gray-800 truncate">{{ getItemName(item) }}</span>
                </div>
                <div v-if="getItemDescription(item)" class="text-[10px] text-gray-400 font-medium italic leading-tight">
                  {{ getItemDescription(item) }}
                </div>
                <div v-if="item.observacoes" class="mt-1 text-[9px] text-red-500 font-bold uppercase truncate">
                  Nota: {{ item.observacoes }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Linha do Tempo (Stepper) na base do Card -->
        <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-50">
          <div class="flex items-center justify-between relative">
            <!-- Linhas de fundo -->
            <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
            
            <!-- Etapas -->
            <div 
              v-for="(step, index) in steps" :key="step.status"
              class="relative z-10 flex flex-col items-center"
              :class="getStatusIndex(pedido.status) >= index ? 'text-gray-900' : 'text-gray-300'"
            >
              <!-- Bolinha -->
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-4"
                :class="[
                  getStatusIndex(pedido.status) >= index 
                    ? 'bg-white border-orange-500 shadow-md shadow-orange-100 scale-110' 
                    : 'bg-white border-gray-200'
                ]"
              >
                <div 
                  v-if="getStatusIndex(pedido.status) > index"
                  class="w-3 h-3 bg-orange-500 rounded-full"
                ></div>
                <div 
                  v-else-if="getStatusIndex(pedido.status) === index"
                  class="w-3 h-3 bg-orange-500 rounded-full animate-pulse"
                ></div>
              </div>
              
              <!-- Texto -->
              <span class="text-[9px] font-black uppercase tracking-widest mt-2">
                {{ step.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 flex items-center justify-center text-5xl mb-8 border border-gray-50">
        📝
      </div>
      <h3 class="text-2xl font-black text-gray-800">Sem pedidos ativos</h3>
      <p class="text-gray-400 max-w-xs mt-3 font-medium">Os pedidos aparecerão nesta tela conforme forem realizados pelos clientes.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';

const { pedidos, fetchPedidos, atualizarStatusPedido, setupRealtimePedidos } = usePedidos();
const toast = useToast();
const realtimeChannel = ref<any>(null);
const filtroAtual = ref('ativos');

const filtros = [
  { label: 'Todos os ativos', value: 'ativos' },
  { label: 'Na Cozinha', value: 'em_preparo' },
  { label: 'Prontos', value: 'pronto' },
  { label: 'Entregues', value: 'entregue' },
];

const steps = [
  { label: 'Recebido', status: 'novo' },
  { label: 'Cozinha', status: 'em_preparo' },
  { label: 'Pronto', status: 'pronto' },
  { label: 'Entregue', status: 'entregue' },
];

const pedidosFiltrados = computed(() => {
    let base = (pedidos.value as any[]).filter(p => p.status !== 'finalizado');
    
    if (filtroAtual.value === 'ativos') return base;
    return base.filter(p => p.status === filtroAtual.value);
});

onMounted(async () => {
    await fetchPedidos({ status: ['novo', 'em_preparo', 'pronto', 'entregue'] });
    
    // Setup Realtime
    realtimeChannel.value = setupRealtimePedidos(() => {
        fetchPedidos({ status: ['novo', 'em_preparo', 'pronto', 'entregue'] });
    });
});

onUnmounted(() => {
    if (realtimeChannel.value) realtimeChannel.value.unsubscribe();
});

const getStatusIndex = (status: string) => {
    return steps.findIndex(s => s.status === status);
};

const handleUpdateStatus = async (pedidoId: string, status: string) => {
    try {
        await atualizarStatusPedido(pedidoId, status);
        toast.success('Pedido atualizado!');
    } catch (error) {
        toast.error('Erro ao atualizar status');
    }
};

const getItemName = (item: any) => {
    if (item.tamanho) return `Pastel ${item.tamanho.nome}`;
    
    if (item.produto_simples) {
        const p = item.produto_simples;
        if (p.tipo_bebida === 'suco' || p.sabor) return p.sabor || 'Suco';
        if (p.tipo_bebida === 'refrigerante') return p.sabor || 'Refrigerante';
        if (p.tipo_bebida === 'agua') return p.sabor || 'Água';
    }
    
    return 'Item';
};

const getItemDescription = (item: any) => {
    if (item.sabores && Array.isArray(item.sabores) && item.sabores.length > 0) {
        return item.sabores.map((s: any) => s.nome).join(' + ');
    }
    
    if (item.produto_simples) {
        const p = item.produto_simples;
        const detalhes = [];
        
        if (p.tipo_preparo) detalhes.push(p.tipo_preparo === 'agua' ? 'Com Água' : 'Com Leite');
        if (p.tamanho) detalhes.push(p.tamanho);
        if (p.volume_ml) detalhes.push(`${p.volume_ml}ml`);
        if (p.tipo_gas) detalhes.push(p.tipo_gas === 'com_gas' ? 'C/ Gás' : 'S/ Gás');
        
        return detalhes.join(' • ');
    }
    
    return '';
};

const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
/* Transição suave para o stepper */
.transition-all {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
