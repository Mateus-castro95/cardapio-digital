import { ref, computed } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

type Mesa = Database['public']['Tables']['mesas']['Row'];
type Pedido = Database['public']['Tables']['pedidos']['Row'];
type ItemPedido = Database['public']['Tables']['itens_pedido']['Row'];

export const useDashboard = () => {
    const client = useSupabaseClient<Database>();

    const mesas = ref<Mesa[]>([]);
    const pedidosHoje = ref<(Pedido & { itens: any[] })[]>([]);
    const loading = ref(false);

    // Busca dados iniciais
    const carregarDados = async () => {
        loading.value = true;
        try {
            // 1. Buscar Mesas
            const { data: dataMesas } = await client
                .from('mesas')
                .select('*')
                .order('numero', { ascending: true });
            mesas.value = dataMesas || [];

            // 2. Buscar Pedidos de Hoje (respeitando fuso de SP)
            const hoje = new Date();
            const offset = hoje.getTimezoneOffset() * 60000;
            const dataInicio = new Date(hoje.getTime() - offset).toISOString().split('T')[0] + 'T00:00:00-03:00';
            const dataFim = new Date(hoje.getTime() - offset).toISOString().split('T')[0] + 'T23:59:59-03:00';

            const { data: dataPedidos } = await client
                .from('pedidos')
                .select(`
                    *,
                    itens:itens_pedido(
                        *,
                        produto_simples:produtos_simples(sabor, produto_id)
                    )
                `)
                .gte('criado_em', dataInicio)
                .lte('criado_em', dataFim);

            pedidosHoje.value = (dataPedidos as any) || [];
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            loading.value = false;
        }
    };

    // Estatística 1: Ocupação (X de Y)
    const statsOcupacao = computed(() => {
        const total = mesas.value.length;
        const ocupadas = mesas.value.filter(m => m.status === 'ocupada').length;
        return { total, ocupadas };
    });

    // Estatística 2: Detalhes das Mesas Ocupadas (Valor e Tempo)
    const detalhesMesasOcupadas = computed(() => {
        return mesas.value
            .filter(m => m.status === 'ocupada')
            .map(mesa => {
                // Pedidos ativos desta mesa (não finalizados)
                const pedidosDaMesa = pedidosHoje.value.filter(p => p.mesa_id === mesa.id && p.status !== 'finalizado');

                const totalConsumido = pedidosDaMesa.reduce((acc, p) => acc + (p.total || 0), 0);

                // Tempo de ocupação (desde o primeiro pedido ativo)
                let tempoMinutos = 0;
                if (pedidosDaMesa.length > 0) {
                    const primeiroPedido = pedidosDaMesa.reduce((min, p) => {
                        if (!min) return p;
                        return new Date(p.criado_em).getTime() < new Date(min.criado_em).getTime() ? p : min;
                    }, pedidosDaMesa[0]);

                    if (primeiroPedido) {
                        const inicio = new Date(primeiroPedido.criado_em).getTime();
                        const agora = new Date().getTime();
                        tempoMinutos = Math.floor((agora - inicio) / 60000);
                    }
                }

                return {
                    numero: mesa.numero,
                    total: totalConsumido,
                    tempo: tempoMinutos
                };
            })
            .sort((a, b) => a.numero - b.numero);
    });

    // Estatística 3: Top 5 Produtos Hoje
    const topProdutos = computed(() => {
        const contagem: Record<string, { nome: string, qtd: number, tipo: string }> = {};

        pedidosHoje.value.forEach(pedido => {
            pedido.itens.forEach((item: any) => {
                // Identificar o nome do produto/sabor
                let nome = 'Produto';
                let tipo = 'Outro';

                if (item.tamanho_id) {
                    // É um pastel (tem sabores)
                    tipo = 'Pastel';
                    const sabores = item.sabores;
                    if (Array.isArray(sabores)) {
                        nome = sabores.map((s: any) => s.nome).join(' + ');
                    } else {
                        nome = 'Pastel Montado';
                    }
                } else if (item.produto_simples) {
                    // É uma bebida ou produto simples
                    tipo = 'Bebida';
                    nome = item.produto_simples.sabor || 'Bebida';
                }

                if (!contagem[nome]) {
                    contagem[nome] = { nome: nome as string, qtd: 0, tipo: tipo as string };
                }
                const current = contagem[nome];
                if (current) {
                    current.qtd += item.quantidade || 0;
                }
            });
        });

        return Object.values(contagem)
            .sort((a, b) => b.qtd - a.qtd)
            .slice(0, 5);
    });

    // Realtime listeners
    const setupRealtime = () => {
        const channel = client
            .channel('dashboard-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => carregarDados())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'mesas' }, () => carregarDados())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'itens_pedido' }, () => carregarDados())
            .subscribe();

        return channel;
    };

    return {
        loading,
        carregarDados,
        setupRealtime,
        statsOcupacao,
        detalhesMesasOcupadas,
        topProdutos
    };
};
