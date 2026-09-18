import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useApp } from '../../context/AppContext'
import Toast from '../ui/Toast'

const TITLES = {
  '/farmer': 'Farmer Dashboard',
  '/farmer/products': 'My Products',
  '/farmer/listing/new': 'Add New Listing',
  '/farmer/orders': 'Orders',
  '/farmer/insights': 'AI Insights',
  '/farmer/profile': 'Profile',
  '/buyer': 'Marketplace',
  '/buyer/cart': 'Cart',
  '/buyer/checkout': 'Checkout',
  '/buyer/orders': 'My Orders',
  '/buyer/profile': 'Profile',
  '/logistics': 'Logistics Dashboard',
  '/logistics/routes': 'Route Details',
  '/logistics/profile': 'Profile',
  '/admin': 'Platform Overview',
  '/admin/farmers': 'Farmers / FPOs',
  '/admin/buyers': 'Buyers',
  '/admin/orders': 'Orders',
  '/admin/analytics': 'Platform Analytics',
  '/admin/profile': 'Profile',
}

function titleFor(pathname) {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.startsWith('/buyer/product/')) return 'Product Details'
  return 'FarmLink AI'
}

export default function DashboardLayout({ allowedRole }) {
  const { user, toast, dismissToast } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}`} replace />

  return (
    <div className="min-h-screen flex bg-sand-50">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={titleFor(location.pathname)} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-7 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
        <Toast toast={toast} onDismiss={dismissToast} />
      </div>
    </div>
  )
}
