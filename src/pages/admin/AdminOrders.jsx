import { useState } from 'react'
import { useApp } from '../../context/useApp'
import OrderTable from '../../components/orders/OrderTable'
import SearchBar from '../../components/marketplace/SearchBar'
import EmptyState from '../../components/ui/EmptyState'
import { ClipboardList } from 'lucide-react'

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
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by order ID, buyer or product..." />
        <p className="text-sm text-ink-500">{filtered.length} of {orders.length} orders</p>
      </div>
      {filtered.length ? <OrderTable orders={filtered} columns={['id', 'buyer', 'farmer', 'product', 'quantity', 'total', 'stage', 'placedOn']} /> : <EmptyState icon={ClipboardList} title="No orders found" description="Try a different order ID, buyer, farmer, or product." />}
    </div>
  )
}
