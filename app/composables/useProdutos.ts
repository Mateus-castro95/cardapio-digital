import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

export type Produto = Database['public']['Tables']['produtos']['Row'];
export type ProdutoSimples = Database['public']['Tables']['produtos_simples']['Row'];

export interface ProdutoCompleto extends Produto {
    detalhes_simples?: ProdutoSimples;
}

export const useProdutos = () => {
    const client = useSupabaseClient<Database>();
    const produtos = ref<ProdutoCompleto[]>([]);
    const loading = ref(false);

    const fetchProdutosBebidas = async () => {
        loading.value = true;
        try {
            const { data, error } = await client
                .from('produtos')
                .select(`
                    *,
                    detalhes_simples:produtos_simples(*)
                `)
                .eq('tipo_produto', 'simples')
                .order('nome', { ascending: true });

            if (error) throw error;

            const formattedData = (data || []).map(p => ({
                ...p,
                detalhes_simples: Array.isArray(p.detalhes_simples) ? p.detalhes_simples[0] : p.detalhes_simples
            })) as ProdutoCompleto[];

            produtos.value = formattedData;
        } catch (error: any) {
            console.error('Erro ao buscar produtos/bebidas:', error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const addBebida = async (produto: Database['public']['Tables']['produtos']['Insert'], detalhes: Omit<Database['public']['Tables']['produtos_simples']['Insert'], 'produto_id'>) => {
        try {
            const { data: prodData, error: prodError } = await client
                .from('produtos')
                .insert([produto])
                .select()
                .single();

            if (prodError) throw prodError;

            const { data: detData, error: detError } = await client
                .from('produtos_simples')
                .insert([{ ...detalhes, produto_id: prodData.id }])
                .select()
                .single();

            if (detError) throw detError;

            const novoProduto: ProdutoCompleto = { ...prodData, detalhes_simples: detData };
            produtos.value.push(novoProduto);
            return novoProduto;
        } catch (error: any) {
            console.error('Erro ao adicionar bebida:', error.message);
            throw error;
        }
    };

    const updateBebida = async (id: string, updates: Database['public']['Tables']['produtos']['Update'], detalhesUpdates: Database['public']['Tables']['produtos_simples']['Update']) => {
        try {
            const { data: prodData, error: prodError } = await client
                .from('produtos')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (prodError) throw prodError;

            const { data: detData, error: detError } = await client
                .from('produtos_simples')
                .update(detalhesUpdates)
                .eq('produto_id', id)
                .select()
                .single();

            if (detError) throw detError;

            const index = produtos.value.findIndex(p => p.id === id);
            if (index !== -1) {
                produtos.value[index] = { ...prodData, detalhes_simples: detData };
            }
            return produtos.value[index];
        } catch (error: any) {
            console.error('Erro ao atualizar bebida:', error.message);
            throw error;
        }
    };

    const removeProduto = async (id: string) => {
        try {
            const { error } = await client
                .from('produtos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            produtos.value = produtos.value.filter(p => p.id !== id);
        } catch (error: any) {
            console.error('Erro ao remover produto:', error.message);
            throw error;
        }
    };

    const toggleAtivo = async (id: string, ativo: boolean, isSimples: boolean = true) => {
        try {
            if (isSimples) {
                const { error } = await client
                    .from('produtos_simples')
                    .update({ ativo })
                    .eq('produto_id', id);
                if (error) throw error;
            } else {
                const { error } = await client
                    .from('produtos')
                    .update({ ativo })
                    .eq('id', id);
                if (error) throw error;
            }

            const index = produtos.value.findIndex(p => p.id === id);
            if (index !== -1 && produtos.value[index]) {
                const item = produtos.value[index];
                if (isSimples && item.detalhes_simples) {
                    item.detalhes_simples.ativo = ativo;
                } else {
                    item.ativo = ativo;
                }
            }
        } catch (error: any) {
            console.error('Erro ao alternar status do produto:', error.message);
            throw error;
        }
    };

    return {
        produtos,
        loading,
        fetchProdutosBebidas,
        addBebida,
        updateBebida,
        removeProduto,
        toggleAtivo
    };
};
