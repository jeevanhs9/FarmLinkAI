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
      <button
        type="button"
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-[16px] shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-up`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 sticky top-0 bg-white/90 backdrop-blur z-10">
          <h2 id={titleId} className="font-display font-bold text-[17px] text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors focus-ring rounded-full p-1.5"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
