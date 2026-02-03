<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <!-- Modal Content -->
        <div 
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
          :class="sizeClasses"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="text-xl font-bold text-gray-800">{{ title }}</h3>
            <button 
              @click="$emit('close')" 
              class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-6">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * Componente BaseModal - Estrutura base para todos os modais do sistema
 */
interface Props {
  show: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
});

defineEmits(['close']);

// Classes de tamanho
const sizeClasses = {
  'max-w-sm': props.size === 'sm',
  'max-w-md': props.size === 'md',
  'max-w-lg': props.size === 'lg',
};
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

.fade-enter-active .relative {
  transition: transform 0.3s ease-out;
}

.fade-enter-from .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
