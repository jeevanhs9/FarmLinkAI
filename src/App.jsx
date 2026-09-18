import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import DashboardLayout from './components/layout/DashboardLayout'

import Login from './pages/auth/Login'
import Profile from './pages/Profile'

import FarmerDashboard from './pages/farmer/FarmerDashboard'
import MyProducts from './pages/farmer/MyProducts'
import AddListing from './pages/farmer/AddListing'
import FarmerOrders from './pages/farmer/FarmerOrders'
import AIInsights from './pages/farmer/AIInsights'

import Marketplace from './pages/buyer/Marketplace'
import ProductDetails from './pages/buyer/ProductDetails'
import Cart from './pages/buyer/Cart'
import Checkout from './pages/buyer/Checkout'
import MyOrders from './pages/buyer/MyOrders'

import LogisticsDashboard from './pages/logistics/LogisticsDashboard'
import RouteDetails from './pages/logistics/RouteDetails'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminFarmers from './pages/admin/AdminFarmers'
import AdminBuyers from './pages/admin/AdminBuyers'
import AdminOrders from './pages/admin/AdminOrders'
import PlatformAnalytics from './pages/admin/PlatformAnalytics'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AppProvider>
  )
}
