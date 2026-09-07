<template>
  <div class="p-4 sm:p-8 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-6">
      <div class="text-left">
        <h1 class="text-2xl sm:text-heading-1 text-cafe mb-1 sm:mb-2 font-black">Gerenciar <span class="text-moca">Mesas</span></h1>
        <p class="text-sm sm:text-body-lg text-bege-torrado font-bold">Monitore a ocupação em tempo real</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button 
            v-if="mesas.length === 0"
            @click="seedMesas" 
            :disabled="loadingSeed"
            class="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-bege-torrado text-cafe hover:bg-bege-cream transition-colors font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <ArrowPathIcon v-if="loadingSeed" class="animate-spin w-4 h-4" />
          Gerar 5 Mesas
        </button>
        <button 
          @click="showAddMesaModal = true" 
          class="w-full sm:w-auto px-6 py-3 rounded-xl bg-cafe text-[#0A0A0C] hover:bg-cafe-dark shadow-lg hover:shadow-xl transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"
        >
          <PlusIcon class="w-5 h-5" />
          Nova Mesa
        </button>
      </div>
    </div>

    <!-- Grid de Mesas -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      <div 
        v-for="mesa in mesas" :key="mesa.id"
        class="relative bg-branco rounded-3xl p-4 sm:p-6 border-2 transition-all duration-300 group shadow-sm hover:shadow-premium"
        :class="mesa.status === 'ocupada' ? 'border-moca/50 bg-moca/5' : 'border-bege-soft hover:border-cafe/30'"
      >
        <div class="absolute top-4 right-4 sm:top-5 sm:right-5">
            <span 
                class="w-2.5 h-2.5 sm:w-3 h-3 rounded-full block shadow-sm"
                :class="mesa.status === 'ocupada' ? 'bg-moca animate-pulse' : 'bg-green-500'"
            ></span>
        </div>

        <div class="flex flex-col items-center text-center py-4 sm:py-6">
            <span class="text-[9px] sm:text-caption uppercase font-black tracking-[0.2em] text-bege-torrado mb-1 sm:mb-2 leading-none">Mesa</span>
            <span class="text-4xl sm:text-5xl font-black text-cafe-dark mb-4 sm:mb-6 leading-none">{{ mesa.numero }}</span>
            
            <div 
                class="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm"
                :class="mesa.status === 'ocupada' ? 'bg-moca/10 text-moca-dark' : 'bg-green-50 text-green-700'"
            >
                {{ mesa.status }}
            </div>
        </div>

        <!-- QR Code Link & Action -->
        <div class="mt-2 sm:mt-4 pt-3 sm:pt-4 border-t border-bege-soft/50 flex justify-center gap-1.5 sm:gap-2">
            <button @click="abrirQrCode(mesa.numero)" class="p-2 sm:p-2.5 bg-bege-cream/50 rounded-xl text-cafe hover:bg-cafe hover:text-branco transition-all shadow-sm" title="Ver QR Code">
                <QrCodeIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button @click="copiarLinkMesa(mesa.numero)" class="p-2 sm:p-2.5 bg-bege-cream/50 rounded-xl text-bege-torrado hover:bg-cafe hover:text-branco transition-all shadow-sm" title="Copiar Link">
                <LinkIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button @click="liberarMesa(mesa)" v-if="mesa.status === 'ocupada'" class="p-2 sm:p-2.5 bg-red-50 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Liberar Mesa">
                <XCircleIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
        </div>
      </div>
    </div>

    <!-- Modal QR Code -->
    <div v-if="showQrModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-preto/60 backdrop-blur-sm" @click.self="showQrModal = false">
      <div class="bg-branco rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in text-center relative">
          <button @click="showQrModal = false" class="absolute top-4 right-4 p-2 text-bege-torrado hover:text-cafe transition-colors">
            <XMarkIcon class="w-6 h-6" />
          </button>
          
          <h3 class="text-heading-3 text-cafe mb-6">Mesa {{ mesaQrAtual }}</h3>
          
          <div class="p-4 bg-white border-4 border-cafe rounded-[2.5rem] shadow-premium mb-6 inline-block">
              <img 
                  v-if="mesaQrAtual"
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getUrlMesa(mesaQrAtual))}`" 
                  alt="QR Code da Mesa"
                  class="w-48 h-48"
              />
          </div>
          <p class="text-description text-preto/70 mb-8 px-4">
              Aponte a câmera para o código acima para acessar o cardápio digital desta mesa.
          </p>
          <button @click="copiarLinkMesa(mesaQrAtual!)" class="w-full py-3 rounded-xl border border-bege-torrado text-cafe hover:bg-bege-cream font-bold transition-colors">
            COPIAR LINK DA MESA
          </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="mesas.length === 0 && !loading" class="flex flex-col items-center justify-center py-20 bg-branco rounded-[3rem] border-2 border-dashed border-bege-soft">
        <div class="w-24 h-24 bg-bege-cream rounded-3xl flex items-center justify-center mb-6 shadow-sm">
          <TableCellsIcon class="w-12 h-12 text-cafe" />
        </div>
        <h3 class="text-heading-2 text-cafe mb-2">Nenhuma mesa</h3>
        <p class="text-body text-bege-torrado">Clique no botão acima para começar.</p>
    </div>

    <!-- Modal Adicionar Mesa -->
    <div v-if="showAddMesaModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-preto/60 backdrop-blur-sm" @click.self="showAddMesaModal = false">
      <div class="bg-branco rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in relative">
        <h3 class="text-heading-3 text-cafe mb-6">Nova Mesa</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-caption font-bold text-cafe uppercase tracking-wider mb-2">Número da Mesa</label>
            <input 
              v-model="novaMesaNumero" 
              type="number" 
              placeholder="Ex: 6" 
              class="w-full px-4 py-3 rounded-xl border border-bege-torrado/30 bg-bege-cream focus:border-cafe focus:ring-2 focus:ring-cafe/20 outline-none transition-all text-body text-preto font-bold text-center text-xl"
            />
          </div>
          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-bege-soft">
            <button @click="showAddMesaModal = false" class="px-4 py-2 text-bege-torrado hover:text-cafe font-medium transition-colors">Cancelar</button>
            <button @click="handleCriarMesa" :disabled="loadingCriar" class="px-6 py-2 bg-cafe text-[#0A0A0C] rounded-xl hover:bg-cafe-dark transition-colors font-bold shadow-md">
              {{ loadingCriar ? 'Salvando...' : 'SALVAR MESA' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';
import { PlusIcon, QrCodeIcon, LinkIcon, XCircleIcon, XMarkIcon, TableCellsIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

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
