import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Star, ShieldCheck, Truck, Sprout } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Badge, { demandTone } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PriceBreakdown from '../../components/checkout/PriceBreakdown'
import EmptyState from '../../components/ui/EmptyState'

export default function ProductDetails() {
  const { id } = useParams()
  const { listings, addToCart } = useApp()
  const navigate = useNavigate()
  const product = listings.find((p) => p.id === id)
  const [qty, setQty] = useState(100)
  const [added, setAdded] = useState(false)

  if (!product) {
    return <EmptyState title="Product not found" description="This listing may have been removed." />
  }

  const logisticsCost = Math.max(2, Math.round(product.price * 0.1))
  const platformFee = Math.max(1, Math.round(product.price * 0.03))

  const handleAdd = () => {
    addToCart(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/buyer')} className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700 focus-ring rounded">
        <ArrowLeft size={15} /> Back to Marketplace
      </button>

      <div className="grid lg:grid-cols-[1.1fr_1fr_0.8fr] gap-5">
        <div className="card overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-64 lg:h-full object-cover" />
        </div>

        <div className="card p-5">
          <h1 className="font-display text-xl font-bold text-ink-900">{product.name === 'Tomato' ? 'Fresh Tomatoes' : product.name}</h1>
          <p className="text-sm text-ink-500 mt-1">{product.farmer}</p>
          <p className="text-xs text-ink-500 mt-0.5">{product.location}</p>

          <div className="flex items-center gap-1.5 text-sm mt-2">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            <span className="font-medium text-ink-900">{product.rating}</span>
            <span className="text-ink-500">({product.reviews} reviews)</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge tone="low">{product.quality}</Badge>
            <Badge tone="neutral">{product.harvest}</Badge>
            <Badge tone={demandTone(product.demand)}>{product.demand} demand</Badge>
          </div>

          <p className="font-display text-2xl font-bold text-ink-900 mt-4">
            ₹{product.price} <span className="text-sm font-normal text-ink-500">/ {product.unit}</span>
          </p>
          <p className="text-xs text-ink-500 mt-0.5">Available Quantity: {product.quantity.toLocaleString('en-IN')} {product.unit}</p>

          <p className="text-sm text-ink-700 mt-4 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center border border-ink-200 rounded-lg">
              <button onClick={() => setQty((q) => Math.max(10, q - 10))} className="p-2.5 text-ink-700 hover:text-forest-700 focus-ring" aria-label="Decrease quantity">
                <Minus size={15} />
              </button>
              <span className="w-14 text-center text-sm font-semibold text-ink-900">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.quantity, q + 10))} className="p-2.5 text-ink-700 hover:text-forest-700 focus-ring" aria-label="Increase quantity">
                <Plus size={15} />
              </button>
            </div>
            <span className="text-sm text-ink-500">{product.unit}</span>
          </div>

          <Button className="w-full mt-4" onClick={handleAdd}>
            {added ? 'Added to Cart ✓' : 'Add to Cart'}
          </Button>
          <p className="text-xs text-ink-500 mt-2">Expected delivery: 2 – 3 days</p>

          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-ink-100 text-xs text-ink-500">
            <span className="flex items-center gap-1.5"><Sprout size={13} className="text-forest-600" /> Direct from Farmers</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-forest-600" /> Quality Assured</span>
            <span className="flex items-center gap-1.5"><Truck size={13} className="text-forest-600" /> On-time Delivery</span>
          </div>
        </div>

        <PriceBreakdown farmerPrice={product.price} logisticsCost={logisticsCost} platformFee={platformFee} />
      </div>
    </div>
  )
}
