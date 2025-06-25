export function formatCurrency(value: number | string): string {
    const number = typeof value === 'string' ? parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) : value

    if (isNaN(number)) return 'R$ 0,00'

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).format(number)
}
