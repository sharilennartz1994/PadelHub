import { useToastStore } from '../../stores/toastStore'
import { Toast } from '../ui/Toast'

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <>
      {toasts.map((toast, i) => (
        <div key={toast.id} style={{ bottom: `${24 + i * 72}px` }} className="fixed right-6 z-[100]">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => dismiss(toast.id)}
          />
        </div>
      ))}
    </>
  )
}
