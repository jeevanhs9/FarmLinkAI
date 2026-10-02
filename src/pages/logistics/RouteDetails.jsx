import { useState } from 'react'
import { CheckCircle2, Circle, MapPin, Package } from 'lucide-react'
import RouteMap from '../../components/logistics/RouteMap'
import { getStopOrders, logisticsStops } from '../../data/logistics'

function statusClass(status) {
  if (status === 'Delivered') return 'text-forest-700 bg-leaf-100'
  if (status === 'In Transit') return 'text-amber-500 bg-amber-100'
  return 'text-ink-700 bg-ink-100'
}

export default function RouteDetails() {
  const [selectedStopId, setSelectedStopId] = useState(logisticsStops[0].id)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">Route Details</h2>
        <p className="text-sm text-ink-500 mt-1">Select a map marker or stop to review its load and planned timing.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_410px] gap-5">
        <div className="card p-4">
          <RouteMap height={430} selectedStopId={selectedStopId} onSelectStop={setSelectedStopId} />
        </div>
        <div className="card p-4">
          <h3 className="font-display font-semibold text-sm text-ink-900 mb-4">Stops & shipments</h3>
          <ol className="space-y-2">
            {logisticsStops.map((stop, index) => {
              const orders = getStopOrders(stop)
              const quantity = orders.reduce((sum, order) => sum + order.quantityKg, 0)
              const selected = stop.id === selectedStopId
              return <li key={stop.id}>
                <button type="button" onClick={() => setSelectedStopId(stop.id)} aria-pressed={selected} className={`w-full rounded-lg p-2.5 text-left transition-colors focus-ring ${selected ? 'bg-leaf-50' : 'hover:bg-sand-50'}`}>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {stop.status === 'Delivered' ? <CheckCircle2 size={18} className="text-forest-600" /> : <Circle size={18} className={stop.status === 'In Transit' ? 'text-amber-500' : 'text-ink-300'} />}
                      {index < logisticsStops.length - 1 && <div className="w-px flex-1 mt-1 bg-ink-100" />}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-ink-900 flex items-center gap-1.5"><MapPin size={12} className={stop.type === 'pickup' ? 'text-clay-500' : 'text-forest-700'} />{stop.sequence}. {stop.type === 'pickup' ? 'Pickup' : 'Delivery'} — {stop.name}</p>
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusClass(stop.status)}`}>{stop.status}</span>
                      </div>
                      <p className="text-xs text-ink-500 mt-0.5">{stop.location} · ETA {stop.eta}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-700"><Package size={12} />{orders.length ? `${orders.map((order) => order.id).join(', ')} · ${orders.map((order) => order.product).join(', ')} · ${quantity} kg` : 'Consolidated delivery · mixed load'}</p>
                    </div>
                  </div>
                </button>
              </li>
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
