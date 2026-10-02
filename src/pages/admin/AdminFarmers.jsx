import { useState } from 'react'
import { farmers } from '../../data/farmers'
import SearchBar from '../../components/marketplace/SearchBar'
import Badge from '../../components/ui/Badge'
import { formatDate } from '../../utils/format'
import EmptyState from '../../components/ui/EmptyState'
import { Users } from 'lucide-react'

export default function AdminFarmers() {
  const [query, setQuery] = useState('')
  const filtered = farmers.filter((f) => `${f.name} ${f.location} ${f.crops.join(' ')}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search farmers or FPOs..." />
        <p className="text-sm text-ink-500">{filtered.length} of {farmers.length} FPOs</p>
      </div>
      {filtered.length === 0 ? <EmptyState icon={Users} title="No FPOs found" description="Try another name, crop, or location." /> : <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-100 text-left text-ink-500 text-xs font-medium">
                <th className="px-4 py-3">FPO / Farmer</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Crops</th>
                <th className="px-4 py-3">Listings</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-t border-ink-100 hover:bg-sand-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={f.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      <span className="font-medium text-ink-900">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{f.location}</td>
                  <td className="px-4 py-3 text-ink-700">{f.members}</td>
                  <td className="px-4 py-3 text-ink-700">{f.crops.join(', ')}</td>
                  <td className="px-4 py-3 text-ink-700">{f.totalListings}</td>
                  <td className="px-4 py-3 text-ink-500">{formatDate(f.joined)}</td>
                  <td className="px-4 py-3"><Badge tone={f.status === 'Active' ? 'success' : 'medium'}>{f.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  )
}
