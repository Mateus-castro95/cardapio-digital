<template>
  <!-- Componente de input reutilizável com label, validação e slots para ícones -->
  <div class="base-input-wrapper">
    <!-- Label do input com indicador de campo obrigatório -->
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="input-container">
      <!-- Slot para ícone ou conteúdo antes do input (ex: ícone de busca) -->
      <span v-if="$slots.prefix" class="input-prefix">
        <slot name="prefix" />
      </span>
      
      <!-- Input principal com binding bidirecional via v-model -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :class="['base-input', { 'has-prefix': $slots.prefix, 'has-suffix': $slots.suffix, 'is-error': error }]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Slot para ícone ou conteúdo depois do input (ex: botão de mostrar senha) -->
      <span v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix" />
      </span>
    </div>
    
    <!-- Mensagem de erro (prioridade sobre hint) -->
    <span v-if="error" class="error-message">{{ error }}</span>
    <!-- Mensagem de ajuda/dica (só aparece se não houver erro) -->
    <span v-else-if="hint" class="hint-message">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * Componente BaseInput - Input reutilizável do sistema
 * 
 * Props:
 * - id: ID único do input (opcional)
 * - modelValue: Valor do input (para v-model)
 * - type: Tipo do input HTML (text, email, password, number, etc)
 * - label: Texto do label acima do input
 * - placeholder: Texto placeholder dentro do input
 * - disabled: Desabilita o input
 * - readonly: Input somente leitura
 * - required: Marca o campo como obrigatório
 * - error: Mensagem de erro de validação
 * - hint: Mensagem de ajuda/dica
 * - min/max/step: Atributos para inputs numéricos
 */
interface Props {
  id?: string;
  modelValue?: string | number;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

/**
 * Eventos emitidos pelo componente
 * - update:modelValue: Atualiza o valor do v-model quando o usuário digita
 * - blur: Disparado quando o input perde o foco
 * - focus: Disparado quando o input recebe o foco
 */
interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}

// Define as props com valores padrão
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
});

// Define os eventos que o componente pode emitir
const emit = defineEmits<Emits>();

/**
 * Manipula o evento de input (quando o usuário digita)
 * Emite o novo valor para atualizar o v-model do componente pai
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

/**
 * Manipula o evento de blur (quando o input perde o foco)
 * Útil para validações que devem ocorrer após o usuário sair do campo
 */
const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

/**
 * Manipula o evento de focus (quando o input recebe o foco)
 * Útil para comportamentos especiais ao focar no campo
 */
const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required-mark {
  color: #ef4444;
  font-size: 1rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  color: #1e293b;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
  outline: none;
}

.base-input::placeholder {
  color: #94a3b8;
}

.base-input:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.base-input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.base-input:readonly {
  background: #f8fafc;
  cursor: default;
}

.base-input.is-error {
  border-color: #ef4444;
}

.base-input.is-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.base-input.has-prefix {
  padding-left: 2.75rem;
}

.base-input.has-suffix {
  padding-right: 2.75rem;
}

.input-prefix,
.input-suffix {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  pointer-events: none;
}

.input-prefix {
  left: 1rem;
}

.input-suffix {
  right: 1rem;
}

.error-message {
  font-size: 0.875rem;
  color: #ef4444;
  font-weight: 500;
}

.hint-message {
  font-size: 0.875rem;
  color: #64748b;
}

/* Hover effect */
.base-input:hover:not(:disabled):not(:readonly) {
  border-color: #cbd5e1;
}

/* Number input arrows styling */
.base-input[type='number']::-webkit-inner-spin-button,
.base-input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
}
</style>
