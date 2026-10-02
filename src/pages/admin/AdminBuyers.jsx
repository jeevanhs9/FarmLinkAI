import { useState } from 'react'
import { buyers } from '../../data/buyers'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, formatINR } from '../../utils/format'
import { ShoppingBag, Search } from 'lucide-react'

export default function AdminBuyers() {
  const [query, setQuery] = useState('')
  const filtered = buyers.filter((b) =>
    `${b.name} ${b.type} ${b.location}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Buyers</h2>
          <p className="text-sm font-medium text-ink-500 mt-1">{filtered.length} of {buyers.length} records</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buyers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-white text-sm font-medium focus-ring focus:border-forest-500 transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No buyers found" description="Try another buyer name, type, or location." />
      ) : (
        <div className="card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sand-50/80 border-b border-ink-100 text-[11px] text-ink-500 uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-5 py-4">Buyer</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Orders</th>
                  <th className="px-5 py-4">Total Spend</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-sand-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-display font-bold text-ink-900">{b.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold bg-sand-100 border border-ink-100 px-2 py-0.5 rounded-lg text-ink-700">{b.type}</span>
                    </td>
                    <td className="px-5 py-4 font-medium text-ink-700">{b.location}</td>
                    <td className="px-5 py-4">
                      <span className="font-display font-bold text-ink-900">{b.totalOrders}</span>
                    </td>
                    <td className="px-5 py-4 font-display font-bold text-ink-900">{formatINR(b.totalSpend)}</td>
                    <td className="px-5 py-4 text-xs font-medium text-ink-500">{formatDate(b.joined)}</td>
                    <td className="px-5 py-4">
                      <Badge tone={b.status === 'Active' ? 'success' : 'high'} rounded="rounded-full">{b.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
