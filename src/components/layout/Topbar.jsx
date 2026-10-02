import { useNavigate } from 'react-router-dom'
import { Bell, Menu, ShoppingCart, PackageCheck } from 'lucide-react'
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
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-ink-100 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden text-ink-700 focus-ring rounded p-1" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="font-display font-semibold text-lg text-ink-900 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {user?.role === 'buyer' && (
          <button
            onClick={() => navigate('/buyer/cart')}
            className="relative text-ink-700 hover:text-forest-700 transition-colors focus-ring rounded p-1"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-forest-600 text-white text-[10px] leading-4 text-center font-semibold">
                {cartCount}
              </span>
            )}
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative text-ink-700 hover:text-forest-700 transition-colors focus-ring rounded p-1"
            aria-label={`Order updates, ${notifications.length} active`}
            aria-expanded={notificationsOpen}
            aria-controls="order-updates-panel"
          >
            <Bell size={20} />
            {notifications.length > 0 && <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-clay-500 text-white text-[10px] leading-4 text-center font-semibold">{notifications.length}</span>}
          </button>
          {notificationsOpen && <div id="order-updates-panel" className="absolute right-0 top-11 z-50 w-[min(21rem,calc(100vw-2rem))] rounded-xl border border-ink-100 bg-white p-3 shadow-xl" role="region" aria-label="Recent order updates">
            <div className="flex items-center justify-between border-b border-ink-100 pb-2">
              <div><h2 className="font-display text-sm font-semibold text-ink-900">Order updates</h2><p className="text-[11px] text-ink-500">Active orders visible to this workspace</p></div>
              <button onClick={() => setNotificationsOpen(false)} className="rounded p-1 text-ink-500 hover:bg-sand-100 focus-ring" aria-label="Close order updates">×</button>
            </div>
            {notifications.length ? <div className="py-1">{notifications.map((order) => <button key={order.id} onClick={() => { setNotificationsOpen(false); navigate(ordersPath) }} className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-sand-50 focus-ring">
              <PackageCheck size={16} className="mt-0.5 shrink-0 text-forest-600" />
              <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-ink-900">{order.id} · {order.product}</span><span className="mt-0.5 block text-xs text-ink-500">{user?.role === 'buyer' ? order.farmer : order.buyer} · {order.stage}</span></span>
            </button>)}</div> : <p className="py-4 text-center text-xs text-ink-500">No active order updates right now.</p>}
            <button onClick={() => { setNotificationsOpen(false); navigate(ordersPath) }} className="mt-1 w-full rounded-lg bg-leaf-50 px-3 py-2 text-xs font-semibold text-forest-700 hover:bg-leaf-100 focus-ring">View orders</button>
          </div>}
        </div>
        <button
          onClick={() => navigate(`/${user?.role}/profile`)}
          className="flex items-center gap-2 focus-ring rounded-full"
        >
          <img src={user?.avatar} alt="" className="h-8 w-8 rounded-full object-cover border border-ink-100" />
          <span className="hidden sm:block text-sm font-medium text-ink-900">{user?.name}</span>
        </button>
      </div>
    </header>
  )
}
