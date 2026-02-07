<template>
  <div class="p-6 max-w-6xl mx-auto font-primary min-h-screen bg-gray-50 pb-20">
    <!-- Cabeçalho -->
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-gray-900">Controle <span class="text-green-600">Financeiro</span></h1>
        <p class="text-gray-400 text-sm font-medium mt-1">Monitore o desempenho e faturamento da pastelaria</p>
      </div>

      <!-- Filtro de Data -->
      <div class="flex flex-wrap items-end gap-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Início</label>
          <input 
            v-model="filtro.inicio" 
            type="date" 
            class="block w-full px-3 py-2 bg-gray-50 border-0 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500 transition-all outline-none"
          >
        </div>
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Fim</label>
          <input 
            v-model="filtro.fim" 
            type="date" 
            class="block w-full px-3 py-2 bg-gray-50 border-0 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500 transition-all outline-none"
          >
        </div>
        <BaseButton 
          variant="primary" 
          size="small" 
          class="!bg-green-600 hover:!bg-green-700 !h-[42px] !px-6"
          @click="carregarDados"
          :loading="loadingReport"
        >
          FILTRAR
        </BaseButton>
      </div>
    </div>

    <!-- Cards de Métricas Principais -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Card Faturamento -->
      <BaseCard class="!p-8 border-l-4 border-l-green-500 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div class="relative z-10">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Faturamento Total</p>
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-black text-green-600">R$</span>
            <h2 class="text-4xl font-black text-gray-900 leading-none tabular-nums">{{ totalFaturado.toFixed(2) }}</h2>
          </div>
        </div>
        <span class="absolute -right-4 -bottom-4 text-7xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">💰</span>
      </BaseCard>

      <!-- Card Pedidos -->
      <BaseCard class="!p-8 border-l-4 border-l-blue-500 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div class="relative z-10">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Volume de Vendas</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-4xl font-black text-gray-900 leading-none tabular-nums">{{ totalPedidos }}</h2>
            <span class="text-sm font-black text-blue-500 uppercase tracking-widest">Pedidos</span>
          </div>
        </div>
        <span class="absolute -right-4 -bottom-4 text-7xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">📝</span>
      </BaseCard>

      <!-- Card Ticket Médio -->
      <BaseCard class="!p-8 border-l-4 border-l-orange-500 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div class="relative z-10">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Ticket Médio</p>
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-black text-orange-500">R$</span>
            <h2 class="text-4xl font-black text-gray-900 leading-none tabular-nums">{{ ticketMedio.toFixed(2) }}</h2>
          </div>
        </div>
        <span class="absolute -right-4 -bottom-4 text-7xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">🎯</span>
      </BaseCard>
    </div>

    <!-- Resumo de Métodos de Pagamento -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center text-xl">📱</div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pix</p>
            <h3 class="text-xl font-black text-gray-900 tabular-nums">R$ {{ totalPix.toFixed(2) }}</h3>
          </div>
        </div>
        <span class="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md">{{ percPix.toFixed(0) }}%</span>
      </div>

      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl">💳</div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cartão</p>
            <h3 class="text-xl font-black text-gray-900 tabular-nums">R$ {{ totalCartao.toFixed(2) }}</h3>
          </div>
        </div>
        <span class="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{{ percCartao.toFixed(0) }}%</span>
      </div>

      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl">💵</div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dinheiro</p>
            <h3 class="text-xl font-black text-gray-900 tabular-nums">R$ {{ totalDinheiro.toFixed(2) }}</h3>
          </div>
        </div>
        <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">{{ percDinheiro.toFixed(0) }}%</span>
      </div>
    </div>

    <!-- Lista de Vendas (Opcional, mas dá confiança no dado) -->
    <BaseCard class="!p-0 overflow-hidden border border-gray-100 mb-10">
      <div class="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
        <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Histórico de Pedidos no Período</h3>
        <span class="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg uppercase">
          {{ pedidosPeriodo.length }} vendas finalizadas
        </span>
      </div>

      <div class="px-8 pb-8 overflow-x-auto">
        <table class="w-full text-left table-fixed">
          <thead>
            <tr class="border-b border-gray-50">
              <th class="py-6 w-24 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</th>
              <th class="py-6 w-20 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hora</th>
              <th class="py-6 w-28 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mesa</th>
              <th class="py-6 w-24 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Protocolo</th>
              <th class="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tipo</th>
              <th class="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Método Pagto</th>
              <th class="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Valor Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="venda in vendasAgrupadas" :key="venda.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="py-5 text-sm font-bold text-gray-900 tabular-nums">{{ formatarDia(venda.data) }}</td>
              <td class="py-5 text-sm font-bold text-gray-900 tabular-nums">{{ formatarHora(venda.data) }}</td>
              <td class="py-5">
                <span v-if="venda.mesa_numero" class="inline-block text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-600 uppercase tracking-wider">
                  MESA {{ venda.mesa_numero }}
                </span>
                <span v-else class="inline-block text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-400 uppercase tracking-wider">
                  EXTERNO
                </span>
              </td>
              <td class="py-5 text-center">
                <span class="text-[10px] font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md tabular-nums border border-gray-100">
                  #{{ venda.id.substring(0, 8) }}
                </span>
              </td>
              <td class="py-5 text-center">
                <span :class="['text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter', 
                  venda.tipo === 'Parcial' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400']">
                  {{ venda.tipo }}
                </span>
              </td>
              <td class="py-5 text-center">
                <span class="text-[10px] font-bold text-gray-900 capitalize italic">
                  {{ venda.metodos }}
                </span>
              </td>
              <td class="py-5 text-right">
                <span class="text-sm font-black text-gray-900 group-hover:text-green-600 transition-colors tabular-nums">R$ {{ venda.total.toFixed(2) }}</span>
              </td>
            </tr>
            <tr v-if="vendasAgrupadas.length === 0">
              <td colspan="7" class="py-12 text-center text-gray-400 text-sm italic border-t border-gray-50">
                Nenhuma venda finalizada encontrada para este período.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';

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
