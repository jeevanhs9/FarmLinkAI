import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search fresh produce...' }) {
  return (
    <div className="relative w-full max-w-md">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus-ring focus:border-forest-500 placeholder:text-ink-500"
      />
    </div>
  )
}
