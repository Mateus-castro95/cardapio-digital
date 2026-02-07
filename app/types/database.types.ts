export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            categorias: {
                Row: {
                    id: string
                    nome: string
                }
                Insert: {
                    id?: string
                    nome: string
                }
                Update: {
                    id?: string
                    nome?: string
                }
                Relationships: []
            },
            tamanhos: {
                Row: {
                    id: string
                    nome: string
                    preco_base: number
                    max_sabores: number
                }
                Insert: {
                    id?: string
                    nome: string
                    preco_base: number
                    max_sabores?: number
                }
                Update: {
                    id?: string
                    nome?: string
                    preco_base?: number
                    max_sabores?: number
                }
                Relationships: []
            },
            sabores: {
                Row: {
                    id: string
                    nome: string
                    tipo: 'tradicional' | 'especial'
                    ativo: boolean
                    categoria: 'salgado' | 'doce'
                }
                Insert: {
                    id?: string
                    nome: string
                    tipo: 'tradicional' | 'especial'
                    ativo?: boolean
                    categoria: 'salgado' | 'doce'
                }
                Update: {
                    id?: string
                    nome?: string
                    tipo?: 'tradicional' | 'especial'
                    ativo?: boolean
                    categoria?: 'salgado' | 'doce'
                }
                Relationships: []
            },
            produtos: {
                Row: {
                    id: string
                    nome: string
                    categoria_id: string
                    tipo_produto: 'simples' | 'configuravel'
                    ativo: boolean
                    criado_em: string
                    subtipo: string
                }
                Insert: {
                    id?: string
                    nome: string
                    categoria_id: string
                    tipo_produto: 'simples' | 'configuravel'
                    ativo?: boolean
                    criado_em?: string
                    subtipo: string
                }
                Update: {
                    id?: string
                    nome?: string
                    categoria_id?: string
                    tipo_produto?: 'simples' | 'configuravel'
                    ativo?: boolean
                }
                Relationships: [
                    {
                        foreignKeyName: "produtos_categoria_id_fkey"
                        columns: ["categoria_id"]
                        referencedRelation: "categorias"
                        referencedColumns: ["id"]
                    }
                ]
            },
            produtos_simples: {
                Row: {
                    id: string
                    produto_id: string
                    preco: number
                    tipo_bebida: 'suco' | 'refrigerante' | 'agua'
                    volume_ml: number | null
                    tipo_preparo: 'agua' | 'leite' | null
                    ativo: boolean
                    tipo_gas: 'com_gas' | 'sem_gas' | null
                    sabor: string | null
                    tamanho: string | null
                }
                Insert: {
                    id?: string
                    produto_id: string
                    preco: number
                    tipo_bebida: 'suco' | 'refrigerante' | 'agua'
                    volume_ml?: number | null
                    tipo_preparo?: 'agua' | 'leite' | null
                    ativo?: boolean
                    tipo_gas?: 'com_gas' | 'sem_gas' | null
                    sabor?: string | null
                    tamanho?: string | null
                }
                Update: {
                    id?: string
                    produto_id?: string
                    preco?: number
                    tipo_bebida?: 'suco' | 'refrigerante' | 'agua'
                    volume_ml?: number | null
                    tipo_preparo?: 'agua' | 'leite' | null
                    ativo?: boolean
                    tipo_gas?: 'com_gas' | 'sem_gas' | null
                    sabor?: string | null
                    tamanho?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "produtos_simples_produto_id_fkey"
                        columns: ["produto_id"]
                        referencedRelation: "produtos"
                        referencedColumns: ["id"]
                    }
                ]
            },
            adicional_sabor_tamanho: {
                Row: {
                    id: string
                    sabor_id: string
                    tamanho_id: string
                    valor_adicional: number
                }
                Insert: {
                    id?: string
                    sabor_id: string
                    tamanho_id: string
                    valor_adicional: number
                }
                Update: {
                    id?: string
                    sabor_id?: string
                    tamanho_id?: string
                    valor_adicional?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "adicional_sabor_tamanho_sabor_id_fkey"
                        columns: ["sabor_id"]
                        referencedRelation: "sabores"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "adicional_sabor_tamanho_tamanho_id_fkey"
                        columns: ["tamanho_id"]
                        referencedRelation: "tamanhos"
                        referencedColumns: ["id"]
                    }
                ]
            },
            mesas: {
                Row: {
                    id: string
                    numero: number
                    status: 'livre' | 'ocupada'
                    atualizado_em: string
                }
                Insert: {
                    id?: string
                    numero: number
                    status?: 'livre' | 'ocupada'
                    atualizado_em?: string
                }
                Update: {
                    id?: string
                    numero?: number
                    status?: 'livre' | 'ocupada'
                    atualizado_em?: string
                }
                Relationships: []
            },
            pedidos: {
                Row: {
                    id: string
                    numero_sequencial: number
                    mesa_id: string | null
                    status: 'novo' | 'em_preparo' | 'pronto' | 'entregue' | 'finalizado'
                    total: number
                    criado_em: string
                    atualizado_em: string
                    venda_id: string | null
                }
                Insert: {
                    id?: string
                    numero_sequencial?: number
                    mesa_id?: string | null
                    status?: 'novo' | 'em_preparo' | 'pronto' | 'entregue' | 'finalizado'
                    total?: number
                    criado_em?: string
                    atualizado_em?: string
                    venda_id?: string | null
                }
                Update: {
                    id?: string
                    numero_sequencial?: number
                    mesa_id?: string | null
                    status?: 'novo' | 'em_preparo' | 'pronto' | 'entregue' | 'finalizado'
                    total?: number
                    criado_em?: string
                    atualizado_em?: string
                    venda_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "pedidos_mesa_id_fkey"
                        columns: ["mesa_id"]
                        referencedRelation: "mesas"
                        referencedColumns: ["id"]
                    }
                ]
            },
            pagamentos: {
                Row: {
                    id: string
                    mesa_id: string
                    valor: number
                    metodo_pagamento: string
                    criado_em: string
                    venda_id: string | null
                }
                Insert: {
                    id?: string
                    mesa_id: string
                    valor: number
                    metodo_pagamento: string
                    criado_em?: string
                    venda_id?: string | null
                }
                Update: {
                    id?: string
                    mesa_id?: string
                    valor?: number
                    metodo_pagamento?: string
                    criado_em?: string
                    venda_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "pagamentos_mesa_id_fkey"
                        columns: ["mesa_id"]
                        referencedRelation: "mesas"
                        referencedColumns: ["id"]
                    }
                ]
            },
            itens_pedido: {
                Row: {
                    id: string
                    pedido_id: string
                    produto_simples_id: string | null
                    tamanho_id: string | null
                    sabores: Json
                    quantidade: number
                    preco_unitario: number
                    observacoes: string | null
                    criado_em: string
                }
                Insert: {
                    id?: string
                    pedido_id: string
                    produto_simples_id?: string | null
                    tamanho_id?: string | null
                    sabores?: Json
                    quantidade?: number
                    preco_unitario: number
                    observacoes?: string | null
                    criado_em?: string
                }
                Update: {
                    id?: string
                    pedido_id?: string
                    produto_simples_id?: string | null
                    tamanho_id?: string | null
                    sabores?: Json
                    quantidade?: number
                    preco_unitario?: number
                    observacoes?: string | null
                    criado_em?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "itens_pedido_pedido_id_fkey"
                        columns: ["pedido_id"]
                        referencedRelation: "pedidos"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "itens_pedido_produto_simples_id_fkey"
                        columns: ["produto_simples_id"]
                        referencedRelation: "produtos_simples"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "itens_pedido_tamanho_id_fkey"
                        columns: ["tamanho_id"]
                        referencedRelation: "tamanhos"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
