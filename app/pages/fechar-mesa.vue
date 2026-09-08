<template>
  <div class="p-4 sm:p-8 max-w-7xl mx-auto">
    <div class="mb-8 sm:mb-10 text-center sm:text-left">
      <h1 class="text-2xl sm:text-heading-1 text-cafe mb-1 sm:mb-2 font-black">Fechar <span class="text-moca">Mesa</span></h1>
      <p class="text-sm sm:text-body-lg text-bege-torrado font-bold">Gerencie o agrupamento de pedidos e pagamentos</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      <!-- Coluna da Esquerda: Seleção de Mesa e Resumo -->
      <div class="lg:col-span-2 space-y-6">
        <!-- SELEÇÃO DE MESA -->
        <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft p-5 sm:p-6">
          <h2 class="text-[10px] sm:text-caption font-black text-bege-torrado uppercase tracking-widest mb-4">Selecione a Mesa</h2>
          <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
            <button 
              v-for="mesa in mesasOcupadas" :key="mesa.id"
              @click="selecionarMesa(mesa)"
              class="h-12 sm:h-14 rounded-xl font-black text-base sm:text-lg transition-all border-2 flex items-center justify-center transform active:scale-95 duration-200"
              :class="mesaSelecionada?.id === mesa.id 
                ? 'bg-cafe border-cafe text-white shadow-lg shadow-cafe/20' 
                : 'bg-bege-cream/30 border-bege-soft text-cafe hover:border-moca hover:text-moca'"
            >
              {{ mesa.numero }}
            </button>
          </div>
          <div v-if="mesasOcupadas.length === 0" class="py-10 text-center text-bege-torrado text-xs sm:text-sm font-bold italic border-2 border-dashed border-bege-soft/50 rounded-2xl mt-4">
            Não há mesas ocupadas no momento.
          </div>
        </div>

        <!-- LISTA DE ITENS AGRUPADOS -->
        <div v-if="mesaSelecionada" class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden">
          <div class="p-5 sm:p-6 border-b border-bege-soft flex flex-col sm:flex-row justify-between items-center bg-bege-cream/20 gap-3">
            <h2 class="text-[10px] sm:text-caption font-black text-bege-torrado uppercase tracking-widest">Resumo do Consumo - Mesa {{ mesaSelecionada.numero }}</h2>
            <span class="text-[9px] sm:text-[10px] font-black text-moca bg-moca/10 px-3 py-1 rounded-lg uppercase border border-moca/20 tracking-wider">
              {{ itensAgrupados.length }} Itens únicos
            </span>
          </div>

          <div class="divide-y divide-bege-soft/50 max-h-[50vh] lg:max-h-[400px] overflow-y-auto custom-scrollbar">
            <div v-for="item in itensAgrupados" :key="item.chave" class="p-4 sm:p-5 flex justify-between items-center hover:bg-bege-cream/10 transition-colors">
              <div class="flex gap-3 sm:gap-4 items-center">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-bege-cream rounded-xl flex items-center justify-center font-black text-cafe text-[10px] sm:text-xs shadow-sm border border-bege-soft">
                  {{ item.quantidade }}x
                </div>
                <div class="min-w-0">
                  <h4 class="text-xs sm:text-body font-black text-cafe-dark leading-tight truncate">{{ item.nome }}</h4>
                  <p class="text-[10px] sm:text-caption text-bege-torrado font-bold leading-tight">{{ item.descricao }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
                <span class="text-xs sm:text-body font-black text-cafe-dark tabular-nums whitespace-nowrap">{{ formatCurrency(item.preco_unitario * item.quantidade) }}</span>
                <button @click="handleExcluirItem(item)" title="Excluir 1 lançamento" class="p-1.5 text-bege-torrado/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <TrashIcon class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="itensAgrupados.length === 0" class="p-12 text-center text-bege-torrado text-xs sm:text-sm font-bold italic">
            Nenhum item encontrado para esta mesa.
          </div>
        </div>
      </div>

      <!-- Coluna da Direita: Painel de Pagamento -->
      <div class="space-y-6">
        <div v-if="mesaSelecionada" class="bg-[#111114] text-branco rounded-3xl shadow-2xl p-6 sticky top-6 border border-[rgba(212,175,55,0.2)]">
          <h2 class="text-[10px] font-black text-bege-claro/60 uppercase tracking-widest mb-6">Financeiro</h2>
          
          <div class="space-y-4 mb-8">
            <div class="flex justify-between items-center text-bege-claro/80">
              <span class="text-xs font-bold uppercase">Total Consumido</span>
              <span class="text-sm font-black">{{ formatCurrency(totalConsumido) }}</span>
            </div>
            <div class="flex justify-between items-center text-green-400">
              <span class="text-xs font-bold uppercase">Total Pago</span>
              <span class="text-sm font-black">{{ formatCurrency(totalPago) }}</span>
            </div>
            <div class="pt-4 border-t border-white/10 flex justify-between items-center">
              <span class="text-xs font-black text-moca-light uppercase tracking-widest">Saldo Restante</span>
              <span class="text-2xl font-black text-white tabular-nums">{{ formatCurrency(saldoRestante) }}</span>
            </div>
          </div>

          <!-- AÇÕES DE PAGAMENTO -->
          <div v-if="saldoRestante > 0" class="space-y-6">
            <!-- Toggle Integral / Parcial -->
            <div class="flex p-1 bg-black/20 rounded-xl border border-white/5">
              <button 
                @click="tipoPagamento = 'integral'; valorPagamento = Number(saldoRestante.toFixed(2))"
                class="flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                :class="tipoPagamento === 'integral' ? 'bg-moca text-[#0A0A0C] shadow-md' : 'text-bege-claro/50 hover:text-white'"
              >
                Integral
              </button>
              <button 
                @click="tipoPagamento = 'parcial'"
                class="flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                :class="tipoPagamento === 'parcial' ? 'bg-moca text-[#0A0A0C] shadow-md' : 'text-bege-claro/50 hover:text-white'"
              >
                Parcial
              </button>
            </div>

            <div class="space-y-1">
              <label class="text-[9px] font-black text-bege-claro/60 uppercase tracking-widest px-1">Valor a Receber</label>
              <BaseInputCurrency 
                v-model="valorPagamento" 
                :disabled="tipoPagamento === 'integral'"
                placeholder="0,00"
                input-class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-moca focus:ring-1 focus:ring-moca transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{'border-red-500 ring-1 ring-red-500': Number(valorPagamento) > saldoRestante}"
              />
              <p v-if="Number(valorPagamento) > saldoRestante" class="text-[10px] text-red-400 font-bold px-1 pt-1">Valor maior que o saldo</p>
            </div>
            
            <div class="space-y-2">
              <p class="text-[9px] font-black text-bege-claro/60 uppercase tracking-widest px-1">Método</p>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="metodo in metodos" :key="metodo.id"
                  @click="metodoSelecionado = metodo.id"
                  class="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all hover:bg-white/5"
                  :class="metodoSelecionado === metodo.id 
                    ? 'bg-moca !border-moca text-[#0A0A0C] shadow-lg transform scale-105' 
                    : 'bg-transparent text-bege-claro/60'"
                >
                  {{ metodo.label }}
                </button>
              </div>
            </div>

            <button 
              class="w-full py-4 rounded-xl bg-cafe text-[#0A0A0C] hover:bg-cafe-dark font-black tracking-widest text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleRegistrarPagamento"
              :disabled="loadingPagamento || !valorPagamento || Number(valorPagamento) <= 0 || Number(valorPagamento) > (saldoRestante + 0.01) || !metodoSelecionado"
            >
              <span v-if="loadingPagamento" class="animate-pulse">PROCESSANDO...</span>
              <span v-else-if="Number(valorPagamento) > saldoRestante">VALOR EXCEDIDO</span>
              <span v-else>CONFIRMAR {{ formatCurrency(Number(valorPagamento || 0)) }}</span>
            </button>
          </div>

          <div v-else class="space-y-6">
            <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
              <p class="text-green-400 text-xs font-black uppercase mb-1 flex items-center justify-center gap-1.5">
                <CheckBadgeIcon class="w-4 h-4 text-green-400" />
                Conta Quitada!
              </p>
              <p class="text-[10px] text-green-400/60 leading-tight">Todos os débitos foram liquidados. A mesa pode ser liberada.</p>
            </div>
            
            <button 
              class="w-full py-4 rounded-xl bg-moca text-white hover:bg-moca-light font-black tracking-widest text-xs shadow-xl shadow-black/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              @click="handleFinalizarMesa"
              :disabled="loadingFinalizar"
            >
              <span v-if="loadingFinalizar" class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
              FINALIZAR E LIBERAR MESA
            </button>
          </div>
        </div>

        <!-- EMPTY STATE FINANCEIRO -->
        <div v-else class="bg-branco rounded-3xl shadow-sm border border-bege-soft p-12 flex flex-col items-center justify-center text-center opacity-50 h-[400px]">
          <CreditCardIcon class="w-16 h-16 mb-6 text-bege-torrado opacity-80" />
          <p class="text-caption font-bold text-bege-torrado uppercase tracking-widest leading-loose">Selecione uma mesa<br>para iniciar o acerto</p>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMAÇÃO EXCLUSÃO -->
    <ModalConfirmacao 
      :show="showConfirmDeleteModal" 
      title="Confirmar Exclusão" 
      :message="`Tem certeza que deseja excluir ${itemToDelete?.raw.item.quantidade}x ${itemToDelete?.itemAgrupado.nome} desta mesa?`"
      :loading="isDeleting"
      @confirm="confirmarExclusaoItem"
      @cancel="showConfirmDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';
import { formatCurrency } from '~/utils/formatters';
import { CheckBadgeIcon, CreditCardIcon, TrashIcon } from '@heroicons/vue/24/outline';

const { mesas, fetchMesas, pedidos, fetchPedidos, fetchPagamentosMesa, registrarPagamento, finalizarMesa, excluirItemPedido } = usePedidos();
const toast = useToast();

const showConfirmDeleteModal = ref(false);
const itemToDelete = ref<any>(null);
const isDeleting = ref(false);

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
                existente.raw_itens.push({ pedidoId: pedido.id, item });
            } else {
                mapa.set(chave, {
                    chave,
                    nome: nomeStr,
                    descricao: descStr,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco_unitario,
                    raw_itens: [{ pedidoId: pedido.id, item }]
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

const carregarDadosDaMesa = async (dataMaisAntiga: string) => {
    try {
        await fetchPagamentosMesa(mesaSelecionada.value.id, dataMaisAntiga);
    } catch (error) {
        toast.error('Erro ao buscar pagamentos', 'Não foi possível carregar o histórico financeiro.');
    }
};

const selecionarMesa = async (mesa: any) => {
    mesaSelecionada.value = mesa;
    valorPagamento.value = null;
    
    // Identificamos o pedido mais antigo desta mesa para filtrar pagamentos históricos
    const pedidoAntigo = pedidosDaMesa.value.length > 0 
        ? pedidosDaMesa.value.reduce((min, p) => p.criado_em < min.criado_em ? p : min, pedidosDaMesa.value[0])
        : null;

    if (pedidoAntigo) {
        await carregarDadosDaMesa(pedidoAntigo.criado_em);
    } else {
        pagamentosMesa.value = [];
    }
    
    // Sugere o valor total restante no campo
    setTimeout(() => {
        valorPagamento.value = Number(saldoRestante.value);
    }, 100);
};

const handleExcluirItem = (itemAgrupado: any) => {
    const raw = itemAgrupado.raw_itens[0];
    if (!raw) return;
    
    itemToDelete.value = { raw, itemAgrupado };
    showConfirmDeleteModal.value = true;
};

const confirmarExclusaoItem = async () => {
    if (!itemToDelete.value) return;
    isDeleting.value = true;
    try {
        await excluirItemPedido(itemToDelete.value.raw.pedidoId, itemToDelete.value.raw.item.id);
        toast.success('Item excluído!', 'O valor da mesa foi recalculado.');
        await fetchPedidos();
        showConfirmDeleteModal.value = false;
        itemToDelete.value = null;
    } catch (error) {
        toast.error('Erro ao excluir', 'Não foi possível excluir o item.');
    } finally {
        isDeleting.value = false;
    }
};

// Função para buscar apenas pagamentos que pertencem ao consumo atual
const buscarPagamentosAtuais = async () => {
    if (!mesaSelecionada.value) return;

    // Pegamos todos os pedidos ATIVOS da mesa
    const ativos = (pedidos.value as any[]).filter(
        p => p.mesa_id === mesaSelecionada.value.id && p.status !== 'finalizado'
    );

    if (ativos.length > 0) {
        // Encontramos a data do pedido mais antigo
        const datas = ativos.map(p => new Date(p.criado_em).getTime());
        const dataMaisAntiga = new Date(Math.min(...datas)).toISOString();
        
        // Buscamos apenas pagamentos feitos após esse primeiro pedido
        pagamentosMesa.value = await fetchPagamentosMesa(mesaSelecionada.value.id, dataMaisAntiga);
    } else {
        // Se não tem pedido, não deve ter pagamento ativo
        pagamentosMesa.value = [];
    }
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

        await registrarPagamento(payload);
        
        toast.success(`Recebido ${formatCurrency(payload.valor)} (${payload.metodo_pagamento})`);
        
        // Atualiza apenas os pagamentos da conta atual
        await buscarPagamentosAtuais();
        
        // Reseta campos conforme o tipo de pagamento
        if (tipoPagamento.value === 'integral') {
            valorPagamento.value = 0;
        } else {
            valorPagamento.value = Number(saldoRestante.value);
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
        // Geramos um ID único para esta venda (sessão)
        // Usamos crypto.randomUUID() que é nativo do navegador moderno
        const vendaId = crypto.randomUUID();

        await finalizarMesa({ 
            mesaId: mesaSelecionada.value.id, 
            vendaId: vendaId 
        });

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
    if (item.nome_item) return item.nome_item;
    if (item.item_cardapio?.nome) return item.item_cardapio.nome;
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
    const parts = [];
    if (item.ponto_carne) parts.push(`Ponto: ${item.ponto_carne}`);

    if (item.item_cardapio?.descricao) {
        parts.push(item.item_cardapio.descricao);
    }

    if (item.sabores && Array.isArray(item.sabores) && item.sabores.length > 0) {
        parts.push(item.sabores.map((s: any) => s.nome).join(' + '));
    }
    if (item.produto_simples) {
        const p = item.produto_simples;
        const detalhes = [];
        if (p.tipo_preparo) detalhes.push(p.tipo_preparo === 'agua' ? 'C/ Água' : 'C/ Leite');
        if (p.tamanho) detalhes.push(p.tamanho);
        if (p.volume_ml) detalhes.push(`${p.volume_ml}ml`);
        if (p.tipo_gas) detalhes.push(p.tipo_gas === 'com_gas' ? 'C/ Gás' : 'S/ Gás');
        parts.push(detalhes.join(' • '));
    }
    return parts.join(' | ');
};
</script>

<style scoped>
/* Transições suaves para seleção de mesa */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
