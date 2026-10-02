export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="h-14 w-14 rounded-2xl bg-leaf-50 text-forest-700 flex items-center justify-center mb-5 ring-4 ring-leaf-50/50">
          <Icon size={24} strokeWidth={2} />
        </div>
      )}
      <h3 className="font-display font-semibold text-lg text-ink-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-ink-500 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
