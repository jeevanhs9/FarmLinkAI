import { NavLink } from 'react-router-dom'
import {
  Sprout, LayoutGrid, Store, Package, PlusCircle, LineChart, User, LogOut,
  Truck, Map, Users, ShoppingBag, ClipboardList, BarChart3, X,
} from 'lucide-react'
import { useApp } from '../../context/useApp'

const NAV = {
  farmer: [
    { to: '/farmer', label: 'Dashboard', icon: LayoutGrid, end: true },
    { to: '/farmer/products', label: 'My Products', icon: Package },
    { to: '/farmer/listing/new', label: 'Add New Listing', icon: PlusCircle },
    { to: '/farmer/orders', label: 'Orders', icon: ClipboardList },
    { to: '/farmer/insights', label: 'AI Insights', icon: LineChart },
    { to: '/farmer/profile', label: 'Profile', icon: User },
  ],
  buyer: [
    { to: '/buyer', label: 'Marketplace', icon: Store, end: true },
    { to: '/buyer/cart', label: 'Cart', icon: ShoppingBag },
    { to: '/buyer/orders', label: 'My Orders', icon: ClipboardList },
    { to: '/buyer/profile', label: 'Profile', icon: User },
  ],
  logistics: [
    { to: '/logistics', label: 'Dashboard', icon: Truck, end: true },
    { to: '/logistics/routes', label: 'Route Details', icon: Map },
    { to: '/logistics/profile', label: 'Profile', icon: User },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/admin/farmers', label: 'Farmers / FPOs', icon: Users },
    { to: '/admin/buyers', label: 'Buyers', icon: ShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
    { to: '/admin/profile', label: 'Profile', icon: User },
  ],
}

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useApp()
  const items = NAV[user?.role] ?? []

  const roleLabels = {
    farmer: 'Farmer / FPO',
    buyer: 'Buyer Workspace',
    logistics: 'Logistics',
    admin: 'Platform Admin',
  }

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 bg-forest-900 text-leaf-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 shrink-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-leaf-400 to-leaf-600 flex items-center justify-center shadow-inner">
                <Sprout size={20} className="text-forest-950" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">FarmLink AI</span>
            </div>
            {user?.role && (
              <span className="inline-flex items-center rounded-full bg-forest-800/50 border border-leaf-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-leaf-300 w-max">
                {roleLabels[user.role]}
              </span>
            )}
          </div>
          <button className="lg:hidden text-white/70 hover:text-white transition-colors" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus-ring
                 ${isActive
                    ? 'bg-forest-800 text-white shadow-inner relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-leaf-400 before:rounded-r-full'
                    : 'text-leaf-100/70 hover:bg-forest-800/50 hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={2.5} className={`transition-colors ${isActive ? 'text-leaf-400' : 'text-leaf-100/50 group-hover:text-leaf-300'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0 bg-forest-950/20">
          <div className="flex items-center gap-3 px-2 mb-4">
            <img src={user?.avatar} alt="" className="h-10 w-10 rounded-full object-cover border-2 border-forest-700 bg-forest-800" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-leaf-100/60 truncate">{user?.phone || 'Demo User'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-leaf-100/70 border border-white/10 hover:bg-white/5 hover:text-white transition-colors focus-ring"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
