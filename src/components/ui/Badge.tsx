interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  size?: 'sm' | 'md'
  className?: string
}

const variantClasses: Record<string, string> = {
  success: 'bg-tertiary-container/20 text-tertiary',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-error/10 text-error',
  info: 'bg-secondary-container/20 text-secondary',
  default: 'bg-surface-container text-on-surface-variant',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
