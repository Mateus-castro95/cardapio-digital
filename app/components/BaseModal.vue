<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <div 
          class="relative bg-[#141417] border border-[#2E2A20] shadow-2xl w-full overflow-hidden transform transition-all text-[#E2DACB] rounded-xl"
          :class="[sizeClasses]"
        >
          <!-- Header -->
          <div 
            class="border-b border-[#2E2A20] flex justify-between items-center bg-[#18181C]"
            :class="size === 'xs' ? 'px-3.5 py-2.5' : size === 'sm' ? 'px-4 py-3' : 'px-4 py-3'"
          >
            <h3 
              class="text-cafe tracking-normal"
              :class="size === 'xs' ? 'text-xs sm:text-sm font-medium' : size === 'sm' ? 'text-sm sm:text-base font-medium' : 'text-base font-medium'"
            >
              {{ title }}
            </h3>
            <button 
              @click="$emit('close')" 
              class="text-bege-torrado hover:text-cafe transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <XMarkIcon :class="size === 'xs' ? 'h-3.5 w-3.5' : 'h-4 w-4'" />
            </button>
          </div>

          <!-- Body -->
          <div :class="size === 'xs' ? 'px-3.5 py-3' : size === 'sm' ? 'px-4 py-4' : 'px-5 py-4'">
            <slot />
          </div>

          <!-- Footer -->
          <div 
            v-if="$slots.footer" 
            class="bg-[#18181C] flex justify-end items-center border-t border-[#2E2A20]"
            :class="size === 'xs' ? 'px-3.5 py-2.5 gap-2' : size === 'sm' ? 'px-4 py-3 gap-2' : 'px-5 py-3 gap-2'"
          >
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
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
});

defineEmits(['close']);

// Classes de tamanho
const sizeClasses = {
  'max-w-[350px]': props.size === 'xs',
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
