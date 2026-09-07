<template>
  <Teleport to="body">
    <div class="fixed z-[9999] flex flex-col gap-3 pointer-events-none top-6 left-1/2 -translate-x-1/2 items-center sm:left-auto sm:right-6 sm:translate-x-0 sm:items-end">
      <TransitionGroup name="list">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="pointer-events-auto flex items-center p-4 rounded-xl shadow-lg border w-80 transform transition-all"
          :class="variantClasses(toast.type)"
        >
          <!-- Ícones -->
          <div class="mr-3 shrink-0">
            <CheckCircleIcon v-if="toast.type === 'success'" class="w-6 h-6 text-green-400" />
            <ExclamationCircleIcon v-else-if="toast.type === 'error'" class="w-6 h-6 text-red-400" />
            <InformationCircleIcon v-else class="w-6 h-6 text-[#D4AF37]" />
          </div>

          <!-- Texto -->
          <div class="flex-1">
            <p class="text-sm font-bold text-cafe">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs text-[#C5B79D]">{{ toast.message }}</p>
          </div>

          <!-- Botão fechar -->
          <button @click="removeToast(toast.id)" class="ml-4 text-bege-torrado hover:text-cafe transition-colors">
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline';
import { useToast } from '~/composables/useToast';

const { toasts, removeToast } = useToast();

const variantClasses = (type: string) => {
  switch (type) {
    case 'success': return 'bg-[#18181C] border-[#2A261D] shadow-2xl';
    case 'error': return 'bg-[#18181C] border-red-900/50 shadow-2xl';
    default: return 'bg-[#18181C] border-[#2A261D] shadow-2xl';
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

