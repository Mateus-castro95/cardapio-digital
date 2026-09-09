import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

export type VariacaoSimples = Database['public']['Tables']['produtos_simples']['Row'] & {
    produto?: Database['public']['Tables']['produtos']['Row']
};

export const useVariacoes = () => {
    const client = useSupabaseClient<Database>();
    const variacoes = ref<VariacaoSimples[]>([]);
    const loading = ref(false);

    const fetchVariacoesBebidas = async (somenteAtivos: boolean = false) => {
        loading.value = true;
        try {
            let query = client
                .from('produtos_simples')
                .select(`
                    *,
                    produto:produtos(*)
                `);
            
            if (somenteAtivos) {
                query = query.eq('ativo', true);
            }

            const { data, error } = await query.order('sabor', { ascending: true });

            if (error) throw error;
            variacoes.value = (data || []).filter(v => v.produto?.subtipo === 'bebida');
        } catch (error: any) {
            console.error('Erro ao buscar variações:', error.message);
        } finally {
            loading.value = false;
        }
    };

    const addNovaVariacao = async (
        nomeProduto: string,
        categoriaId: string,
        detalhes: Omit<Database['public']['Tables']['produtos_simples']['Insert'], 'produto_id'>
    ) => {
        try {
            // 1. Localiza ou cria o produto pai (ex: "Suco", "Refrigerante", "Água" ou o Nome da marca)
            let { data: prodExistente } = await client
                .from('produtos')
                .select('id')
                .eq('nome', nomeProduto)
                .eq('subtipo', 'bebida')
                .maybeSingle();

            let produtoId = prodExistente?.id;

            if (!produtoId) {
                const { data: novoProd, error: errorProd } = await client
                    .from('produtos')
                    .insert([{
                        nome: nomeProduto,
                        categoria_id: categoriaId,
                        tipo_produto: 'simples',
                        subtipo: 'bebida'
                    }])
                    .select()
                    .single();

                if (errorProd) throw errorProd;
                produtoId = novoProd.id;
            }

            // 2. Cria a variação com os novos campos sabor/tamanho
            const { data: variacao, error: errorVar } = await client
                .from('produtos_simples')
                .insert([{ ...detalhes, produto_id: produtoId }])
                .select(`*, produto:produtos(*)`)
                .single();

            if (errorVar) throw errorVar;
            variacoes.value.unshift(variacao);
            return variacao;
        } catch (error: any) {
            console.error('Erro ao cadastrar bebida:', error.message);
            throw error;
        }
    };

    const updateVariacaoCompleta = async (
        id: string,
        produtoId: string,
        nomeProduto: string,
        detalhes: Database['public']['Tables']['produtos_simples']['Update']
    ) => {
        try {
            // 1. Atualiza o nome no produto pai se necessário
            await client.from('produtos').update({ nome: nomeProduto }).eq('id', produtoId);

            // 2. Atualiza a variação
            const { data, error } = await client
                .from('produtos_simples')
                .update(detalhes)
                .eq('id', id)
                .select(`*, produto:produtos(*)`)
                .single();

            if (error) throw error;

            const index = variacoes.value.findIndex(v => v.id === id);
            if (index !== -1) variacoes.value[index] = data;

            return data;
        } catch (error: any) {
            console.error('Erro ao atualizar variação:', error.message);
            throw error;
        }
    };

    const removeVariacao = async (variacaoId: string, produtoId: string) => {
        try {
            const { error: errVar } = await client.from('produtos_simples').delete().eq('id', variacaoId);
            if (errVar) throw errVar;

            const { count } = await client
                .from('produtos_simples')
                .select('*', { count: 'exact', head: true })
                .eq('produto_id', produtoId);

            if (count === 0) {
                await client.from('produtos').delete().eq('id', produtoId);
            }

            variacoes.value = variacoes.value.filter(v => v.id !== variacaoId);
        } catch (error: any) {
            console.error('Erro ao remover:', error.message);
            throw error;
        }
    };

    return {
        variacoes,
        loading,
        fetchVariacoesBebidas,
        addNovaVariacao,
        updateVariacaoCompleta,
        removeVariacao
    };
};
