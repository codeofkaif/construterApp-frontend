export function formatIndianRupee(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatLakhTotal(amount: number): string {
  const lakh = amount / 100000
  const formatted = Number.isInteger(lakh) ? lakh.toString() : lakh.toFixed(1)
  return `₹${formatted} Lakh`
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}
