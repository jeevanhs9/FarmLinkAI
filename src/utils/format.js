export function formatINR(value) {
  return '\u20B9' + Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function demandColor(level) {
  switch (level) {
    case 'High': return { bg: 'bg-clay-100', text: 'text-clay-500' }
    case 'Medium': return { bg: 'bg-amber-100', text: 'text-amber-500' }
    default: return { bg: 'bg-leaf-100', text: 'text-forest-700' }
  }
}
