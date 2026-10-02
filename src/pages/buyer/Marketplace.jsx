import { useMemo, useState } from 'react'
import { useApp } from '../../context/useApp'
import { CATEGORIES } from '../../data/products'
import SearchBar from '../../components/marketplace/SearchBar'
import CategoryFilter from '../../components/marketplace/CategoryFilter'
import ProductGrid from '../../components/marketplace/ProductGrid'

export default function Marketplace() {
  const { listings } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('All locations')
  const [sort, setSort] = useState('Recommended')
  const [organicOnly, setOrganicOnly] = useState(false)

  const filtered = useMemo(() => {
    const results = listings.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const matchesQuery = `${p.name} ${p.farmer} ${p.location}`.toLowerCase().includes(query.toLowerCase())
      const matchesLocation = location === 'All locations' || p.location.includes(location)
      const matchesOrganic = !organicOnly || p.category === 'Organic' || p.quality?.includes('Organic')
      return matchesCategory && matchesQuery && matchesLocation && matchesOrganic
    })
    return [...results].sort((a, b) => {
      if (sort === 'Price: low to high') return a.price - b.price
      if (sort === 'Price: high to low') return b.price - a.price
      if (sort === 'Demand') return ({ High: 3, Medium: 2, Low: 1 }[b.demand] - ({ High: 3, Medium: 2, Low: 1 }[a.demand]))
      return b.rating - a.rating
    })
  }, [listings, query, category, location, sort, organicOnly])

  const clearFilters = () => {
    setQuery('')
    setCategory('All')
    setLocation('All locations')
    setSort('Recommended')
    setOrganicOnly(false)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-gradient-to-br from-forest-700 to-forest-900 text-white p-6">
        <h2 className="font-display text-xl font-bold">Fresh from Farms</h2>
        <p className="text-leaf-100/80 text-sm mt-1">Quality produce. Fair prices. Direct from farmers.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-leaf-50">
          {['Verified FPO listings', 'Shared-load delivery', 'Clear price breakdown'].map((item) => <span key={item} className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">{item}</span>)}
        </div>
        <div className="mt-4">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      <CategoryFilter categories={CATEGORIES} active={category} onChange={setCategory} />

      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="market-location">Market location</label><select id="market-location" value={location} onChange={(e) => setLocation(e.target.value)} className="px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm focus-ring">
          <option>All locations</option><option>Kolar</option><option>Chikkaballapur</option><option>Tumkur</option><option>Bengaluru</option>
        </select>
        <label className="sr-only" htmlFor="market-sort">Sort listings</label><select id="market-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm focus-ring">
          <option>Recommended</option><option>Price: low to high</option><option>Price: high to low</option><option>Demand</option>
        </select>
        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm text-ink-700 cursor-pointer">
          <input type="checkbox" checked={organicOnly} onChange={(e) => setOrganicOnly(e.target.checked)} className="accent-forest-700" /> Organic only
        </label>
        <span className="text-xs text-ink-500 ml-auto">{filtered.length} listings</span>
      </div>

      <ProductGrid products={filtered} onClear={clearFilters} />
    </div>
  )
}
