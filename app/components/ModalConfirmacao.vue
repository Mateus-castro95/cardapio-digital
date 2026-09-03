<template>
  <BaseModal :show="show" :title="title" size="sm" @close="$emit('cancel')">
    <div class="text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/20 border border-red-500/20 mb-4">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-500" />
      </div>
      <p class="text-[#C5B79D] font-medium">{{ message }}</p>
    </div>

    <template #footer>
      <BaseButton variant="outline" @click="$emit('cancel')">
        {{ cancelLabel }}
      </BaseButton>
      <BaseButton :variant="variant" :loading="loading" @click="$emit('confirm')">
        {{ confirmLabel }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
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

withDefaults(defineProps<Props>(), {
  title: 'Confirmar Ação',
  loading: false,
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  variant: 'danger'
});

defineEmits(['confirm', 'cancel']);
</script>

