export default function Badge({ children, tone = 'neutral', className = '', rounded = 'rounded-md' }) {
  const tones = {
    high: 'bg-clay-100 text-clay-500',
    medium: 'bg-amber-100 text-amber-500',
    low: 'bg-leaf-100 border border-leaf-400/20 text-forest-700',
    success: 'bg-leaf-100 border border-leaf-400/20 text-forest-700',
    neutral: 'bg-ink-100 text-ink-700',
    info: 'bg-sand-100 text-ink-700 border border-ink-200',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 ${rounded} text-[11px] font-bold uppercase tracking-wide leading-tight ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
