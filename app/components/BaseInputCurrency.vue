<template>
  <input
    :value="displayValue"
    @input="handleInput"
    @focus="handleFocus"
    type="tel"
    :placeholder="placeholder"
    class="base-input"
    :class="inputClass"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: number | string | null | undefined;
  placeholder?: string;
  inputClass?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const displayValue = ref('');

// Formata o valor com 2 casas decimais (RTL mask approach)
const formatMoney = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue) || numValue === 0) return '';
  
  // Converte para string com 2 casas decimais e vírgula
  return numValue.toFixed(2).replace('.', ',');
};

// Inicializa o valor de exibição
displayValue.value = formatMoney(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  // Sempre sincroniza do DB para a View se vier de fora
  // Mas para não sobrescrever enquanto digita, verificamos se equivale
  const currentNumeric = parseToNumeric(displayValue.value);
  const newNumeric = typeof newValue === 'string' ? parseFloat(newValue) : newValue;
  
  if (currentNumeric !== newNumeric) {
    displayValue.value = formatMoney(newValue);
  }
});

const parseToNumeric = (str: string): number | null => {
  if (!str) return null;
  // Remove tudo que não for dígito
  const digits = str.replace(/\D/g, '');
  if (!digits) return null;
  
  // Converte para centavos e depois divide por 100
  return parseInt(digits, 10) / 100;
};

const handleFocus = (event: Event) => {
  // Se estiver zerado, ao focar, deixa em branco para facilitar a digitação
  if (props.modelValue === 0 || displayValue.value === '0,00' || displayValue.value === '') {
    displayValue.value = '';
    emit('update:modelValue', null);
  } else {
    // Seleciona tudo para sobrescrever mais fácil
    const target = event.target as HTMLInputElement;
    target.select();
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value;
  
  // Converte o que foi digitado para um valor numérico real
  const numericValue = parseToNumeric(rawValue);
  
  if (numericValue !== null && numericValue > 0) {
    // Atualiza a visualização com a máscara (RTL)
    displayValue.value = formatMoney(numericValue);
    // Força o DOM a refletir o Vue imediatamente
    target.value = displayValue.value;
    
    // Move o cursor para o final
    setTimeout(() => {
      target.selectionStart = target.selectionEnd = target.value.length;
    }, 0);
  } else {
    displayValue.value = '';
    target.value = ''; // Força o input a ficar vazio (remove letras soltas)
  }
  
  // Emite o valor float puro (ex: 12.50) para o banco de dados
  emit('update:modelValue', numericValue !== null && numericValue > 0 ? numericValue : null);
};
</script>

<style scoped>
.base-input {
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem; /* text-sm */
  font-family: inherit;
  color: #E2DACB;
  background-color: transparent;
  border: 1px solid #2E2A20;
  border-radius: 8px; /* rounded-lg */
  transition: all 0.2s ease;
  outline: none;
}

.base-input::placeholder {
  color: #7A7261;
}

.base-input:focus {
  border-color: #D4AF37;
  background-color: transparent;
}

.base-input:disabled {
  background-color: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
