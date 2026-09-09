<template>
  <div class="p-4 sm:p-8 max-w-7xl mx-auto space-y-12">
    <!-- Cabeçalho Principal -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-bege-soft pb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
        </div>
        <h1 class="text-2xl sm:text-heading-1 text-cafe font-black">
          Gestão do <span class="text-moca">Cardápio</span>
        </h1>
        <p class="text-sm sm:text-body text-bege-torrado">
          Gerencie as categorias e os produtos do restaurante em um único lugar
        </p>
      </div>

      <div class="flex flex-wrap gap-2 w-full sm:w-auto">
        <button 
          @click="handleOpenAddCategory"
          class="flex-1 sm:flex-none px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-cafe text-cafe hover:bg-bege-cream transition-all font-black text-[10px] sm:text-xs uppercase tracking-wider text-center"
        >
          <span class="hidden sm:inline">+ </span>Nova Categoria
        </button>
        <button 
          @click="handleOpenAddItem()"
          class="flex-1 sm:flex-none px-2 sm:px-5 py-2 sm:py-2.5 bg-cafe text-[#0A0A0C] hover:bg-cafe-dark transition-all font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 flex items-center justify-center gap-1 sm:gap-2 text-center leading-tight"
        >
          <PlusIcon class="w-4 h-4 hidden sm:block" />
          <span>Novo Prato / Bebida</span>
        </button>
      </div>
    </div>

    <!-- Filtros Globais -->
    <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="flex-1 w-full relative">
        <input 
          v-model="filtroBusca"
          type="text" 
          placeholder="Buscar produto ou categoria..."
          class="w-full px-4 py-2.5 text-sm rounded-xl border border-moca/30 focus:border-moca outline-none bg-transparent text-moca placeholder-moca/50"
        />
      </div>
      <select 
        v-model="filtroCategoria"
        class="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl border border-moca/30 focus:border-moca outline-none bg-transparent font-bold text-moca"
      >
        <option class="bg-zinc-900 text-moca" value="todas">Todas as categorias</option>
        <option class="bg-zinc-900 text-moca" v-for="cat in categorias" :key="cat.id" :value="cat.id">
          {{ cat.nome }}
        </option>
      </select>
    </div>

    <!-- LISTA DE CATEGORIAS (ACORDEÃO) -->
    <section class="space-y-4">
      <div 
        v-for="categoria in categoriasFiltradas" 
        :key="categoria.id" 
        class="bg-[#141417] rounded-xl shadow-sm border border-[#2E2A20] overflow-hidden transition-all"
      >
        <!-- Cabeçalho do Acordeão -->
        <div class="flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 transition-colors">
          <div 
            class="flex-1 flex items-center gap-4 cursor-pointer"
            @click="toggleCategory(categoria.id)"
          >
            <div class="p-2 bg-[#18181C] rounded-lg text-[#D4AF37] shrink-0 border border-[#2E2A20]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': expandedCategories.includes(categoria.id) }">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-base text-[#E2DACB] capitalize">{{ categoria.nome }}</h3>
              <p class="text-xs text-[#9C907A] font-medium mt-0.5">
                {{ contarItensPorCategoria(categoria.id) }} itens cadastrados
              </p>
            </div>
          </div>

          <!-- Ações da Categoria -->
          <div class="flex items-center gap-1.5 sm:gap-2">
            <button 
              @click.stop="handleOpenAddItem(categoria.id)"
              class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] text-black hover:bg-[#b5952f] rounded-lg text-xs font-medium transition-all shadow-sm shrink-0"
              title="Cadastrar novo item nesta categoria"
            >
              <PlusIcon class="w-3.5 h-3.5" /> Add Item
            </button>
            <button 
              @click.stop="handleOpenAddItem(categoria.id)"
              class="sm:hidden p-1.5 bg-[#D4AF37] text-black hover:bg-[#b5952f] rounded-lg transition-all shadow-sm shrink-0"
            >
              <PlusIcon class="w-3.5 h-3.5" />
            </button>
            <div class="w-px h-6 bg-[#2E2A20] mx-1 hidden sm:block"></div>
            <button 
              @click.stop="handleOpenEditCategory(categoria)" 
              class="p-2 text-[#9C907A] hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-colors shrink-0"
              title="Editar categoria"
            >
              <PencilSquareIcon class="h-4 w-4" />
            </button>
            <button 
              @click.stop="confirmDelete(categoria, 'categoria')" 
              class="p-2 text-[#9C907A] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
              title="Excluir categoria"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Corpo do Acordeão (Tabelas) -->
        <div v-show="expandedCategories.includes(categoria.id)" class="border-t border-bege-soft bg-branco">
          <!-- Tabela de Bebidas -->
          <div v-if="isBebidaCategory(categoria.id)">
            <div>
              <BaseTabela :colunas="colsBebidas" :data="getBebidasByCat(categoria.id)" class="w-full border-0">
                <template #nome="{ item }">
                  <div class="py-2.5 max-w-sm">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-black text-cafe-dark text-sm block">
                        {{ item.sabor || item.produto?.nome || 'Bebida' }}
                      </span>
                      <span class="md:hidden text-[9px] bg-bege-cream text-cafe-dark px-1.5 py-0.5 rounded font-black uppercase border border-bege-soft/60 whitespace-nowrap">
                        {{ formatTipoBebida(item.tipo_bebida) }}
                      </span>
                    </div>
                    <p v-if="item.produto?.nome && item.sabor && item.produto?.nome !== item.sabor" class="text-[11px] text-bege-torrado font-medium mt-0.5">
                      {{ item.produto.nome }}
                    </p>
                  </div>
                </template>

                <template #tipo_bebida="{ item }">
                  <span class="hidden md:inline-block text-[9px] bg-bege-cream text-cafe-dark px-2.5 py-1 rounded-lg font-black uppercase border border-bege-soft/60 whitespace-nowrap">
                    {{ formatTipoBebida(item.tipo_bebida) }}
                  </span>
                  <span class="md:hidden font-black text-cafe text-sm tabular-nums whitespace-nowrap">
                    {{ formatCurrency(item.preco) }}
                  </span>
                </template>

                <template #detalhes="{ item }">
                  <span class="text-xs text-bege-torrado font-medium">
                    {{ formatDetalhesBebida(item) }}
                  </span>
                </template>

                <template #preco="{ item }">
                  <span class="hidden md:inline-block font-black text-cafe text-sm tabular-nums whitespace-nowrap">
                    {{ formatCurrency(item.preco) }}
                  </span>
                </template>

                <template #ativo="{ item }">
                  <BaseToggle v-model="item.ativo" @update:model-value="handleToggleAtivoBebida(item)" />
                </template>

                <template #acoes="{ item }">
                  <div class="flex gap-1">
                    <button 
                      class="p-2 text-bege-torrado hover:text-cafe hover:bg-bege-cream rounded-xl transition-colors" 
                      @click="handleOpenEditItem(item, true)"
                      title="Editar bebida"
                    >
                      <PencilSquareIcon class="h-5 w-5" />
                    </button>
                    <button 
                      class="p-2 text-bege-torrado hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" 
                      @click="confirmDelete(item, 'bebida')"
                      title="Excluir bebida"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </template>
              </BaseTabela>
              <div v-if="getBebidasByCat(categoria.id).length === 0" class="p-8 text-center text-gray-400 text-sm italic">
                Nenhuma bebida cadastrada nesta categoria.
              </div>
            </div>
          </div>
          
          <!-- Tabela de Pratos -->
          <div v-else>
            <div>
              <BaseTabela :colunas="colsPratos" :data="getPratosByCat(categoria.id)" class="w-full border-0">
                <template #nome="{ item }">
                  <div class="py-2.5 max-w-sm">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-black text-cafe-dark text-sm">{{ item.nome }}</span>
                      <span 
                        v-if="item.destaque" 
                        class="text-[8px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-black uppercase tracking-wider shrink-0"
                      >
                        Especial
                      </span>
                      <span 
                        v-if="item.permite_ponto_carne" 
                        class="text-[8px] bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded font-black uppercase tracking-wider shrink-0"
                      >
                        Ponto Ativo
                      </span>
                    </div>
                    <p v-if="item.descricao" class="text-[11px] text-bege-torrado font-medium line-clamp-2 mt-0.5 leading-relaxed">
                      {{ item.descricao }}
                    </p>
                  </div>
                </template>



                <template #preco="{ item }">
                  <span class="font-black text-cafe text-sm tabular-nums whitespace-nowrap">
                    {{ formatCurrency(item.preco) }}
                  </span>
                </template>

                <template #ativo="{ item }">
                  <BaseToggle v-model="item.ativo" @update:model-value="handleToggleAtivoPrato(item)" />
                </template>

                <template #acoes="{ item }">
                  <div class="flex gap-1">
                    <button 
                      class="p-2 text-bege-torrado hover:text-cafe hover:bg-bege-cream rounded-xl transition-colors" 
                      @click="handleOpenEditItem(item, false)"
                      title="Editar prato"
                    >
                      <PencilSquareIcon class="h-5 w-5" />
                    </button>
                    <button 
                      class="p-2 text-bege-torrado hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" 
                      @click="confirmDelete(item, 'prato')"
                      title="Excluir prato"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </template>
              </BaseTabela>
              <div v-if="getPratosByCat(categoria.id).length === 0" class="p-8 text-center text-gray-400 text-sm italic">
                Nenhum prato cadastrado nesta categoria.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="categoriasFiltradas.length === 0" class="p-12 text-center text-bege-torrado text-sm font-bold bg-branco rounded-2xl border border-bege-soft">
        Nenhuma categoria ou produto encontrado.
      </div>
    </section>

    <!-- MODAL CATEGORIA -->
    <BaseModal 
      :show="showCategoryModal" 
      :title="editingItemType === 'categoria' ? 'Editar Categoria' : 'Nova Categoria'" 
      @close="showCategoryModal = false"
    >
      <div class="py-2">
        <BaseInput 
          v-model="categoryForm.nome" 
          label="Nome da Categoria" 
          placeholder="Ex: Carnes Nobres, Massas, Sobremesas..." 
          required 
        />
      </div>
      <template #footer>
        <BaseButton variant="outline" @click="showCategoryModal = false">Cancelar</BaseButton>
        <BaseButton variant="primary" :loading="isSaving" @click="handleSaveCategory">Confirmar</BaseButton>
      </template>
    </BaseModal>

    <!-- MODAL PRATO OU BEBIDA -->
    <BaseModal 
      :show="showItemModal" 
      :title="editingItem ? 'Editar Item' : 'Novo Item no Cardápio'" 
      @close="showItemModal = false" 
      size="lg"
    >
      <div class="py-2 space-y-4">
        <!-- Campos Base -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-[#D4AF37] mb-1.5">Categoria *</label>
            <select 
              v-model="itemForm.categoria_id" 
              class="w-full px-3 py-1.5 text-sm bg-transparent border border-[#2E2A20] rounded-lg text-[#E2DACB] focus:border-[#D4AF37] outline-none"
              :disabled="!!editingItem"
            >
              <option class="bg-zinc-900 text-moca" value="" disabled>Selecione uma categoria</option>
              <option class="bg-zinc-900 text-moca" v-for="cat in categorias" :key="cat.id" :value="cat.id">
                {{ cat.nome }}
              </option>
            </select>
          </div>

          <div v-if="!isBebidaCategory(itemForm.categoria_id)">
            <label class="block text-sm font-bold text-[#D4AF37] mb-1.5">Preço (R$) *</label>
            <BaseInputCurrency 
              v-model="itemForm.preco" 
              placeholder="0,00"
            />
          </div>
        </div>

        <!-- Se for Bebida, mostra campos específicos de bebida -->
        <template v-if="isBebidaCategory(itemForm.categoria_id)">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseInput 
              v-model="itemForm.nome" 
              label="Nome ou Sabor da Bebida" 
              placeholder="Ex: Coca-Cola, Suco de Laranja..." 
              required 
            />
            <div>
              <label class="block text-sm font-bold text-[#D4AF37] mb-1.5">Tipo de Bebida</label>
              <select 
                v-model="itemForm.tipo_bebida" 
                class="w-full px-3 py-1.5 text-sm bg-transparent border border-[#2E2A20] rounded-lg text-[#E2DACB] focus:border-[#D4AF37] outline-none"
              >
                <option class="bg-zinc-900 text-moca" value="suco">Suco Natural</option>
                <option class="bg-zinc-900 text-moca" value="refrigerante">Refrigerante</option>
                <option class="bg-zinc-900 text-moca" value="agua">Água Mineral</option>
                <option class="bg-zinc-900 text-moca" value="cerveja">Cerveja</option>
                <option class="bg-zinc-900 text-moca" value="vinho">Vinho / Espumante</option>
                <option class="bg-zinc-900 text-moca" value="drink">Drink</option>
                <option class="bg-zinc-900 text-moca" value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div class="space-y-3 mt-4">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-bold text-[#D4AF37]">Tamanhos e Variações</h4>
              <button 
                v-if="!editingItem"
                type="button"
                @click="itemForm.variacoesBebida.push({preco: 0, tamanho: '', volume_ml: '', tipo_preparo: '', tipo_gas: ''})"
                class="flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:text-[#b5952f] transition-colors bg-[#2E2A20]/40 px-2 py-1 rounded"
              >
                <PlusIcon class="w-4 h-4" /> Adicionar
              </button>
            </div>
            
            <div 
              v-for="(v, index) in itemForm.variacoesBebida" 
              :key="index"
              class="relative p-3 sm:p-4 border border-[#2E2A20] bg-[#18181C] rounded-xl"
            >
              <button 
                v-if="!editingItem && index > 0"
                type="button"
                @click="itemForm.variacoesBebida.splice(index, 1)"
                class="absolute -top-2 -right-2 p-1 bg-red-900/90 hover:bg-red-900 text-red-100 hover:text-white rounded-full transition-colors border border-red-800 shadow-md"
                title="Remover variação"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label class="block text-[10px] font-bold text-[#9C907A] mb-1 uppercase tracking-wider">Preço (R$) *</label>
                  <BaseInputCurrency v-model="v.preco" placeholder="0,00" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#9C907A] mb-1 uppercase tracking-wider">Tamanho</label>
                  <BaseInput v-model="v.tamanho" placeholder="Ex: Lata, 2L..." />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#9C907A] mb-1 uppercase tracking-wider">Volume (ml)</label>
                  <input 
                    type="number"
                    v-model="v.volume_ml" 
                    placeholder="Ex: 350" 
                    class="w-full px-3 py-1.5 text-sm bg-transparent border border-[#2E2A20] rounded-lg text-[#E2DACB] focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#9C907A] mb-1 uppercase tracking-wider">Adicionais</label>
                  <select 
                    v-model="v.tipo_preparo" 
                    class="w-full px-3 py-1.5 text-sm bg-transparent border border-[#2E2A20] rounded-lg text-[#E2DACB] focus:border-[#D4AF37] outline-none"
                  >
                    <option class="bg-zinc-900 text-moca" value="">Padrão</option>
                    <option class="bg-zinc-900 text-moca" value="agua">Com Água</option>
                    <option class="bg-zinc-900 text-moca" value="leite">Com Leite</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Senão, mostra campos de Prato -->
        <template v-else>
          <BaseInput 
            v-model="itemForm.nome" 
            label="Nome do Prato" 
            placeholder="Ex: Mignon Gratinado, Salmão ao Molho de Maracujá" 
            required 
          />

          <div>
            <label class="block text-sm font-bold text-[#D4AF37] mb-1.5">Descrição do Prato</label>
            <textarea 
              v-model="itemForm.descricao" 
              rows="3" 
              placeholder="Cortes nobres, modo de preparo, guarnições e acompanhamentos..."
              class="w-full px-3 py-1.5 text-sm bg-transparent border border-[#2E2A20] rounded-lg text-[#E2DACB] focus:border-[#D4AF37] outline-none placeholder:text-[#7A7261]"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-transparent rounded-xl border border-[#2E2A20]">
            <label class="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="itemForm.permite_ponto_carne" 
                class="w-5 h-5 text-cafe rounded border-gray-600 bg-transparent focus:ring-cafe" 
              />
              <div>
                <span class="text-sm font-bold text-[#D4AF37] block">Permite Ponto da Carne</span>
                <span class="text-xs text-[#9C907A] block">Exibe opções de corte (mal passado, ao ponto, etc.)</span>
              </div>
            </label>

            <label class="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="itemForm.destaque" 
                class="w-5 h-5 text-cafe rounded border-gray-600 bg-transparent focus:ring-cafe" 
              />
              <div>
                <span class="text-sm font-bold text-[#D4AF37] block">Especialidade da Casa</span>
                <span class="text-xs text-[#9C907A] block">Exibe selo de destaque no cardápio</span>
              </div>
            </label>
          </div>
        </template>
      </div>
      <template #footer>
        <BaseButton variant="outline" @click="showItemModal = false">Cancelar</BaseButton>
        <BaseButton variant="primary" :loading="isSaving" @click="handleSaveItem">
          {{ editingItem ? 'Salvar Item' : 'Cadastrar Item' }}
        </BaseButton>
      </template>
    </BaseModal>

    <!-- MODAL CONFIRMAÇÃO EXCLUSÃO -->
    <ModalConfirmacao 
      :show="showConfirmDeleteModal" 
      title="Confirmar Exclusão" 
      :message="`Tem certeza que deseja excluir '${itemToDelete?.nome || 'este item'}'? Esta ação não pode ser desfeita.`"
      :loading="isDeleting"
      @confirm="handleDelete"
      @cancel="showConfirmDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useToast } from '~/composables/useToast';
import { useCategorias } from '~/composables/useCategorias';
import { useCardapioItens, type ItemCardapio } from '~/composables/useCardapioItens';
import { useVariacoes } from '~/composables/useVariacoes';
import { useSupabaseClient } from '#imports';
import { PencilSquareIcon, TrashIcon, PlusIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const toast = useToast();
const { categorias, fetchCategorias, addCategoria, updateCategoria, removeCategoria } = useCategorias();
const { 
  itens: pratosAdega, 
  fetchTodosItensAdmin, 
  addItem: addPrato, 
  updateItem: updatePrato, 
  removeItem: removePrato, 
  toggleAtivo: toggleAtivoPrato 
} = useCardapioItens();

const { 
  variacoes: bebidas, 
  fetchVariacoesBebidas,
  addNovaVariacao,
  updateVariacaoCompleta,
  removeVariacao
} = useVariacoes();

// Formatação Monetária
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Acordeão de Categorias
const expandedCategories = ref<string[]>([]);
const toggleCategory = (id: string) => {
  const index = expandedCategories.value.indexOf(id);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(id);
  }
};

const getCategoryName = (id: string) => {
  return categorias.value.find(c => c.id === id)?.nome || '';
};

const isBebidaCategory = (id: string) => {
  const name = getCategoryName(id).toLowerCase();
  return name.includes('bebida') || name.includes('suco') || name.includes('refrigerante') || name.includes('água');
};

const getPratosByCat = (catId: string) => pratosAdega.value.filter(p => p.categoria_id === catId);
const getBebidasByCat = (catId: string) => bebidas.value.filter(b => b.produto?.categoria_id === catId);

const contarItensPorCategoria = (categoriaId: string) => {
  return getPratosByCat(categoriaId).length + getBebidasByCat(categoriaId).length;
};

// Colunas das Tabelas
const colsPratos = [
  { key: 'nome', label: 'Prato' },
  { key: 'preco', label: 'Preço' },
  { key: 'ativo', label: 'Ativo' },
  { key: 'acoes', label: 'Ações' }
];

const colsBebidas = [
  { key: 'nome', label: 'Bebida' },
  { key: 'tipo_bebida', label: 'Tipo' },
  { key: 'detalhes', label: 'Especificações' },
  { key: 'preco', label: 'Preço' },
  { key: 'ativo', label: 'Ativo' },
  { key: 'acoes', label: 'Ações' }
];

// Filtros Globais
const filtroBusca = ref('');
const filtroCategoria = ref('todas');

const categoriasFiltradas = computed(() => {
  let cats = categorias.value;
  if (filtroCategoria.value !== 'todas') {
    cats = cats.filter(c => c.id === filtroCategoria.value);
  }
  if (filtroBusca.value.trim()) {
    const search = filtroBusca.value.toLowerCase().trim();
    cats = cats.filter(c => {
      if (c.nome.toLowerCase().includes(search)) return true;
      const pratos = getPratosByCat(c.id);
      if (pratos.some(p => p.nome.toLowerCase().includes(search))) return true;
      const bebs = getBebidasByCat(c.id);
      if (bebs.some(b => (b.sabor || b.produto?.nome || '').toLowerCase().includes(search))) return true;
      return false;
    });
  }
  return cats;
});

// Formatação Bebidas
const formatTipoBebida = (tipo: string) => {
  if (tipo === 'suco') return 'Suco Natural';
  if (tipo === 'refrigerante') return 'Refrigerante';
  if (tipo === 'agua') return 'Água Mineral';
  if (tipo === 'cerveja') return 'Cerveja';
  if (tipo === 'vinho') return 'Vinho / Espumante';
  if (tipo === 'drink') return 'Drink';
  return tipo || 'Bebida';
};

const formatDetalhesBebida = (b: any) => {
  const parts: string[] = [];
  if (b.volume_ml && b.volume_ml > 0) parts.push(`${b.volume_ml}ml`);
  if (b.tamanho && !['Padrão', 'Unico', 'Único'].includes(b.tamanho)) parts.push(b.tamanho);
  if (b.tipo_preparo) parts.push(b.tipo_preparo === 'agua' ? 'Com Água' : 'Com Leite');
  if (b.tipo_gas) parts.push(b.tipo_gas === 'com_gas' ? 'Com Gás' : 'Sem Gás');
  return parts.join(' • ') || '-';
};

const handleToggleAtivoBebida = async (item: any) => {
  try {
    const supabase = useSupabaseClient<any>();
    const { error } = await supabase
      .from('produtos_simples')
      .update({ ativo: item.ativo })
      .eq('id', item.id);
    if (error) throw error;
    toast.success('Status atualizado', `Bebida ${item.ativo ? 'ativada' : 'desativada'}`);
  } catch (e: any) {
    toast.error('Erro', 'Não foi possível alterar o status');
  }
};

const handleToggleAtivoPrato = async (item: any) => {
  try {
    await toggleAtivoPrato(item.id, item.ativo);
    toast.success('Status atualizado', `Prato ${item.ativo ? 'ativado' : 'desativado'}`);
  } catch (e: any) {
    toast.error('Erro', 'Não foi possível alterar o status do prato');
  }
};

// Modais
const showCategoryModal = ref(false);
const showItemModal = ref(false);
const showConfirmDeleteModal = ref(false);

const isSaving = ref(false);
const isDeleting = ref(false);

const editingItem = ref<any>(null);
const editingItemType = ref<'categoria' | 'prato' | 'bebida' | null>(null);
const itemToDelete = ref<{ id: string, nome: string, type: 'categoria' | 'prato' | 'bebida', produto_id?: string } | null>(null);

// Formulários
const categoryForm = reactive({ nome: '' });
const itemForm = reactive({
  nome: '',
  categoria_id: '',
  preco: 0,
  ativo: true,
  // Campos Prato
  descricao: '',
  destaque: false,
  permite_ponto_carne: false,
  // Campos Bebida
  tipo_bebida: 'refrigerante',
  variacoesBebida: [
    { preco: 0, tamanho: '', volume_ml: '', tipo_preparo: '', tipo_gas: '' }
  ]
});

onMounted(async () => {
  try {
    await Promise.all([
      fetchCategorias(),
      fetchTodosItensAdmin(),
      fetchVariacoesBebidas()
    ]);
  } catch (error) {
    toast.error('Erro de Carregamento', 'Não foi possível carregar os dados.');
  }
});

// Ações Categorias
const handleOpenAddCategory = () => {
  editingItem.value = null;
  editingItemType.value = 'categoria';
  categoryForm.nome = '';
  showCategoryModal.value = true;
};

const handleOpenEditCategory = (item: any) => {
  editingItem.value = item;
  editingItemType.value = 'categoria';
  categoryForm.nome = item.nome;
  showCategoryModal.value = true;
};

// Ações Itens
const handleOpenAddItem = (catId?: string) => {
  editingItem.value = null;
  editingItemType.value = null;
  itemForm.nome = '';
  itemForm.categoria_id = catId || '';
  itemForm.preco = 0;
  itemForm.descricao = '';
  itemForm.destaque = false;
  itemForm.permite_ponto_carne = false;
  itemForm.tipo_bebida = 'refrigerante';
  itemForm.variacoesBebida = [{ preco: 0, tamanho: '', volume_ml: '', tipo_preparo: '', tipo_gas: '' }];
  itemForm.ativo = true;

  if (catId && !expandedCategories.value.includes(catId)) {
    expandedCategories.value.push(catId);
  }
  
  showItemModal.value = true;
};

const handleOpenEditItem = (item: any, isBebida: boolean) => {
  editingItem.value = item;
  editingItemType.value = isBebida ? 'bebida' : 'prato';
  
  itemForm.categoria_id = isBebida ? item.produto?.categoria_id : item.categoria_id;
  itemForm.preco = item.preco;
  itemForm.ativo = item.ativo !== undefined ? item.ativo : true;

  if (isBebida) {
    itemForm.nome = item.sabor || item.produto?.nome || '';
    itemForm.tipo_bebida = item.tipo_bebida || 'refrigerante';
    itemForm.variacoesBebida = [{
      preco: item.preco || 0,
      tamanho: item.tamanho || '',
      volume_ml: item.volume_ml || '',
      tipo_preparo: item.tipo_preparo || '',
      tipo_gas: item.tipo_gas || ''
    }];
  } else {
    itemForm.nome = item.nome;
    itemForm.descricao = item.descricao || '';
    itemForm.destaque = !!item.destaque;
    itemForm.permite_ponto_carne = !!item.permite_ponto_carne;
  }
  showItemModal.value = true;
};

// Salvamento
const handleSaveCategory = async () => {
  if (!categoryForm.nome.trim()) return toast.error('Aviso', 'Nome da categoria é obrigatório');
  isSaving.value = true;
  try {
    if (editingItem.value && editingItemType.value === 'categoria') {
      await updateCategoria(editingItem.value.id, categoryForm.nome);
      toast.success('Sucesso', 'Categoria atualizada com sucesso');
    } else {
      await addCategoria(categoryForm.nome);
      toast.success('Sucesso', 'Categoria criada com sucesso');
    }
    showCategoryModal.value = false;
  } catch (e: any) {
    toast.error('Erro ao salvar categoria', e.message);
  } finally {
    isSaving.value = false;
  }
};

const handleSaveItem = async () => {
  if (!itemForm.nome.trim()) return toast.warning('Aviso', 'Informe o nome do item');
  if (!itemForm.categoria_id) return toast.warning('Aviso', 'Selecione uma categoria');
  
  const isBebida = isBebidaCategory(itemForm.categoria_id);
  
  if (!isBebida && (!itemForm.preco || itemForm.preco <= 0)) {
    return toast.warning('Aviso', 'Informe o valor do item');
  }
  
  if (isBebida && itemForm.variacoesBebida.some(v => !v.preco || v.preco <= 0)) {
    return toast.warning('Aviso', 'Informe o valor para todos os tamanhos/variações');
  }

  isSaving.value = true;

  try {
    if (isBebida) {
      if (editingItem.value && editingItemType.value === 'bebida') {
        const v = itemForm.variacoesBebida[0]!;
        const detalhes = {
          sabor: itemForm.nome,
          preco: v.preco,
          tipo_bebida: itemForm.tipo_bebida as any,
          tamanho: v.tamanho || null,
          volume_ml: v.volume_ml ? parseInt(String(v.volume_ml)) : null,
          tipo_preparo: v.tipo_preparo || null,
          tipo_gas: v.tipo_gas || null,
          ativo: itemForm.ativo
        };
        await updateVariacaoCompleta(
          editingItem.value.id,
          editingItem.value.produto_id,
          editingItem.value.produto?.nome || itemForm.nome,
          detalhes as any
        );
        toast.success('Sucesso', 'Bebida atualizada');
      } else {
        for (const v of itemForm.variacoesBebida) {
          const detalhes = {
            sabor: itemForm.nome,
            preco: v.preco,
            tipo_bebida: itemForm.tipo_bebida as any,
            tamanho: v.tamanho || null,
            volume_ml: v.volume_ml ? parseInt(String(v.volume_ml)) : null,
            tipo_preparo: v.tipo_preparo || null,
            tipo_gas: v.tipo_gas || null,
            ativo: itemForm.ativo
          };
          await addNovaVariacao(itemForm.nome, itemForm.categoria_id, detalhes as any);
        }
        toast.success('Sucesso', 'Bebida(s) cadastrada(s)');
      }
    } else {
      const payload = {
        nome: itemForm.nome,
        categoria_id: itemForm.categoria_id,
        descricao: itemForm.descricao,
        preco: itemForm.preco,
        destaque: itemForm.destaque,
        permite_ponto_carne: itemForm.permite_ponto_carne,
        ativo: itemForm.ativo
      };
      
      if (editingItem.value && editingItemType.value === 'prato') {
        await updatePrato(editingItem.value.id, payload);
        toast.success('Sucesso', 'Prato atualizado');
      } else {
        await addPrato(payload);
        toast.success('Sucesso', 'Prato cadastrado');
      }
    }
    showItemModal.value = false;
  } catch (e: any) {
    toast.error('Erro ao salvar', e.message);
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (item: any, type: 'categoria' | 'prato' | 'bebida') => {
  itemToDelete.value = {
    id: item.id,
    nome: item.nome || item.sabor || 'item',
    type,
    produto_id: type === 'bebida' ? item.produto_id : undefined
  };
  showConfirmDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!itemToDelete.value) return;
  
  isDeleting.value = true;
  try {
    const { type, id, produto_id } = itemToDelete.value;
    
    if (type === 'categoria') {
      await removeCategoria(id);
      toast.success('Excluído', 'Categoria removida com sucesso');
    } else if (type === 'bebida') {
      await removeVariacao(id, produto_id!);
      toast.success('Excluído', 'Bebida removida com sucesso');
    } else {
      await removePrato(id);
      toast.success('Excluído', 'Prato removido com sucesso');
    }
    showConfirmDeleteModal.value = false;
  } catch (e: any) {
    if (e.message?.includes('23503') || e.code === '23503') {
      toast.error('Ação Negada', 'Não é possível excluir esta categoria pois ela possui itens vinculados.');
    } else {
      toast.error('Erro ao excluir', 'Tente novamente.');
    }
  } finally {
    isDeleting.value = false;
    itemToDelete.value = null;
  }
};
</script>

<style scoped>
/* Transições suaves */
</style>
