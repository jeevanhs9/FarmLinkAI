import { Sparkles } from 'lucide-react'
import Badge, { demandTone } from '../ui/Badge'

export default function AIRecommendationCard({ crop, image, demand, changePct, priceRange, quantity, compact }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={15} className="text-forest-600" />
        <h3 className="font-display font-semibold text-sm text-ink-900">AI Recommendation</h3>
      </div>
      <div className="flex gap-3">
        <img src={image} alt={crop} className="h-16 w-16 rounded-lg object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display font-semibold text-ink-900">{crop}</p>
            <Badge tone={demandTone(demand)}>{demand} Demand</Badge>
          </div>
          <p className="text-xs text-ink-500 mt-1">
            Demand expected to increase by {changePct}% next week in your area.
          </p>
          {!compact && (
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-ink-700">
                <span className="text-ink-500">Suggested Price: </span>
                <span className="font-semibold text-forest-700">₹{priceRange[0]} – ₹{priceRange[1]}/kg</span>
              </p>
              <p className="text-xs text-ink-700">
                <span className="text-ink-500">Recommended quantity: </span>
                <span className="font-semibold">{quantity} kg</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
