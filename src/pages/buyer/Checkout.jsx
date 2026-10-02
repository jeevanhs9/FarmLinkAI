import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, MapPin, Truck, CreditCard, ArrowRight, ShoppingBag } from 'lucide-react'
import { useApp } from '../../context/useApp'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { formatINR } from '../../utils/format'
import { calculateOrderSummary } from '../../utils/pricing'

const PAYMENT_METHODS = ['UPI', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery']

export default function Checkout() {
  const { cartItems, placeOrder } = useApp()
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [payment, setPayment] = useState('UPI')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [confirmedOrders, setConfirmedOrders] = useState(null)

  if (cartItems.length === 0 && !confirmedOrders) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Nothing to check out"
        description="Add produce to your cart first."
        action={<Button onClick={() => navigate('/buyer')}>Go to Marketplace</Button>}
      />
    )
  }

  const { subtotal, logistics, platformFee, total } = calculateOrderSummary(cartItems)

  const handlePlaceOrder = (event) => {
    event.preventDefault()
    if (placingOrder) return
    setPlacingOrder(true)
    const created = placeOrder(location, payment)
    if (created.length) setConfirmedOrders(created)
    else setPlacingOrder(false)
  }

  if (confirmedOrders) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-8 text-center bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-leaf-50/50" />
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-forest-200/50">
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Order Confirmed!</h2>
            <p className="text-sm text-ink-500 mt-2 max-w-xs mx-auto">
              {confirmedOrders.length} order{confirmedOrders.length > 1 ? 's' : ''} placed successfully — payment will be simulated for this prototype.
            </p>

            <div className="mt-6 rounded-xl bg-sand-50 px-4 py-3 text-left border border-ink-100">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-forest-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink-500">Delivery to</span>
              </div>
              <p className="text-sm font-semibold text-ink-900">{confirmedOrders[0]?.deliveryLocation}</p>
            </div>

            <div className="mt-4 space-y-3">
              {confirmedOrders.map((o) => (
                <div key={o.id} className="flex justify-between items-center text-sm border border-ink-100 rounded-xl px-4 py-3 bg-white">
                  <div>
                    <span className="font-display font-bold text-ink-900">{o.id}</span>
                    <span className="text-ink-500 mx-2">·</span>
                    <span className="font-medium text-ink-700">{o.product}</span>
                  </div>
                  <span className="font-display font-bold text-forest-700">{formatINR(o.total)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-8">
              <Button variant="outline" onClick={() => navigate('/buyer')} className="px-5">
                Continue Shopping
              </Button>
              <Button onClick={() => navigate('/buyer/orders')} className="px-5">
                Track Orders <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">
      <div className="space-y-5">
        <div className="card p-6 bg-white">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-leaf-50 text-forest-700 flex items-center justify-center border border-leaf-100">
              <MapPin size={18} />
            </div>
            <h3 className="font-display font-bold text-base text-ink-900 tracking-tight">Delivery Address</h3>
          </div>
          <label htmlFor="delivery-location" className="sr-only">Delivery location</label>
          <input
            id="delivery-location"
            required
            minLength={5}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Street, area, city, PIN code"
            className="w-full px-4 py-3 rounded-xl border border-ink-200 text-[15px] bg-sand-50/50 focus:bg-white focus-ring focus:border-forest-500 transition-all"
          />
        </div>

        <div className="card p-6 bg-white">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-leaf-50 text-forest-700 flex items-center justify-center border border-leaf-100">
              <Truck size={18} />
            </div>
            <h3 className="font-display font-bold text-base text-ink-900 tracking-tight">Delivery Timeline</h3>
          </div>
          <p className="text-sm text-ink-600 leading-relaxed">
            Estimated <strong>2 – 3 business days</strong> via our consolidated logistics network. Your order will be pooled with nearby orders for cost-effective shared transport.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-forest-700 bg-leaf-50 px-3 py-2 rounded-lg border border-leaf-100">
            <Truck size={14} />
            <span>Eco-friendly consolidated delivery</span>
          </div>
        </div>

        <div className="card p-6 bg-white">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-leaf-50 text-forest-700 flex items-center justify-center border border-leaf-100">
              <CreditCard size={18} />
            </div>
            <h3 className="font-display font-bold text-base text-ink-900 tracking-tight">Payment Method</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPayment(m)}
                aria-pressed={payment === m}
                className={`px-4 py-3 rounded-xl border text-sm font-bold text-left transition-all focus-ring
                  ${payment === m
                    ? 'border-forest-600 bg-leaf-50 text-forest-800 ring-2 ring-forest-200'
                    : 'border-ink-200 text-ink-700 hover:border-forest-400 hover:bg-sand-50'
                  }`}
              >
                <span className="block">{m}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-ink-400 mt-4 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-ink-300" />
            Payment is simulated in this prototype — no real transaction occurs.
          </p>
        </div>
      </div>

      <div className="card p-6 bg-white sticky top-[84px]">
        <h3 className="font-display font-bold text-lg text-ink-900 mb-5 tracking-tight">Order Summary</h3>

        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 -mx-1 px-1">
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-3 text-sm">
              <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-ink-100" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900 truncate">{product.name}</p>
                <p className="text-xs text-ink-500">{quantity} × {product.unit}</p>
              </div>
              <span className="font-display font-bold text-ink-900">{formatINR(product.price * quantity)}</span>
            </div>
          ))}
        </div>

        <dl className="mt-5 space-y-3 text-sm border-t border-ink-100 pt-4">
          <div className="flex justify-between items-center">
            <dt className="text-ink-600 font-medium">Subtotal</dt>
            <dd className="font-bold text-ink-900">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-ink-600 font-medium">Logistics fee</dt>
            <dd className="font-bold text-ink-900">{formatINR(logistics)}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-ink-600 font-medium">Platform fee</dt>
            <dd className="font-bold text-ink-900">{formatINR(platformFee)}</dd>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-ink-100">
            <dt className="font-display font-bold text-base text-ink-900">Total to Pay</dt>
            <dd className="font-display font-bold text-2xl text-forest-700 tracking-tight">{formatINR(total)}</dd>
          </div>
        </dl>

        <Button
          type="submit"
          className="w-full mt-6 py-3.5 text-[15px] flex justify-between items-center"
          disabled={location.trim().length < 5 || placingOrder}
          loading={placingOrder}
        >
          {placingOrder ? 'Processing...' : 'Place Demo Order'}
          {!placingOrder && <ArrowRight size={18} />}
        </Button>
      </div>
    </form>
  )
}