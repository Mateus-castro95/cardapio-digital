/**
 * Formata um número como moeda brasileira (R$ 0,00)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada no padrão brasileiro
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
