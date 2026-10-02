import { useCallback, useEffect, useMemo, useState } from 'react'
import { products as seedProducts } from '../data/products'
import { orders as seedOrders, ORDER_STAGES } from '../data/orders'
import { demoUsers } from '../data/users'
import { calculateLinePrice } from '../utils/pricing'
import { AppContext } from './contextStore'

function loadDemoState(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key)
    const parsed = saved ? JSON.parse(saved) : fallback
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function saveDemoState(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Keep the current session usable when browser storage is full or unavailable.
  }
}

function nextNumericId(items, prefix, minimum) {
  const largest = items.reduce((current, item) => {
    const match = String(item.id).match(new RegExp(`^${prefix}(\\d+)$`))
    return match ? Math.max(current, Number(match[1])) : current
  }, minimum)
  return `${prefix}${largest + 1}`
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState(() => loadDemoState('farmlink-listings', seedProducts))
  const [orders, setOrders] = useState(() => loadDemoState('farmlink-orders', seedOrders))
  const [cart, setCart] = useState(() => loadDemoState('farmlink-cart', []))
  const [toast, setToast] = useState(null)

  useEffect(() => { saveDemoState('farmlink-listings', listings) }, [listings])
  useEffect(() => { saveDemoState('farmlink-orders', orders) }, [orders])
  useEffect(() => { saveDemoState('farmlink-cart', cart) }, [cart])

  const notify = useCallback((message, tone = 'success') => {
    setToast({ message, tone, id: Date.now() })
  }, [])

  const login = useCallback((role) => {
    if (demoUsers[role]) setUser(demoUsers[role])
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCart([])
  }, [])

  const addListing = useCallback((listing) => {
    const newListing = {
      id: nextNumericId(listings, 'p', 100),
      farmerId: user?.id ?? 'f1',
      farmer: user?.orgName ?? "Farmer's Listing",
      demand: 'Medium',
      rating: 0,
      reviews: 0,
      image: listing.image || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=800&auto=format&fit=crop',
      ...listing,
      location: listing.location?.trim() || user?.location || '',
      quantity: Math.max(0, Number(listing.quantity) || 0),
      price: Math.max(0, Number(listing.price) || 0),
    }
    setListings((prev) => [newListing, ...prev])
    notify(`${newListing.name} has been added to your listings.`)
    return newListing
  }, [listings, user, notify])

  const addToCart = useCallback((productId, quantity) => {
    const product = listings.find((item) => item.id === productId)
    if (!product || product.quantity <= 0) {
      notify('This listing is no longer available.', 'error')
      return
    }
    const requested = Math.max(1, Math.floor(Number(quantity) || 0))
    const existing = cart.find((item) => item.productId === productId)
    const remaining = product.quantity - (existing?.quantity ?? 0)
    const accepted = Math.min(requested, Math.max(0, remaining))
    if (accepted <= 0) {
      notify(`Only ${product.quantity} ${product.unit} are available.`, 'error')
      return
    }
    setCart((prev) => {
      const current = prev.find((item) => item.productId === productId)
      return current
        ? prev.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + accepted } : item)
        : [...prev, { productId, quantity: accepted }]
    })
    notify(accepted < requested
      ? `Added the available ${accepted} ${product.unit} of ${product.name}.`
      : `${product.name} added to cart.`)
  }, [cart, listings, notify])

  const updateCartQuantity = useCallback((productId, quantity) => {
    const product = listings.find((item) => item.id === productId)
    if (!product) {
      setCart((prev) => prev.filter((item) => item.productId !== productId))
      return
    }
    if (quantity > product.quantity) {
      quantity = product.quantity
      notify(`Only ${product.quantity} ${product.unit} are available.`)
    }
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.productId !== productId)
      return prev.map((item) => item.productId === productId ? { ...item, quantity } : item)
    })
  }, [listings, notify])

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartItems = useMemo(() => cart.map((item) => {
    const product = listings.find((listing) => listing.id === item.productId)
    return product ? { ...item, product } : null
  }).filter(Boolean), [cart, listings])

  const cartCount = useMemo(() => cart.length, [cart])

  const placeOrder = useCallback((deliveryLocation, paymentMethod) => {
    const validItems = cartItems.filter((item) => item.quantity > 0 && item.quantity <= item.product.quantity)
    if (!validItems.length || validItems.length !== cartItems.length) {
      notify('Review your cart quantities before placing the order.', 'error')
      return []
    }

    const firstOrderNumber = Number(nextNumericId(orders, 'ORD-', 1042).replace('ORD-', ''))
    const newOrders = validItems.map((item, index) => {
      const { subtotal, logisticsFee, platformFee, total } = calculateLinePrice(item.product.price, item.quantity)
      return {
        id: `ORD-${firstOrderNumber + index}`,
        buyerId: user?.id ?? 'b1',
        buyer: user?.orgName ?? 'Buyer',
        farmerId: item.product.farmerId,
        farmer: item.product.farmer,
        product: item.product.name,
        quantity: item.quantity,
        unit: item.product.unit,
        subtotal,
        logisticsFee,
        platformFee,
        total,
        paymentMethod,
        stage: 'Order Placed',
        placedOn: new Date().toISOString().slice(0, 10),
        eta: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
        deliveryLocation: deliveryLocation.trim(),
      }
    })
    setOrders((prev) => [...newOrders, ...prev])
    const purchased = new Map(validItems.map((item) => [item.product.id, item.quantity]))
    setListings((prev) => prev.map((product) => purchased.has(product.id)
      ? { ...product, quantity: Math.max(0, product.quantity - purchased.get(product.id)) }
      : product))
    clearCart()
    notify(`${newOrders.length} order${newOrders.length === 1 ? '' : 's'} placed. This is a demo checkout.`)
    return newOrders
  }, [cartItems, orders, user, clearCart, notify])

  const advanceOrderStage = useCallback((orderId) => {
    setOrders((prev) => prev.map((order) => {
      if (order.id !== orderId) return order
      const index = ORDER_STAGES.indexOf(order.stage)
      const next = ORDER_STAGES[Math.min(index + 1, ORDER_STAGES.length - 1)]
      return { ...order, stage: next }
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
