import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-surface-container-high border-none
              text-on-surface placeholder-on-surface-variant/50
              focus:outline-none focus:ring-2 focus:ring-primary/20
              transition-all
              ${icon ? 'pl-12' : ''}
              ${error ? 'ring-2 ring-error/30' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-error">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-on-surface-variant">{helperText}</span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
