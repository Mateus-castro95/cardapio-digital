<template>
  <div class="p-8 max-w-7xl mx-auto min-h-screen">
    <!-- Cabeçalho -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
      <div>
        <h1 class="text-heading-1 text-cafe mb-2">Acompanhar <span class="text-moca">Pedidos</span></h1>
        <p class="text-body-lg text-bege-torrado">Monitore o status de cada mesa em tempo real</p>
      </div>
      <div class="flex items-center gap-3 bg-branco px-4 py-2 rounded-xl border border-bege-soft shadow-sm">
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        <span class="text-xs font-bold text-cafe-dark uppercase tracking-wider">Monitorando</span>
      </div>
    </div>

    <!-- Filtros Rápidos -->
    <div class="flex gap-3 mb-8 overflow-x-auto pb-2 custom-scrollbar">
      <button 
        v-for="f in filtros" :key="f.label"
        @click="filtroAtual = f.value"
        class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border-2"
        :class="filtroAtual === f.value 
          ? 'bg-cafe border-cafe text-white shadow-lg' 
          : 'bg-branco border-bege-soft text-bege-torrado hover:border-moca hover:text-moca'"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Lista de Pedidos -->
    <div v-if="pedidosFiltrados.length > 0" class="space-y-6">
      <div 
        v-for="pedido in pedidosFiltrados" :key="pedido.id"
        class="bg-branco rounded-3xl border border-bege-soft shadow-premium hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
      >
        <!-- Conteúdo Principal -->
        <div class="p-6 flex flex-col md:flex-row gap-8 items-start md:items-center relative">
          
          <!-- Indicador de Status Lateral -->
          <div class="absolute left-0 top-0 bottom-0 w-1.5 transition-colors"
            :class="{
              'bg-blue-500': pedido.status === 'novo',
              'bg-moca': pedido.status === 'em_preparo',
              'bg-green-500': pedido.status === 'pronto',
              'bg-gray-300': pedido.status === 'entregue'
            }"
          ></div>

          <!-- Mesa -->
          <div class="flex flex-col items-center justify-center bg-cafe text-white rounded-2xl p-5 min-w-[110px] shrink-0 shadow-lg ml-2">
            <span class="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Mesa</span>
            <span class="text-4xl font-black">{{ pedido.mesa?.numero || '?' }}</span>
          </div>

          <!-- Detalhes -->
          <div class="flex-grow min-w-0 w-full">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div class="flex items-center gap-3">
                <span class="text-heading-3 text-cafe-dark">Pedido #{{ String(pedido.numero_sequencial).padStart(3, '0') }}</span>
                <span class="text-[10px] text-bege-torrado font-bold uppercase tracking-wider bg-bege-cream px-2 py-1 rounded-lg border border-bege-soft/50">
                  {{ formatTime(pedido.criado_em) }}
                </span>
              </div>

              <!-- Ações Rápidas -->
              <div class="shrink-0">
                <button 
                  v-if="pedido.status === 'pronto'"
                  class="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 py-2.5 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                  @click="handleUpdateStatus(pedido.id, 'entregue')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Marcar Entregue
                </button>
                <div v-else-if="pedido.status === 'entregue'" class="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Entregue na mesa
                </div>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-3">
              <div 
                v-for="(item, idx) in pedido.itens" :key="idx"
                class="bg-bege-cream/50 p-3 rounded-xl border border-bege-soft hover:border-moca/30 flex flex-col gap-1 min-w-[150px] transition-colors"
              >
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 flex items-center justify-center bg-cafe text-white rounded text-[10px] font-black">{{ item.quantidade }}</span>
                  <span class="text-xs font-bold text-cafe-dark truncate">{{ getItemName(item) }}</span>
                </div>
                <div v-if="getItemDescription(item)" class="text-[10px] text-bege-torrado font-medium pl-7 leading-tight">
                  {{ getItemDescription(item) }}
                </div>
                <div v-if="item.observacoes" class="mt-1 ml-7 text-[9px] text-red-500 font-bold uppercase truncate bg-red-50 px-1 py-0.5 rounded w-fit">
                  Obs: {{ item.observacoes }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Linha do Tempo -->
        <div class="px-8 py-6 bg-bege-cream/30 border-t border-bege-soft">
          <div class="flex items-center justify-between relative max-w-3xl mx-auto">
            <!-- Linha de fundo -->
            <div class="absolute top-1/2 left-0 w-full h-0.5 bg-bege-soft -translate-y-1/2 z-0"></div>
            
            <!-- Etapas -->
            <div 
              v-for="(step, index) in steps" :key="step.status"
              class="relative z-10 flex flex-col items-center group/step"
              :class="getStatusIndex(pedido.status) >= index ? 'text-cafe' : 'text-bege-torrado/50'"
            >
              <!-- Bolinha -->
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-4 bg-white"
                :class="[
                  getStatusIndex(pedido.status) >= index 
                    ? 'border-moca shadow-lg scale-110' 
                    : 'border-bege-soft'
                ]"
              >
                <div 
                  v-if="getStatusIndex(pedido.status) >= index"
                  class="w-3 h-3 bg-moca rounded-full"
                  :class="{'animate-pulse': getStatusIndex(pedido.status) === index}"
                ></div>
              </div>
              
              <span class="text-[9px] font-black uppercase tracking-widest mt-3 transition-colors">
                {{ step.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center opacity-60">
      <div class="w-32 h-32 bg-branco rounded-[2.5rem] shadow-premium border border-bege-soft flex items-center justify-center text-6xl mb-8">
        📝
      </div>
      <h3 class="text-heading-2 text-cafe-dark">Sem pedidos ativos</h3>
      <p class="text-body text-bege-torrado max-w-sm mt-3">Os pedidos aparecerão nesta tela conforme forem realizados pelos clientes.</p>
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
