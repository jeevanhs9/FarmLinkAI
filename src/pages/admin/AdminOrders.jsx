import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import OrderTable from '../../components/orders/OrderTable'
import SearchBar from '../../components/marketplace/SearchBar'

export default function AdminOrders() {
  const { orders } = useApp()
  const [query, setQuery] = useState('')
  const filtered = orders.filter((o) =>
    o.id.toLowerCase().includes(query.toLowerCase()) ||
    o.buyer.toLowerCase().includes(query.toLowerCase()) ||
    o.product.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by order ID, buyer or product..." />
        <p className="text-sm text-ink-500">{filtered.length} of {orders.length} orders</p>
      </div>
      <OrderTable orders={filtered} columns={['id', 'buyer', 'farmer', 'product', 'quantity', 'total', 'stage', 'placedOn']} />
    </div>
  )
}
