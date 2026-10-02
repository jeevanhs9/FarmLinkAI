import Badge from '../ui/Badge'
import { formatDate, formatINR } from '../../utils/format'

const STAGE_TONE = {
  'Order Placed': 'info',
  Confirmed: 'medium',
  Packed: 'medium',
  'Picked Up': 'medium',
  'In Transit': 'medium',
  Delivered: 'success',
}

const LABELS = {
  id: 'Order ID', buyer: 'Buyer', farmer: 'Farmer / FPO',
  product: 'Product', quantity: 'Qty', total: 'Total',
  stage: 'Status', placedOn: 'Placed On',
}

export default function OrderTable({
  orders,
  columns = ['id', 'buyer', 'product', 'quantity', 'total', 'stage', 'placedOn'],
  onRowClick,
}) {
  return (
    <div className="card overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-sand-50/80 border-b border-ink-100 text-[11px] text-ink-500 uppercase tracking-widest font-bold">
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-5 py-4 whitespace-nowrap">{LABELS[c]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {orders.map((o) => (
              <tr
                key={o.id}
                onClick={() => onRowClick?.(o)}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onRowClick(o)
                  }
                }}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={onRowClick ? `View order ${o.id}` : undefined}
                className={`hover:bg-sand-50 transition-colors ${onRowClick ? 'cursor-pointer focus:bg-sand-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-forest-600' : ''}`}
              >
                {columns.map((c) => (
                  <td key={c} className="px-5 py-4 whitespace-nowrap text-ink-700">
                    {c === 'id' && (
                      <span className="font-display font-bold text-ink-900">{o.id}</span>
                    )}
                    {c === 'quantity' && (
                      <span>
                        <span className="font-semibold text-ink-900">{o.quantity}</span>
                        <span className="text-xs text-ink-500 ml-1">{o.unit}</span>
                      </span>
                    )}
                    {c === 'total' && (
                      <span className="font-display font-bold text-ink-900">{formatINR(o.total)}</span>
                    )}
                    {c === 'stage' && (
                      <Badge tone={STAGE_TONE[o.stage]} rounded="rounded-full">{o.stage}</Badge>
                    )}
                    {c === 'placedOn' && (
                      <span className="text-xs font-medium">{formatDate(o.placedOn)}</span>
                    )}
                    {!['id', 'quantity', 'total', 'stage', 'placedOn'].includes(c) && (
                      <span className="font-medium text-ink-700">{o[c]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
