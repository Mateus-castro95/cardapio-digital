import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

export type ItemCardapio = Database['public']['Tables']['itens_cardapio']['Row'];
export type ItemCardapioInsert = Database['public']['Tables']['itens_cardapio']['Insert'];
export type ItemCardapioUpdate = Database['public']['Tables']['itens_cardapio']['Update'];

export interface ItemCardapioComCategoria extends ItemCardapio {
    categoria?: Database['public']['Tables']['categorias']['Row'];
}

export const useCardapioItens = () => {
    const client = useSupabaseClient<Database>();
    const itens = ref<ItemCardapioComCategoria[]>([]);
    const loading = ref(false);

    // Busca todos os itens ativos com suas categorias para o Cardápio do Cliente
    const fetchItensCardapio = async () => {
        loading.value = true;
        try {
            const { data, error } = await client
                .from('itens_cardapio')
                .select(`
                    *,
                    categoria:categorias(*)
                `)
                .eq('ativo', true)
                .order('ordem', { ascending: true })
                .order('nome', { ascending: true });

            if (error) throw error;
            itens.value = (data as any) || [];
            return itens.value;
        } catch (error: any) {
            console.error('Erro ao buscar itens do cardápio:', error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // Busca todos os itens (ativos e inativos) para o Painel Administrativo
    const fetchTodosItensAdmin = async () => {
        loading.value = true;
        try {
            const { data, error } = await client
                .from('itens_cardapio')
                .select(`
                    *,
                    categoria:categorias(*)
                `)
                .order('ordem', { ascending: true })
                .order('nome', { ascending: true });

            if (error) throw error;
            itens.value = (data as any) || [];
            return itens.value;
        } catch (error: any) {
            console.error('Erro ao buscar itens administrativos:', error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // Adiciona novo prato
    const addItem = async (item: ItemCardapioInsert) => {
        try {
            const { data, error } = await client
                .from('itens_cardapio')
                .insert([item])
                .select(`
                    *,
                    categoria:categorias(*)
                `)
                .single();

            if (error) throw error;
            if (data) {
                itens.value.push(data as any);
            }
            return data;
        } catch (error: any) {
            console.error('Erro ao adicionar prato:', error.message);
            throw error;
        }
    };

    // Atualiza prato existente
    const updateItem = async (id: string, updates: ItemCardapioUpdate) => {
        try {
            const { data, error } = await client
                .from('itens_cardapio')
                .update({ ...updates, atualizado_em: new Date().toISOString() })
                .eq('id', id)
                .select(`
                    *,
                    categoria:categorias(*)
                `)
                .single();

            if (error) throw error;
            const index = itens.value.findIndex(i => i.id === id);
            if (index !== -1 && data) {
                itens.value[index] = data as any;
            }
            return data;
        } catch (error: any) {
            console.error('Erro ao atualizar prato:', error.message);
            throw error;
        }
    };

    // Remove prato
    const removeItem = async (id: string) => {
        try {
            const { error } = await client
                .from('itens_cardapio')
                .delete()
                .eq('id', id);

            if (error) throw error;
            itens.value = itens.value.filter(i => i.id !== id);
        } catch (error: any) {
            console.error('Erro ao remover prato:', error.message);
            throw error;
        }
    };

    // Alterna status ativo/inativo
    const toggleAtivo = async (id: string, ativo: boolean) => {
        try {
            const { error } = await client
                .from('itens_cardapio')
                .update({ ativo, atualizado_em: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
            const item = itens.value.find(i => i.id === id);
            if (item) item.ativo = ativo;
        } catch (error: any) {
            console.error('Erro ao alternar status do prato:', error.message);
            throw error;
        }
    };

    return {
        itens,
        loading,
        fetchItensCardapio,
        fetchTodosItensAdmin,
        addItem,
        updateItem,
        removeItem,
        toggleAtivo
    };
};
