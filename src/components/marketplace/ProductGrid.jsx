import ProductCard from './ProductCard'
import EmptyState from '../ui/EmptyState'
import { PackageSearch } from 'lucide-react'
import Button from '../ui/Button'

export default function ProductGrid({ products, onClear }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No produce matches your search"
        description="Try a different keyword, market, or category to see more available produce."
        action={onClear && <Button variant="outline" size="sm" onClick={onClear}>Clear filters</Button>}
      />
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
