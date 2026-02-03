<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="list">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="pointer-events-auto flex items-center p-4 rounded-xl shadow-lg border w-80 transform transition-all"
          :class="variantClasses(toast.type)"
        >
          <!-- Ícones -->
          <div class="mr-3 shrink-0">
            <svg v-if="toast.type === 'success'" class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="toast.type === 'error'" class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Texto -->
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-800">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs text-gray-500">{{ toast.message }}</p>
          </div>

          <!-- Botão fechar -->
          <button @click="removeToast(toast.id)" class="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';

const { toasts, removeToast } = useToast();

const variantClasses = (type: string) => {
  switch (type) {
    case 'success': return 'bg-white border-green-100 ring-1 ring-green-500/10';
    case 'error': return 'bg-white border-red-100 ring-1 ring-red-500/10';
    default: return 'bg-white border-gray-100 ring-1 ring-gray-900/5';
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>

