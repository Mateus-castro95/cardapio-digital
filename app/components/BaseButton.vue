<template>
  <!-- Componente de botão reutilizável com múltiplas variantes e estados -->
  <button
    :id="id"
    :type="type"
    :disabled="disabled"
    :class="['base-button', variant, size, { 'is-loading': loading, 'is-disabled': disabled }]"
    @click="handleClick"
    v-bind="filteredAttrs"
  >
    <!-- Spinner de loading exibido quando o botão está processando -->
    <span v-if="loading" class="loading-spinner"></span>
    
    <!-- Conteúdo do botão (slot para texto ou ícones) -->
    <span :class="{ 'button-content': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * Componente BaseButton - Botão reutilizável do sistema
 * 
 * Props:
 * - id: ID único do botão (opcional)
 * - type: Tipo do botão HTML (button, submit, reset)
 * - variant: Estilo visual (primary, secondary, danger, success, outline)
 * - size: Tamanho do botão (small, medium, large)
 * - disabled: Desabilita o botão
 * - loading: Exibe spinner e desabilita interação
 */
interface Props {
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Eventos emitidos pelo componente
 * - click: Disparado quando o botão é clicado (se não estiver disabled ou loading)
 */
interface Emits {
  (e: 'click', event: MouseEvent): void;
}

import { useAttrs, computed } from 'vue';

// Define as props com valores padrão
const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
});

// Define os eventos que o componente pode emitir
const emit = defineEmits<Emits>();

const attrs = useAttrs();
const filteredAttrs = computed(() => {
  const { onClick, ...rest } = attrs;
  return rest;
});

defineOptions({
  inheritAttrs: false
});

/**
 * Manipula o clique do botão
 * Só emite o evento se o botão não estiver disabled ou loading
 */
const handleClick = (event: MouseEvent) => {
  // Valida se o botão pode ser clicado
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-weight: 400;
  border: none;
  border-radius: 8px; /* rounded-lg */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.base-button:focus {
  outline: 2px solid rgba(255, 255, 255, 0.1);
  outline-offset: 2px;
}

/* Sizes */
.small {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.medium {
  padding: 0.375rem 1rem;
  font-size: 0.75rem; /* text-xs */
}

.large {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem; /* text-sm */
}

/* Variants */
.primary {
  background-color: #D4AF37;
  color: #0A0A0C;
}

.primary:hover:not(.is-disabled):not(.is-loading) {
  background-color: #b5952f;
}

.secondary {
  background-color: #2E2A20;
  color: #E2DACB;
}

.secondary:hover:not(.is-disabled):not(.is-loading) {
  background-color: #3E382B;
}

.danger {
  background-color: #dc2626;
  color: white;
}

.danger:hover:not(.is-disabled):not(.is-loading) {
  background-color: #b91c1c;
}

.success {
  background-color: #059669;
  color: white;
}

.success:hover:not(.is-disabled):not(.is-loading) {
  background-color: #047857;
}

.outline {
  background-color: transparent;
  border: 1px solid #3E382B;
  color: #C5B79D;
}

.outline:hover:not(.is-disabled):not(.is-loading) {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

/* States */
.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(100%);
}

.is-loading {
  cursor: wait;
  opacity: 0.8;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.button-content {
  opacity: 0.7;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.base-button:active:not(.is-disabled):not(.is-loading) {
  transform: scale(0.98);
}
</style>
