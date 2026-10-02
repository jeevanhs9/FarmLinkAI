export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg focus-ring transition-all duration-200 active:scale-[0.97] outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100'

  const sizes = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-sm px-6 py-3',
  }

  const variants = {
    primary: 'bg-gradient-to-b from-forest-600 to-forest-700 text-white hover:from-forest-700 hover:to-forest-800 shadow-sm border border-forest-800/20',
    secondary: 'bg-leaf-50 text-forest-700 hover:bg-leaf-100',
    outline: 'border border-ink-200 text-ink-900 bg-white hover:bg-sand-50 hover:border-ink-300 shadow-sm',
    ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
    danger: 'bg-clay-500 text-white hover:bg-clay-500/90 shadow-sm',
  }

  return (
    <Component
      className={`${base} ${sizes[size]} ${variants[variant]} ${className} ${loading ? 'opacity-80 pointer-events-none' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </Component>
  )
}
