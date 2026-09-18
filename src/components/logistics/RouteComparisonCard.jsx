import { formatINR } from '../../utils/format'

function RouteBlock({ label, distance, time, cost, highlight }) {
  return (
    <div className={`rounded-lg p-3 border ${highlight ? 'border-forest-600 bg-leaf-50' : 'border-ink-100'}`}>
      <p className={`text-xs font-semibold mb-2 ${highlight ? 'text-forest-700' : 'text-ink-500'}`}>{label}</p>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-ink-500">Distance</span><span className="font-medium text-ink-900">{distance}</span></div>
        <div className="flex justify-between"><span className="text-ink-500">Time</span><span className="font-medium text-ink-900">{time}</span></div>
        <div className="flex justify-between"><span className="text-ink-500">Cost</span><span className="font-medium text-ink-900">{cost}</span></div>
      </div>
    </div>
  )
}

export default function RouteComparisonCard({ baseline, optimized }) {
  const distanceSaved = Number.parseFloat(baseline.distance) - Number.parseFloat(optimized.distance)
  const costDifference = baseline.cost - optimized.cost
  return (
    <div className="card p-4">
      <h3 className="font-display font-semibold text-sm text-ink-900 mb-3">Route Comparison</h3>
      <div className="space-y-3">
        <RouteBlock label="Baseline Route" distance={baseline.distance} time={baseline.time} cost={formatINR(baseline.cost)} />
        <RouteBlock label="Optimized Route" distance={optimized.distance} time={optimized.time} cost={formatINR(optimized.cost)} highlight />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-sand-100 p-2.5 text-xs"><span className="text-ink-500">Distance difference <b className="text-ink-900">{distanceSaved.toFixed(0)} km</b></span><span className="text-ink-500">Cost difference <b className="text-ink-900">{formatINR(costDifference)}</b></span></div>
      <p className="mt-2 text-[11px] text-ink-500">Prototype simulation — comparison figures are demo values.</p>
    </div>
  )
}
