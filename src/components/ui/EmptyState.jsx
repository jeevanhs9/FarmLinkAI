export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-leaf-50 text-forest-700 flex items-center justify-center mb-4">
          <Icon size={22} />
        </div>
      )}
      <h3 className="font-display font-semibold text-ink-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-ink-500 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
