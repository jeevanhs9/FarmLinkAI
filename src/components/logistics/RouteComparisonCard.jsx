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
  const toMinutes = (time) => {
    const hours = Number(time.match(/(\d+)h/)?.[1] || 0)
    const minutes = Number(time.match(/(\d+)m/)?.[1] || 0)
    return hours * 60 + minutes
  }
  const minutesSaved = toMinutes(baseline.time) - toMinutes(optimized.time)
  const timeSaved = minutesSaved >= 60 ? `${Math.floor(minutesSaved / 60)}h ${minutesSaved % 60}m` : `${minutesSaved}m`
  const distancePercent = Math.round((distanceSaved / Number.parseFloat(baseline.distance)) * 100)
  const costPercent = Math.round((costDifference / baseline.cost) * 100)
  return (
    <div className="card p-4">
      <h3 className="font-display font-semibold text-sm text-ink-900 mb-3">Route Comparison</h3>
      <div className="space-y-3">
        <RouteBlock label="Baseline Route" distance={baseline.distance} time={baseline.time} cost={formatINR(baseline.cost)} />
        <RouteBlock label="Optimized Route" distance={optimized.distance} time={optimized.time} cost={formatINR(optimized.cost)} highlight />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-sand-100 p-2.5 text-xs"><div><span className="block text-ink-500">Distance saved</span><b className="mt-0.5 block text-ink-900">{distanceSaved.toFixed(0)} km · {distancePercent}%</b></div><div><span className="block text-ink-500">Time saved</span><b className="mt-0.5 block text-ink-900">{timeSaved}</b></div><div><span className="block text-ink-500">Cost saved</span><b className="mt-0.5 block text-ink-900">{formatINR(costDifference)} · {costPercent}%</b></div></div>
      <p className="mt-2 text-[11px] text-ink-500">Prototype simulation — comparison figures are demo values.</p>
    </div>
  )
}
