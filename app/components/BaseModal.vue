<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <!-- Modal Content -->
        <div 
          class="relative bg-[#141417] border border-[#2E2A20] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all text-[#E2DACB]"
          :class="sizeClasses"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-[#2E2A20] flex justify-between items-center bg-[#18181C]">
            <h3 class="text-xl font-bold text-cafe">{{ title }}</h3>
            <button 
              @click="$emit('close')" 
              class="text-bege-torrado hover:text-cafe transition-colors p-1 rounded-full hover:bg-white/5"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-6">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4 bg-[#18181C] flex justify-end gap-3 border-t border-[#2E2A20]">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';
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
