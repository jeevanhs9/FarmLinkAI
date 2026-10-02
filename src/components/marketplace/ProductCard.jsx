import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { demandTone } from '../../utils/demand'
import { useApp } from '../../context/useApp'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useApp()
  const [qty, setQty] = useState(1)

  const isSoldOut = product.quantity <= 0

  const handleAdd = (e) => {
    e.stopPropagation()
    if (isSoldOut) return
    addToCart(product.id, qty)
  }

  const handleQtyChange = (e, delta) => {
    e.stopPropagation()
    setQty(prev => Math.max(1, Math.min(product.quantity, prev + delta)))
  }

  return (
    <div className="card overflow-hidden flex flex-col group card-hover relative bg-white">
      {/* Image Area */}
      <div
        onClick={() => navigate(`/buyer/product/${product.id}`)}
        className="block relative h-48 w-full overflow-hidden bg-sand-100 cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.03] ${isSoldOut ? 'grayscale opacity-75' : ''}`}
          loading="lazy"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Badge
          tone={demandTone(product.demand)}
          className="absolute top-3 right-3 shadow-md backdrop-blur-md bg-white/95"
        >
          {product.demand} demand
        </Badge>

        {isSoldOut && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-ink-900 text-white font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-lg shadow-xl">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 md:p-5 flex flex-col flex-1 relative z-10 bg-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <button
            onClick={() => navigate(`/buyer/product/${product.id}`)}
            className="text-left focus-ring outline-none rounded inline-block"
          >
            <h3 className="font-display font-bold text-ink-900 text-lg leading-tight group-hover:text-forest-700 transition-colors">
              {product.name}
            </h3>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-700 shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            {product.rating}
          </div>
        </div>

        {/* Meta info */}
        <div className="space-y-1.5 mb-4">
          <button className="flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-forest-700 transition-colors focus-ring rounded outline-none w-max max-w-full">
            <MapPin size={12} className="shrink-0 text-ink-400" />
            <span className="truncate border-b border-dashed border-ink-300 hover:border-forest-400">{product.farmer}</span>
          </button>
          <div className="text-[11px] font-medium text-ink-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-leaf-400 mr-1.5 align-middle" />
            {product.quality}
          </div>
        </div>

        {/* Spacer to push pricing down */}
        <div className="flex-1" />

        {/* Pricing & Actions */}
        <div className="pt-4 border-t border-ink-100 flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display font-bold text-2xl text-ink-900 tracking-tight leading-none">
                ₹{product.price}<span className="text-sm font-semibold text-ink-500 font-sans ml-1">/{product.unit}</span>
              </p>
            </div>
            <div className="text-right">
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isSoldOut ? 'text-clay-500' : 'text-forest-600'}`}>
                {isSoldOut ? '0 available' : `${product.quantity.toLocaleString('en-IN')} ${product.unit} in stock`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSoldOut && (
              <div className="flex items-center h-10 rounded-lg border border-ink-200 bg-sand-50 p-1">
                <button
                  onClick={(e) => handleQtyChange(e, -1)}
                  disabled={qty <= 1}
                  className="w-8 h-full flex flex-col items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-white rounded-md disabled:opacity-30 transition-colors focus-ring outline-none"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} strokeWidth={3} />
                </button>
                <span className="w-8 text-center font-bold text-sm text-ink-900 select-none">
                  {qty}
                </span>
                <button
                  onClick={(e) => handleQtyChange(e, 1)}
                  disabled={qty >= product.quantity}
                  className="w-8 h-full flex flex-col items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-white rounded-md disabled:opacity-30 transition-colors focus-ring outline-none"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            )}

            <Button
              className="flex-1 h-10"
              onClick={handleAdd}
              disabled={isSoldOut}
            >
              {isSoldOut ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
