import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

type Pedido = Database['public']['Tables']['pedidos']['Row'];
type ItemPedido = Database['public']['Tables']['itens_pedido']['Row'];
type Mesa = Database['public']['Tables']['mesas']['Row'];

export interface ItemPedidoInput {
    produto_simples_id?: string | null;
    tamanho_id?: string | null;
    item_cardapio_id?: string | null;
    nome_item?: string | null;
    ponto_carne?: string | null;
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

export interface PedidoCompleto extends Pedido {
    itens: ItemPedido[];
    mesa?: Mesa | null;
}

export const usePedidos = () => {
    const client = useSupabaseClient<Database>();

    const pedidos = ref<PedidoCompleto[]>([]);
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
            const mesaExistente = mesas.value[index];
            if (mesaExistente) {
                mesaExistente.status = status;
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
    const fetchPedidos = async (filtros?: { status?: ('novo' | 'em_preparo' | 'pronto' | 'entregue' | 'finalizado')[] }) => {
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
                        tamanho:tamanhos(nome),
                        item_cardapio:itens_cardapio(*)
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

    // Busca pedidos ativos (não finalizados) de uma mesa específica
    const fetchPedidosDaMesa = async (mesaId: string) => {
        try {
            const { data, error } = await client
                .from('pedidos')
                .select(`
                    *,
                    itens:itens_pedido(
                        *,
                        produto_simples:produtos_simples(*),
                        tamanho:tamanhos(nome),
                        item_cardapio:itens_cardapio(*)
                    )
                `)
                .eq('mesa_id', mesaId)
                .neq('status', 'finalizado')
                .order('criado_em', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error('Erro ao buscar pedidos da mesa:', error.message);
            throw error;
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
            const index = pedidos.value.findIndex((p: any) => p.id === pedidoId);
            const pedidoExistente = pedidos.value[index];
            if (pedidoExistente) {
                pedidoExistente.status = novoStatus as any;
            }
        } catch (error: any) {
            console.error('Erro ao atualizar status do pedido:', error.message);
            throw error;
        }
    };

    // Exclui um item específico de um pedido e recalcula o total
    const excluirItemPedido = async (pedidoId: string, itemId: string) => {
        try {
            // 1. Deletar o item
            const { error: errorDelete } = await client
                .from('itens_pedido')
                .delete()
                .eq('id', itemId);
                
            if (errorDelete) throw errorDelete;

            // 2. Buscar itens restantes para recalcular
            const { data: itensRestantes, error: errorItens } = await client
                .from('itens_pedido')
                .select('*')
                .eq('pedido_id', pedidoId);

            if (errorItens) throw errorItens;

            // 3. Calcular novo total
            const novoTotal = itensRestantes.reduce((acc, item) => acc + (item.preco_unitario * item.quantidade), 0);

            // 4. Atualizar o pedido com novo total
            const { error: errorUpdate } = await client
                .from('pedidos')
                .update({ total: novoTotal } as any)
                .eq('id', pedidoId);

            if (errorUpdate) throw errorUpdate;

            // 5. Atualizar estado local
            const pedido = pedidos.value.find((p: any) => p.id === pedidoId);
            if (pedido) {
                pedido.total = novoTotal;
                pedido.itens = pedido.itens.filter((i: any) => i.id !== itemId);
            }
            
            return { sucesso: true, novoTotal };
        } catch (error: any) {
            console.error('Erro ao excluir item do pedido:', error.message);
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

    // Busca os pagamentos de uma mesa, opcionalmente a partir de uma data (para evitar histórico antigo)
    const fetchPagamentosMesa = async (mesaId: string, dataApos?: string) => {
        try {
            let query = client
                .from('pagamentos' as any)
                .select('*')
                .eq('mesa_id', mesaId);

            if (dataApos) {
                // Pegamos 5 segundos antes para evitar problemas de sincronia de milisegundos
                const dataFiltro = new Date(new Date(dataApos).getTime() - 5000).toISOString();
                query = query.gte('criado_em', dataFiltro);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error('Erro ao buscar pagamentos:', error.message);
            throw error;
        }
    };

    // Registra um novo pagamento na tabela pagamentos
    const registrarPagamento = async (dados: { mesa_id: string, valor: number, metodo_pagamento: string, venda_id?: string }) => {
        try {
            const { data, error } = await client
                .from('pagamentos' as any)
                .insert([dados])
                .select();

            if (error) throw error;
            return data?.[0];
        } catch (error: any) {
            console.error('Erro ao registrar pagamento:', error.message);
            throw error;
        }
    };

    // Finaliza a mesa: vincula pedidos ao venda_id, marca como finalizados e libera a mesa
    const finalizarMesa = async (params: { mesaId: string, vendaId: string }) => {
        const { mesaId, vendaId } = params;
        try {
            // 1. Marcar todos os pedidos ativos da mesa como 'finalizado' e vincular ao venda_id
            const { error: errorPedidos } = await client
                .from('pedidos')
                .update({
                    status: 'finalizado',
                    venda_id: vendaId
                } as any)
                .eq('mesa_id', mesaId)
                .neq('status', 'finalizado');

            if (errorPedidos) throw errorPedidos;

            // 2. Vincular todos os pagamentos dessa mesa que ainda não têm venda_id
            const { error: errorPagamentos } = await client
                .from('pagamentos' as any)
                .update({ venda_id: vendaId } as any)
                .eq('mesa_id', mesaId)
                .is('venda_id', null);

            if (errorPagamentos) throw errorPagamentos;

            // 3. Mudar o status da mesa para 'livre'
            await atualizarStatusMesa(mesaId, 'livre');

        } catch (error: any) {
            console.error('Erro ao finalizar mesa:', error.message);
            throw error;
        }
    };

    // Busca pedidos por um período específico (para o financeiro)
    const fetchPedidosPorPeriodo = async (dataInicio: string, dataFim: string) => {
        loading.value = true;
        try {
            const { data, error } = await client
                .from('pedidos')
                .select('*, mesa:mesas(numero)')
                .eq('status', 'finalizado')
                .gte('criado_em', dataInicio)
                .lte('criado_em', dataFim)
                .order('criado_em', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error('Erro ao buscar pedidos por período:', error.message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // Busca detalhes de pagamentos por período (para o resumo de métodos)
    const fetchPagamentosPorPeriodo = async (dataInicio: string, dataFim: string) => {
        try {
            const { data, error } = await client
                .from('pagamentos' as any)
                .select('*')
                .gte('criado_em', dataInicio)
                .lte('criado_em', dataFim);

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error('Erro ao buscar pagamentos por período:', error.message);
            throw error;
        }
    };

    return {
        pedidos,
        mesas,
        loading,
        fetchMesas,
        fetchPedidos,
        fetchPedidosDaMesa,
        fetchPedidosPorPeriodo,
        fetchPagamentosPorPeriodo,
        criarPedido,
        atualizarStatusPedido,
        excluirItemPedido,
        atualizarStatusMesa,
        criarMesa,
        setupRealtimePedidos,
        fetchPagamentosMesa,
        registrarPagamento,
        finalizarMesa
    };
};
