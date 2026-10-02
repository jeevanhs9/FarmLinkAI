import { formatINR } from '../../utils/format'
import { calculateUnitPrice } from '../../utils/pricing'

export default function PriceBreakdown({ unitPrice, unit = 'kg', className = '' }) {
  const { subtotal, logisticsFee, platformFee, total } = calculateUnitPrice(unitPrice)
  const rows = [
    ['Farmer Price', subtotal],
    ['Logistics Cost (8%)', logisticsFee],
    ['Platform Fee', platformFee],
  ]
  return (
    <div className={`card p-4 ${className}`}>
      <h3 className="font-display font-semibold text-sm text-ink-900 mb-3">Price Breakdown (per {unit})</h3>
      <div className="space-y-2 text-sm">
        {rows.map(([label, val]) => (
          <div key={label} className="flex justify-between text-ink-700">
            <span>{label}</span>
            <span>{formatINR(val)}</span>
          </div>
        ))}
        <div className="border-t border-ink-100 pt-2 flex justify-between font-semibold text-ink-900">
          <span>Final Price</span>
          <span>{formatINR(total)}</span>
        </div>
      </div>
    </div>
  )
}
