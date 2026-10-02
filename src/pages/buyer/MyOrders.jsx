import { useState } from 'react'
import { useApp } from '../../context/useApp'
import OrderTable from '../../components/orders/OrderTable'
import OrderTimeline from '../../components/orders/OrderTimeline'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import { ClipboardList } from 'lucide-react'
import { formatDate, formatINR } from '../../utils/format'

const STAGE_TONE = {
  'Order Placed': 'info', Confirmed: 'medium', Packed: 'medium',
  'Picked Up': 'medium', 'In Transit': 'medium', Delivered: 'success',
}

export default function MyOrders() {
  const { user, orders } = useApp()
  const [selected, setSelected] = useState(null)
  const myOrders = orders.filter((o) => o.buyerId === user.id)
  const active = myOrders.filter((o) => o.stage !== 'Delivered')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">My Orders</h2>
          <p className="text-sm font-medium text-ink-500 mt-1">
            {myOrders.length} total · {active.length} active
          </p>
        </div>
      </div>

      {myOrders.length ? (
        <OrderTable
          orders={myOrders}
          columns={['id', 'farmer', 'product', 'quantity', 'total', 'stage', 'placedOn']}
          onRowClick={setSelected}
        />
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Once you place an order from the marketplace, it will appear here."
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.id}`} maxWidth="max-w-2xl">
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Farmer / FPO', value: selected.farmer },
                { label: 'Product', value: selected.product },
                { label: 'Quantity', value: `${selected.quantity} ${selected.unit}` },
                { label: 'Order Total', value: formatINR(selected.total) },
                { label: 'Placed On', value: formatDate(selected.placedOn) },
                { label: 'Expected Delivery', value: formatDate(selected.eta) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-sand-50 rounded-xl p-3 border border-ink-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500 mb-1">{label}</p>
                  <p className="font-semibold text-ink-900 text-sm">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Fulfillment Status</p>
                <Badge tone={STAGE_TONE[selected.stage]} rounded="rounded-full">{selected.stage}</Badge>
              </div>
              <OrderTimeline currentStage={selected.stage} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
