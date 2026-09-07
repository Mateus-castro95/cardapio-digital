<template>
  <BaseModal :show="show" :title="title" size="xs" @close="$emit('cancel')">
    <div class="flex items-start gap-3 py-1">
      <div class="flex items-center justify-center h-7 w-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 shrink-0 mt-0.5">
        <ExclamationTriangleIcon class="h-4 w-4" />
      </div>
      <p class="text-xs text-[#C5B79D] font-normal leading-relaxed">
        {{ message }}
      </p>
    </div>

    <template #footer>
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-3 py-1.5 rounded-lg border border-[#3E382B] text-xs font-normal text-[#C5B79D] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
      >
        {{ cancelLabel }}
      </button>
      <button
        type="button"
        :disabled="loading"
        @click="$emit('confirm')"
        class="px-3.5 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
        :class="confirmButtonClass"
      >
        <span v-if="loading" class="inline-block animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
        {{ confirmLabel }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

/**
 * Componente ModalConfirmacao - Especializado em ações de confirmação
 */
interface Props {
  show: boolean;
  title?: string;
  message: string;
  loading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar Exclusão',
  loading: false,
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  variant: 'danger'
});

const confirmButtonClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white';
    case 'primary':
      return 'bg-[#D4AF37] hover:bg-[#b5952f] text-black';
    case 'secondary':
      return 'bg-[#2E2A20] hover:bg-[#3E382B] text-[#E2DACB]';
    case 'success':
      return 'bg-emerald-600 hover:bg-emerald-700 text-white';
    default:
      return 'bg-red-600 hover:bg-red-700 text-white';
  }
});

defineEmits(['confirm', 'cancel']);
</script>

