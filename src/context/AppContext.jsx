import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { products as seedProducts } from '../data/products'
import { orders as seedOrders, ORDER_STAGES } from '../data/orders'
import { demoUsers } from '../data/users'

const AppContext = createContext(null)

let listingIdCounter = 100
let orderIdCounter = 1043

function loadDemoState(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null) // { role, ...profile }
  const [listings, setListings] = useState(() => loadDemoState('farmlink-listings', seedProducts))
  const [orders, setOrders] = useState(() => loadDemoState('farmlink-orders', seedOrders))
  const [cart, setCart] = useState(() => loadDemoState('farmlink-cart', [])) // { productId, quantity }
  const [toast, setToast] = useState(null)

  useEffect(() => { window.localStorage.setItem('farmlink-listings', JSON.stringify(listings)) }, [listings])
  useEffect(() => { window.localStorage.setItem('farmlink-orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { window.localStorage.setItem('farmlink-cart', JSON.stringify(cart)) }, [cart])

  const notify = useCallback((message, tone = 'success') => {
    setToast({ message, tone, id: Date.now() })
  }, [])

  const login = useCallback((role) => {
    setUser(demoUsers[role])
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCart([])
  }, [])

  const addListing = useCallback((listing) => {
    listingIdCounter += 1
    const newListing = {
      id: `p${listingIdCounter}`,
      farmerId: user?.id ?? 'f1',
      farmer: user?.orgName ?? "Farmer's Listing",
      location: user?.location ?? '',
      demand: 'Medium',
      rating: 0,
      reviews: 0,
      image: listing.image || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=800&auto=format&fit=crop',
      ...listing,
    }
    setListings((prev) => [newListing, ...prev])
    notify(`${newListing.name} has been added to your listings.`)
    return newListing
  }, [user, notify])

  const addToCart = useCallback((productId, quantity) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId)
      if (existing) {
        return prev.map((c) => c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c)
      }
      return [...prev, { productId, quantity }]
    })
    const product = listings.find((item) => item.id === productId)
    if (product) notify(`${product.name} added to cart.`)
  }, [listings, notify])

  const updateCartQuantity = useCallback((productId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((c) => c.productId !== productId)
      return prev.map((c) => c.productId === productId ? { ...c, quantity } : c)
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartItems = useMemo(() => {
    return cart.map((c) => {
      const product = listings.find((p) => p.id === c.productId)
      return product ? { ...c, product } : null
    }).filter(Boolean)
  }, [cart, listings])

  const cartCount = useMemo(() => cart.reduce((sum, c) => sum + 1, 0), [cart])

  const placeOrder = useCallback((deliveryLocation) => {
    const newOrders = cartItems.map((item) => {
      orderIdCounter += 1
      return {
        id: `ORD-${orderIdCounter}`,
        buyerId: user?.id ?? 'b1',
        buyer: user?.orgName ?? 'Buyer',
        farmerId: item.product.farmerId,
        farmer: item.product.farmer,
        product: item.product.name,
        quantity: item.quantity,
        unit: item.product.unit,
        // Match the checkout's 8% logistics and 2% platform fee demo breakdown.
        total: Math.round(item.product.price * item.quantity * 1.10),
        stage: 'Order Placed',
        placedOn: new Date().toISOString().slice(0, 10),
        eta: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
        deliveryLocation,
      }
    })
    setOrders((prev) => [...newOrders, ...prev])
    clearCart()
    notify(`${newOrders.length} order${newOrders.length === 1 ? '' : 's'} placed. This is a demo checkout.`)
    return newOrders
  }, [cartItems, user, clearCart, notify])

  const advanceOrderStage = useCallback((orderId) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o
      const idx = ORDER_STAGES.indexOf(o.stage)
      const next = ORDER_STAGES[Math.min(idx + 1, ORDER_STAGES.length - 1)]
      return { ...o, stage: next }
    }))
  }, [])

  const value = {
    user, login, logout,
    listings, addListing,
    orders, advanceOrderStage,
    cart, cartItems, cartCount, addToCart, updateCartQuantity, removeFromCart, clearCart, placeOrder,
    toast, dismissToast: () => setToast(null), notify,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
