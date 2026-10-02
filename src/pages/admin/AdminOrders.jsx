import { useState } from 'react'
import { useApp } from '../../context/useApp'
import OrderTable from '../../components/orders/OrderTable'
import EmptyState from '../../components/ui/EmptyState'
import { ClipboardList, Search } from 'lucide-react'

export default function AdminOrders() {
  const { orders } = useApp()
  const [query, setQuery] = useState('')
  const filtered = orders.filter((o) =>
    o.id.toLowerCase().includes(query.toLowerCase()) ||
    o.buyer.toLowerCase().includes(query.toLowerCase()) ||
    o.farmer.toLowerCase().includes(query.toLowerCase()) ||
    o.product.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Platform Orders</h2>
          <p className="text-sm font-medium text-ink-500 mt-1">{filtered.length} of {orders.length} orders</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID, buyer, farmer or product..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-white text-sm font-medium focus-ring focus:border-forest-500 transition-colors"
          />
        </div>
      </div>

      {filtered.length ? (
        <OrderTable
          orders={filtered}
          columns={['id', 'buyer', 'farmer', 'product', 'quantity', 'total', 'stage', 'placedOn']}
        />
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No orders found"
          description="Try a different order ID, buyer, farmer, or product name."
        />
      )}
    </div>
  )
}
