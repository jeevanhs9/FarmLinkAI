const TONES = {
  high: 'bg-clay-100 text-clay-500',
  medium: 'bg-amber-100 text-amber-500',
  low: 'bg-leaf-100 text-forest-700',
  neutral: 'bg-ink-100 text-ink-700',
  success: 'bg-leaf-100 text-forest-700',
  info: 'bg-sand-100 text-ink-700',
}

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function demandTone(level) {
  if (level === 'High') return 'high'
  if (level === 'Medium') return 'medium'
  return 'low'
}
