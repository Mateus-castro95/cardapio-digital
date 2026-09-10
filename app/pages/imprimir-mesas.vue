<template>
  <div class="print-page bg-white min-h-screen p-8 text-black font-sans">
    <div class="mb-8 print:hidden text-center max-w-2xl mx-auto bg-gray-100 p-6 rounded-xl border border-gray-300 shadow-sm">
      <h1 class="text-2xl font-black mb-2 text-gray-800">Visualização de Impressão</h1>
      <p class="mb-6 text-gray-600 text-sm">Se a janela de impressão não abriu automaticamente, ou se você a fechou sem querer, use os botões abaixo.</p>
      <div class="flex justify-center gap-4">
        <button @click="imprimir" class="px-6 py-3 bg-black text-white rounded-xl font-black uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-md">
          Imprimir QR Codes
        </button>
        <button @click="fechar" class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold uppercase hover:bg-gray-200 transition-colors">
          Voltar
        </button>
      </div>
    </div>

    <!-- Grade de QR Codes -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-8 print-grid">
      <div 
        v-for="mesa in mesasSortidas" 
        :key="mesa.id"
        class="border-[3px] border-black rounded-3xl p-4 flex flex-col items-center justify-center text-center page-break-inside-avoid bg-white"
      >
        <h2 class="text-3xl font-black mb-4 uppercase tracking-widest text-black">Mesa {{ mesa.numero }}</h2>
        <img 
          :src="`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(getUrlMesa(mesa))}&format=svg`" 
          alt="QR Code"
          class="w-40 h-40 mb-4"
          @load="imageLoaded"
        />
        <div class="px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 w-full">
          <p class="text-[11px] font-black text-gray-800 uppercase tracking-wider leading-tight">Aponte a câmera</p>
          <p class="text-[9px] font-bold text-gray-500 leading-tight">para acessar o cardápio</p>
        </div>
      </div>
    </div>
    
    <div v-if="mesas.length === 0 && !loading" class="text-center py-20 print:hidden text-gray-500 font-bold">
      Nenhuma mesa cadastrada.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePedidos } from '~/composables/usePedidos';

// Usamos layout vazio para garantir que nada interfira se for configurado futuramente
definePageMeta({
  layout: false
});

const { mesas, fetchMesas, loading } = usePedidos();
const imagesToLoad = ref(0);
const imagesLoadedCount = ref(0);
const impressaoDisparada = ref(false);

const mesasSortidas = computed(() => {
  return [...mesas.value].sort((a, b) => Number(a.numero) - Number(b.numero));
});

const getUrlMesa = (mesa: any) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/cardapio?codigo=${mesa.id}`;
};

onMounted(async () => {
  await fetchMesas();
  imagesToLoad.value = mesas.value.length;
  
  // Se não houver mesas, imprime direto
  if (imagesToLoad.value === 0) {
    imprimir();
  }
});

const imageLoaded = () => {
  imagesLoadedCount.value++;
  if (imagesLoadedCount.value >= imagesToLoad.value && !impressaoDisparada.value) {
    impressaoDisparada.value = true;
    // Pequeno delay para garantir renderização de estilos
    setTimeout(() => {
      imprimir();
    }, 800);
  }
};

const imprimir = () => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};

const fechar = () => {
  window.close();
};
</script>

<style scoped>
/* Reset de cores para forçar o fundo branco em tudo na página, sobrepondo o tema dark global */
:global(body) {
  background-color: white !important;
}

@media print {
  @page {
    margin: 1.5cm;
    size: A4 portrait;
  }
  
  :global(body) {
    background-color: white !important;
  }

  .print-page {
    background: white !important;
    padding: 0 !important;
    min-height: auto !important;
  }
  
  .print-grid {
    gap: 1cm !important;
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
  }
  
  .page-break-inside-avoid {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    margin-bottom: 1cm;
  }
}
</style>
