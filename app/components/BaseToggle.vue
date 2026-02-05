<template>
  <label class="base-toggle">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="slider"></span>
  </label>
</template>

<script setup lang="ts">
/**
 * Componente BaseToggle - Switch de ligar/desligar
 * 
 * Props:
 * - modelValue: Estado do toggle (v-model)
 * - disabled: Desabilita a interação
 */
interface Props {
  modelValue: boolean;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<style scoped>
.base-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.base-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

input:checked + .slider {
  background-color: #f59e0b;
}

input:focus + .slider {
  box-shadow: 0 0 1px #f59e0b;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
