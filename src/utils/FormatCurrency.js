// Format a number as currency. Prices in the backend are plain numbers (e.g. 120.00).

export const formatCurrency = (value, currency = 'USD') => {
  const amount = Number(value)
  if (value === null || value === undefined || Number.isNaN(amount)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}
