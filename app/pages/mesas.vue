<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-heading-1 text-cafe mb-2">Gerenciar <span class="text-moca">Mesas</span></h1>
        <p class="text-body-lg text-bege-torrado">Monitore a ocupação em tempo real</p>
      </div>
      <div class="flex gap-3">
        <button 
            v-if="mesas.length === 0"
            @click="seedMesas" 
            :disabled="loadingSeed"
            class="px-6 py-3 rounded-xl border border-bege-torrado text-cafe hover:bg-bege-cream transition-colors font-medium flex items-center gap-2"
        >
          <span v-if="loadingSeed" class="animate-spin">⌛</span>
          GERAR 5 MESAS
        </button>
        <button 
          @click="showAddMesaModal = true" 
          class="px-6 py-3 rounded-xl bg-cafe text-branco hover:bg-cafe-dark shadow-premium hover:shadow-lg transition-all font-medium flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          NOVA MESA
        </button>
      </div>
    </div>

    <!-- Grid de Mesas -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div 
        v-for="mesa in mesas" :key="mesa.id"
        class="relative bg-branco rounded-3xl p-6 border-2 transition-all duration-300 group shadow-sm hover:shadow-premium"
        :class="mesa.status === 'ocupada' ? 'border-moca/50 bg-moca/5' : 'border-bege-soft hover:border-cafe/30'"
      >
        <div class="absolute top-4 right-4">
            <span 
                class="w-3 h-3 rounded-full block shadow-sm"
                :class="mesa.status === 'ocupada' ? 'bg-moca animate-pulse' : 'bg-green-500'"
            ></span>
        </div>

        <div class="flex flex-col items-center text-center py-6">
            <span class="text-caption uppercase font-black tracking-[0.2em] text-bege-torrado mb-2">Mesa</span>
            <span class="text-5xl font-black text-cafe-dark mb-6">{{ mesa.numero }}</span>
            
            <div 
                class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider"
                :class="mesa.status === 'ocupada' ? 'bg-moca/20 text-moca-dark' : 'bg-green-100 text-green-700'"
            >
                {{ mesa.status }}
            </div>
        </div>

        <!-- QR Code Link & Action -->
        <div class="mt-4 pt-4 border-t border-bege-soft flex justify-center gap-2">
            <button @click="abrirQrCode(mesa.numero)" class="p-2.5 bg-bege-cream rounded-xl text-cafe hover:bg-cafe hover:text-branco transition-colors" title="Ver QR Code">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1l-1 1m-1 1h.01m0 0h.01m0 0h.01M12 20h.01m0 0h.01m0 0h.01M7 7h.01m0 0h.01m0 0h.01M7 12h.01m0 0h.01m0 0h.01M7 17h.01m0 0h.01m0 0h.01M12 7h.01m0 0h.01m0 0h.01M12 12h.01m0 0h.01m0 0h.01M12 17h.01m0 0h.01m0 0h.01M17 7h.01m0 0h.01m0 0h.01M17 12h.01m0 0h.01m0 0h.01M17 17h.01m0 0h.01m0 0h.01" /></svg>
            </button>
            <button @click="copiarLinkMesa(mesa.numero)" class="p-2.5 bg-bege-cream rounded-xl text-bege-torrado hover:bg-cafe hover:text-branco transition-colors" title="Copiar Link">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            </button>
            <button @click="liberarMesa(mesa)" v-if="mesa.status === 'ocupada'" class="p-2.5 bg-red-50 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-colors" title="Liberar Mesa">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
        </div>
      </div>
    </div>

    <!-- Modal QR Code -->
    <div v-if="showQrModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-preto/60 backdrop-blur-sm" @click.self="showQrModal = false">
      <div class="bg-branco rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in text-center relative">
          <button @click="showQrModal = false" class="absolute top-4 right-4 p-2 text-bege-torrado hover:text-cafe transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>
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
        <div class="w-24 h-24 bg-bege-cream rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-sm">🪑</div>
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
            <button @click="handleCriarMesa" :disabled="loadingCriar" class="px-6 py-2 bg-cafe text-branco rounded-xl hover:bg-cafe-dark transition-colors font-bold shadow-md">
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
