import { useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: () => void
}

const config: Record<
  string,
  { bg: string; icon: React.ElementType }
> = {
  success: {
    bg: 'bg-tertiary-container/20 text-tertiary border-tertiary/30',
    icon: CheckCircle,
  },
  error: {
    bg: 'bg-error/10 text-error border-error/30',
    icon: AlertCircle,
  },
  info: {
    bg: 'bg-secondary-container/20 text-secondary border-secondary/30',
    icon: Info,
  },
  warning: {
    bg: 'bg-amber-100 text-amber-700 border-amber-300',
    icon: AlertTriangle,
  },
}

export function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const { bg, icon: Icon } = config[type]

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[100]
        flex items-center gap-3
        px-5 py-4 rounded-xl border
        shadow-elevated animate-slide-up
        ${bg}
      `}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 rounded-lg p-1 hover:bg-black/5 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
