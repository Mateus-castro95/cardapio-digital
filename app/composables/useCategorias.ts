import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

export interface Categoria {
    id: string;
    nome: string;
}

/**
 * Composable para gerenciar o CRUD de categorias no Supabase
 */
export const useCategorias = () => {
    const client = useSupabaseClient<Database>();
    const categorias = ref<Categoria[]>([]);
    const loading = ref(false);

    // Busca todas as categorias
    const fetchCategorias = async () => {
        loading.value = true;
        try {
            const { data, error } = await client
                .from('categorias')
                .select('*')
                .order('nome', { ascending: true });

            if (error) throw error;
            categorias.value = data || [];
        } catch (error: any) {
            console.error('Erro ao buscar categorias:', error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // Adiciona nova categoria
    const addCategoria = async (nome: string) => {
        try {
            const { data, error } = await client
                .from('categorias')
                .insert([{ nome }] as any)
                .select()
                .single();

            if (error) throw error;
            if (data) {
                categorias.value.push(data as Categoria);
            }
            return data;
        } catch (error: any) {
            console.error('Erro ao adicionar categoria:', error.message);
            throw error;
        }
    };

    // Atualiza categoria existente
    const updateCategoria = async (id: string, nome: string) => {
        try {
            const { data, error } = await client
                .from('categorias')
                .update({ nome } as any)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const index = categorias.value.findIndex(c => c.id === id);
                if (index !== -1) {
                    categorias.value[index] = data as Categoria;
                }
            }
            return data;
        } catch (error: any) {
            console.error('Erro ao atualizar categoria:', error.message);
            throw error;
        }
    };

    // Remove uma categoria
    const removeCategoria = async (id: string) => {
        try {
            const { error } = await client
                .from('categorias')
                .delete()
                .eq('id', id);

            if (error) {
                if (error.code === '23503' || error.message?.includes('foreign key')) {
                    throw new Error('Não é possível excluir esta categoria pois ela possui produtos vinculados.');
                }
                throw error;
            }
            categorias.value = categorias.value.filter(c => c.id !== id);
        } catch (error: any) {
            console.error('Erro ao remover categoria:', error.message);
            throw error;
        }
    };

    return {
        categorias,
        loading,
        fetchCategorias,
        addCategoria,
        updateCategoria,
        removeCategoria
    };
};
