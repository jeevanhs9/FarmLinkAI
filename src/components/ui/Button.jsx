export default function Button({
  as: As = 'button', variant = 'primary', size = 'md', className = '', children, ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-sm px-5 py-3',
  }
  const variants = {
    primary: 'bg-forest-700 text-white hover:bg-forest-800',
    secondary: 'bg-leaf-50 text-forest-700 hover:bg-leaf-100',
    outline: 'border border-ink-200 text-ink-900 hover:bg-ink-100',
    ghost: 'text-ink-700 hover:bg-ink-100',
    danger: 'bg-clay-500 text-white hover:bg-clay-500/90',
  }
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </As>
  )
}
