import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

type Pedido = Database['public']['Tables']['pedidos']['Row'];
type ItemPedido = Database['public']['Tables']['itens_pedido']['Row'];
type Mesa = Database['public']['Tables']['mesas']['Row'];

export interface ItemPedidoInput {
    produto_simples_id?: string | null;
    tamanho_id?: string | null;
    sabores?: any;
    quantidade: number;
    preco_unitario: number;
    observacoes?: string | null;
}

export interface PedidoInput {
    mesa_id: string | null;
    total: number;
    itens: ItemPedidoInput[];
}

export const usePedidos = () => {
    const client = useSupabaseClient<Database>();

    const pedidos = ref<(Pedido & { itens: ItemPedido[], mesa?: Mesa | null })[]>([]);
    const mesas = ref<Mesa[]>([]);
    const loading = ref(false);

    // Busca todas as mesas
    const fetchMesas = async () => {
        try {
            const { data, error } = await client
                .from('mesas')
                .select('*')
                .order('numero', { ascending: true });

            if (error) throw error;
            mesas.value = data || [];
        } catch (error: any) {
            console.error('Erro ao buscar mesas:', error.message);
            throw error;
        }
    };

    // Atualiza o status de uma mesa manualmente
    const atualizarStatusMesa = async (mesaId: string, status: 'livre' | 'ocupada') => {
        try {
            const { error } = await client
                .from('mesas')
                .update({ status } as any)
                .eq('id', mesaId);

            if (error) throw error;

            // Atualiza estado local
            const index = mesas.value.findIndex(m => m.id === mesaId);
            if (index !== -1) {
                mesas.value[index].status = status;
            }
        } catch (error: any) {
            console.error('Erro ao atualizar status da mesa:', error.message);
            throw error;
        }
    };

    // Cria uma nova mesa
    const criarMesa = async (numero: number) => {
        try {
            const { data, error } = await client
                .from('mesas')
                .insert([{ numero, status: 'livre' }])
                .select()
                .single();

            if (error) throw error;
            mesas.value.push(data);
            return data;
        } catch (error: any) {
            console.error('Erro ao criar mesa:', error.message);
            throw error;
        }
    };

    // Cria um novo pedido completo (Cabeçalho + Itens + Status da Mesa)
    const criarPedido = async (input: PedidoInput) => {
        loading.value = true;
        try {
            // 1. Criar o Pedido (Cabeçalho)
            const { data: pedido, error: errorPedido } = await client
                .from('pedidos')
                .insert([{
                    mesa_id: input.mesa_id,
                    total: input.total,
                    status: 'novo'
                }] as any)
                .select()
                .single();

            if (errorPedido) throw errorPedido;

            // 2. Criar os Itens do Pedido
            const itensParaInserir = input.itens.map(item => ({
                ...item,
                pedido_id: pedido.id
            }));

            const { error: errorItens } = await client
                .from('itens_pedido')
                .insert(itensParaInserir as any);

            if (errorItens) throw errorItens;

            // 3. Atualizar status da mesa para ocupada (se houver mesa selecionada)
            if (input.mesa_id) {
                await atualizarStatusMesa(input.mesa_id, 'ocupada');
            }

            return pedido;
        } catch (error: any) {
            console.error('Erro ao criar pedido:', error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // Busca pedidos com itens e mesa associada
    const fetchPedidos = async (filtros?: { status?: string[] }) => {
        loading.value = true;
        try {
            let query = client
                .from('pedidos')
                .select(`
                    *,
                    mesa:mesas(*),
                    itens:itens_pedido(
                        *,
                        produto_simples:produtos_simples(*),
                        tamanho:tamanhos(nome)
                    )
                `)
                .order('criado_em', { ascending: false });

            if (filtros?.status && filtros.status.length > 0) {
                query = query.in('status', filtros.status);
            }

            const { data, error } = await query;

            if (error) throw error;
            pedidos.value = (data as any) || [];
        } catch (error: any) {
            console.error('Erro ao buscar pedidos:', error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // Atualiza apenas o status do pedido (Cozinha -> Pronto -> Entregue)
    const atualizarStatusPedido = async (pedidoId: string, novoStatus: string) => {
        try {
            const { error } = await client
                .from('pedidos')
                .update({ status: novoStatus } as any)
                .eq('id', pedidoId);

            if (error) throw error;

            // Atualiza estado local
            const index = pedidos.value.findIndex(p => p.id === pedidoId);
            if (index !== -1) {
                pedidos.value[index].status = novoStatus as any;
            }
        } catch (error: any) {
            console.error('Erro ao atualizar status do pedido:', error.message);
            throw error;
        }
    };

    // Configura o Realtime para escutar mudanças em pedidos
    const setupRealtimePedidos = (onUpdate: () => void) => {
        const channel = client
            .channel('pedidos-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*', // Escuta INSERT, UPDATE e DELETE
                    schema: 'public',
                    table: 'pedidos'
                },
                () => {
                    // Sempre que algo mudar nos pedidos, chamamos o callback
                    onUpdate();
                }
            )
            .subscribe();

        return channel;
    };

    // Busca todos os pagamentos já realizados por uma mesa específica
    const fetchPagamentosMesa = async (mesaId: string) => {
        try {
            const { data, error } = await client
                .from('pagamentos' as any)
                .select('*')
                .eq('mesa_id', mesaId);

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error('Erro ao buscar pagamentos:', error.message);
            throw error;
        }
    };

    // Registra um novo pagamento na tabela pagamentos
    const registrarPagamento = async (dados: { mesa_id: string, valor: number, metodo_pagamento: string }) => {
        try {
            const { data, error } = await client
                .from('pagamentos' as any)
                .insert([dados])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Erro ao registrar pagamento:', error.message);
            throw error;
        }
    };

    // Finaliza a mesa: limpa pagamentos, marca pedidos como finalizados e libera a mesa
    const finalizarMesa = async (mesaId: string) => {
        try {
            // 1. Marcar todos os pedidos ativos da mesa como 'finalizado'
            const { error: errorPedidos } = await client
                .from('pedidos')
                .update({ status: 'finalizado' } as any)
                .eq('mesa_id', mesaId)
                .neq('status', 'finalizado');

            if (errorPedidos) throw errorPedidos;

            // 2. Remover o registro de pagamentos temporários dessa mesa (já que foi fechada)
            // Nota: Em um sistema real, você pode querer manter isso para relatórios, 
            // mas aqui limparemos para permitir que a próxima pessoa use a mesa do zero.
            const { error: errorPagamentos } = await client
                .from('pagamentos' as any)
                .delete()
                .eq('mesa_id', mesaId);

            if (errorPagamentos) throw errorPagamentos;

            // 3. Mudar o status da mesa para 'livre'
            await atualizarStatusMesa(mesaId, 'livre');

        } catch (error: any) {
            console.error('Erro ao finalizar mesa:', error.message);
            throw error;
        }
    };

    return {
        pedidos,
        mesas,
        loading,
        fetchMesas,
        fetchPedidos,
        criarPedido,
        atualizarStatusPedido,
        atualizarStatusMesa,
        criarMesa,
        setupRealtimePedidos,
        fetchPagamentosMesa,
        registrarPagamento,
        finalizarMesa
    };
};
