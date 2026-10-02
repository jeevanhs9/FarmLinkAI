import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Toast({ toast, onDismiss }) {
  const [isClosing, setIsClosing] = useState(false)
  const duration = 3200

  useEffect(() => {
    if (!toast) return
    setIsClosing(false)
    const timer = window.setTimeout(() => {
      setIsClosing(true)
      setTimeout(onDismiss, 200) // allow CSS exit animation to play
    }, duration)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null
  const isError = toast.tone === 'error'
  const StatusIcon = isError ? CircleAlert : CheckCircle2

  return (
    <div
      className={`fixed right-4 bottom-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${isError ? 'border-l-clay-500' : 'border-l-forest-600'} ${isClosing ? 'opacity-0 translate-y-2' : 'animate-[slide-in_250ms_cubic-bezier(0.16,1,0.3,1)]'} transition-all duration-200`}
      role={isError ? 'alert' : 'status'}
    >
      <StatusIcon size={20} className={`${isError ? 'text-clay-500' : 'text-forest-600'} shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-ink-900 leading-snug">{toast.message}</p>
        <div className="mt-3 h-1 w-full bg-sand-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${isError ? 'bg-clay-500' : 'bg-forest-600'} animate-[drain_3s_linear_forwards]`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
      <button
        onClick={() => { setIsClosing(true); setTimeout(onDismiss, 200) }}
        className="text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors focus-ring rounded p-1 -mt-1 -mr-1"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes drain { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  )
}
