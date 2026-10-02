import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import { useEffect } from 'react'

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(onDismiss, 3200)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null
  const isError = toast.tone === 'error'
  const StatusIcon = isError ? CircleAlert : CheckCircle2
  return (
    <div className="fixed right-4 bottom-4 z-[60] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-leaf-100 bg-white px-4 py-3 shadow-lg animate-[slide-in_180ms_ease-out]" role={isError ? 'alert' : 'status'}>
      <StatusIcon size={18} className={`${isError ? 'text-clay-500' : 'text-forest-600'} shrink-0`} />
      <p className="text-sm font-medium text-ink-900">{toast.message}</p>
      <button onClick={onDismiss} className="text-ink-500 hover:text-ink-900 focus-ring rounded" aria-label="Dismiss notification"><X size={16} /></button>
    </div>
  )
}
