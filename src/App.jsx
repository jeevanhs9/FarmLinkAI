import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import DashboardLayout from './components/layout/DashboardLayout'

const Login = lazy(() => import('./pages/auth/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const FarmerDashboard = lazy(() => import('./pages/farmer/FarmerDashboard'))
const MyProducts = lazy(() => import('./pages/farmer/MyProducts'))
const AddListing = lazy(() => import('./pages/farmer/AddListing'))
const FarmerOrders = lazy(() => import('./pages/farmer/FarmerOrders'))
const AIInsights = lazy(() => import('./pages/farmer/AIInsights'))
const Marketplace = lazy(() => import('./pages/buyer/Marketplace'))
const ProductDetails = lazy(() => import('./pages/buyer/ProductDetails'))
const Cart = lazy(() => import('./pages/buyer/Cart'))
const Checkout = lazy(() => import('./pages/buyer/Checkout'))
const MyOrders = lazy(() => import('./pages/buyer/MyOrders'))
const LogisticsDashboard = lazy(() => import('./pages/logistics/LogisticsDashboard'))
const RouteDetails = lazy(() => import('./pages/logistics/RouteDetails'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminFarmers = lazy(() => import('./pages/admin/AdminFarmers'))
const AdminBuyers = lazy(() => import('./pages/admin/AdminBuyers'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const PlatformAnalytics = lazy(() => import('./pages/admin/PlatformAnalytics'))

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/farmer" element={<DashboardLayout allowedRole="farmer" />}>
              <Route index element={<FarmerDashboard />} />
              <Route path="products" element={<MyProducts />} />
              <Route path="listing/new" element={<AddListing />} />
              <Route path="orders" element={<FarmerOrders />} />
              <Route path="insights" element={<AIInsights />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/buyer" element={<DashboardLayout allowedRole="buyer" />}>
              <Route index element={<Marketplace />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/logistics" element={<DashboardLayout allowedRole="logistics" />}>
              <Route index element={<LogisticsDashboard />} />
              <Route path="routes" element={<RouteDetails />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/admin" element={<DashboardLayout allowedRole="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="farmers" element={<AdminFarmers />} />
              <Route path="buyers" element={<AdminBuyers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="analytics" element={<PlatformAnalytics />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  )
}

function PageLoading() {
  return <div className="grid min-h-screen place-items-center bg-sand-50 text-sm text-ink-500" role="status" aria-live="polite">Loading FarmLink workspace…</div>
}
