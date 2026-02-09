<template>
  <BaseModal :show="show" :title="title" size="sm" @close="$emit('cancel')">
    <div class="text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p class="text-gray-600">{{ message }}</p>
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

