import { useState } from 'react'
import { farmers } from '../../data/farmers'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate } from '../../utils/format'
import { Users, Search, Leaf } from 'lucide-react'

export default function AdminFarmers() {
  const [query, setQuery] = useState('')
  const filtered = farmers.filter((f) =>
    `${f.name} ${f.location} ${f.crops.join(' ')}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Farmers / FPOs</h2>
          <p className="text-sm font-medium text-ink-500 mt-1">{filtered.length} of {farmers.length} records</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search farmers or FPOs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-white text-sm font-medium focus-ring focus:border-forest-500 transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No FPOs found" description="Try another name, crop, or location." />
      ) : (
        <div className="card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sand-50/80 border-b border-ink-100 text-[11px] text-ink-500 uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-5 py-4">FPO / Farmer</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Members</th>
                  <th className="px-5 py-4">Crops</th>
                  <th className="px-5 py-4">Listings</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-sand-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={f.avatar} alt="" className="h-10 w-10 rounded-xl object-cover border border-ink-100 bg-sand-100" />
                        <div>
                          <p className="font-display font-bold text-ink-900">{f.name}</p>
                          <p className="text-xs font-medium text-ink-500">{f.members} members</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-ink-700">{f.location}</td>
                    <td className="px-5 py-4">
                      <span className="font-display font-bold text-ink-900">{f.members}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {f.crops.slice(0, 3).map((crop) => (
                          <span key={crop} className="inline-flex items-center gap-1 text-[10px] font-bold bg-leaf-50 border border-leaf-100 text-forest-700 px-1.5 py-0.5 rounded-md">
                            <Leaf size={9} /> {crop}
                          </span>
                        ))}
                        {f.crops.length > 3 && (
                          <span className="text-[10px] font-bold text-ink-500 bg-ink-100 px-1.5 py-0.5 rounded-md">+{f.crops.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-display font-bold text-ink-900">{f.totalListings}</td>
                    <td className="px-5 py-4 text-xs font-medium text-ink-500">{formatDate(f.joined)}</td>
                    <td className="px-5 py-4">
                      <Badge tone={f.status === 'Active' ? 'success' : 'medium'} rounded="rounded-full">{f.status}</Badge>
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
