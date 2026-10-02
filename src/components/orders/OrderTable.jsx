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

export default function OrderTable({ orders, columns = ['id', 'buyer', 'product', 'quantity', 'total', 'stage', 'placedOn'], onRowClick }) {
  const LABELS = { id: 'Order ID', buyer: 'Buyer', farmer: 'Farmer / FPO', product: 'Product', quantity: 'Qty', total: 'Total', stage: 'Status', placedOn: 'Placed On' }
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand-100 text-left text-ink-500 text-xs font-medium">
              {columns.map((c) => <th key={c} className="px-4 py-3 whitespace-nowrap">{LABELS[c]}</th>)}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                onClick={() => onRowClick?.(o)}
                onKeyDown={(event) => { if (onRowClick && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onRowClick(o) } }}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={onRowClick ? `View order ${o.id}` : undefined}
                className={`border-t border-ink-100 hover:bg-sand-50 ${onRowClick ? 'cursor-pointer focus:bg-sand-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-forest-600' : ''}`}
              >
                {columns.map((c) => (
                  <td key={c} className="px-4 py-3 whitespace-nowrap text-ink-700">
                    {c === 'id' && <span className="font-medium text-ink-900">{o.id}</span>}
                    {c === 'quantity' && `${o.quantity} ${o.unit}`}
                    {c === 'total' && formatINR(o.total)}
                    {c === 'stage' && <Badge tone={STAGE_TONE[o.stage]}>{o.stage}</Badge>}
                    {c === 'placedOn' && formatDate(o.placedOn)}
                    {!['id', 'quantity', 'total', 'stage', 'placedOn'].includes(c) && o[c]}
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
