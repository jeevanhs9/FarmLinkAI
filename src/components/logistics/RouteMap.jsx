import { useEffect, useRef, useState } from 'react'
import { getStopOrders, logisticsStops, routeComparison } from '../../data/logistics'

let mapsPromise

function loadMaps(key) {
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google.maps)
  if (mapsPromise) return mapsPromise
  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&libraries=marker`
    script.async = true
    script.onload = () => {
      if (window.google?.maps) resolve(window.google.maps)
      else { mapsPromise = null; reject(new Error('Google Maps did not initialize.')) }
    }
    script.onerror = () => { mapsPromise = null; reject(new Error('Google Maps could not load.')) }
    document.head.appendChild(script)
  })
  return mapsPromise
}

const timeText = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`
}

export default function RouteMap({
  height = 440, selectedStopId, onSelectStop, onRouteState, refreshToken,
  tracking, trackingProgress = 0, onTrackingUpdate, viewAction,
}) {
  const host = useRef(null)
  const mapRef = useRef(null)
  const markerRefs = useRef({})
  const routePath = useRef([])
  const vehicleRef = useRef(null)
  const trackingRef = useRef(0)
  const boundsRef = useRef(null)
  const routeKmRef = useRef(0)
  const [fallback, setFallback] = useState('')
  const [routingMode, setRoutingMode] = useState('loading')
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'

  useEffect(() => {
    let active = true
    const showOfflineRoute = (reason) => {
      routePath.current = logisticsStops.map((stop) => stop.position)
      routeKmRef.current = Number.parseFloat(routeComparison.optimized.distance)
      setRoutingMode('demo')
      setFallback(reason)
      onRouteState?.({
        status: 'directions-error',
        offline: true,
        distance: routeComparison.optimized.distance,
        duration: routeComparison.optimized.time,
      })
    }

    const initialize = async () => {
      if (!key) {
        showOfflineRoute('Google Maps is not configured. The stop order and comparison figures are demonstration data.')
        return
      }
      onRouteState?.({ status: 'calculating' })
      try {
        const maps = await loadMaps(key)
        const [{ Map, InfoWindow }, { AdvancedMarkerElement }, { DirectionsService, DirectionsRenderer, TravelMode }] = await Promise.all([
          maps.importLibrary('maps'), maps.importLibrary('marker'), maps.importLibrary('routes'),
        ])
        if (!active || !host.current) return
        const map = new Map(host.current, {
          center: { lat: 13.12, lng: 77.63 }, zoom: 8, mapId,
          streetViewControl: false, mapTypeControl: false,
        })
        mapRef.current = map
        const info = new InfoWindow()
        const bounds = new maps.LatLngBounds()
        boundsRef.current = bounds

        logisticsStops.forEach((stop) => {
          const stopOrders = getStopOrders(stop)
          const quantity = stopOrders.reduce((sum, order) => sum + order.quantityKg, 0)
          const content = document.createElement('button')
          content.className = `logistics-marker ${stop.type}`
          const number = document.createElement('b')
          number.textContent = stop.sequence
          const label = document.createElement('span')
          label.textContent = stop.name
          content.append(number, label)
          const marker = new AdvancedMarkerElement({ map, position: stop.position, title: `${stop.sequence}. ${stop.name}`, content })
          marker.addListener('click', () => {
            onSelectStop?.(stop.id)
            const details = document.createElement('div')
            const heading = document.createElement('strong')
            heading.textContent = `${stop.sequence}. ${stop.name}`
            details.append(heading)
            const detailLines = [
              `${stop.type === 'pickup' ? 'PICKUP / FPO' : 'BUYER DELIVERY'} · ${stop.location}`,
              `Orders: ${stopOrders.map((order) => order.id).join(', ')}`,
              `${stopOrders.map((order) => order.product).join(' + ')} · ${quantity} kg`,
              `Status: ${stop.status} · ETA: ${stop.eta}`,
            ]
            detailLines.forEach((line) => {
              const paragraph = document.createElement('p')
              paragraph.textContent = line
              details.append(paragraph)
            })
            info.setContent(details)
            info.open({ map, anchor: marker })
          })
          markerRefs.current[stop.id] = marker
          bounds.extend(stop.position)
        })
        map.fitBounds(bounds, 64)

        try {
          const renderer = new DirectionsRenderer({
            map, suppressMarkers: true, preserveViewport: true,
            polylineOptions: { strokeColor: '#256e41', strokeWeight: 5, strokeOpacity: 0.9 },
          })
          const result = await new DirectionsService().route({
            origin: logisticsStops[0].position,
            destination: logisticsStops.at(-1).position,
            waypoints: logisticsStops.slice(1, -1).map((stop) => ({ location: stop.position, stopover: true })),
            travelMode: TravelMode.DRIVING,
            optimizeWaypoints: false,
          })
          if (!active) return
          renderer.setDirections(result)
          routePath.current = result.routes[0]?.overview_path ?? []
          const legs = result.routes[0]?.legs ?? []
          const meters = legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0)
          const seconds = legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0)
          routeKmRef.current = meters / 1000
          setRoutingMode('ready')
          onRouteState?.({ status: 'ready', distance: `${(meters / 1000).toFixed(1)} km`, duration: timeText(seconds) })
        } catch (error) {
          console.error('FarmLink Directions error: road routing unavailable.', error)
          if (!active) return
          routePath.current = logisticsStops.map((stop) => stop.position)
          new maps.Polyline({
            path: routePath.current, map, strokeColor: '#256e41', strokeWeight: 4, strokeOpacity: 0.72,
            icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 }, offset: '0', repeat: '14px' }],
          })
          setRoutingMode('demo')
          onRouteState?.({ status: 'directions-error', distance: routeComparison.optimized.distance, duration: routeComparison.optimized.time })
        }

        if (routePath.current.length) {
          const truck = document.createElement('div')
          truck.className = 'logistics-truck'
          truck.textContent = '🚚'
          vehicleRef.current = new AdvancedMarkerElement({ map, position: routePath.current[0], title: 'FarmLink Truck 01 — DEMO LIVE', content: truck })
        }
      } catch (error) {
        console.error('FarmLink Maps loading error: map API could not initialize.', error)
        if (active) showOfflineRoute(`${error.message} Showing the fixed demo route.`)
      }
    }

    initialize()
    return () => {
      active = false
      mapRef.current = null
      markerRefs.current = {}
      vehicleRef.current = null
    }
  }, [key, mapId, refreshToken, onRouteState, onSelectStop])

  useEffect(() => { trackingRef.current = trackingProgress }, [trackingProgress])

  useEffect(() => {
    if (!tracking || !routePath.current.length || (!vehicleRef.current && !fallback)) return undefined
    const timer = window.setInterval(() => {
      trackingRef.current = Math.min(100, trackingRef.current + 2)
      const index = Math.min(routePath.current.length - 1, Math.floor((trackingRef.current / 100) * (routePath.current.length - 1)))
      if (vehicleRef.current) vehicleRef.current.position = routePath.current[index]
      const currentIndex = Math.min(logisticsStops.length - 1, Math.floor((trackingRef.current / 100) * logisticsStops.length))
      onTrackingUpdate?.({
        progress: trackingRef.current,
        currentStopId: logisticsStops[currentIndex].id,
        remainingKm: Math.max(0, routeKmRef.current * (1 - trackingRef.current / 100)).toFixed(1),
      })
      if (trackingRef.current === 100) window.clearInterval(timer)
    }, 1200)
    return () => window.clearInterval(timer)
  }, [tracking, onTrackingUpdate, fallback])

  useEffect(() => {
    const marker = markerRefs.current[selectedStopId]
    if (marker && mapRef.current) mapRef.current.panTo(marker.position)
  }, [selectedStopId])

  useEffect(() => {
    if (!mapRef.current || !viewAction) return
    if (viewAction.startsWith('fit')) mapRef.current.fitBounds(boundsRef.current, 64)
    if (viewAction.startsWith('recenter')) mapRef.current.panTo({ lat: 13.12, lng: 77.63 })
  }, [viewAction])

  if (fallback) return <Fallback height={height} reason={fallback} selectedStopId={selectedStopId} onSelectStop={onSelectStop} trackingProgress={trackingProgress} />
  return <div className="relative overflow-hidden rounded-xl border border-ink-100 bg-leaf-50 shadow-sm" style={{ height }}>
    <div ref={host} className="h-full w-full" />
    <div className="absolute right-3 top-3 rounded-full border border-ink-100 bg-white/95 px-3 py-1.5 text-[11px] font-semibold shadow-sm">
      {routingMode === 'ready' ? <span className="text-forest-700">● Live Google Maps</span> : routingMode === 'demo' ? <span className="text-amber-500">● Live Map · Demo Routing</span> : <span className="text-ink-500">● Calculating route…</span>}
    </div>
    <div className="absolute left-3 bottom-3 flex items-center gap-3 rounded-lg border border-ink-100 bg-white/95 px-3 py-2 text-[11px] shadow-sm">
      <span className="flex items-center gap-1.5 text-clay-500"><i className="h-2 w-2 rounded-full bg-clay-500" /> Pickup / FPO</span>
      <span className="flex items-center gap-1.5 text-forest-700"><i className="h-2 w-2 rounded-full bg-forest-700" /> Buyer delivery</span>
    </div>
  </div>
}

function Fallback({ height, reason, selectedStopId, onSelectStop, trackingProgress }) {
  const width = 800
  const mapHeight = 365
  const points = logisticsStops.map((stop) => ({
    stop,
    x: 55 + ((stop.position.lng - 77) / 1.25) * 690,
    y: 42 + ((13.5 - stop.position.lat) / 0.6) * 285,
  }))
  const route = points.map(({ x, y }) => `${x},${y}`).join(' ')
  const position = Math.min(points.length - 2, Math.floor((trackingProgress / 100) * (points.length - 1)))
  const progress = Math.max(0, Math.min(1, (trackingProgress / 100) * (points.length - 1) - position))
  const truck = {
    x: points[position].x + (points[position + 1].x - points[position].x) * progress,
    y: points[position].y + (points[position + 1].y - points[position].y) * progress,
  }

  return <div className="relative overflow-hidden rounded-xl border border-ink-100 bg-[#edf4e9]" style={{ height }}>
    <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-2 p-3">
      <div className="rounded-lg border border-ink-100 bg-white/95 px-3 py-2 shadow-sm"><p className="text-xs font-semibold text-ink-900">Offline route preview</p><p className="mt-0.5 max-w-sm text-[10px] leading-relaxed text-ink-500">{reason}</p></div>
      <span className="rounded-full border border-amber-200 bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-amber-700 shadow-sm">DEMO ROUTE · NO LIVE GPS</span>
    </div>
    <svg viewBox={`0 0 ${width} ${mapHeight}`} role="img" aria-label="Illustrated demo pickup and delivery route across six stops" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <defs><pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dce7d6" strokeWidth="1" /></pattern></defs>
      <rect width={width} height={mapHeight} fill="#edf4e9" />
      <rect width={width} height={mapHeight} fill="url(#mapGrid)" />
      <path d="M-20 286 C125 260 176 325 300 280 S520 215 820 252" fill="none" stroke="#fff" strokeWidth="28" />
      <path d="M-20 286 C125 260 176 325 300 280 S520 215 820 252" fill="none" stroke="#d6dfd2" strokeWidth="1.5" strokeDasharray="8 7" />
      <path d="M85 8 C132 112 198 155 214 380 M395 -20 C353 88 435 188 450 385 M682 -20 C628 72 720 156 684 380" fill="none" stroke="#fff" strokeWidth="18" />
      <path d="M85 8 C132 112 198 155 214 380 M395 -20 C353 88 435 188 450 385 M682 -20 C628 72 720 156 684 380" fill="none" stroke="#d6dfd2" strokeWidth="1.25" strokeDasharray="7 7" />
      <polyline points={route} fill="none" stroke="#fff" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={route} fill="none" stroke="#256e41" strokeWidth="4" strokeDasharray="9 7" strokeLinejoin="round" strokeLinecap="round" />
      {points.map(({ stop, x, y }) => {
        const selected = selectedStopId === stop.id
        const fill = stop.type === 'pickup' ? '#c96a3a' : '#1c5834'
        const labels = {
          kolar: { name: 'Kolar FPO', dx: -16, dy: -16, anchor: 'end' },
          chikkaballapur: { name: 'Chikkaballapur', dx: 0, dy: 35, anchor: 'middle' },
          tumakuru: { name: 'Tumakuru FPO', dx: -4, dy: -18, anchor: 'middle' },
          north: { name: 'North buyer', dx: -17, dy: -19, anchor: 'end' },
          central: { name: 'Central buyer', dx: -18, dy: 34, anchor: 'end' },
          east: { name: 'East buyer', dx: 20, dy: 27, anchor: 'start' },
        }
        const label = labels[stop.id]
        const labelX = x + label.dx
        const labelY = y + label.dy
        return <g key={stop.id} role="button" tabIndex="0" aria-label={`Stop ${stop.sequence}: ${stop.type}, ${stop.name}, ${stop.eta}`} onClick={() => onSelectStop?.(stop.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectStop?.(stop.id) } }} className="route-stop cursor-pointer focus:outline-none">
          <title>{`Stop ${stop.sequence} · ${stop.name} · ${stop.eta}`}</title>
          {selected && <circle cx={x} cy={y} r="23" fill={fill} opacity=".16" />}
          <circle cx={x} cy={y} r="15" fill="white" />
          <circle cx={x} cy={y} r="12" fill={fill} stroke={selected ? '#123420' : '#fff'} strokeWidth={selected ? 3 : 1.5} />
          <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{stop.sequence}</text>
          <text x={labelX} y={labelY} textAnchor={label.anchor} fill="#1b211d" fontSize="11" fontWeight="600" paintOrder="stroke" stroke="white" strokeWidth="4" strokeLinejoin="round">{label.name}</text>
          <text x={labelX} y={labelY + 13} textAnchor={label.anchor} fill="#6b756e" fontSize="9" paintOrder="stroke" stroke="white" strokeWidth="3" strokeLinejoin="round">{stop.eta}</text>
        </g>
      })}
      <g transform={`translate(${truck.x} ${truck.y})`} aria-hidden="true"><circle r="16" fill="white" stroke="#16462a" strokeWidth="2" /><text x="0" y="6" textAnchor="middle" fontSize="16">🚚</text></g>
      <g transform="translate(548 322)"><rect width="234" height="29" rx="8" fill="white" opacity=".94" /><circle cx="17" cy="14.5" r="5" fill="#c96a3a" /><text x="28" y="18" fill="#3c453e" fontSize="10">FPO pickup</text><circle cx="112" cy="14.5" r="5" fill="#1c5834" /><text x="123" y="18" fill="#3c453e" fontSize="10">Buyer delivery</text></g>
    </svg>
  </div>
}
