import { useEffect, useRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { getStopOrders, logisticsStops } from '../../data/logistics'

let mapsPromise
function loadMaps(key) {
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google.maps)
  if (mapsPromise) return mapsPromise
  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&libraries=marker`
    script.async = true
    script.onload = () => window.google?.maps ? resolve(window.google.maps) : reject(new Error('Google Maps did not initialize.'))
    script.onerror = () => reject(new Error('Google Maps could not load.'))
    document.head.appendChild(script)
  })
  return mapsPromise
}
const timeText = (seconds) => { const h = Math.floor(seconds / 3600); const m = Math.round((seconds % 3600) / 60); return h ? `${h}h ${m}m` : `${m}m` }

export default function RouteMap({ height = 440, selectedStopId, onSelectStop, onRouteState, refreshToken, tracking, onTrackingUpdate, viewAction }) {
  const host = useRef(null); const mapRef = useRef(null); const markerRefs = useRef({})
  const [fallback, setFallback] = useState(''); const [routingMode, setRoutingMode] = useState('loading'); const routePath = useRef([]); const vehicleRef = useRef(null); const trackingRef = useRef(0); const boundsRef = useRef(null); const routeKmRef = useRef(0)
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'

  useEffect(() => {
    let active = true
    const init = async () => {
      if (!key) { setFallback('No VITE_GOOGLE_MAPS_API_KEY configured.'); onRouteState?.({ status: 'unavailable' }); return }
      onRouteState?.({ status: 'calculating' })
      try {
        const maps = await loadMaps(key)
        const [{ Map, InfoWindow }, { AdvancedMarkerElement }, { DirectionsService, DirectionsRenderer, TravelMode }] = await Promise.all([maps.importLibrary('maps'), maps.importLibrary('marker'), maps.importLibrary('routes')])
        if (!active || !host.current) return
        const map = new Map(host.current, { center: { lat: 13.12, lng: 77.63 }, zoom: 8, mapId, streetViewControl: false, mapTypeControl: false })
        mapRef.current = map
        const info = new InfoWindow(); const bounds = new maps.LatLngBounds(); boundsRef.current = bounds
        logisticsStops.forEach((stop) => {
          const orders = getStopOrders(stop); const quantity = orders.reduce((sum, order) => sum + order.quantityKg, 0)
          const content = document.createElement('button'); content.className = `logistics-marker ${stop.type}`; content.innerHTML = `<b>${stop.sequence}</b><span>${stop.name}</span>`
          const marker = new AdvancedMarkerElement({ map, position: stop.position, title: `${stop.sequence}. ${stop.name}`, content })
          marker.addListener('click', () => { onSelectStop?.(stop.id); info.setContent(`<strong>${stop.sequence}. ${stop.name}</strong><br/>${stop.type === 'pickup' ? 'PICKUP / FPO' : 'BUYER DELIVERY'} · ${stop.location}<br/>Orders: ${orders.map((order) => order.id).join(', ')}<br/>${orders.map((order) => order.product).join(' + ')} · ${quantity} kg<br/>Status: ${stop.status} · ETA: ${stop.eta}`); info.open({ map, anchor: marker }) })
          markerRefs.current[stop.id] = marker; bounds.extend(stop.position)
        })
        map.fitBounds(bounds, 64)
        setRoutingMode('loading')
        try {
          const renderer = new DirectionsRenderer({ map, suppressMarkers: true, preserveViewport: true, polylineOptions: { strokeColor: '#256e41', strokeWeight: 5, strokeOpacity: .9 } })
          const result = await new DirectionsService().route({ origin: logisticsStops[0].position, destination: logisticsStops.at(-1).position, waypoints: logisticsStops.slice(1, -1).map((stop) => ({ location: stop.position, stopover: true })), travelMode: TravelMode.DRIVING, optimizeWaypoints: false })
          if (!active) return
          renderer.setDirections(result); routePath.current = result.routes[0]?.overview_path ?? []
          const legs = result.routes[0]?.legs ?? []; const meters = legs.reduce((n, leg) => n + (leg.distance?.value || 0), 0); const seconds = legs.reduce((n, leg) => n + (leg.duration?.value || 0), 0); routeKmRef.current = meters / 1000
          setRoutingMode('ready'); onRouteState?.({ status: 'ready', distance: `${(meters / 1000).toFixed(1)} km`, duration: timeText(seconds) })
        } catch (error) {
          console.error('FarmLink Directions error: road routing unavailable.', error)
          if (!active) return
          routePath.current = logisticsStops.map((stop) => stop.position)
          new maps.Polyline({ path: routePath.current, map, strokeColor: '#256e41', strokeWeight: 4, strokeOpacity: .72, icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 }, offset: '0', repeat: '14px' }] })
          setRoutingMode('demo'); onRouteState?.({ status: 'directions-error' })
        }
        if (routePath.current.length) { const truck = document.createElement('div'); truck.className = 'logistics-truck'; truck.textContent = '🚚'; vehicleRef.current = new AdvancedMarkerElement({ map, position: routePath.current[0], title: 'FarmLink Truck 01 — DEMO LIVE', content: truck }) }
      } catch (error) { console.error('FarmLink Maps loading error: map API could not initialize.', error); if (active) { setFallback(error.message); onRouteState?.({ status: 'unavailable' }) } }
    }
    init(); return () => { active = false; mapRef.current = null; markerRefs.current = {} }
  }, [key, mapId, refreshToken, onRouteState, onSelectStop])

  useEffect(() => {
    if (!tracking || !routePath.current.length || !vehicleRef.current) return undefined
    const timer = window.setInterval(() => {
      trackingRef.current = Math.min(100, trackingRef.current + 2)
      const index = Math.min(routePath.current.length - 1, Math.floor((trackingRef.current / 100) * (routePath.current.length - 1)))
      vehicleRef.current.position = routePath.current[index]
      const currentIndex = Math.min(logisticsStops.length - 1, Math.floor((trackingRef.current / 100) * logisticsStops.length))
      onTrackingUpdate?.({ progress: trackingRef.current, currentStopId: logisticsStops[currentIndex].id, remainingKm: Math.max(0, routeKmRef.current * (1 - trackingRef.current / 100)).toFixed(1) })
      if (trackingRef.current === 100) window.clearInterval(timer)
    }, 1200)
    return () => window.clearInterval(timer)
  }, [tracking, onTrackingUpdate])

  useEffect(() => { const marker = markerRefs.current[selectedStopId]; if (marker && mapRef.current) mapRef.current.panTo(marker.position) }, [selectedStopId])
  useEffect(() => { if (!mapRef.current || !viewAction) return; if (viewAction.startsWith('fit')) mapRef.current.fitBounds(boundsRef.current, 64); if (viewAction.startsWith('recenter')) mapRef.current.panTo({ lat: 13.12, lng: 77.63 }) }, [viewAction])
  if (fallback) return <Fallback height={height} reason={fallback} />
  return <div className="relative overflow-hidden rounded-xl border border-ink-100 bg-leaf-50 shadow-sm" style={{ height }}><div ref={host} className="h-full w-full" /><div className="absolute right-3 top-3 rounded-full border border-ink-100 bg-white/95 px-3 py-1.5 text-[11px] font-semibold shadow-sm">{routingMode === 'ready' ? <span className="text-forest-700">● Live Google Maps</span> : routingMode === 'demo' ? <span className="text-amber-500">● Live Map • Demo Routing</span> : <span className="text-ink-500">● Calculating route…</span>}</div><div className="absolute left-3 bottom-3 flex items-center gap-3 rounded-lg border border-ink-100 bg-white/95 px-3 py-2 text-[11px] shadow-sm"><span className="flex items-center gap-1.5 text-clay-500"><i className="h-2 w-2 rounded-full bg-clay-500" /> Pickup / FPO</span><span className="flex items-center gap-1.5 text-forest-700"><i className="h-2 w-2 rounded-full bg-forest-700" /> Buyer delivery</span></div></div>
}

function Fallback({ height, reason }) {
  return <div className="grid place-items-center rounded-xl border border-ink-100 bg-leaf-50 p-6 text-center" style={{ height }}><AlertCircle size={24} className="text-amber-500" /><div className="mt-3"><p className="font-semibold text-ink-900">Google Maps not configured</p><p className="mt-1 max-w-sm text-xs text-ink-500">{reason} Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to enable live map routing.</p><p className="mt-3 text-[11px] font-medium text-ink-500">Demo Route — Live Google Maps unavailable</p><p className="mt-1 text-[11px] text-ink-400">Prototype simulation remains available in Route Details.</p></div></div>
}
