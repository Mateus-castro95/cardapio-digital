<template>
  <input
    :value="displayValue"
    @input="handleInput"
    @focus="isFocused = true"
    @blur="handleBlur"
    type="text"
    inputmode="decimal"
    :placeholder="placeholder"
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

// Converte número para string com vírgula para exibição
const formatForDisplay = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '';
  return numValue.toFixed(2).replace('.', ',');
};

// Inicializa o valor de exibição
displayValue.value = formatForDisplay(props.modelValue);

const isFocused = ref(false);

// Atualiza quando o modelValue mudar externamente
watch(() => props.modelValue, (newValue) => {
  // Só atualiza se o input não estiver focado
  if (!isFocused.value) {
    displayValue.value = formatForDisplay(newValue);
  }
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  
  // Permite apenas números, vírgula e ponto
  value = value.replace(/[^\d,]/g, '');
  
  // Garante apenas uma vírgula
  const parts = value.split(',');
  if (parts.length > 2) {
    value = parts[0] + ',' + parts.slice(1).join('');
  }
  
  // Limita casas decimais a 2
  if (parts.length === 2 && parts[1] && parts[1].length > 2) {
    value = parts[0] + ',' + parts[1].substring(0, 2);
  }
  
  displayValue.value = value;
  
  // Converte para número (substitui vírgula por ponto)
  const numericValue = value.replace(',', '.');
  const parsedValue = parseFloat(numericValue);
  
  emit('update:modelValue', isNaN(parsedValue) ? null : parsedValue);
};

const handleBlur = () => {
  isFocused.value = false;
  // Formata o valor ao perder o foco
  displayValue.value = formatForDisplay(props.modelValue);
};
</script>
