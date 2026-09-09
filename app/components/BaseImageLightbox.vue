<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
        @click="closeLightbox"
      >
        <!-- Botão Fechar -->
        <button 
          @click.stop="closeLightbox"
          class="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-bege-torrado hover:text-cafe hover:bg-white/10 rounded-full transition-colors z-[3010]"
          title="Fechar (Esc)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8 sm:w-10 sm:h-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Imagem Principal -->
        <img 
          :src="imageUrl" 
          class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-transform duration-300 transform scale-100"
          @click.stop
          alt="Visualização da imagem"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useLightbox } from '~/composables/useLightbox';

const { isOpen, imageUrl, closeLightbox } = useLightbox();

// Fechar com a tecla ESC
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeLightbox();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active img {
  animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-leave-active img {
  transition: transform 0.3s ease;
  transform: scale(0.9);
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
