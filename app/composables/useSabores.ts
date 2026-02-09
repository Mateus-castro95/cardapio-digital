import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

export type Sabor = Database['public']['Tables']['sabores']['Row'];
export type AdicionalSabor = Database['public']['Tables']['adicional_sabor_tamanho']['Row'];

export interface SaborCompleto extends Sabor {
    adicionais?: AdicionalSabor[];
}

export const useSabores = () => {
    const client = useSupabaseClient<Database>();
    const sabores = ref<SaborCompleto[]>([]);
    const loading = ref(false);

    const fetchSabores = async () => {
        loading.value = true;
        try {
            const { data, error } = await client
                .from('sabores')
                .select(`
                    *,
                    adicionais:adicional_sabor_tamanho(*)
                `)
                .order('nome', { ascending: true });

            if (error) throw error;
            sabores.value = data || [];
        } catch (error: any) {
            console.error('Erro ao buscar sabores:', error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const addSaborCompleto = async (
        sabor: Database['public']['Tables']['sabores']['Insert'],
        adicionais: Omit<Database['public']['Tables']['adicional_sabor_tamanho']['Insert'], 'sabor_id'>[] = []
    ) => {
        try {
            // 1. Criar o sabor
            const { data: saborData, error: saborError } = await client
                .from('sabores')
                .insert([sabor])
                .select()
                .single();

            if (saborError) throw saborError;

            // 2. Criar os adicionais se houver
            let adicionaisData: AdicionalSabor[] = [];
            if (sabor.tipo === 'especial' && adicionais.length > 0) {
                const payload = adicionais.map(a => ({ ...a, sabor_id: saborData.id }));
                const { data: adjData, error: adjError } = await client
                    .from('adicional_sabor_tamanho')
                    .insert(payload)
                    .select();

                if (adjError) throw adjError;
                adicionaisData = adjData || [];
            }

            const novoSabor: SaborCompleto = { ...saborData, adicionais: adicionaisData };
            sabores.value.push(novoSabor);
            return novoSabor;
        } catch (error: any) {
            console.error('Erro ao adicionar sabor completo:', error.message);
            throw error;
        }
    };

    const updateSaborCompleto = async (
        id: string,
        updates: Database['public']['Tables']['sabores']['Update'],
        adicionais: Omit<Database['public']['Tables']['adicional_sabor_tamanho']['Insert'], 'sabor_id'>[] = []
    ) => {
        try {
            // 1. Atualizar o sabor base
            const { data: saborData, error: saborError } = await client
                .from('sabores')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (saborError) throw saborError;

            // 2. Atualizar adicionais apenas se o tipo foi enviado OU se novos adicionais foram fornecidos
            // Isso evita que o toggle de 'ativo' (que não envia o tipo) apague os dados por erro
            if (updates.tipo === 'especial') {
                // Se o tipo é especial, atualizamos os adicionais (limpa e insere novos)
                await client.from('adicional_sabor_tamanho').delete().eq('sabor_id', id);
                if (adicionais.length > 0) {
                    const payload = adicionais.map(a => ({ ...a, sabor_id: id }));
                    await client.from('adicional_sabor_tamanho').insert(payload);
                }
            } else if (updates.tipo === 'tradicional') {
                // Se mudou explicitamente para tradicional, remove qualquer adicional existente
                await client.from('adicional_sabor_tamanho').delete().eq('sabor_id', id);
            } else if (updates.tipo === undefined && adicionais.length > 0) {
                // Se o tipo não foi enviado (não mudou) mas enviamos novos preços adicionais
                await client.from('adicional_sabor_tamanho').delete().eq('sabor_id', id);
                const payload = adicionais.map(a => ({ ...a, sabor_id: id }));
                await client.from('adicional_sabor_tamanho').insert(payload);
            }

            // Recarrega apenas este sabor para garantir dados consistentes
            const { data: freshData, error: freshError } = await client
                .from('sabores')
                .select('*, adicionais:adicional_sabor_tamanho(*)')
                .eq('id', id)
                .single();

            if (freshError) throw freshError;

            const index = sabores.value.findIndex(s => s.id === id);
            if (index !== -1) {
                sabores.value[index] = freshData;
            }
            return freshData;
        } catch (error: any) {
            console.error('Erro ao atualizar sabor completo:', error.message);
            throw error;
        }
    };

    const removeSabor = async (id: string) => {
        try {
            const { error } = await client
                .from('sabores')
                .delete()
                .eq('id', id);

            if (error) throw error;
            sabores.value = sabores.value.filter(s => s.id !== id);
        } catch (error: any) {
            console.error('Erro ao remover sabor:', error.message);
            throw error;
        }
    };

    return {
        sabores,
        loading,
        fetchSabores,
        addSaborCompleto,
        updateSaborCompleto,
        removeSabor
    };
};
