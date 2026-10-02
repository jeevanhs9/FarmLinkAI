export const LOGISTICS_RATE = 0.08
export const PLATFORM_RATE = 0.02

export function calculateUnitPrice(unitPrice) {
  const subtotal = Number(unitPrice)
  const logisticsFee = subtotal * LOGISTICS_RATE
  const platformFee = subtotal * PLATFORM_RATE
  return { subtotal, logisticsFee, platformFee, total: subtotal + logisticsFee + platformFee }
}

export function calculateLinePrice(unitPrice, quantity) {
  const subtotal = Number(unitPrice) * Number(quantity)
  const logisticsFee = Math.round(subtotal * LOGISTICS_RATE)
  const platformFee = Math.round(subtotal * PLATFORM_RATE)
  return { subtotal, logisticsFee, platformFee, total: subtotal + logisticsFee + platformFee }
}

export function calculateOrderSummary(items) {
  return items.reduce((summary, item) => {
    const line = calculateLinePrice(item.product.price, item.quantity)
    return {
      subtotal: summary.subtotal + line.subtotal,
      logistics: summary.logistics + line.logisticsFee,
      platformFee: summary.platformFee + line.platformFee,
      total: summary.total + line.total,
    }
  }, { subtotal: 0, logistics: 0, platformFee: 0, total: 0 })
}
