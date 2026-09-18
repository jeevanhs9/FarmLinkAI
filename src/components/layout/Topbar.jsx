import { useNavigate } from 'react-router-dom'
import { Bell, Menu, ShoppingCart } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Topbar({ title, onMenuClick }) {
  const { user, cartCount } = useApp()
  const navigate = useNavigate()

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
        <button className="text-ink-700 hover:text-forest-700 transition-colors focus-ring rounded p-1" aria-label="Notifications">
          <Bell size={20} />
        </button>
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
