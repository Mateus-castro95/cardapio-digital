<template>
  <div class="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
    <!-- Cabeçalho -->
    <div class="mb-8 sm:mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div>
        <h1 class="text-2xl sm:text-heading-1 text-cafe mb-1 sm:mb-2 text-center lg:text-left">Controle <span class="text-green-600">Financeiro</span></h1>
        <p class="text-sm sm:text-body-lg text-bege-torrado text-center lg:text-left">Monitore o desempenho e faturamento</p>
      </div>

      <!-- Filtro de Data -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 bg-branco p-4 sm:p-5 rounded-3xl border border-bege-soft shadow-premium w-full lg:w-auto overflow-hidden">
        <div class="flex-1 min-w-0 space-y-1">
          <label class="text-[9px] sm:text-[10px] font-black text-bege-torrado uppercase tracking-widest px-1">Início</label>
          <input 
            v-model="filtro.inicio" 
            type="date" 
            class="block w-full max-w-full px-3 sm:px-4 py-2 bg-bege-cream/30 border border-bege-soft rounded-xl text-xs sm:text-sm font-bold text-cafe focus:border-moca focus:ring-1 focus:ring-moca transition-all outline-none"
          >
        </div>
        <div class="flex-1 min-w-0 space-y-1">
          <label class="text-[9px] sm:text-[10px] font-black text-bege-torrado uppercase tracking-widest px-1">Fim</label>
          <input 
            v-model="filtro.fim" 
            type="date" 
            class="block w-full max-w-full px-3 sm:px-4 py-2 bg-bege-cream/30 border border-bege-soft rounded-xl text-xs sm:text-sm font-bold text-cafe focus:border-moca focus:ring-1 focus:ring-moca transition-all outline-none"
          >
        </div>
        <button 
          class="sm:px-6 py-2 rounded-xl bg-cafe text-white font-black tracking-wide text-xs shadow-lg hover:bg-cafe-dark transition-all h-[38px] sm:h-[42px] flex items-center justify-center gap-2"
          @click="carregarDados"
          :disabled="loadingReport"
        >
          <span v-if="loadingReport" class="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></span>
          FILTRAR
        </button>
      </div>
    </div>

    <!-- Cards de Métricas Principais -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <!-- Card Faturamento -->
      <div class="bg-branco p-6 sm:p-8 rounded-3xl shadow-premium border border-bege-soft border-l-4 border-l-green-500 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div class="relative z-10">
          <p class="text-[9px] sm:text-[10px] font-black text-bege-torrado uppercase tracking-widest mb-3 sm:mb-4">Faturamento Total</p>
          <div class="flex items-baseline gap-1 sm:gap-2">
            <span class="text-base sm:text-lg font-black text-green-600">R$</span>
            <h2 class="text-3xl sm:text-4xl font-black text-cafe-dark leading-none tabular-nums">{{ formatCurrency(totalFaturado).replace('R$', '').trim() }}</h2>
          </div>
        </div>
        <BanknotesIcon class="absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 text-cafe/5 group-hover:text-cafe/10 transition-colors pointer-events-none" />
      </div>

      <!-- Card Pedidos -->
      <div class="bg-branco p-6 sm:p-8 rounded-3xl shadow-premium border border-bege-soft border-l-4 border-l-moca relative overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div class="relative z-10">
          <p class="text-[9px] sm:text-[10px] font-black text-bege-torrado uppercase tracking-widest mb-3 sm:mb-4">Volume de Vendas</p>
          <div class="flex items-baseline gap-1 sm:gap-2">
            <h2 class="text-3xl sm:text-4xl font-black text-cafe-dark leading-none tabular-nums">{{ totalPedidos }}</h2>
            <span class="text-xs sm:text-sm font-black text-moca uppercase tracking-widest">Pedidos</span>
          </div>
        </div>
        <DocumentTextIcon class="absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 text-cafe/5 group-hover:text-cafe/10 transition-colors pointer-events-none" />
      </div>

      <!-- Card Ticket Médio -->
      <div class="bg-branco p-6 sm:p-8 rounded-3xl shadow-premium border border-bege-soft border-l-4 border-l-cafe relative overflow-hidden group hover:shadow-xl transition-all duration-500 sm:col-span-2 lg:col-span-1">
        <div class="relative z-10">
          <p class="text-[9px] sm:text-[10px] font-black text-bege-torrado uppercase tracking-widest mb-3 sm:mb-4">Ticket Médio</p>
          <div class="flex items-baseline gap-1 sm:gap-2">
            <span class="text-base sm:text-lg font-black text-cafe">R$</span>
            <h2 class="text-3xl sm:text-4xl font-black text-cafe-dark leading-none tabular-nums">{{ formatCurrency(ticketMedio).replace('R$', '').trim() }}</h2>
          </div>
        </div>
        <ChartBarIcon class="absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 text-cafe/5 group-hover:text-cafe/10 transition-colors pointer-events-none" />
      </div>
    </div>

    <!-- Resumo de Métodos de Pagamento -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
      <div v-for="item in [
        { label: 'Pix', valor: totalPix, perc: percPix, icon: QrCodeIcon, color: 'cyan' },
        { label: 'Cartão', valor: totalCartao, perc: percCartao, icon: CreditCardIcon, color: 'purple' },
        { label: 'Dinheiro', valor: totalDinheiro, perc: percDinheiro, icon: BanknotesIcon, color: 'amber' }
      ]" :key="item.label" 
      class="bg-branco p-4 sm:p-6 rounded-3xl border border-bege-soft flex items-center justify-between shadow-premium hover:shadow-xl transition-all group">
        <div class="flex items-center gap-3 sm:gap-4">
          <div :class="`w-10 h-10 sm:w-12 sm:h-12 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`">
            <component :is="item.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p class="text-[9px] sm:text-[10px] font-black text-bege-torrado uppercase tracking-widest">{{ item.label }}</p>
            <h3 class="text-lg sm:text-xl font-black text-cafe-dark tabular-nums">{{ formatCurrency(item.valor) }}</h3>
          </div>
        </div>
        <span :class="`text-[9px] sm:text-[10px] font-bold text-${item.color}-700 bg-${item.color}-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-${item.color}-100`">{{ item.perc.toFixed(0) }}%</span>
      </div>
    </div>

    <!-- Lista de Vendas -->
    <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden mb-12">
      <div class="p-6 sm:p-8 border-b border-bege-soft flex flex-col sm:flex-row justify-between items-center bg-bege-cream/10 gap-4">
        <h3 class="text-xs sm:text-caption font-black text-bege-torrado uppercase tracking-[0.2em]">Histórico de Vendas</h3>
        <span class="text-[9px] sm:text-[10px] font-black text-green-700 bg-green-50 px-3 py-1.5 rounded-xl uppercase border border-green-100 shadow-sm">
          {{ pedidosPeriodo.length }} vendas finalizadas
        </span>
      </div>

      <!-- Versão Tabela (Desktop) -->
      <div class="hidden lg:block px-8 pb-8 overflow-x-auto">
        <table class="w-full text-left table-fixed">
          <thead>
            <tr class="border-b border-bege-soft">
              <th class="py-6 w-24 text-[10px] font-black text-bege-torrado uppercase tracking-widest">Data</th>
              <th class="py-6 w-20 text-[10px] font-black text-bege-torrado uppercase tracking-widest">Hora</th>
              <th class="py-6 w-28 text-[10px] font-black text-bege-torrado uppercase tracking-widest">Mesa</th>
              <th class="py-6 w-28 text-[10px] font-black text-bege-torrado uppercase tracking-widest text-center">Protocolo</th>
              <th class="py-6 text-[10px] font-black text-bege-torrado uppercase tracking-widest text-center">Tipo</th>
              <th class="py-6 text-[10px] font-black text-bege-torrado uppercase tracking-widest text-center">Método Pagto</th>
              <th class="py-6 text-[10px] font-black text-bege-torrado uppercase tracking-widest text-right">Valor Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-bege-soft/50">
            <tr v-for="venda in vendasAgrupadas" :key="venda.id" class="hover:bg-bege-cream/30 transition-colors group">
              <td class="py-5 text-sm font-bold text-cafe-dark tabular-nums">{{ formatarDia(venda.data) }}</td>
              <td class="py-5 text-sm font-bold text-cafe-dark tabular-nums">{{ formatarHora(venda.data) }}</td>
              <td class="py-5">
                <span v-if="venda.mesa_numero" class="inline-block text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-cafe text-white uppercase tracking-wider shadow-sm">
                  MESA {{ venda.mesa_numero }}
                </span>
                <span v-else class="inline-block text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-400 uppercase tracking-wider">
                  EXTERNO
                </span>
              </td>
              <td class="py-5 text-center">
                <span class="text-[10px] font-bold text-bege-torrado bg-bege-cream/50 px-2.5 py-1 rounded-lg tabular-nums border border-bege-soft/50">
                  #{{ venda.venda_id ? venda.venda_id.substring(0, 8).toUpperCase() : venda.id.substring(0, 8).toUpperCase() }}
                </span>
              </td>
              <td class="py-5 text-center">
                <span :class="['text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tighter border shadow-xs', 
                  venda.tipo === 'Parcial' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100']">
                  {{ venda.tipo }}
                </span>
              </td>
              <td class="py-5 text-center">
                <span class="text-[10px] font-bold text-cafe capitalize italic">
                  {{ venda.metodos }}
                </span>
              </td>
              <td class="py-5 text-right">
                <span class="text-sm font-black text-cafe-dark group-hover:text-green-600 transition-colors tabular-nums">{{ formatCurrency(venda.total) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Versão Cards (Mobile) -->
      <div class="lg:hidden divide-y divide-bege-soft/50">
        <div v-for="venda in vendasAgrupadas" :key="venda.id" class="p-5 hover:bg-bege-cream/20 transition-colors">
          <div class="flex justify-between items-start mb-3">
            <div class="space-y-1">
              <span v-if="venda.mesa_numero" class="inline-block text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-cafe text-white uppercase tracking-wider mr-2">
                MESA {{ venda.mesa_numero }}
              </span>
              <span v-else class="inline-block text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-400 uppercase tracking-wider mr-2">
                EXTERNO
              </span>
              <span class="text-[9px] font-black text-bege-torrado uppercase bg-bege-cream/50 px-2 py-1 rounded-lg border border-bege-soft/30">
                #{{ (venda.venda_id || venda.id).substring(0, 8).toUpperCase() }}
              </span>
            </div>
            <span class="text-sm font-black text-cafe-dark tabular-nums">{{ formatCurrency(venda.total) }}</span>
          </div>
          
          <div class="flex justify-between items-center text-[10px]">
            <div class="flex items-center gap-3 text-bege-torrado font-bold">
              <span class="flex items-center gap-1">
                <CalendarIcon class="w-3.5 h-3.5" />
                {{ formatarDia(venda.data) }}
              </span>
              <span class="flex items-center gap-1">
                <ClockIcon class="w-3.5 h-3.5" />
                {{ formatarHora(venda.data) }}
              </span>
            </div>
            <div class="flex items-center gap-2">
               <span :class="['text-[8px] font-black px-1.5 py-0.5 rounded uppercase border', 
                  venda.tipo === 'Parcial' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100']">
                  {{ venda.tipo }}
                </span>
               <span class="font-bold text-cafe-dark/70 italic capitalize">{{ venda.metodos }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="vendasAgrupadas.length === 0" class="py-16 text-center">
        <ChartPieIcon class="w-12 h-12 mb-4 mx-auto opacity-20 text-cafe" />
        <p class="text-bege-torrado text-sm font-bold uppercase tracking-widest">Nenhuma venda finalizada encontrada</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';
import { formatCurrency } from '~/utils/formatters';
import { 
  BanknotesIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  QrCodeIcon, 
  CreditCardIcon, 
  CalendarIcon, 
  ClockIcon, 
  ChartPieIcon 
} from '@heroicons/vue/24/outline';

const { fetchPedidosPorPeriodo, fetchPagamentosPorPeriodo } = usePedidos();
const toast = useToast();

const loadingReport = ref(false);
const pedidosPeriodo = ref<any[]>([]);
const pagamentosPeriodo = ref<any[]>([]);

// Filtro inicializado com o dia de hoje (respeitando fuso horário local)
const getHojeLocal = () => {
  const agora = new Date();
  const offset = agora.getTimezoneOffset() * 60000;
  return new Date(agora.getTime() - offset).toISOString().split('T')[0];
};

const filtro = ref({
  inicio: getHojeLocal(),
  fim: getHojeLocal()
});

// Métricas calculadas
const totalFaturado = computed(() => {
  return pedidosPeriodo.value.reduce((acc, p) => acc + (p.total || 0), 0);
});

// Métricas por Método de Pagamento
const totalPix = computed(() => {
  return pagamentosPeriodo.value
    .filter(p => p.metodo_pagamento === 'pix')
    .reduce((acc, p) => acc + Number(p.valor), 0);
});

const totalCartao = computed(() => {
  return pagamentosPeriodo.value
    .filter(p => p.metodo_pagamento === 'cartao')
    .reduce((acc, p) => acc + Number(p.valor), 0);
});

const totalDinheiro = computed(() => {
  return pagamentosPeriodo.value
    .filter(p => p.metodo_pagamento === 'dinheiro')
    .reduce((acc, p) => acc + Number(p.valor), 0);
});

// Porcentagens
const totalPagamentos = computed(() => totalPix.value + totalCartao.value + totalDinheiro.value);
const percPix = computed(() => totalPagamentos.value > 0 ? (totalPix.value / totalPagamentos.value) * 100 : 0);
const percCartao = computed(() => totalPagamentos.value > 0 ? (totalCartao.value / totalPagamentos.value) * 100 : 0);
const percDinheiro = computed(() => totalPagamentos.value > 0 ? (totalDinheiro.value / totalPagamentos.value) * 100 : 0);

const totalPedidos = computed(() => {
  return pedidosPeriodo.value.length;
});

const ticketMedio = computed(() => {
  if (totalPedidos.value === 0) return 0;
  return totalFaturado.value / totalPedidos.value;
});

// Lógica de agrupamento para transformar pedidos em "Vendas" com precisão absoluta usando venda_id
const vendasAgrupadas = computed(() => {
  if (pedidosPeriodo.value.length === 0) return [];

  const gruposMap = new Map();

  pedidosPeriodo.value.forEach(pedido => {
    // Se o pedido tiver venda_id, o agrupamento é 100% garantido por ele
    // Caso contrário (pedidos antigos), usamos o timestamp de fechamento
    const chave = pedido.venda_id || `legacy-${pedido.mesa_id}-${new Date(pedido.atualizado_em).getTime()}`;

    if (!gruposMap.has(chave)) {
      gruposMap.set(chave, {
        id: pedido.id,
        venda_id: pedido.venda_id,
        data: pedido.atualizado_em,
        mesa_id: pedido.mesa_id,
        mesa_numero: pedido.mesa?.numero,
        total: 0,
        inicioSessao: new Date(pedido.criado_em).getTime(),
        fimSessao: new Date(pedido.atualizado_em).getTime()
      });
    } else {
      const grupo = gruposMap.get(chave);
      const criacao = new Date(pedido.criado_em).getTime();
      if (criacao < grupo.inicioSessao) grupo.inicioSessao = criacao;
    }
    
    gruposMap.get(chave).total += (pedido.total || 0);
  });

  return Array.from(gruposMap.values()).map(venda => {
    let pagamentosDaVenda = [];

    if (venda.venda_id) {
      // PRECISÃO TOTAL: Busca pagamentos que têm o MESMO venda_id
      pagamentosDaVenda = pagamentosPeriodo.value.filter(p => p.venda_id === venda.venda_id);
    } else {
      // FALLBACK: Para dados antigos, mantém a lógica de tempo com margem de segurança
      pagamentosDaVenda = pagamentosPeriodo.value.filter(p => {
        if (p.mesa_id !== venda.mesa_id) return false;
        const tempoPagto = new Date(p.criado_em).getTime();
        return tempoPagto >= (venda.inicioSessao - 1000) && tempoPagto <= (venda.fimSessao + 10000);
      });
    }

    const metodosSet = new Set(pagamentosDaVenda.map(p => p.metodo_pagamento));
    const metodosUnicos = Array.from(metodosSet).join(' / ');

    return {
      ...venda,
      tipo: pagamentosDaVenda.length > 1 ? 'Parcial' : 'Integral',
      metodos: metodosUnicos || 'Não informado'
    };
  });
});

// Funções
const carregarDados = async () => {
  loadingReport.value = true;
  try {
    // Definimos o início e fim do dia enviando explicitamente o fuso horário de SP (-03:00)
    // Isso garante que o Supabase filtre os registros baseados no horário local do usuário
    const dataInicio = `${filtro.value.inicio}T00:00:00-03:00`;
    const dataFim = `${filtro.value.fim}T23:59:59-03:00`;
    
    // Busca em paralelo
    const [pedidos, pagamentos] = await Promise.all([
      fetchPedidosPorPeriodo(dataInicio, dataFim),
      fetchPagamentosPorPeriodo(dataInicio, dataFim)
    ]);

    pedidosPeriodo.value = pedidos;
    pagamentosPeriodo.value = pagamentos;
  } catch (error: any) {
    toast.error('Erro ao carregar relatório');
    console.error(error);
  } finally {
    loadingReport.value = false;
  }
};

const formatarDia = (dataIso: string) => {
  const data = new Date(dataIso);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  }).format(data);
};

const formatarHora = (dataIso: string) => {
  const data = new Date(dataIso);
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(data);
};

onMounted(() => {
  carregarDados();
});
</script>

<style scoped>
.font-primary {
  font-family: 'Inter', sans-serif;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  filter: invert(0.5);
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
