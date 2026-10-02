import { useEffect, useState } from 'react'
import { CheckCircle2, Info } from 'lucide-react'
import ChartCard from '../../components/charts/ChartCard'
import DemandForecastChart from '../../components/charts/DemandForecastChart'
import Badge from '../../components/ui/Badge'
import { insightCrops, insightLocations, insightWindows } from '../../data/insights'
import { aiService } from '../../services/api'
import { formatINR } from '../../utils/format'
import PriceTrendChart from '../../components/charts/PriceTrendChart'
import { priceTrend } from '../../data/insights'
import { demandTone } from '../../utils/demand'

const SELECT_CLASS = 'px-3 py-2 rounded-lg border border-ink-200 text-sm bg-white focus-ring focus:border-forest-500'

export default function AIInsights() {
  const [crop, setCrop] = useState(insightCrops[0])
  const [location, setLocation] = useState(insightLocations[0])
  const [windowLabel, setWindowLabel] = useState(insightWindows[1])
  const [forecast, setForecast] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    aiService.forecast(crop, location, windowLabel).then((data) => {
      if (active) setForecast(data)
    }).catch(() => {
      if (active) setError('Forecast data could not be loaded. Please try changing the filters again.')
    })
    return () => { active = false }
  }, [crop, location, windowLabel])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">AI Demand Forecast</h2>
        <p className="text-sm text-ink-500 mt-1">See what the market needs. Plan your harvest. Get better prices.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="insight-crop">Crop</label>
        <select id="insight-crop" className={SELECT_CLASS} value={crop} onChange={(e) => { setForecast(null); setError(''); setCrop(e.target.value) }}>
          {insightCrops.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="sr-only" htmlFor="insight-location">Market location</label>
        <select id="insight-location" className={SELECT_CLASS} value={location} onChange={(e) => { setForecast(null); setError(''); setLocation(e.target.value) }}>
          {insightLocations.map((l) => <option key={l}>{l}</option>)}
        </select>
        <label className="sr-only" htmlFor="insight-window">Forecast period</label>
        <select id="insight-window" className={SELECT_CLASS} value={windowLabel} onChange={(e) => { setForecast(null); setError(''); setWindowLabel(e.target.value) }}>
          {insightWindows.map((w) => <option key={w}>{w}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Historical demand vs predicted demand" subtitle="Prototype forecast using demo historical data" className="lg:col-span-2">
          {!forecast ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-ink-500" role="status">{error || 'Loading forecast…'}</div>
          ) : (
            <DemandForecastChart data={forecast.series} />
          )}
        </ChartCard>

        <div className="card p-4">
          <h3 className="font-display font-semibold text-sm text-ink-900 mb-3">AI Recommendation</h3>
          {forecast ? (
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-forest-600 shrink-0" />
                <span className="text-ink-700">Demand: </span>
                <Badge tone={demandTone(forecast.demand)}>{forecast.demand}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-forest-600 shrink-0" />
                <span className="text-ink-700">Suggested Price: <b className="text-ink-900">{formatINR(forecast.priceRange[0])} – {formatINR(forecast.priceRange[1])}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-forest-600 shrink-0" />
                <span className="text-ink-700">Recommended Quantity: <b className="text-ink-900">{forecast.recommendedQuantity} kg</b></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-forest-600 shrink-0" />
                <span className="text-ink-700">Best Market: <b className="text-ink-900">{forecast.bestMarket}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-forest-600 shrink-0" />
                <span className="text-ink-700">Best Selling Window: <b className="text-ink-900">{forecast.bestWindow}</b></span>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-leaf-50 text-forest-800 text-xs leading-relaxed">
                {crop} demand is expected to increase by {forecast.changePct}% in {location} over the {windowLabel.toLowerCase()}.
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-500">{error || 'Loading recommendation…'}</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Price intelligence" subtitle="Demo market range ₹27–₹31/kg · suggested range ₹29–₹32/kg">
          <PriceTrendChart data={priceTrend} />
          <p className="mt-2 text-[11px] text-ink-500">Price values are prototype data for demonstrating the recommendation workflow.</p>
        </ChartCard>
        <div className="card p-4">
          <h3 className="font-display font-semibold text-sm text-ink-900">Why this prediction?</h3>
          <p className="text-xs text-ink-500 mt-1">Illustrative model factors — not calculated feature importance.</p>
          <div className="mt-4 space-y-3">
            {[['Historical demand', 82], ['Market price trend', 64], ['Seasonality', 56], ['Local demand', 76], ['Available supply', 42], ['Weather signal (demo)', 48]].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[135px_1fr] gap-3 items-center text-xs"><span className="text-ink-700">{label}</span><div className="h-2 rounded-full bg-ink-100 overflow-hidden"><div className="h-full rounded-full bg-forest-600" style={{ width: `${value}%` }} /></div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-display font-semibold text-sm text-ink-900">How it works</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-700">
          {['Market data', 'Crop data', 'Weather / seasonality', 'Historical orders', 'Data processing', 'ML model', 'Demand forecast', 'Price recommendation'].map((item, index) => <span key={item} className="flex items-center gap-2"><span className="rounded-md bg-leaf-50 px-2.5 py-1.5 text-forest-700 font-medium">{item}</span>{index < 7 && <span className="text-ink-300">→</span>}</span>)}
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-ink-500 bg-sand-100 rounded-lg p-3">
        <Info size={14} className="shrink-0 mt-0.5" />
        These are demonstration / mock values for the SIH 2026 prototype, not real-world market predictions.
        They are structured so the ML API can supply live values later without changing this page.
      </div>
    </div>
  )
}
