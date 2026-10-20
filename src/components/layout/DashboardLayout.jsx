import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useApp } from '../../context/useApp'
import Toast from '../ui/Toast'

const TITLES = {
  '/farmer': 'Farmer Dashboard',
  '/farmer/products': 'My Products',
  '/farmer/listing/new': 'Add New Listing',
  '/farmer/orders': 'Orders',
  '/farmer/insights': 'AI Insights',
  '/farmer/pooling': 'Intelligent Load Pooling',
  '/farmer/offers': 'Buyer Offers & Net Proceeds',
  '/farmer/profile': 'Profile',
  '/buyer': 'Marketplace',
  '/buyer/cart': 'Shopping Cart',
  '/buyer/checkout': 'Checkout',
  '/buyer/orders': 'My Orders',
  '/buyer/profile': 'Profile',
  '/logistics': 'Logistics Dashboard',
  '/logistics/routes': 'Route Details',
  '/logistics/pooling': 'Load Pooling Coordination',
  '/logistics/profile': 'Profile',
  '/admin': 'Platform Overview',
  '/admin/farmers': 'Farmers / FPOs',
  '/admin/buyers': 'Buyers',
  '/admin/orders': 'Platform Orders',
  '/admin/analytics': 'Platform Analytics',
  '/admin/enterprise': 'SAP Enterprise SCM Gateway',
  '/admin/profile': 'Profile',
  '/disruptions': 'Supply Chain Disruption Recovery Hub',
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
  const isAllowed = !allowedRole || user.role === allowedRole || (allowedRole === 'farmer' && user.role === 'fpo')
  if (!isAllowed) return <Navigate to={`/${user.role === 'fpo' ? 'farmer' : user.role}`} replace />

  return (
    <div className="min-h-screen flex bg-sand-50 selection:bg-leaf-300 selection:text-ink-900">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col relative">
        <Topbar title={titleFor(location.pathname)} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-7 max-w-[1400px] w-full mx-auto relative z-0 animate-fade-up">
          <Outlet />
        </main>
        <Toast toast={toast} onDismiss={dismissToast} />
      </div>
    </div>
  )
}
