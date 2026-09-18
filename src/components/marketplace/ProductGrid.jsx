import ProductCard from './ProductCard'
import EmptyState from '../ui/EmptyState'
import { PackageSearch } from 'lucide-react'

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No produce matches your search"
        description="Try a different keyword or clear the category filter."
      />
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
