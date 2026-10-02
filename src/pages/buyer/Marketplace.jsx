import { useMemo, useState } from 'react'
import { Search, MapPin, SlidersHorizontal, Check } from 'lucide-react'
import { useApp } from '../../context/useApp'
import { CATEGORIES } from '../../data/products'
import CategoryFilter from '../../components/marketplace/CategoryFilter'
import ProductGrid from '../../components/marketplace/ProductGrid'
import Button from '../../components/ui/Button'

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
    <div className="space-y-6">
      {/* Hero Banner with Search */}
      <div className="relative rounded-[24px] bg-forest-950 overflow-hidden shadow-xl">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-leaf-400 via-forest-900 to-transparent pointer-events-none" />

        <div className="relative z-10 px-6 py-10 lg:px-12 lg:py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="w-full lg:max-w-xl text-center lg:text-left">
            <h2 className="font-display text-3xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Fresh Produce,<br />
              <span className="text-leaf-400">Directly Sourced.</span>
            </h2>
            <p className="text-leaf-100/80 text-[15px] mt-4 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Skip the middlemen. Order fresh harvests from local FPOs with verified quality and transparent pricing.
            </p>

            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2.5">
              {[
                { label: 'Verified FPO listings', bg: 'bg-leaf-500/20 text-leaf-300' },
                { label: 'Shared-load delivery', bg: 'bg-white/10 text-white' },
                { label: 'Fair price breakdown', bg: 'bg-white/10 text-white' }
              ].map((item) => (
                <span key={item.label} className={`rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold ${item.bg} backdrop-blur-md`}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full lg:max-w-md shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Search for tomatoes, farms, locations..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white/90 focus:bg-white rounded-xl text-[15px] font-medium text-ink-900 placeholder:text-ink-500 outline-none ring-2 ring-transparent focus:ring-leaf-400 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CategoryFilter categories={CATEGORIES} active={category} onChange={setCategory} />

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-ink-100 shadow-sm flex flex-col md:flex-row items-center gap-4 sticky top-[76px] z-10 transition-shadow hover:shadow-md">

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <div className="flex items-center gap-2">
            <div className="relative group">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-forest-600 transition-colors pointer-events-none" />
              <select
                id="market-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl border border-ink-200 bg-sand-50 hover:bg-white text-sm font-semibold text-ink-900 focus-ring cursor-pointer appearance-none transition-colors"
                aria-label="Market location"
              >
                <option>All locations</option>
                <option>Kolar</option>
                <option>Chikkaballapur</option>
                <option>Tumkur</option>
                <option>Bengaluru</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-ink-200 shrink-0 hidden md:block" />

          <div className="flex items-center gap-2">
            <div className="relative group">
              <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-forest-600 transition-colors pointer-events-none" />
              <select
                id="market-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl border border-ink-200 bg-sand-50 hover:bg-white text-sm font-semibold text-ink-900 focus-ring cursor-pointer appearance-none transition-colors"
                aria-label="Sort listings"
              >
                <option>Recommended</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
                <option>Demand</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-ink-200 shrink-0 hidden md:block" />

          <label className="shrink-0 relative flex items-center p-0.5 rounded-full cursor-pointer group">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-forest-600 peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-ink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-600"></div>
            <span className="ml-3 text-sm font-bold text-ink-700 group-hover:text-ink-900 transition-colors">Organic only</span>
          </label>
        </div>

        <div className="md:ml-auto w-full md:w-auto flex items-center justify-between gap-4 border-t md:border-none border-ink-100 pt-3 md:pt-0 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-leaf-50 text-forest-700 rounded-lg text-xs font-bold border border-leaf-100">
            <Check size={14} /> {filtered.length} found
          </span>
          {(query || category !== 'All' || location !== 'All locations' || organicOnly) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-clay-500 hover:text-clay-600 hover:bg-clay-50 md:hidden">
              Clear filters
            </Button>
          )}
        </div>
      </div>

      <ProductGrid products={filtered} onClear={clearFilters} />
    </div>
  )
}
