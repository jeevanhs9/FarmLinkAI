import { useNavigate } from 'react-router-dom'
import { Bell, Menu, ShoppingCart, PackageCheck, CheckCircle2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '../../context/useApp'

export default function Topbar({ title, onMenuClick }) {
  const { user, cartCount, orders } = useApp()
  const navigate = useNavigate()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const notifications = useMemo(() => orders.filter((order) => {
    if (user?.role === 'farmer') return order.farmerId === user.id && order.stage !== 'Delivered'
    if (user?.role === 'buyer') return order.buyerId === user.id && order.stage !== 'Delivered'
    if (user?.role === 'logistics') return order.stage !== 'Delivered'
    return true
  }).slice(0, 5), [orders, user])

  const ordersPath = user?.role === 'logistics' ? '/logistics' : `/${user?.role}/orders`

  return (
    <header className="sticky top-0 z-20 h-[60px] bg-white/80 backdrop-blur-md border-b border-ink-100 flex items-center justify-between px-4 lg:px-6 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-ink-700 hover:bg-ink-100 transition-colors focus-ring rounded-lg p-2 -ml-2"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-display font-bold text-lg text-ink-900 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        {user?.role === 'buyer' && (
          <button
            onClick={() => navigate('/buyer/cart')}
            className="relative text-ink-700 hover:text-forest-700 hover:bg-leaf-50 transition-colors focus-ring rounded-full p-2"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 h-4.5 min-w-[18px] px-1 rounded-full bg-forest-600 text-white text-[10px] leading-tight flex items-center justify-center font-bold ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((open) => !open)}
            className={`relative text-ink-700 hover:text-forest-700 hover:bg-leaf-50 transition-colors focus-ring rounded-full p-2 ${notificationsOpen ? 'bg-leaf-50 text-forest-700' : ''}`}
            aria-label={`Order updates, ${notifications.length} active`}
            aria-expanded={notificationsOpen}
            aria-controls="order-updates-panel"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-clay-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div
              id="order-updates-panel"
              className="absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-ink-100 bg-white p-3 shadow-2xl animate-fade-up"
              role="region"
              aria-label="Recent order updates"
            >
              <div className="flex items-center justify-between border-b border-ink-100 pb-3 mb-2 px-1">
                <div>
                  <h2 className="font-display text-sm font-bold text-ink-900">Active Orders</h2>
                  <p className="text-[11px] text-ink-500 mt-0.5">{notifications.length} updates requiring your attention</p>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="rounded-full p-1.5 text-ink-500 hover:bg-ink-100 hover:text-ink-900 focus-ring transition-colors"
                  aria-label="Close order updates"
                >
                  <X size={16} />
                </button>
              </div>

              {notifications.length ? (
                <div className="py-1 space-y-1">
                  {notifications.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => { setNotificationsOpen(false); navigate(ordersPath) }}
                      className="group flex w-full items-start gap-3 rounded-xl p-2.5 text-left hover:bg-sand-50 focus-ring transition-colors"
                    >
                      <div className="mt-0.5 h-8 w-8 rounded-full bg-leaf-50 flex items-center justify-center shrink-0 border border-leaf-100 group-hover:bg-white group-hover:border-leaf-200 transition-colors">
                        <PackageCheck size={16} className="text-forest-600" />
                      </div>
                      <span className="min-w-0 flex-1">
                        <span className="flex justify-between items-center mb-0.5">
                          <span className="block truncate text-xs font-bold text-ink-900">{order.product}</span>
                          <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                            {order.stage}
                          </span>
                        </span>
                        <span className="block text-xs text-ink-500 truncate">
                          Order {order.id} · {user?.role === 'buyer' ? `From ${order.farmer}` : `To ${order.buyer}`}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-sand-50 flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} className="text-ink-300" />
                  </div>
                  <p className="text-sm font-medium text-ink-900">All caught up!</p>
                  <p className="text-xs text-ink-500 mt-1">No active orders right now.</p>
                </div>
              )}

              <button
                onClick={() => { setNotificationsOpen(false); navigate(ordersPath) }}
                className="mt-3 w-full rounded-xl bg-sand-50 border border-ink-100 px-3 py-2.5 text-xs font-bold text-ink-700 hover:bg-ink-100 hover:text-ink-900 focus-ring transition-colors"
              >
                View all orders
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
