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
  gap: 0.5rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

.base-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Sizes */
.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Variants */
.primary {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.primary:hover:not(.is-disabled):not(.is-loading) {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.secondary {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
}

.secondary:hover:not(.is-disabled):not(.is-loading) {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.danger:hover:not(.is-disabled):not(.is-loading) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.success:hover:not(.is-disabled):not(.is-loading) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.outline {
  background: transparent;
  border: 2px solid #f59e0b;
  color: #f59e0b;
}

.outline:hover:not(.is-disabled):not(.is-loading) {
  background: rgba(245, 158, 11, 0.1);
  transform: translateY(-2px);
}

/* States */
.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
