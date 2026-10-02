import { useEffect, useState } from 'react'
import { CheckCircle2, Info, TrendingUp, Target, MapPin, Clock } from 'lucide-react'
import ChartCard from '../../components/charts/ChartCard'
import DemandForecastChart from '../../components/charts/DemandForecastChart'
import Badge from '../../components/ui/Badge'
import { insightCrops, insightLocations, insightWindows } from '../../data/insights'
import { aiService } from '../../services/api'
import { formatINR } from '../../utils/format'
import PriceTrendChart from '../../components/charts/PriceTrendChart'
import { priceTrend } from '../../data/insights'
import { demandTone } from '../../utils/demand'

const SELECT_CLASS = 'pl-4 pr-8 py-2.5 rounded-xl border border-ink-200 bg-white text-sm font-semibold focus-ring focus:border-forest-500 appearance-none cursor-pointer transition-colors hover:bg-sand-50'

const FACTORS = [
  ['Historical demand', 82], ['Market price trend', 64], ['Seasonality', 56],
  ['Local demand', 76], ['Available supply', 42], ['Weather signal (demo)', 48],
]

const PIPELINE = ['Market data', 'Crop data', 'Weather / seasonality', 'Historical orders', 'Data processing', 'ML model', 'Demand forecast', 'Price recommendation']

export default function AIInsights() {
  const [crop, setCrop] = useState(insightCrops[0])
  const [location, setLocation] = useState(insightLocations[0])
  const [windowLabel, setWindowLabel] = useState(insightWindows[1])
  const [forecast, setForecast] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setForecast(null)
    aiService.forecast(crop, location, windowLabel).then((data) => {
      if (active) setForecast(data)
    }).catch(() => {
      if (active) setError('Forecast data could not be loaded. Try adjusting filters.')
    })
    return () => { active = false }
  }, [crop, location, windowLabel])

  const resetFilter = (setter, val) => { setForecast(null); setError(''); setter(val) }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">AI Demand Forecast</h2>
          <p className="text-sm font-medium text-ink-500 mt-1">See what the market needs. Plan your harvest. Get better prices.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'insight-crop', label: 'Crop', value: crop, setter: setCrop, options: insightCrops },
            { id: 'insight-location', label: 'Market location', value: location, setter: setLocation, options: insightLocations },
            { id: 'insight-window', label: 'Forecast period', value: windowLabel, setter: setWindowLabel, options: insightWindows },
          ].map(({ id, label, value, setter, options }) => (
            <div key={id} className="relative">
              <label className="sr-only" htmlFor={id}>{label}</label>
              <select id={id} className={SELECT_CLASS} value={value} onChange={(e) => resetFilter(setter, e.target.value)}>
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 lg:gap-6">
        <ChartCard title="Demand Forecast" subtitle="Prototype forecast using demo historical data">
          {!forecast ? (
            <div className="h-[280px] flex flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-forest-200 border-t-forest-600 animate-spin" />
              <p className="text-sm font-medium text-ink-500">{error || 'Loading forecast…'}</p>
            </div>
          ) : (
            <DemandForecastChart data={forecast.series} />
          )}
        </ChartCard>

        <div className="card p-6 bg-white flex flex-col">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-8 w-8 rounded-lg bg-forest-50 text-forest-700 border border-leaf-100 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <h3 className="font-display font-bold text-base text-ink-900 tracking-tight">AI Recommendation</h3>
          </div>

          {forecast ? (
            <div className="space-y-4 flex-1">
              {[
                { icon: TrendingUp, label: 'Market Demand', content: <Badge tone={demandTone(forecast.demand)} rounded="rounded-full">{forecast.demand}</Badge> },
                { icon: Target, label: 'Suggested Price Range', content: <span className="font-display font-bold text-ink-900 text-sm">{formatINR(forecast.priceRange[0])} – {formatINR(forecast.priceRange[1])}</span> },
                { icon: CheckCircle2, label: 'Target Quantity', content: <span className="font-display font-bold text-ink-900 text-sm">{forecast.recommendedQuantity} kg</span> },
                { icon: MapPin, label: 'Best Market', content: <span className="font-bold text-ink-900 text-sm">{forecast.bestMarket}</span> },
                { icon: Clock, label: 'Best Window', content: <span className="font-bold text-ink-900 text-sm">{forecast.bestWindow}</span> },
              ].map(({ icon: Icon, label, content }) => (
                <div key={label} className="flex items-start justify-between gap-3 py-2.5 border-b border-ink-100 last:border-none">
                  <div className="flex items-center gap-2 text-xs font-bold text-ink-500 uppercase tracking-wider">
                    <Icon size={14} className="text-forest-500" />{label}
                  </div>
                  {content}
                </div>
              ))}

              <div className="mt-2 p-4 rounded-xl bg-forest-950 text-white text-[13px] leading-relaxed">
                <span className="text-leaf-300 font-bold">{crop}</span> demand is expected to increase by{' '}
                <span className="font-bold text-white">{forecast.changePct}%</span> in{' '}
                <span className="text-leaf-300">{location}</span> over the{' '}
                {windowLabel.toLowerCase()}.
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm font-medium text-ink-500">{error || 'Loading recommendation…'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
        <ChartCard title="Price Intelligence" subtitle="Demo market range ₹27–₹31/kg · suggested ₹29–₹32/kg">
          <PriceTrendChart data={priceTrend} />
          <p className="mt-2 text-[11px] font-medium text-ink-500">Prototype data for demonstrating the recommendation workflow.</p>
        </ChartCard>

        <div className="card p-6 bg-white">
          <h3 className="font-display font-bold text-base text-ink-900 tracking-tight mb-1">Why this prediction?</h3>
          <p className="text-xs font-medium text-ink-500 mb-5">Illustrative model factors — not calculated feature importance.</p>
          <div className="space-y-4">
            {FACTORS.map(([label, value]) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-ink-700">{label}</span>
                  <span className="text-forest-700">{value}%</span>
                </div>
                <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-forest-600 to-leaf-400" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6 bg-white">
        <h3 className="font-display font-bold text-base text-ink-900 mb-4 tracking-tight">How it works</h3>
        <div className="flex flex-wrap items-center gap-2">
          {PIPELINE.map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              <span className="rounded-xl bg-leaf-50 border border-leaf-100 text-forest-700 px-3 py-1.5 text-xs font-bold">{item}</span>
              {index < PIPELINE.length - 1 && (
                <span className="text-ink-300 font-bold">→</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3 text-sm font-medium text-ink-500 bg-amber-50 border border-amber-200/60 rounded-xl p-4">
        <Info size={18} className="shrink-0 mt-0.5 text-amber-500" />
        <span>These are <strong className="text-amber-800">demonstration values</strong> for the SIH 2026 prototype, not real-world market predictions. They are structured so the ML API can supply live values later without changing this page.</span>
      </div>
    </div>
  )
}
