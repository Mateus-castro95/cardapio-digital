<template>
  <span :class="['base-badge', variant]">
    <slot />
  </span>
</template>

<script setup lang="ts">
/**
 * Componente BaseBadge - Pequeno rótulo informativo
 * 
 * Props:
 * - variant: Estilo visual (default, primary, success, warning, danger, info)
 */
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
});
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.default {
  background-color: #f1f5f9;
  color: #475569;
}

.primary {
  background-color: #fef3c7;
  color: #92400e;
}

.success {
  background-color: #dcfce7;
  color: #166534;
}

.warning {
  background-color: #ffedd5;
  color: #9a3412;
}

.danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.info {
  background-color: #e0f2fe;
  color: #075985;
}
</style>
