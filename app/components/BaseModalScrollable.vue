<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        @click="$emit('close')"
      ></div>

      <!-- Modal Content -->
      <div 
        class="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden animate-slide-up"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 class="text-xl font-bold text-gray-800">{{ title }}</h3>
          <button 
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body Scrollable -->
        <div class="flex-1 overflow-y-auto px-1">
          <slot></slot>
        </div>

        <!-- Footer (Optional Slot) -->
        <div v-if="$slots['footer-fixed']" class="bg-white border-t border-gray-100 mt-auto">
          <slot name="footer-fixed"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
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
