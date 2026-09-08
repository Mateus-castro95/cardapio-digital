<template>
  <div class="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
    <!-- Cabeçalho -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-10 gap-6">
      <div>
        <h1 class="text-2xl sm:text-heading-1 text-cafe mb-1 sm:mb-2">Acompanhar <span class="text-moca">Pedidos</span></h1>
        <p class="text-sm sm:text-body-lg text-bege-torrado">Monitore o status de cada mesa em tempo real</p>
      </div>
      <div class="flex items-center gap-3 bg-branco px-4 py-2 rounded-xl border border-bege-soft shadow-sm shrink-0">
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        <span class="text-[10px] sm:text-xs font-black text-cafe-dark uppercase tracking-wider">Monitorando Ao Vivo</span>
      </div>
    </div>

    <!-- Filtros Rápidos (Desktop) -->
    <div class="hidden sm:flex gap-3 mb-8 overflow-x-auto pb-4 custom-scrollbar">
      <button 
        v-for="f in filtros" :key="f.label"
        @click="filtroAtual = f.value"
        class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border-2"
        :class="filtroAtual === f.value 
          ? 'bg-cafe border-cafe text-[#0A0A0C] shadow-lg' 
          : 'bg-branco border-bege-soft text-bege-torrado hover:border-moca hover:text-moca'"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Filtros Rápidos (Mobile) -->
    <div class="sm:hidden mb-8 relative">
      <select 
        v-model="filtroAtual"
        class="w-full appearance-none bg-branco border border-bege-soft text-cafe-dark px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-wider focus:outline-none focus:border-cafe focus:ring-1 focus:ring-cafe shadow-sm"
      >
        <option v-for="f in filtros" :key="f.value" :value="f.value">
          {{ f.label }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-cafe">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>

    <!-- Lista de Pedidos -->
    <div v-if="pedidosFiltrados.length > 0" class="space-y-6 sm:space-y-8">
      <div 
        v-for="pedido in pedidosFiltrados" :key="pedido.id"
        class="bg-branco rounded-3xl border border-bege-soft shadow-premium hover:shadow-xl transition-all duration-300 overflow-hidden group"
      >
        <!-- Conteúdo Principal -->
        <div class="p-5 sm:p-6 flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center relative">
          
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
          <div class="flex flex-row md:flex-col items-center justify-center bg-cafe text-[#0A0A0C] rounded-2xl p-3 sm:p-5 min-w-full md:min-w-[110px] shrink-0 shadow-lg ml-0 md:ml-2 gap-2 md:gap-0">
            <span class="text-[9px] sm:text-[10px] uppercase font-black tracking-widest opacity-60 md:mb-1">Mesa</span>
            <span class="text-2xl sm:text-4xl font-black">{{ pedido.mesa?.numero || '?' }}</span>
          </div>

          <!-- Detalhes -->
          <div class="flex-grow min-w-0 w-full">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div class="flex items-center gap-3">
                <span class="text-lg sm:text-heading-3 text-cafe-dark font-black">Pedido #{{ String(pedido.numero_sequencial).padStart(3, '0') }}</span>
                <span class="text-[9px] sm:text-[10px] text-bege-torrado font-black uppercase tracking-wider bg-bege-cream px-2 py-1 rounded-lg border border-bege-soft/50 tabular-nums">
                  {{ formatTime(pedido.criado_em) }}
                </span>
              </div>

              <!-- Ações Rápidas -->
              <div class="shrink-0">
                <button 
                  v-if="pedido.status === 'pronto'"
                  class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                  @click="handleUpdateStatus(pedido.id, 'entregue')"
                >
                  <CheckIcon class="h-4 w-4" />
                  Marcar Entregue
                </button>
                <div v-else-if="pedido.status === 'entregue'" class="flex items-center justify-center sm:justify-start gap-2 text-green-700 font-black text-[9px] uppercase bg-green-50 px-3 py-2 rounded-xl border border-green-100 shadow-sm">
                  <CheckCircleIcon class="h-3.5 w-3.5" />
                  Entregue na mesa
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              <div 
                v-for="(item, idx) in pedido.itens" :key="idx"
                class="bg-bege-cream/30 p-4 rounded-2xl border border-bege-soft/40 hover:border-moca/30 flex flex-col gap-1 transition-colors group/item"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-6 h-6 shrink-0 flex items-center justify-center bg-cafe text-[#0A0A0C] rounded-lg text-[10px] font-black shadow-sm">{{ item.quantidade }}</span>
                    <span class="text-xs font-black text-cafe-dark truncate">{{ getItemName(item) }}</span>
                  </div>
                  <button @click="handleExcluirItem(pedido, item)" title="Excluir item" class="shrink-0 p-1.5 text-bege-torrado/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="item.ponto_carne" class="ml-9 my-1">
                  <span class="text-[9px] text-red-700 font-black uppercase bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                    Ponto: {{ item.ponto_carne }}
                  </span>
                </div>
                <div v-if="getItemDescription(item)" class="text-[10px] text-bege-torrado font-bold pl-9 leading-snug">
                  {{ getItemDescription(item) }}
                </div>
                <div v-if="item.observacoes" class="mt-2 ml-9 text-[9px] text-red-600 font-extrabold uppercase bg-red-50 px-2 py-1 rounded-lg w-fit border border-red-100 shadow-sm leading-none">
                  Obs: {{ item.observacoes }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Linha do Tempo (Stepper) -->
        <div class="px-5 sm:px-8 py-5 sm:py-6 bg-bege-cream/20 border-t border-bege-soft/50">
          <div class="flex items-center justify-between relative max-w-2xl mx-auto px-2">
            <!-- Linha de fundo -->
            <div class="absolute top-1/2 left-0 w-full h-0.5 bg-bege-soft/50 -translate-y-1/2 z-0"></div>
            
            <!-- Etapas -->
            <div 
              v-for="(step, index) in steps" :key="step.status"
              class="relative z-10 flex flex-col items-center group/step"
              :class="getStatusIndex(pedido.status) >= index ? 'text-cafe' : 'text-bege-torrado/40'"
            >
              <!-- Bolinha -->
              <div 
                class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 sm:border-4 bg-white"
                :class="[
                  getStatusIndex(pedido.status) >= index 
                    ? 'border-moca shadow-md scale-110' 
                    : 'border-bege-soft/60'
                ]"
              >
                <div 
                  v-if="getStatusIndex(pedido.status) >= index"
                  class="w-2 h-2 sm:w-3 sm:h-3 bg-moca rounded-full shadow-inner"
                  :class="{'animate-pulse': getStatusIndex(pedido.status) === index}"
                ></div>
              </div>
              
              <span class="text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-2.5 transition-colors text-center truncate w-12 sm:w-auto">
                {{ step.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center opacity-60">
      <div class="w-32 h-32 bg-branco rounded-[2.5rem] shadow-premium border border-bege-soft flex items-center justify-center mb-8">
        <ClipboardDocumentListIcon class="w-16 h-16 text-cafe-dark" />
      </div>
      <h3 class="text-heading-2 text-cafe-dark">Sem pedidos ativos</h3>
      <p class="text-body text-bege-torrado max-w-sm mt-3">Os pedidos aparecerão nesta tela conforme forem realizados pelos clientes.</p>
    </div>

    <!-- MODAL CONFIRMAÇÃO EXCLUSÃO -->
    <ModalConfirmacao 
      :show="showConfirmDeleteModal" 
      title="Confirmar Exclusão" 
      :message="`Tem certeza que deseja excluir ${itemToDelete?.item.quantidade}x ${itemToDelete ? getItemName(itemToDelete.item) : ''} deste pedido?`"
      :loading="isDeleting"
      @confirm="confirmarExclusaoItem"
      @cancel="showConfirmDeleteModal = false"
    />
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';
import { CheckIcon, CheckCircleIcon } from '@heroicons/vue/20/solid';
import { ClipboardDocumentListIcon, TrashIcon } from '@heroicons/vue/24/outline';

const { pedidos, fetchPedidos, atualizarStatusPedido, excluirItemPedido, setupRealtimePedidos } = usePedidos();
const toast = useToast();
const realtimeChannel = ref<any>(null);
const filtroAtual = ref('ativos');

const showConfirmDeleteModal = ref(false);
const itemToDelete = ref<any>(null);
const isDeleting = ref(false);

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
        toast.success('Status atualizado!', 'O pedido foi atualizado com sucesso.');
    } catch (error) {
        toast.error('Erro ao atualizar', 'Não foi possível atualizar o pedido.');
    }
};

const handleExcluirItem = (pedido: any, item: any) => {
    itemToDelete.value = { pedido, item };
    showConfirmDeleteModal.value = true;
};

const confirmarExclusaoItem = async () => {
    if (!itemToDelete.value) return;
    isDeleting.value = true;
    try {
        await excluirItemPedido(itemToDelete.value.pedido.id, itemToDelete.value.item.id);
        toast.success('Item excluído!', 'O valor do pedido foi recalculado.');
        showConfirmDeleteModal.value = false;
        itemToDelete.value = null;
    } catch (error) {
        toast.error('Erro ao excluir', 'Não foi possível excluir o item.');
    } finally {
        isDeleting.value = false;
    }
};

const getItemName = (item: any) => {
    if (item.nome_item) return item.nome_item;
    if (item.item_cardapio?.nome) return item.item_cardapio.nome;
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
    if (item.item_cardapio?.descricao) {
        return item.item_cardapio.descricao;
    }

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
