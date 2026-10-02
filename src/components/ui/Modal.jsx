import { X } from 'lucide-react'
import { useEffect, useId } from 'react'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const titleId = useId()
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close dialog" />
      <div className={`relative w-full ${maxWidth} bg-white rounded-xl border border-ink-100 shadow-xl max-h-[90vh] overflow-y-auto`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 sticky top-0 bg-white">
          <h2 id={titleId} className="font-display font-semibold text-base text-ink-900">{title}</h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-900 focus-ring rounded p-1" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
