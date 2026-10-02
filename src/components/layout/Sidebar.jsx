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

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 bg-forest-900 text-leaf-50 flex flex-col transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-leaf-500 flex items-center justify-center">
              <Sprout size={18} className="text-forest-900" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-white text-[15px] tracking-tight">FarmLink AI</span>
          </div>
          <button className="lg:hidden text-white/70" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-ring
                 ${isActive ? 'bg-forest-700 text-white' : 'text-leaf-100/80 hover:bg-forest-800 hover:text-white'}`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-leaf-100/80 hover:bg-forest-800 hover:text-white transition-colors focus-ring"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
