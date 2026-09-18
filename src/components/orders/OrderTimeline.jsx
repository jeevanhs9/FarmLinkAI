import { Check } from 'lucide-react'
import { ORDER_STAGES } from '../../data/orders'

export default function OrderTimeline({ currentStage }) {
  const currentIdx = ORDER_STAGES.indexOf(currentStage)

  return (
    <div className="flex items-center w-full overflow-x-auto py-2">
      {ORDER_STAGES.map((stage, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        return (
          <div key={stage} className="flex items-center min-w-fit last:min-w-0">
            <div className="flex flex-col items-center gap-1.5 w-24 text-center">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold border-2
                  ${done ? 'bg-forest-700 border-forest-700 text-white' : active ? 'border-forest-700 text-forest-700 bg-leaf-50' : 'border-ink-200 text-ink-300 bg-white'}`}
              >
                {done ? <Check size={13} /> : i + 1}
              </div>
              <span className={`text-[11px] leading-tight ${active ? 'text-forest-700 font-semibold' : done ? 'text-ink-700' : 'text-ink-300'}`}>
                {stage}
              </span>
            </div>
            {i < ORDER_STAGES.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-12 -mt-5 shrink-0 ${i < currentIdx ? 'bg-forest-700' : 'bg-ink-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
