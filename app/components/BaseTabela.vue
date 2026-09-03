<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-[#2A261D] bg-[#111114]">
          <th v-for="col in colunas" :key="col.key" class="py-3 px-4 text-xs font-black text-cafe uppercase tracking-wider">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index" class="border-b border-[#221F18] hover:bg-white/[0.03] transition-colors">
          <td v-for="col in colunas" :key="col.key" class="py-4 px-4 text-sm text-[#E2DACB]">
            <slot :name="col.key" :item="item">
              {{ item[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
/**
 * Componente BaseTabela - Tabela genérica para exibição de dados
 * 
 * Props:
 * - colunas: Array de objetos com { key, label }
 * - data: Array de objetos com os dados
 */
interface Coluna {
  key: string;
  label: string;
}

interface Props {
  colunas: Coluna[];
  data: any[];
}

defineProps<Props>();
</script>

<style scoped>
/* Estilos específicos da tabela se necessário */
</style>
