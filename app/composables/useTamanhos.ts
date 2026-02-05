import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

export type Tamanho = Database['public']['Tables']['tamanhos']['Row'];

export const useTamanhos = () => {
    const client = useSupabaseClient<Database>();
    const tamanhos = ref<Tamanho[]>([]);
    const loading = ref(false);

    const fetchTamanhos = async () => {
        loading.value = true;
        try {
            const { data, error } = await client
                .from('tamanhos')
                .select('*')
                .order('preco_base', { ascending: true });

            if (error) throw error;
            tamanhos.value = data || [];
        } catch (error: any) {
            console.error('Erro ao buscar tamanhos:', error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const addTamanho = async (tamanho: Database['public']['Tables']['tamanhos']['Insert']) => {
        try {
            const { data, error } = await client
                .from('tamanhos')
                .insert([tamanho])
                .select()
                .single();

            if (error) throw error;
            if (data) {
                tamanhos.value.push(data);
            }
            return data;
        } catch (error: any) {
            console.error('Erro ao adicionar tamanho:', error.message);
            throw error;
        }
    };

    const updateTamanho = async (id: string, updates: Database['public']['Tables']['tamanhos']['Update']) => {
        try {
            const { data, error } = await client
                .from('tamanhos')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            if (data) {
                const index = tamanhos.value.findIndex(t => t.id === id);
                if (index !== -1) {
                    tamanhos.value[index] = data;
                }
            }
            return data;
        } catch (error: any) {
            console.error('Erro ao atualizar tamanho:', error.message);
            throw error;
        }
    };

    const removeTamanho = async (id: string) => {
        try {
            const { error } = await client
                .from('tamanhos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            tamanhos.value = tamanhos.value.filter(t => t.id !== id);
        } catch (error: any) {
            console.error('Erro ao remover tamanho:', error.message);
            throw error;
        }
    };

    return {
        tamanhos,
        loading,
        fetchTamanhos,
        addTamanho,
        updateTamanho,
        removeTamanho
    };
};
