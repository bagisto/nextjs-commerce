export function getFormattedPrice(amount: number, currency: string) {
  const formatCurrency = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency,
  })

  return formatCurrency.format(amount)
}
