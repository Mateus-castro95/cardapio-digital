<template>
  <div class="w-full overflow-hidden">
    <table class="w-full text-left border-collapse block md:table">
      <thead class="hidden md:table-header-group">
        <tr class="border-b border-[#2A261D] bg-[#111114]">
          <th v-for="col in colunas" :key="col.key" class="py-3 px-4 text-xs font-black text-cafe uppercase tracking-wider">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="block md:table-row-group">
        <tr v-for="(item, index) in data" :key="index" class="relative border-b border-[#221F18] hover:bg-white/[0.03] transition-colors flex flex-row flex-wrap md:table-row py-3 md:py-0 min-h-[100px] md:min-h-0">
          <td v-for="(col, colIndex) in colunas" :key="col.key" class="py-1 md:py-4 px-4 text-sm text-[#E2DACB] block md:table-cell md:w-auto" 
            :class="
              col.key === 'nome' ? 'w-[75%] md:w-auto md:pr-4 min-h-[72px] md:min-h-0' : 
              (col.key === 'ativo' ? 'absolute top-3 right-4 md:static' : 
              (col.key === 'acoes' ? 'absolute top-[46px] right-2 md:static' : 'flex-1 md:flex-none md:w-auto'))
            ">
            <div class="flex flex-col md:block h-full justify-start">
              <div class="flex items-center mt-1 md:mt-0" :class="{'justify-end': col.key === 'ativo' || col.key === 'acoes'}">
                <slot :name="col.key" :item="item">
                  <span>{{ item[col.key] }}</span>
                </slot>
              </div>
            </div>
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
