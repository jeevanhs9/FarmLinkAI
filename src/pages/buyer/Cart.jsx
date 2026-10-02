import { useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react'
import { useApp } from '../../context/useApp'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { formatINR } from '../../utils/format'
import Badge from '../../components/ui/Badge'

export default function Cart() {
  const { cartItems, updateCartQuantity, removeFromCart, cartCount } = useApp()
  const navigate = useNavigate()

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const logisticsFee = cartCount > 0 ? 150 : 0
  const fpoFee = subtotal * 0.02
  const total = subtotal + logisticsFee + fpoFee

  if (cartCount === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Fresh produce from local farmers is waiting for you."
        action={<Button onClick={() => navigate('/buyer')}>Browse Marketplace</Button>}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Shopping Cart</h2>
        <Badge tone="info" rounded="rounded-full" className="font-bold">{cartCount} items</Badge>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
        <div className="card overflow-hidden bg-white">
          <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_auto] gap-4 p-4 border-b border-ink-100 bg-sand-50/50 text-[11px] font-bold uppercase tracking-widest text-ink-500">
            <div>Product</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Subtotal</div>
            <div className="w-10"></div>
          </div>

          <ul className="divide-y divide-ink-100">
            {cartItems.map((item) => (
              <li key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr_auto] gap-4 sm:items-center hover:bg-sand-50/30 transition-colors">
                <div className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-ink-100 bg-sand-50">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="font-display font-bold text-ink-900 text-base truncate">{item.product.name}</h3>
                    <p className="text-xs font-medium text-ink-500 mt-1 truncate">By {item.product.farmer}</p>
                    <p className="font-display font-bold text-forest-700 mt-2">
                      ₹{item.product.price}<span className="text-xs font-medium text-ink-500 font-sans ml-1">/{item.product.unit}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-center">
                  <span className="text-xs font-bold text-ink-500 sm:hidden">QTY</span>
                  <div className="flex items-center h-10 rounded-lg border border-ink-200 bg-white">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-9 h-full flex flex-col items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-sand-50 rounded-l-md transition-colors focus-ring outline-none"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-ink-900 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-9 h-full flex flex-col items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-sand-50 rounded-r-md transition-colors focus-ring outline-none"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end text-right">
                  <span className="text-xs font-bold text-ink-500 sm:hidden">SUBTOTAL</span>
                  <p className="font-display font-bold text-lg text-ink-900">
                    {formatINR(item.product.price * item.quantity)}
                  </p>
                </div>

                <div className="flex justify-end order-first sm:order-last -mt-2 sm:mt-0">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-ink-300 hover:text-clay-500 hover:bg-clay-50 p-2 rounded-lg transition-colors focus-ring"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 bg-white sticky top-[84px]">
          <h3 className="font-display font-bold text-lg text-ink-900 mb-6 tracking-tight">Order Summary</h3>
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-ink-600 font-medium">Subtotal ({cartCount} items)</dt>
              <dd className="font-bold text-ink-900">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between items-center group">
              <dt className="text-ink-600 font-medium flex items-center gap-1.5 cursor-help">
                Logistics fee
                <span className="hidden group-hover:inline-block px-1.5 py-0.5 rounded text-[9px] bg-ink-100 text-ink-700 uppercase tracking-wider absolute -ml-2 -mt-7">Shared transport</span>
              </dt>
              <dd className="font-bold text-ink-900">{formatINR(logisticsFee)}</dd>
            </div>
            <div className="flex justify-between items-center group">
              <dt className="text-ink-600 font-medium flex items-center gap-1.5 cursor-help">
                FPO support (2%)
                <span className="hidden group-hover:inline-block px-1.5 py-0.5 rounded text-[9px] bg-ink-100 text-ink-700 uppercase tracking-wider absolute -ml-2 -mt-7">Farmer organization</span>
              </dt>
              <dd className="font-bold text-ink-900">{formatINR(fpoFee)}</dd>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-ink-100 mt-2">
              <dt className="font-display font-bold text-base text-ink-900">Total Price</dt>
              <dd className="font-display font-bold text-2xl text-forest-700 tracking-tight">{formatINR(total)}</dd>
            </div>
          </dl>
          <div className="mt-8 space-y-3">
            <Button className="w-full flex justify-between items-center py-3.5 group text-[15px]" onClick={() => navigate('/buyer/checkout')}>
              Proceed to Checkout
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ghost" className="w-full text-xs font-bold" onClick={() => navigate('/buyer')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
