<template>
  <div class="p-4 sm:p-8 max-w-7xl mx-auto space-y-12">
    <!-- Cabeçalho Principal -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-bege-soft pb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xl">🍷</span>
          <span class="text-[10px] font-black uppercase tracking-widest text-bege-torrado bg-bege-cream px-2 py-0.5 rounded-md border border-bege-soft/60">
            Adega Canoinhas
          </span>
        </div>
        <h1 class="text-2xl sm:text-heading-1 text-cafe font-black">
          Gestão do <span class="text-moca">Cardápio</span>
        </h1>
        <p class="text-sm sm:text-body text-bege-torrado">
          Gerencie as categorias e os pratos do restaurante em um único lugar
        </p>
      </div>

      <div class="flex flex-wrap gap-2 w-full sm:w-auto">
        <button 
          @click="handleOpenAddCategory"
          class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-cafe text-cafe hover:bg-bege-cream transition-all font-black text-xs uppercase tracking-wider"
        >
          + Nova Categoria
        </button>
        <button 
          @click="handleOpenAddPrato"
          class="flex-1 sm:flex-none px-5 py-2.5 bg-cafe text-branco hover:bg-cafe-dark transition-all font-black text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <PlusIcon class="w-4 h-4" />
          <span>Cadastrar Prato</span>
        </button>
      </div>
    </div>

    <!-- SEÇÃO 1: CATEGORIAS DO RESTAURANTE -->
    <section class="space-y-4">
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-lg sm:text-xl font-black text-cafe-dark flex items-center gap-2">
            Categorias do Cardápio
            <span class="text-[9px] bg-bege-cream text-cafe-dark px-2 py-0.5 rounded-full font-black uppercase">
              {{ categorias.length }}
            </span>
          </h2>
          <p class="text-xs text-bege-torrado">Divisões gastronômicas do menu</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <div 
          v-for="categoria in categorias" 
          :key="categoria.id" 
          class="bg-branco rounded-2xl p-4 shadow-sm border border-bege-soft hover:shadow-md hover:border-moca/30 transition-all flex justify-between items-center group"
        >
          <div class="min-w-0 pr-2">
            <span class="font-black text-sm text-cafe-dark capitalize truncate block">
              {{ categoria.nome }}
            </span>
            <span class="text-[10px] text-bege-torrado font-bold">
              {{ contarPratosPorCategoria(categoria.id) }} pratos
            </span>
          </div>
          <div class="flex gap-1 shrink-0">
            <button 
              @click="handleOpenEditCategory(categoria)" 
              class="p-1.5 text-bege-torrado hover:text-cafe hover:bg-bege-cream rounded-lg transition-colors"
              title="Editar categoria"
            >
              <PencilSquareIcon class="h-4 w-4" />
            </button>
            <button 
              @click="confirmDelete(categoria, 'categoria')" 
              class="p-1.5 text-bege-torrado hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir categoria"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- SEÇÃO 2: PRATOS DA ADEGA CANOINHAS -->
    <section class="space-y-4 pt-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 class="text-lg sm:text-xl font-black text-cafe-dark flex items-center gap-2">
            Pratos e Especialidades
            <span class="text-[9px] bg-bege-cream text-cafe-dark px-2 py-0.5 rounded-full font-black uppercase">
              {{ pratosAdega.length }} cadastrados
            </span>
          </h2>
          <p class="text-xs text-bege-torrado">Edite valores, descrições, pontos de carne e disponibilidade</p>
        </div>

        <!-- Filtros e Busca Rápida -->
        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input 
            v-model="filtroBusca"
            type="text" 
            placeholder="Buscar por nome..."
            class="px-3.5 py-2 text-xs rounded-xl border border-bege-soft focus:border-cafe outline-none bg-branco min-w-[200px]"
          />
          <select 
            v-model="filtroCategoria"
            class="px-3.5 py-2 text-xs rounded-xl border border-bege-soft focus:border-cafe outline-none bg-branco font-bold text-cafe-dark"
          >
            <option value="todas">Todas as categorias</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
              {{ cat.nome }}
            </option>
          </select>
        </div>
      </div>

      <!-- Tabela Principal de Pratos -->
      <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden">
        <div class="overflow-x-auto">
          <BaseTabela :colunas="colsPratos" :data="pratosFiltrados" class="min-w-[900px]">
            <!-- Coluna: Nome & Descrição -->
            <template #nome="{ item }">
              <div class="px-4 py-2.5 max-w-sm">
                <div class="flex items-center gap-2">
                  <span class="font-black text-cafe-dark text-sm">{{ item.nome }}</span>
                  <span 
                    v-if="item.destaque" 
                    class="text-[8px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-black uppercase tracking-wider"
                  >
                    ⭐ Especial
                  </span>
                </div>
                <p v-if="item.descricao" class="text-[11px] text-bege-torrado font-medium line-clamp-2 mt-0.5 leading-relaxed">
                  {{ item.descricao }}
                </p>
              </div>
            </template>

            <!-- Coluna: Categoria -->
            <template #categoria="{ item }">
              <span class="text-[9px] bg-bege-cream text-cafe-dark px-2.5 py-1 rounded-lg font-black uppercase border border-bege-soft/60 whitespace-nowrap">
                {{ item.categoria?.nome || getCategoryName(item.categoria_id) }}
              </span>
            </template>

            <!-- Coluna: Ponto da Carne -->
            <template #permite_ponto_carne="{ item }">
              <span 
                v-if="item.permite_ponto_carne" 
                class="text-[9px] bg-red-50 text-red-700 px-2 py-1 rounded-lg font-black uppercase border border-red-100 whitespace-nowrap inline-flex items-center gap-1"
              >
                🥩 Ponto Ativo
              </span>
              <span v-else class="text-[10px] text-bege-torrado/30 font-bold">-</span>
            </template>

            <!-- Coluna: Preço -->
            <template #preco="{ item }">
              <span class="font-black text-cafe text-sm tabular-nums whitespace-nowrap">
                {{ formatCurrency(item.preco) }}
              </span>
            </template>

            <!-- Coluna: Ativo / Pausado -->
            <template #ativo="{ item }">
              <BaseToggle v-model="item.ativo" @update:model-value="handleToggleAtivoPrato(item)" />
            </template>

            <!-- Coluna: Ações -->
            <template #acoes="{ item }">
              <div class="flex gap-1">
                <button 
                  class="p-2 text-bege-torrado hover:text-cafe hover:bg-bege-cream rounded-xl transition-colors" 
                  @click="handleOpenEditPrato(item)"
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
        </div>

        <div v-if="pratosFiltrados.length === 0" class="p-12 text-center text-bege-torrado text-sm font-bold italic">
          Nenhum prato encontrado com os filtros selecionados.
        </div>
      </div>
    </section>

    <!-- MODAL CATEGORIA -->
    <BaseModal 
      :show="showCategoryModal" 
      :title="editingItem ? 'Editar Categoria' : 'Nova Categoria'" 
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

    <!-- MODAL PRATO ADEGA -->
    <BaseModal 
      :show="showPratoAdminModal" 
      :title="editingItem ? 'Editar Prato' : 'Novo Prato da Adega'" 
      @close="showPratoAdminModal = false" 
      size="lg"
    >
      <div class="py-2 space-y-4">
        <BaseInput 
          v-model="pratoForm.nome" 
          label="Nome do Prato *" 
          placeholder="Ex: Mignon Gratinado, Salmão ao Molho de Maracujá" 
          required 
        />
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-700">Categoria *</label>
            <select 
              v-model="pratoForm.categoria_id" 
              class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-cafe outline-none bg-white font-medium text-sm"
            >
              <option value="" disabled>Selecione uma categoria</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                {{ cat.nome }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">Preço (R$) *</label>
            <BaseInputCurrency 
              v-model="pratoForm.preco" 
              placeholder="0,00" 
              input-class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cafe outline-none font-bold text-sm" 
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-bold text-gray-700">Descrição do Prato</label>
          <textarea 
            v-model="pratoForm.descricao" 
            rows="3" 
            placeholder="Cortes nobres, modo de preparo, guarnições e acompanhamentos..."
            class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-cafe outline-none text-sm placeholder:text-gray-400"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <label class="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="pratoForm.permite_ponto_carne" 
              class="w-5 h-5 text-cafe rounded border-gray-300 focus:ring-cafe" 
            />
            <div>
              <span class="text-sm font-bold text-cafe-dark block">Permite Ponto da Carne</span>
              <span class="text-xs text-gray-500 block">Exibe opções de corte (mal passado, ao ponto, etc.)</span>
            </div>
          </label>

          <label class="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="pratoForm.destaque" 
              class="w-5 h-5 text-cafe rounded border-gray-300 focus:ring-cafe" 
            />
            <div>
              <span class="text-sm font-bold text-cafe-dark block">Especialidade da Casa</span>
              <span class="text-xs text-gray-500 block">Exibe selo de destaque no cardápio</span>
            </div>
          </label>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="outline" @click="showPratoAdminModal = false">Cancelar</BaseButton>
        <BaseButton variant="primary" :loading="isSaving" @click="handleSavePrato">
          {{ editingItem ? 'Salvar Prato' : 'Cadastrar Prato' }}
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
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline';

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

// Formatação Monetária
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Colunas da Tabela
const colsPratos = [
  { key: 'nome', label: 'Prato' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'permite_ponto_carne', label: 'Ponto Carne' },
  { key: 'preco', label: 'Preço' },
  { key: 'ativo', label: 'Ativo' },
  { key: 'acoes', label: 'Ações' }
];

// Filtros
const filtroBusca = ref('');
const filtroCategoria = ref('todas');

const pratosFiltrados = computed(() => {
  return pratosAdega.value.filter(p => {
    const matchCategoria = filtroCategoria.value === 'todas' || p.categoria_id === filtroCategoria.value;
    const matchBusca = !filtroBusca.value || p.nome.toLowerCase().includes(filtroBusca.value.toLowerCase());
    return matchCategoria && matchBusca;
  });
});

const contarPratosPorCategoria = (categoriaId: string) => {
  return pratosAdega.value.filter(p => p.categoria_id === categoriaId).length;
};

// Modais
const showCategoryModal = ref(false);
const showPratoAdminModal = ref(false);
const showConfirmDeleteModal = ref(false);

const isSaving = ref(false);
const isDeleting = ref(false);

const editingItem = ref<any>(null);
const itemToDelete = ref<{ id: string, nome: string, type: 'categoria' | 'prato' } | null>(null);

// Formulários
const categoryForm = reactive({ nome: '' });
const pratoForm = reactive({
  nome: '',
  categoria_id: '',
  descricao: '',
  preco: 0,
  destaque: false,
  permite_ponto_carne: false,
  ativo: true
});

onMounted(async () => {
  try {
    await Promise.all([
      fetchCategorias(),
      fetchTodosItensAdmin()
    ]);
  } catch (error) {
    toast.error('Erro de Carregamento', 'Não foi possível carregar os dados do cardápio.');
  }
});

// Abertura de Modais
const handleOpenAddCategory = () => {
  editingItem.value = null;
  categoryForm.nome = '';
  showCategoryModal.value = true;
};

const handleOpenEditCategory = (item: any) => {
  editingItem.value = item;
  categoryForm.nome = item.nome;
  showCategoryModal.value = true;
};

const handleOpenAddPrato = () => {
  editingItem.value = null;
  pratoForm.nome = '';
  pratoForm.categoria_id = categorias.value[0]?.id || '';
  pratoForm.descricao = '';
  pratoForm.preco = 0;
  pratoForm.destaque = false;
  pratoForm.permite_ponto_carne = false;
  pratoForm.ativo = true;
  showPratoAdminModal.value = true;
};

const handleOpenEditPrato = (item: any) => {
  editingItem.value = item;
  pratoForm.nome = item.nome;
  pratoForm.categoria_id = item.categoria_id;
  pratoForm.descricao = item.descricao || '';
  pratoForm.preco = item.preco;
  pratoForm.destaque = !!item.destaque;
  pratoForm.permite_ponto_carne = !!item.permite_ponto_carne;
  pratoForm.ativo = item.ativo !== undefined ? item.ativo : true;
  showPratoAdminModal.value = true;
};

// Salvamento
const handleSaveCategory = async () => {
  if (!categoryForm.nome.trim()) return toast.error('Aviso', 'Nome da categoria é obrigatório');
  isSaving.value = true;
  try {
    if (editingItem.value) {
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

const handleSavePrato = async () => {
  if (!pratoForm.nome.trim()) return toast.warning('Aviso', 'Informe o nome do prato');
  if (!pratoForm.categoria_id) return toast.warning('Aviso', 'Selecione uma categoria');
  if (!pratoForm.preco || pratoForm.preco <= 0) return toast.warning('Aviso', 'Informe o valor do prato');

  isSaving.value = true;
  try {
    if (editingItem.value) {
      await updatePrato(editingItem.value.id, {
        nome: pratoForm.nome,
        categoria_id: pratoForm.categoria_id,
        descricao: pratoForm.descricao,
        preco: pratoForm.preco,
        destaque: pratoForm.destaque,
        permite_ponto_carne: pratoForm.permite_ponto_carne,
        ativo: pratoForm.ativo
      });
      toast.success('Sucesso', 'Prato atualizado com sucesso');
    } else {
      await addPrato({
        nome: pratoForm.nome,
        categoria_id: pratoForm.categoria_id,
        descricao: pratoForm.descricao,
        preco: pratoForm.preco,
        destaque: pratoForm.destaque,
        permite_ponto_carne: pratoForm.permite_ponto_carne,
        ativo: pratoForm.ativo
      });
      toast.success('Sucesso', 'Prato cadastrado com sucesso');
    }
    showPratoAdminModal.value = false;
  } catch (e: any) {
    toast.error('Erro ao salvar prato', e.message);
  } finally {
    isSaving.value = false;
  }
};

const handleToggleAtivoPrato = async (item: any) => {
  try {
    await toggleAtivoPrato(item.id, item.ativo);
    toast.success('Status atualizado', `Prato ${item.ativo ? 'ativado' : 'desativado'}`);
  } catch (e: any) {
    toast.error('Erro', 'Não foi possível alterar o status');
  }
};

// Exclusão
const confirmDelete = (item: any, type: 'categoria' | 'prato') => {
  itemToDelete.value = { id: item.id, nome: item.nome, type };
  showConfirmDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    const { id, type } = itemToDelete.value;
    if (type === 'categoria') {
      await removeCategoria(id);
    } else if (type === 'prato') {
      await removePrato(id);
    }
    toast.success('Excluído', 'Item removido com sucesso');
    showConfirmDeleteModal.value = false;
  } catch (e: any) {
    toast.error('Erro ao excluir', e.message);
  } finally {
    isDeleting.value = false;
  }
};

const getCategoryName = (id: string) => {
  return categorias.value.find(c => c.id === id)?.nome || 'Sem Categoria';
};
</script>

<style scoped>
/* Transições suaves */
</style>
