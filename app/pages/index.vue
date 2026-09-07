<template>
  <div class="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
    <!-- Cabeçalho -->
    <div class="mb-8 sm:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="text-center sm:text-left">
        <h1 class="text-2xl sm:text-heading-1 text-cafe mb-1 sm:mb-2 font-black">Painel de <span class="text-moca">Controle</span></h1>
        <p class="text-sm sm:text-body-lg text-bege-torrado font-bold italic opacity-80">Visão operacional em tempo real</p>
      </div>

      <!-- Card Ocupação Rápida -->
      <div class="bg-branco px-6 sm:px-8 py-4 rounded-[2rem] sm:rounded-3xl border border-bege-soft shadow-premium flex items-center justify-between sm:justify-end gap-5 sm:gap-8 self-center sm:self-auto w-full sm:w-auto">
        <div class="text-left sm:text-right">
          <p class="text-[9px] sm:text-[10px] font-black text-bege-torrado uppercase tracking-[0.2em] mb-1">Capacidade</p>
          <h2 class="text-xl sm:text-2xl font-black text-cafe-dark leading-none">
            {{ statsOcupacao.ocupadas }} 
            <span class="text-bege-soft font-light text-lg sm:text-xl px-1">/</span> 
            {{ statsOcupacao.total }}
          </h2>
        </div>
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-bege-cream/50 flex items-center justify-center relative shadow-inner">
          <TableCellsIcon class="w-5 h-5 sm:w-6 sm:h-6 text-cafe" />
          <span 
            v-if="statsOcupacao.ocupadas > 0"
            class="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-moca rounded-full border-2 border-branco animate-pulse shadow-sm"
          ></span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
      <!-- Coluna Esquerda: Mesas Ativas (Operação) -->
      <div class="lg:col-span-8 space-y-6 sm:space-y-8">
        <div class="bg-branco rounded-[2rem] sm:rounded-[2.5rem] border border-bege-soft shadow-premium overflow-hidden">
          <div class="p-6 sm:p-8 border-b border-bege-soft/50 flex flex-col sm:flex-row justify-between items-center bg-bege-cream/10 gap-4">
            <h3 class="text-[10px] sm:text-caption font-black text-cafe uppercase tracking-widest flex items-center gap-2 sm:gap-3">
              <span class="w-1.5 sm:w-2 h-5 sm:h-6 bg-moca rounded-full"></span>
              Mesas Ativas Agora
            </h3>
            <span class="text-[8px] sm:text-[10px] font-black text-moca-dark bg-moca/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
              {{ detalhesMesasOcupadas.length }} mesas consumindo
            </span>
          </div>

          <div class="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="mesa in detalhesMesasOcupadas" 
              :key="mesa.numero"
              class="group bg-bege-cream/20 hover:bg-white/10 border border-bege-soft/60 hover:border-moca/30 p-5 sm:p-6 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-cafe text-[#0A0A0C] rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black shadow-lg">
                    {{ mesa.numero }}
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-black text-cafe-dark uppercase tracking-wide">Mesa {{ mesa.numero }}</h4>
                    <p class="text-[9px] sm:text-[10px] font-black text-bege-torrado uppercase leading-tight">
                      Ocupada<br>Há {{ mesa.tempo }} min
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[9px] sm:text-[10px] font-black text-moca uppercase tracking-widest mb-1">Parcial</p>
                  <p class="text-lg sm:text-xl font-black text-cafe-dark tabular-nums leading-none">{{ formatCurrency(mesa.total) }}</p>
                </div>
              </div>
              
              <!-- Barra de Tempo Visual -->
              <div class="w-full h-1.5 bg-bege-soft/30 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-moca transition-all duration-1000"
                  :style="{ width: Math.min((mesa.tempo / 60) * 100, 100) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Empty State Mesas -->
            <div v-if="detalhesMesasOcupadas.length === 0" class="col-span-full py-12 sm:py-16 text-center">
              <BuildingStorefrontIcon class="w-12 h-12 mb-4 mx-auto opacity-20 text-cafe" />
              <p class="text-[10px] sm:text-sm font-black text-bege-torrado uppercase tracking-[0.2em] italic opacity-60">Nenhuma mesa ativa no momento</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Coluna Direita: Top Produtos (Estratégia) -->
      <div class="lg:col-span-4 space-y-6 sm:space-y-8">
        <div class="bg-cafe rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-premium relative overflow-hidden">
          <!-- Decoração -->
          <SparklesIcon class="absolute -right-6 -top-6 w-28 h-28 opacity-10 text-dourado-vivo pointer-events-none transform rotate-12" />
          
          <h3 class="text-[10px] sm:text-caption font-black text-bege-cream uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center gap-3">
             <TrophyIcon class="w-5 h-5 text-dourado-vivo shrink-0" /> Top 5 de Hoje
          </h3>

          <div class="space-y-4 sm:space-y-6 relative z-10">
            <div 
              v-for="(item, index) in topProdutos" 
              :key="item.nome"
              class="flex items-center gap-3 sm:gap-4 group"
            >
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-bege-cream/10 flex items-center justify-center text-[10px] sm:text-xs font-black text-bege-cream">
                #{{ index + 1 }}
              </div>
              <div class="flex-1">
                <div class="flex justify-between mb-1">
                  <span class="text-xs sm:text-sm font-black text-branco truncate max-w-[150px] sm:max-w-[180px]">{{ item.nome }}</span>
                  <span class="text-xs sm:text-sm font-black text-moca">{{ item.qtd }}x</span>
                </div>
                <!-- Mini barra de progresso -->
                <div class="w-full h-1 bg-branco/10 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-moca transition-all duration-1000"
                    :style="{ width: (item.qtd / (topProdutos[0]?.qtd || 1)) * 100 + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <div v-if="topProdutos.length === 0" class="py-10 text-center text-bege-cream/50">
              <p class="text-[10px] font-black uppercase tracking-widest italic opacity-40">Aguardando vendas...</p>
            </div>
          </div>

          <div class="mt-6 sm:mt-8 pt-6 border-t border-branco/10">
            <p class="text-[8px] sm:text-[10px] font-black text-bege-cream/40 uppercase tracking-widest text-center italic">
              Atualizado em tempo real
            </p>
          </div>
        </div>

        <!-- Card Métricas Rápidas -->
        <div class="bg-branco p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-bege-soft shadow-premium">
           <p class="text-[10px] font-black text-bege-torrado uppercase tracking-widest mb-6">Resumo Operacional hoje</p>
           
           <div class="space-y-3 sm:space-y-4">
              <div class="flex justify-between items-center p-4 bg-bege-cream/20 rounded-2xl border border-bege-soft/30">
                <span class="text-[10px] sm:text-xs font-black text-cafe uppercase tracking-tighter">Ticket Médio</span>
                <span class="text-xs sm:text-sm font-black text-cafe-dark tabular-nums">{{ formatCurrency(ticketMedio) }}</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-bege-cream/20 rounded-2xl border border-bege-soft/30">
                <span class="text-[10px] sm:text-xs font-black text-cafe uppercase tracking-tighter">Em Aberto</span>
                <span class="text-xs sm:text-sm font-black text-moca tabular-nums">{{ formatCurrency(totalEmAberto) }}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { useDashboard } from '~/composables/useDashboard';
import { formatCurrency } from '~/utils/formatters';
import { TableCellsIcon, BuildingStorefrontIcon, SparklesIcon, TrophyIcon } from '@heroicons/vue/24/outline';

const { 
  loading, 
  carregarDados, 
  setupRealtime, 
  statsOcupacao, 
  detalhesMesasOcupadas, 
  topProdutos 
} = useDashboard();

let realtimeChannel: any = null;

onMounted(async () => {
  await carregarDados();
  realtimeChannel = setupRealtime();
});

onUnmounted(() => {
  if (realtimeChannel) {
    realtimeChannel.unsubscribe();
  }
});

// Cálculos extras rápidos para o card de resumo
const totalEmAberto = computed(() => {
  return detalhesMesasOcupadas.value.reduce((acc, m) => acc + m.total, 0);
});

const ticketMedio = computed(() => {
  const numMesas = detalhesMesasOcupadas.value.length;
  if (numMesas === 0) return 0;
  return totalEmAberto.value / numMesas;
});
</script>

<style scoped>
.shadow-premium {
  box-shadow: 0 10px 30px -10px rgba(67, 43, 31, 0.08);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
