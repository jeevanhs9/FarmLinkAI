import { useState } from 'react'
import { useApp } from '../../context/useApp'
import { ORDER_STAGES } from '../../data/orders'
import OrderTable from '../../components/orders/OrderTable'
import OrderTimeline from '../../components/orders/OrderTimeline'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { ClipboardList } from 'lucide-react'
import { formatDate, formatINR } from '../../utils/format'

export default function FarmerOrders() {
  const { user, orders, advanceOrderStage } = useApp()
  const [selected, setSelected] = useState(null)
  const myOrders = orders.filter((o) => o.farmerId === user.id)

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">{myOrders.length} orders for your listed produce</p>
      {myOrders.length ? (
        <OrderTable
          orders={myOrders}
          columns={['id', 'buyer', 'product', 'quantity', 'total', 'stage', 'placedOn']}
          onRowClick={setSelected}
        />
      ) : (
        <EmptyState icon={ClipboardList} title="No orders yet" description="Orders for your listings will show up here." />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.id} maxWidth="max-w-xl">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-ink-500 text-xs">Buyer</p><p className="font-medium text-ink-900">{selected.buyer}</p></div>
              <div><p className="text-ink-500 text-xs">Product</p><p className="font-medium text-ink-900">{selected.product}</p></div>
              <div><p className="text-ink-500 text-xs">Quantity</p><p className="font-medium text-ink-900">{selected.quantity} {selected.unit}</p></div>
              <div><p className="text-ink-500 text-xs">Total</p><p className="font-medium text-ink-900">{formatINR(selected.total)}</p></div>
              <div><p className="text-ink-500 text-xs">Placed On</p><p className="font-medium text-ink-900">{formatDate(selected.placedOn)}</p></div>
              <div><p className="text-ink-500 text-xs">Expected Delivery</p><p className="font-medium text-ink-900">{formatDate(selected.eta)}</p></div>
            </div>
            <OrderTimeline currentStage={selected.stage} />
            {selected.stage !== 'Delivered' && (
              <Button size="sm" onClick={() => { advanceOrderStage(selected.id); setSelected((s) => ({ ...s, stage: nextStage(s.stage) })) }}>
                Advance to next stage
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function nextStage(stage) {
  const idx = ORDER_STAGES.indexOf(stage)
  return ORDER_STAGES[Math.min(idx + 1, ORDER_STAGES.length - 1)]
}
