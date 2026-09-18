export default function StatCard({ label, value, icon: Icon, tone = 'neutral', sub }) {
  const tones = {
    neutral: 'bg-leaf-50 text-forest-700',
    clay: 'bg-clay-100 text-clay-500',
    amber: 'bg-amber-100 text-amber-500',
  }
  return (
    <div className="card p-4 flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-ink-500">{label}</p>
        <p className="mt-1.5 font-display text-2xl font-bold text-ink-900">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-ink-500">{sub}</p>}
      </div>
      {Icon && (
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      )}
    </div>
  )
}
