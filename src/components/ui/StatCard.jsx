import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon, tone = 'neutral', sub, trend = null }) {
  const tones = {
    neutral: 'bg-leaf-50 text-forest-700 border-b-[3px] border-leaf-400',
    clay: 'bg-clay-100 text-clay-500 border-b-[3px] border-clay-500',
    amber: 'bg-amber-100 text-amber-500 border-b-[3px] border-amber-500',
  }

  return (
    <div className={`card overflow-hidden relative p-5 flex flex-col justify-between ${tones[tone].replace(/bg-[^\s]+|text-[^\s]+/g, '')}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-500">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-display text-3xl font-bold text-ink-900 leading-none">{value}</p>
            {trend !== null && (
              <span className={`flex items-center text-xs font-semibold ${trend > 0 ? 'text-forest-600' : 'text-clay-500'}`}>
                {trend > 0 ? <TrendingUp size={14} className="mr-0.5" /> : <TrendingDown size={14} className="mr-0.5" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${tones[tone].split('border')[0]}`}>
            <Icon size={22} strokeWidth={2} />
          </div>
        )}
      </div>

      {sub && <p className="mt-4 text-xs text-ink-500 font-medium">{sub}</p>}
    </div>
  )
}
