<template>
  <div class="p-6 max-w-5xl mx-auto font-primary min-h-screen bg-gray-50 pb-20">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-gray-900">Fechar <span class="text-orange-500">Mesa</span></h1>
      <p class="text-gray-400 text-sm font-medium mt-1">Gerencie o agrupamento de pedidos e pagamentos</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Coluna da Esquerda: Seleção de Mesa e Resumo -->
      <div class="lg:col-span-2 space-y-6">
        <!-- SELEÇÃO DE MESA -->
        <BaseCard class="!p-6">
          <h2 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Selecione a Mesa</h2>
          <div class="grid grid-cols-4 sm:grid-cols-6 gap-3">
            <button 
              v-for="mesa in mesasOcupadas" :key="mesa.id"
              @click="selecionarMesa(mesa)"
              class="h-14 rounded-2xl font-black text-lg transition-all border-2 flex items-center justify-center"
              :class="mesaSelecionada?.id === mesa.id 
                ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200 hover:text-orange-500'"
            >
              {{ mesa.numero }}
            </button>
          </div>
          <div v-if="mesasOcupadas.length === 0" class="py-4 text-center text-gray-400 text-sm italic">
            Não há mesas ocupadas no momento.
          </div>
        </BaseCard>

        <!-- LISTA DE ITENS AGRUPADOS -->
        <BaseCard v-if="mesaSelecionada" class="!p-0 overflow-hidden">
          <div class="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-xs font-black text-gray-400 uppercase tracking-widest">Resumo do Consumo - Mesa {{ mesaSelecionada.numero }}</h2>
            <span class="text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-lg uppercase">
              {{ itensAgrupados.length }} Itens únicos
            </span>
          </div>

          <div class="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
            <div v-for="item in itensAgrupados" :key="item.chave" class="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div class="flex gap-4 items-center">
                <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-500 text-xs shadow-sm">
                  {{ item.quantidade }}x
                </div>
                <div>
                  <h4 class="text-sm font-black text-gray-800 leading-tight">{{ item.nome }}</h4>
                  <p class="text-[10px] text-gray-400 font-medium italic">{{ item.descricao }}</p>
                </div>
              </div>
              <span class="text-sm font-black text-gray-900">R$ {{ (item.preco_unitario * item.quantidade).toFixed(2) }}</span>
            </div>
          </div>

          <div v-if="itensAgrupados.length === 0" class="p-12 text-center text-gray-400 text-sm">
            Nenhum item encontrado para esta mesa.
          </div>
        </BaseCard>
      </div>

      <!-- Coluna da Direita: Painel de Pagamento -->
      <div class="space-y-6">
        <BaseCard v-if="mesaSelecionada" class="!p-6 !bg-gray-900 text-white sticky top-6">
          <h2 class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Financeiro</h2>
          
          <div class="space-y-4 mb-8">
            <div class="flex justify-between items-center opacity-60">
              <span class="text-xs font-bold uppercase">Total Consumido</span>
              <span class="text-sm font-black">R$ {{ totalConsumido.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center text-green-400">
              <span class="text-xs font-bold uppercase">Total Pago</span>
              <span class="text-sm font-black">R$ {{ totalPago.toFixed(2) }}</span>
            </div>
            <div class="pt-4 border-t border-gray-800 flex justify-between items-center">
              <span class="text-sm font-black text-orange-400 uppercase tracking-wider">Saldo Restante</span>
              <span class="text-3xl font-black text-white">R$ {{ saldoRestante.toFixed(2) }}</span>
            </div>
          </div>

          <!-- AÇÕES DE PAGAMENTO -->
          <div v-if="saldoRestante > 0" class="space-y-6">
            <!-- Toggle Integral / Parcial -->
            <div class="flex p-1 bg-gray-800 rounded-2xl border border-gray-700">
              <button 
                @click="tipoPagamento = 'integral'; valorPagamento = Number(saldoRestante.toFixed(2))"
                class="flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                :class="tipoPagamento === 'integral' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'"
              >
                Integral
              </button>
              <button 
                @click="tipoPagamento = 'parcial'"
                class="flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                :class="tipoPagamento === 'parcial' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'"
              >
                Parcial
              </button>
            </div>

            <BaseInput 
              v-model="valorPagamento" 
              type="number" 
              label="Valor a Receber"
              dark
              :disabled="tipoPagamento === 'integral'"
              :error="Number(valorPagamento) > saldoRestante ? 'Valor maior que o saldo' : undefined"
              class="!bg-gray-800 !border-gray-700 !text-white"
            />
            
            <div class="space-y-2">
              <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Método</p>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="metodo in metodos" :key="metodo.id"
                  @click="metodoSelecionado = metodo.id"
                  class="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all"
                  :class="metodoSelecionado === metodo.id 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-900/40' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'"
                >
                  {{ metodo.label }}
                </button>
              </div>
            </div>

            <BaseButton 
              class="w-full !rounded-2xl !py-4 shadow-xl shadow-black/20 font-black tracking-widest text-xs"
              @click="handleRegistrarPagamento"
              :loading="loadingPagamento"
              :disabled="!valorPagamento || Number(valorPagamento) <= 0 || Number(valorPagamento) > (saldoRestante + 0.01) || !metodoSelecionado"
            >
              <span v-if="Number(valorPagamento) > saldoRestante">VALOR EXCEDIDO</span>
              <span v-else>CONFIRMAR R$ {{ Number(valorPagamento || 0).toFixed(2) }}</span>
            </BaseButton>
          </div>

          <div v-else class="space-y-6">
            <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-[2rem] text-center">
              <p class="text-green-400 text-xs font-black uppercase mb-1">Conta Quitada! 🥂</p>
              <p class="text-[10px] text-green-400/60 leading-tight">Todos os débitos foram liquidados. A mesa pode ser liberada.</p>
            </div>
            
            <BaseButton 
              variant="primary"
              class="w-full !rounded-2xl !py-4 !bg-orange-500 hover:!bg-orange-600 font-black shadow-xl shadow-orange-900/40"
              @click="handleFinalizarMesa"
              :loading="loadingFinalizar"
            >
              FINALIZAR E LIBERAR MESA
            </BaseButton>
          </div>
        </BaseCard>

        <!-- EMPTY STATE FINANCEIRO -->
        <BaseCard v-else class="!p-12 flex flex-col items-center justify-center text-center opacity-50">
          <div class="text-4xl mb-4">💳</div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest leading-loose">Selecione uma mesa<br>para iniciar o acerto</p>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';

const { mesas, fetchMesas, pedidos, fetchPedidos, fetchPagamentosMesa, registrarPagamento, finalizarMesa } = usePedidos();
const toast = useToast();

const mesaSelecionada = ref<any>(null);
const pagamentosMesa = ref<any[]>([]);
const valorPagamento = ref<number | null>(null);
const tipoPagamento = ref<'integral' | 'parcial'>('integral');
const metodoSelecionado = ref('pix');
const loadingPagamento = ref(false);
const loadingFinalizar = ref(false);

const metodos = [
  { id: 'pix', label: 'Pix' },
  { id: 'cartao', label: 'Cartão' },
  { id: 'dinheiro', label: 'Dinheiro' },
];

const mesasOcupadas = computed(() => mesas.value.filter(m => m.status === 'ocupada'));

const pedidosDaMesa = computed(() => {
    if (!mesaSelecionada.value) return [];
    return (pedidos.value as any[]).filter(p => p.mesa_id === mesaSelecionada.value.id && p.status !== 'finalizado');
});

const itensAgrupados = computed(() => {
    const mapa = new Map();
    
    pedidosDaMesa.value.forEach(pedido => {
        pedido.itens.forEach((item: any) => {
            const nomeStr = getItemName(item);
            const descStr = getItemDescription(item);
            const chave = `${nomeStr}-${descStr}-${item.preco_unitario}`;
            
            if (mapa.has(chave)) {
                const existente = mapa.get(chave);
                existente.quantidade += item.quantidade;
            } else {
                mapa.set(chave, {
                    chave,
                    nome: nomeStr,
                    descricao: descStr,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco_unitario
                });
            }
        });
    });
    
    return Array.from(mapa.values());
});

const totalConsumido = computed(() => {
    return pedidosDaMesa.value.reduce((acc, p) => acc + p.total, 0);
});

const totalPago = computed(() => {
    return pagamentosMesa.value.reduce((acc, p) => acc + Number(p.valor), 0);
});

const saldoRestante = computed(() => {
    const diff = totalConsumido.value - totalPago.value;
    return diff > 0 ? diff : 0;
});

onMounted(async () => {
    await fetchMesas();
    await fetchPedidos();
});

const selecionarMesa = async (mesa: any) => {
    mesaSelecionada.value = mesa;
    valorPagamento.value = null;
    // Busca pagamentos já realizados
    pagamentosMesa.value = await fetchPagamentosMesa(mesa.id);
    // Sugere o valor total restante no campo
    setTimeout(() => {
        valorPagamento.value = Number(saldoRestante.value.toFixed(2));
    }, 100);
};

const handleRegistrarPagamento = async () => {
    const valorNumerico = Number(valorPagamento.value);
    
    if (valorNumerico > (saldoRestante.value + 0.01)) {
        toast.error('O valor não pode ser maior que o saldo restante');
        return;
    }

    loadingPagamento.value = true;
    try {
        const payload = {
            mesa_id: mesaSelecionada.value.id,
            valor: valorNumerico,
            metodo_pagamento: metodoSelecionado.value
        };

        const result = await registrarPagamento(payload);
        
        // Se o banco registrou, independente do retorno detalhado, prosseguimos
        toast.success(`Recebido R$ ${payload.valor.toFixed(2)} (${payload.metodo_pagamento})`);
        
        // Atualiza a lista de pagamentos e recalcula saldos
        pagamentosMesa.value = await fetchPagamentosMesa(mesaSelecionada.value.id);
        
        // Reseta campos conforme o tipo de pagamento
        if (tipoPagamento.value === 'integral') {
            valorPagamento.value = 0;
        } else {
            valorPagamento.value = Number(saldoRestante.value.toFixed(2));
        }
    } catch (error: any) {
        console.error('Erro no checkout:', error);
        toast.error('Erro ao registrar', error.message || 'Verifique sua conexão');
    } finally {
        loadingPagamento.value = false;
    }
};

const handleFinalizarMesa = async () => {
    if (!mesaSelecionada.value) return;
    
    loadingFinalizar.value = true;
    try {
        await finalizarMesa(mesaSelecionada.value.id);
        toast.success('Mesa encerrada com sucesso!');
        
        // Reseta tudo
        mesaSelecionada.value = null;
        pagamentosMesa.value = [];
        await fetchMesas();
        await fetchPedidos();
    } catch (error) {
        toast.error('Erro ao finalizar mesa');
    } finally {
        loadingFinalizar.value = false;
    }
};

const getItemName = (item: any) => {
    if (item.tamanho) return `Pastel ${item.tamanho.nome}`;
    if (item.produto_simples) {
        const p = item.produto_simples;
        if (p.tipo_bebida === 'suco' || p.sabor) return p.sabor || 'Suco';
        if (p.tipo_bebida === 'refrigerante') return p.sabor || 'Refrigerante';
        if (p.tipo_bebida === 'agua') return p.sabor || 'Água';
        return p.sabor || 'Bebida';
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
        if (p.tipo_preparo) detalhes.push(p.tipo_preparo === 'agua' ? 'C/ Água' : 'C/ Leite');
        if (p.tamanho) detalhes.push(p.tamanho);
        if (p.volume_ml) detalhes.push(`${p.volume_ml}ml`);
        if (p.tipo_gas) detalhes.push(p.tipo_gas === 'com_gas' ? 'C/ Gás' : 'S/ Gás');
        return detalhes.join(' • ');
    }
    return '';
};
</script>

<style scoped>
/* Transições suaves para seleção de mesa */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
