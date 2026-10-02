import { useState } from 'react'
import { useApp } from '../../context/useApp'
import OrderTable from '../../components/orders/OrderTable'
import OrderTimeline from '../../components/orders/OrderTimeline'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { ClipboardList } from 'lucide-react'
import { formatDate, formatINR } from '../../utils/format'

export default function MyOrders() {
  const { user, orders } = useApp()
  const [selected, setSelected] = useState(null)
  const myOrders = orders.filter((o) => o.buyerId === user.id)

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">{myOrders.length} orders placed</p>
      {myOrders.length ? (
        <OrderTable
          orders={myOrders}
          columns={['id', 'farmer', 'product', 'quantity', 'total', 'stage', 'placedOn']}
          onRowClick={setSelected}
        />
      ) : (
        <EmptyState icon={ClipboardList} title="No orders yet" description="Orders you place will show up here." />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.id} maxWidth="max-w-xl">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-ink-500 text-xs">Farmer / FPO</p><p className="font-medium text-ink-900">{selected.farmer}</p></div>
              <div><p className="text-ink-500 text-xs">Product</p><p className="font-medium text-ink-900">{selected.product}</p></div>
              <div><p className="text-ink-500 text-xs">Quantity</p><p className="font-medium text-ink-900">{selected.quantity} {selected.unit}</p></div>
              <div><p className="text-ink-500 text-xs">Total</p><p className="font-medium text-ink-900">{formatINR(selected.total)}</p></div>
              <div><p className="text-ink-500 text-xs">Placed On</p><p className="font-medium text-ink-900">{formatDate(selected.placedOn)}</p></div>
              <div><p className="text-ink-500 text-xs">Expected Delivery</p><p className="font-medium text-ink-900">{formatDate(selected.eta)}</p></div>
            </div>
            <OrderTimeline currentStage={selected.stage} />
          </div>
        )}
      </Modal>
    </div>
  )
}
