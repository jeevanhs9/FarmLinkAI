import { useState } from 'react'
import { buyers } from '../../data/buyers'
import SearchBar from '../../components/marketplace/SearchBar'
import Badge from '../../components/ui/Badge'
import { formatDate, formatINR } from '../../utils/format'
import EmptyState from '../../components/ui/EmptyState'
import { ShoppingBag } from 'lucide-react'

export default function AdminBuyers() {
  const [query, setQuery] = useState('')
  const filtered = buyers.filter((b) => `${b.name} ${b.type} ${b.location}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search buyers..." />
        <p className="text-sm text-ink-500">{filtered.length} of {buyers.length} buyers</p>
      </div>
      {filtered.length === 0 ? <EmptyState icon={ShoppingBag} title="No buyers found" description="Try another buyer name, type, or location." /> : <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-100 text-left text-ink-500 text-xs font-medium">
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total Spend</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-ink-100 hover:bg-sand-50">
                  <td className="px-4 py-3 font-medium text-ink-900">{b.name}</td>
                  <td className="px-4 py-3 text-ink-700">{b.type}</td>
                  <td className="px-4 py-3 text-ink-700">{b.location}</td>
                  <td className="px-4 py-3 text-ink-700">{b.totalOrders}</td>
                  <td className="px-4 py-3 text-ink-700">{formatINR(b.totalSpend)}</td>
                  <td className="px-4 py-3 text-ink-500">{formatDate(b.joined)}</td>
                  <td className="px-4 py-3"><Badge tone={b.status === 'Active' ? 'success' : 'high'}>{b.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  )
}
