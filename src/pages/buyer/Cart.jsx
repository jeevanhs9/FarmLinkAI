import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { formatINR } from '../../utils/format'

export default function Cart() {
  const { cartItems, updateCartQuantity, removeFromCart } = useApp()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Browse the marketplace and add some fresh produce to get started."
        action={<Button onClick={() => navigate('/buyer')}>Go to Marketplace</Button>}
      />
    )
  }

  const subtotal = cartItems.reduce((s, c) => s + c.product.price * c.quantity, 0)
  const logistics = Math.round(subtotal * 0.08)
  const total = subtotal + logistics

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-5">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-100 text-left text-ink-500 text-xs font-medium">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Subtotal</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(({ product, quantity }) => (
                <tr key={product.id} className="border-t border-ink-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={product.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                      <span className="font-medium text-ink-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center border border-ink-200 rounded-lg w-fit">
                      <button onClick={() => updateCartQuantity(product.id, quantity - 10)} className="p-1.5 text-ink-700 hover:text-forest-700 focus-ring" aria-label="Decrease">
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-xs font-semibold">{quantity}</span>
                      <button onClick={() => updateCartQuantity(product.id, quantity + 10)} className="p-1.5 text-ink-700 hover:text-forest-700 focus-ring" aria-label="Increase">
                        <Plus size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">₹{product.price}/{product.unit}</td>
                  <td className="px-4 py-3 font-medium text-ink-900">{formatINR(product.price * quantity)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeFromCart(product.id)} className="text-ink-300 hover:text-clay-500 focus-ring rounded" aria-label="Remove">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5 h-fit space-y-3">
        <h3 className="font-display font-semibold text-sm text-ink-900">Order Summary</h3>
        <div className="flex justify-between text-sm text-ink-700"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
        <div className="flex justify-between text-sm text-ink-700"><span>Logistics</span><span>{formatINR(logistics)}</span></div>
        <div className="border-t border-ink-100 pt-3 flex justify-between font-semibold text-ink-900">
          <span>Total</span><span>{formatINR(total)}</span>
        </div>
        <Button className="w-full" onClick={() => navigate('/buyer/checkout')}>Proceed to Checkout</Button>
      </div>
    </div>
  )
}
