import { useNavigate } from 'react-router-dom'
import { MapPin, Star } from 'lucide-react'
import Badge, { demandTone } from '../ui/Badge'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useApp()

  return (
    <div className="card overflow-hidden flex flex-col group">
      <button
        onClick={() => navigate(`/buyer/product/${product.id}`)}
        className="block relative h-36 w-full overflow-hidden bg-ink-100 focus-ring"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <Badge tone={demandTone(product.demand)} className="absolute top-2 right-2 shadow-sm">
          {product.demand} demand
        </Badge>
      </button>
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <button onClick={() => navigate(`/buyer/product/${product.id}`)} className="text-left focus-ring rounded">
          <h3 className="font-display font-semibold text-ink-900 text-[15px] leading-tight">{product.name}</h3>
        </button>
        <p className="text-xs text-ink-500 flex items-center gap-1 truncate">
          <MapPin size={12} className="shrink-0" /> {product.farmer}
        </p>
        <div className="flex items-center gap-1 text-xs text-ink-500">
          <Star size={12} className="fill-amber-500 text-amber-500" />
          {product.rating} <span className="text-ink-300">·</span> {product.quality}
        </div>
        <div className="flex items-end justify-between mt-1">
          <div>
            <p className="font-display font-bold text-ink-900">₹{product.price}<span className="text-xs font-normal text-ink-500">/{product.unit}</span></p>
            <p className="text-[11px] text-ink-500">{product.quantity.toLocaleString('en-IN')} {product.unit} available</p>
          </div>
        </div>
        <Button size="sm" className="mt-2 w-full" onClick={() => addToCart(product.id, 10)}>
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
