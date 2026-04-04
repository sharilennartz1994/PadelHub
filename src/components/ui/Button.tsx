import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<string, string> = {
  primary:
    'kinetic-gradient text-on-primary shadow-teal-ambient hover:shadow-elevated',
  secondary:
    'bg-surface-container-lowest border border-outline/20 text-primary hover:bg-surface-container-low',
  danger:
    'bg-error/10 text-error border border-error/20 hover:bg-error/20',
  outline:
    'border border-outline/30 text-on-surface hover:bg-surface-container-low',
  ghost:
    'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base font-semibold',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-label font-medium rounded-xl
        transition-all duration-200
        hover:scale-[1.02] active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
