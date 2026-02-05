<template>
  <div class="p-6 max-w-4xl mx-auto font-primary min-h-screen bg-gray-50 pb-20">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-black text-gray-900">Gerenciar <span class="text-orange-500">Mesas</span></h1>
        <p class="text-gray-400 text-sm font-medium mt-1">Monitore a ocupação em tempo real</p>
      </div>
      <div class="flex gap-3">
        <BaseButton 
            v-if="mesas.length === 0"
            @click="seedMesas" 
            :loading="loadingSeed"
            variant="outline"
            class="!rounded-2xl border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          GERAR 5 MESAS
        </BaseButton>
        <BaseButton @click="showAddMesaModal = true" variant="primary" class="!rounded-2xl shadow-lg shadow-orange-100">
          + NOVA MESA
        </BaseButton>
      </div>
    </div>

    <!-- Grid de Mesas -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div 
        v-for="mesa in mesas" :key="mesa.id"
        class="relative bg-white rounded-[2rem] p-6 border-2 transition-all duration-300 group"
        :class="mesa.status === 'ocupada' ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 hover:border-orange-200'"
      >
        <div class="absolute top-4 right-4">
            <span 
                class="w-3 h-3 rounded-full block shadow-sm"
                :class="mesa.status === 'ocupada' ? 'bg-orange-500 animate-pulse' : 'bg-green-400'"
            ></span>
        </div>

        <div class="flex flex-col items-center text-center py-4">
            <span class="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Mesa</span>
            <span class="text-5xl font-black text-gray-900 mb-4">{{ mesa.numero }}</span>
            
            <div 
                class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider"
                :class="mesa.status === 'ocupada' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'"
            >
                {{ mesa.status }}
            </div>
        </div>

        <!-- QR Code Link & Action -->
        <div class="mt-4 pt-4 border-t border-gray-50 flex justify-center gap-2">
            <button @click="abrirQrCode(mesa.numero)" class="p-2 bg-orange-50 rounded-xl text-orange-600 hover:bg-orange-100 transition-colors" title="Ver QR Code">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1l-1 1m-1 1h.01m0 0h.01m0 0h.01M12 20h.01m0 0h.01m0 0h.01M7 7h.01m0 0h.01m0 0h.01M7 12h.01m0 0h.01m0 0h.01M7 17h.01m0 0h.01m0 0h.01M12 7h.01m0 0h.01m0 0h.01M12 12h.01m0 0h.01m0 0h.01M12 17h.01m0 0h.01m0 0h.01M17 7h.01m0 0h.01m0 0h.01M17 12h.01m0 0h.01m0 0h.01M17 17h.01m0 0h.01m0 0h.01" /></svg>
            </button>
            <button @click="copiarLinkMesa(mesa.numero)" class="p-2 bg-gray-50 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors" title="Copiar Link">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            </button>
            <button @click="liberarMesa(mesa)" v-if="mesa.status === 'ocupada'" class="p-2 bg-red-50 rounded-xl hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors" title="Liberar Mesa">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
        </div>
      </div>
    </div>

    <!-- Modal QR Code -->
    <BaseModal :show="showQrModal" :title="`QR Code - Mesa ${mesaQrAtual}`" @close="showQrModal = false">
      <div class="flex flex-col items-center py-6 text-center">
          <div class="p-4 bg-white border-4 border-gray-900 rounded-[2.5rem] shadow-2xl mb-6">
              <img 
                  v-if="mesaQrAtual"
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getUrlMesa(mesaQrAtual))}`" 
                  alt="QR Code da Mesa"
                  class="w-64 h-64"
              />
          </div>
          <p class="text-sm text-gray-500 max-w-xs">
              Aponte a câmera do celular para este código para abrir o cardápio automaticamente na <b>Mesa {{ mesaQrAtual }}</b>.
          </p>
          <div class="mt-8 w-full">
              <BaseButton variant="outline" @click="copiarLinkMesa(mesaQrAtual!)" class="w-full !rounded-2xl">COPIAR LINK DA MESA</BaseButton>
          </div>
      </div>
    </BaseModal>

    <!-- Empty State -->
    <div v-if="mesas.length === 0 && !loading" class="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
        <div class="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-4xl mb-6">🪑</div>
        <h3 class="text-xl font-bold text-gray-800">Nenhuma mesa cadastrada</h3>
        <p class="text-gray-400 text-sm mt-2">Clique no botão acima para gerar as primeiras mesas.</p>
    </div>

    <!-- Modal Adicionar Mesa -->
    <BaseModal :show="showAddMesaModal" title="Cadastrar Nova Mesa" @close="showAddMesaModal = false">
      <div class="space-y-4 pt-4">
        <BaseInput 
            v-model="novaMesaNumero" 
            label="Número da Mesa" 
            type="number" 
            placeholder="Ex: 6" 
            required
        />
        <div class="flex justify-end gap-3 mt-8">
          <BaseButton variant="outline" @click="showAddMesaModal = false">Cancelar</BaseButton>
          <BaseButton @click="handleCriarMesa" :loading="loadingCriar">SALVAR MESA</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Modal Confirmação de Liberação -->
    <ModalConfirmacao
      :show="showConfirmModal"
      title="Liberar Mesa"
      :message="`Deseja liberar a Mesa ${mesaToLiberate?.numero}? (Os pedidos ativos não serão excluídos, apenas a mesa ficará disponível)`"
      :loading="loadingLiberar"
      @confirm="handleConfirmLiberar"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';

const { mesas, fetchMesas, criarMesa, atualizarStatusMesa, loading } = usePedidos();
const toast = useToast();

const showAddMesaModal = ref(false);
const showQrModal = ref(false);
const mesaQrAtual = ref<number | null>(null);
const novaMesaNumero = ref<number | null>(null);
const loadingCriar = ref(false);
const loadingSeed = ref(false);

// Estado para exclusão/liberação de mesa
const showConfirmModal = ref(false);
const mesaToLiberate = ref<any>(null);
const loadingLiberar = ref(false);

onMounted(async () => {
  await fetchMesas();
});

const getUrlMesa = (numero: number) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/cardapio?mesa=${numero}`;
};

const abrirQrCode = (numero: number) => {
    mesaQrAtual.value = numero;
    showQrModal.value = true;
};

const handleCriarMesa = async () => {
    if (!novaMesaNumero.value) return toast.error('Ops!', 'Digite o número da mesa.');
    
    loadingCriar.value = true;
    try {
        await criarMesa(novaMesaNumero.value);
        toast.success('Mesa cadastrada!');
        showAddMesaModal.value = false;
        novaMesaNumero.value = null;
    } catch (error) {
        toast.error('Erro', 'Este número de mesa já pode estar em uso.');
    } finally {
        loadingCriar.value = false;
    }
};

const seedMesas = async () => {
    loadingSeed.value = true;
    try {
        for (let i = 1; i <= 5; i++) {
            await criarMesa(i);
        }
        toast.success('Sucesso!', '5 mesas criadas para teste.');
    } catch (error) {
        toast.error('Erro ao gerar mesas');
    } finally {
        loadingSeed.value = false;
    }
};

const liberarMesa = (mesa: any) => {
    mesaToLiberate.value = mesa;
    showConfirmModal.value = true;
};

const handleConfirmLiberar = async () => {
    if (!mesaToLiberate.value) return;
    
    loadingLiberar.value = true;
    try {
        await atualizarStatusMesa(mesaToLiberate.value.id, 'livre');
        toast.success('Mesa liberada!');
        showConfirmModal.value = false;
    } catch (error) {
        toast.error('Erro ao liberar mesa');
    } finally {
        loadingLiberar.value = false;
        mesaToLiberate.value = null;
    }
};

const copiarLinkMesa = (numero: number) => {
    const link = getUrlMesa(numero);
    navigator.clipboard.writeText(link);
    toast.success('Link Copiado!', `URL para Mesa ${numero} está na área de transferência.`);
};
</script>
