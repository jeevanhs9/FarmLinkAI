export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors focus-ring
            ${active === cat
              ? 'bg-forest-700 border-forest-700 text-white'
              : 'bg-white border-ink-200 text-ink-700 hover:border-forest-500 hover:text-forest-700'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
