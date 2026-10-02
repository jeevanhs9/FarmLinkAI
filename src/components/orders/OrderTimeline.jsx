import { Check } from 'lucide-react'
import { ORDER_STAGES } from '../../data/orders'

export default function OrderTimeline({ currentStage }) {
  const currentIdx = ORDER_STAGES.indexOf(currentStage)

  return (
    <div className="w-full overflow-x-auto py-3">
      <div className="flex items-start min-w-fit mx-auto">
        {ORDER_STAGES.map((stage, i) => {
          const done = i < currentIdx
          const active = i === currentIdx
          return (
            <div key={stage} className="flex items-center">
              <div className="flex flex-col items-center gap-2 w-24 text-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 transition-all
                    ${done ? 'bg-forest-700 border-forest-700 text-white shadow-sm shadow-forest-700/30'
                      : active ? 'border-forest-600 text-forest-700 bg-leaf-50 ring-4 ring-leaf-100'
                      : 'border-ink-200 text-ink-300 bg-white'}`}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : <span>{i + 1}</span>}
                </div>
                <span className={`text-[11px] font-bold leading-tight transition-colors
                  ${active ? 'text-forest-700' : done ? 'text-ink-600' : 'text-ink-300'}`}>
                  {stage}
                </span>
              </div>
              {i < ORDER_STAGES.length - 1 && (
                <div className={`h-0.5 w-6 sm:w-10 -mt-6 shrink-0 rounded-full transition-colors ${i < currentIdx ? 'bg-forest-600' : 'bg-ink-200'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
