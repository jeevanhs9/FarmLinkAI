export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-semibold text-sm text-ink-900">{title}</h3>
          {subtitle && <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
