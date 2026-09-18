import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, MapPin, Truck, CreditCard } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { ShoppingCart } from 'lucide-react'
import { formatINR } from '../../utils/format'

const PAYMENT_METHODS = ['UPI', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery']

export default function Checkout() {
  const { cartItems, placeOrder, user } = useApp()
  const navigate = useNavigate()
  const [location, setLocation] = useState(user?.location || '')
  const [payment, setPayment] = useState('UPI')
  const [confirmedOrders, setConfirmedOrders] = useState(null)

  if (cartItems.length === 0 && !confirmedOrders) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Nothing to check out"
        description="Add produce to your cart first."
        action={<Button onClick={() => navigate('/buyer')}>Go to Marketplace</Button>}
      />
    )
  }

  const subtotal = cartItems.reduce((s, c) => s + c.product.price * c.quantity, 0)
  const logistics = Math.round(subtotal * 0.08)
  const platformFee = Math.round(subtotal * 0.02)
  const total = subtotal + logistics + platformFee

  const handlePlaceOrder = () => {
    const created = placeOrder(location)
    setConfirmedOrders(created)
  }

  if (confirmedOrders) {
    return (
      <div className="max-w-lg mx-auto card p-8 text-center">
        <div className="h-14 w-14 rounded-full bg-leaf-100 text-forest-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h2 className="font-display font-semibold text-lg text-ink-900">Order placed successfully</h2>
        <p className="text-sm text-ink-500 mt-1">
          {confirmedOrders.length} order{confirmedOrders.length > 1 ? 's' : ''} confirmed — payment will be simulated for this prototype.
        </p>
        <div className="mt-5 space-y-2 text-left">
          {confirmedOrders.map((o) => (
            <div key={o.id} className="flex justify-between text-sm border border-ink-100 rounded-lg px-3 py-2">
              <span className="font-medium text-ink-900">{o.id} · {o.product}</span>
              <span className="text-ink-700">{formatINR(o.total)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={() => navigate('/buyer')}>Continue Shopping</Button>
          <Button onClick={() => navigate('/buyer/orders')}>Track Orders</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-5">
      <div className="space-y-4">
        <div className="card p-5">
          <h3 className="font-display font-semibold text-sm text-ink-900 flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-forest-600" /> Delivery Location
          </h3>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter delivery address"
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus-ring focus:border-forest-500"
          />
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold text-sm text-ink-900 flex items-center gap-2 mb-2">
            <Truck size={16} className="text-forest-600" /> Expected Delivery
          </h3>
          <p className="text-sm text-ink-700">2 – 3 business days via consolidated logistics route</p>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold text-sm text-ink-900 flex items-center gap-2 mb-3">
            <CreditCard size={16} className="text-forest-600" /> Payment Method
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setPayment(m)}
                className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-left focus-ring
                  ${payment === m ? 'border-forest-600 bg-leaf-50 text-forest-700' : 'border-ink-200 text-ink-700 hover:border-forest-400'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-ink-300 mt-3">Payment is simulated in this prototype — no real transaction occurs.</p>
        </div>
      </div>

      <div className="card p-5 h-fit space-y-3">
        <h3 className="font-display font-semibold text-sm text-ink-900">Order Summary</h3>
        {cartItems.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between text-xs text-ink-700">
            <span>{product.name} × {quantity}{product.unit}</span>
            <span>{formatINR(product.price * quantity)}</span>
          </div>
        ))}
        <div className="border-t border-ink-100 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm text-ink-700"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
          <div className="flex justify-between text-sm text-ink-700"><span>Logistics</span><span>{formatINR(logistics)}</span></div>
          <div className="flex justify-between text-sm text-ink-700"><span>Platform Fee</span><span>{formatINR(platformFee)}</span></div>
          <div className="flex justify-between font-semibold text-ink-900 border-t border-ink-100 pt-2"><span>Total</span><span>{formatINR(total)}</span></div>
        </div>
        <Button className="w-full" onClick={handlePlaceOrder} disabled={!location}>Place Order</Button>
      </div>
    </div>
  )
}
