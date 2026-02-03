<template>
  <div class="p-6">
    <div class="mb-8 flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Produtos</h1>
        <p class="text-gray-500">Gerencie seus produtos e categorias aqui.</p>
      </div>
      <BaseButton variant="primary" @click="handleOpenAddModal">
        Adicionar nova categoria
      </BaseButton>
    </div>

    <!-- Abas -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8">
        <button class="border-b-2 border-primary-500 py-4 px-1 text-sm font-medium text-primary-600">
          Categorias
        </button>
      </nav>
    </div>

    <!-- Conteúdo da Aba Categorias -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseCard v-for="categoria in categorias" :key="categoria.id" class="group relative">
        <div class="flex justify-between items-center">
          <span class="font-semibold text-lg text-gray-700">{{ categoria.nome }}</span>
          
          <div class="flex gap-2">
            <BaseButton variant="outline" size="small" class="!p-2 !border-blue-100 !text-blue-600 hover:!bg-blue-50" @click="handleEdit(categoria)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </BaseButton>
            <BaseButton variant="outline" size="small" class="!p-2 !border-red-100 !text-red-600 hover:!bg-red-50" @click="handleConfirmDelete(categoria)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Modal para Adicionar/Editar Categoria -->
    <BaseModal 
      :show="showEditModal" 
      :title="editingCategory ? 'Editar Categoria' : 'Nova Categoria'" 
      @close="showEditModal = false"
    >
      <div class="py-2">
        <BaseInput 
          v-model="categoryForm.nome" 
          label="Nome da Categoria" 
          placeholder="Ex: Pizzas, Bebidas..." 
          required
        />
      </div>
      <template #footer>
        <BaseButton variant="outline" @click="showEditModal = false">
          Cancelar
        </BaseButton>
        <BaseButton variant="primary" :loading="isSaving" @click="handleSaveCategory">
          Confirmar
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Modal de Confirmação para Exclusão -->
    <ModalConfirmacao 
      :show="showDeleteModal" 
      title="Excluir Categoria" 
      :message="`Tem certeza que deseja excluir a categoria '${categoryToDelete?.nome}'?`"
      :loading="isDeleting"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useToast } from '~/composables/useToast';
import { useCategorias } from '~/composables/useCategorias';

const toast = useToast();
const { 
  categorias, 
  loading: loadingTable, 
  fetchCategorias, 
  addCategoria, 
  updateCategoria, 
  removeCategoria 
} = useCategorias();

// Estados dos modais
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);

const editingCategory = ref<null | { id: string, nome: string }>(null);
const categoryToDelete = ref<null | { id: string, nome: string }>(null);

const categoryForm = reactive({
    nome: ''
});

// Busca dados ao montar a página
onMounted(async () => {
    try {
        await fetchCategorias();
    } catch (error) {
        toast.error('Erro de Conexão', 'Não foi possível carregar as categorias.');
    }
});

// Abre modal para adicionar nova
const handleOpenAddModal = () => {
    editingCategory.value = null;
    categoryForm.nome = '';
    showEditModal.value = true;
};

// Abre modal para editar
const handleEdit = (categoria: any) => {
    editingCategory.value = { ...categoria };
    categoryForm.nome = categoria.nome;
    showEditModal.value = true;
};

// Salva categoria no Supabase
const handleSaveCategory = async () => {
    if (!categoryForm.nome) {
        toast.error('Campo obrigatório', 'O nome da categoria é necessário.');
        return;
    }

    isSaving.value = true;
    
    try {
        if (editingCategory.value) {
            await updateCategoria(editingCategory.value.id, categoryForm.nome);
            toast.success('Sucesso!', 'Categoria atualizada com sucesso.');
        } else {
            await addCategoria(categoryForm.nome);
            toast.success('Sucesso!', 'Nova categoria adicionada.');
        }
        showEditModal.value = false;
    } catch (error: any) {
        toast.error('Erro ao salvar', error.message || 'Ocorreu um erro inesperado.');
    } finally {
        isSaving.value = false;
    }
};

// Abre confirmação de exclusão
const handleConfirmDelete = (categoria: any) => {
    categoryToDelete.value = categoria;
    showDeleteModal.value = true;
};

// Exclui categoria do Supabase
const handleDelete = async () => {
    if (!categoryToDelete.value) return;
    
    isDeleting.value = true;
    
    try {
        await removeCategoria(categoryToDelete.value.id);
        toast.success('Excluído!', 'Categoria removida com sucesso.');
        showDeleteModal.value = false;
    } catch (error: any) {
        toast.error('Erro ao excluir', error.message || 'Não foi possível excluir a categoria.');
    } finally {
        isDeleting.value = false;
    }
};
</script>

<style scoped>
/* Estilos específicos da página de produtos */
</style>
