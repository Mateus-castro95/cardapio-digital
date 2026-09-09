<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        @click="$emit('close')"
      ></div>

      <!-- Modal Content -->
      <div 
        class="relative w-full max-w-2xl bg-[#141417] border border-[#2E2A20] text-[#E2DACB] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[80vh] sm:max-h-[85vh] overflow-hidden animate-slide-up"
      >
        <!-- Header -->
        <div v-if="title" class="px-6 py-4 border-b border-[#2E2A20] flex justify-between items-center bg-[#18181C] sticky top-0 z-10">
          <h3 class="text-xl font-bold text-cafe">{{ title }}</h3>
          <button 
            @click="$emit('close')"
            class="p-2 hover:bg-white/5 rounded-full transition-colors text-bege-torrado hover:text-cafe"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <!-- Absolute Close Button (When no header) -->
        <button 
          v-else
          @click="$emit('close')"
          class="absolute top-4 right-4 z-20 p-2 bg-[#18181C]/80 hover:bg-[#2E2A20] rounded-full transition-colors text-bege-torrado hover:text-cafe backdrop-blur-md shadow-sm"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>

        <!-- Body Scrollable -->
        <div class="flex-1 overflow-y-auto px-1" :class="{'pt-2': !title}">
          <slot></slot>
        </div>

        <!-- Footer (Optional Slot) -->
        <div v-if="$slots['footer-fixed']" class="bg-[#18181C] border-t border-[#2E2A20] mt-auto">
          <slot name="footer-fixed"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';
defineProps<{
  show: boolean;
  title?: string;
}>();

defineEmits(['close']);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@media (min-width: 640px) {
  .animate-slide-up {
    animation: zoomIn 0.2s ease-out;
  }
}

@keyframes zoomIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Hide scrollbar but keep functionality */
.overflow-y-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}
.overflow-y-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
