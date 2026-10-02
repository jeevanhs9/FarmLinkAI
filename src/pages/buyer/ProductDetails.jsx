import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Star, ShieldCheck, Truck, Sprout, MapPin, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/useApp'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PriceBreakdown from '../../components/checkout/PriceBreakdown'
import EmptyState from '../../components/ui/EmptyState'
import { demandTone } from '../../utils/demand'

export default function ProductDetails() {
  const { id } = useParams()
  const { listings, addToCart } = useApp()
  const navigate = useNavigate()
  const product = listings.find((p) => p.id === id)
  const [qty, setQty] = useState(() => product ? Math.min(10, product.quantity) : 0)
  const [added, setAdded] = useState(false)

  if (!product) {
    return <EmptyState title="Product not found" description="This listing may have been removed." />
  }

  const handleAdd = () => {
    addToCart(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/buyer')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-forest-700 transition-colors focus-ring rounded-lg px-2 py-1 -ml-2"
      >
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      <div className="grid lg:grid-cols-[1.2fr_1fr_0.85fr] gap-6 items-start">
        {/* Product Image */}
        <div className="card overflow-hidden bg-sand-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 lg:h-96 object-cover"
          />
          <Badge
            tone={demandTone(product.demand)}
            className="absolute top-4 right-4 shadow-lg backdrop-blur-md bg-white/90"
          >
            {product.demand} demand
          </Badge>
        </div>

        {/* Product Info */}
        <div className="card p-6 bg-white flex flex-col gap-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900 tracking-tight leading-tight">
              {product.name === 'Tomato' ? 'Fresh Tomatoes' : product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button
                className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-forest-700 transition-colors focus-ring rounded"
                onClick={() => {}}
              >
                <MapPin size={14} className="text-ink-400" />
                {product.farmer} · {product.location}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 rounded-lg px-2 py-1">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                <span className="text-sm font-bold text-amber-800">{product.rating}</span>
              </div>
              <span className="text-sm font-medium text-ink-500">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge tone="low">{product.quality}</Badge>
            <Badge tone="neutral">{product.harvest}</Badge>
          </div>

          <div className="py-4 border-y border-ink-100">
            <p className="font-display text-4xl font-bold text-ink-900 tracking-tight">
              ₹{product.price}
              <span className="text-lg font-semibold text-ink-500 ml-2">/ {product.unit}</span>
            </p>
            <p className="text-sm font-medium text-ink-500 mt-1.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-forest-500 inline-block" />
                {product.quantity.toLocaleString('en-IN')} {product.unit} available
              </span>
            </p>
          </div>

          {product.description && (
            <p className="text-sm text-ink-600 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center h-12 rounded-xl border-2 border-ink-200 bg-white overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 10))}
                disabled={qty <= 1}
                className="w-11 h-full flex items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-sand-50 transition-colors disabled:opacity-30 focus-ring outline-none"
                aria-label="Decrease quantity"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="w-14 text-center text-base font-bold text-ink-900 select-none" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(product.quantity, q + 10))}
                disabled={qty >= product.quantity}
                className="w-11 h-full flex items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-sand-50 transition-colors disabled:opacity-30 focus-ring outline-none"
                aria-label="Increase quantity"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
            <span className="text-sm font-bold text-ink-500">{product.unit}</span>
          </div>

          <Button
            className={`w-full py-3.5 text-[15px] ${added ? 'bg-forest-700' : ''}`}
            onClick={handleAdd}
            disabled={product.quantity <= 0}
          >
            {product.quantity <= 0 ? 'Sold Out' : added ? (
              <><CheckCircle2 size={18} className="mr-2" /> Added to Cart</>
            ) : 'Add to Cart'}
          </Button>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-ink-100">
            {[
              { icon: Sprout, label: 'Direct from Farmers' },
              { icon: ShieldCheck, label: 'Quality Assured' },
              { icon: Truck, label: '2–3 Day Delivery' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center p-2 rounded-xl bg-sand-50 border border-ink-100">
                <Icon size={18} className="text-forest-600" />
                <span className="text-[11px] font-bold text-ink-600 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <PriceBreakdown unitPrice={product.price} unit={product.unit} />
      </div>
    </div>
  )
}
