import { useContext } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { ToastContext } from '@/context/ToastContextStore'

const styleMap = {
  success: {
    icon: <CheckCircle2 size={18} />,
    box: 'border-green-200 bg-green-50 text-green-800 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300',
  },
  error: {
    icon: <XCircle size={18} />,
    box: 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    box: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300',
  },
  info: {
    icon: <Info size={18} />,
    box: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300',
  },
}

function ToastContainer() {
  const { toast, dismiss } = useContext(ToastContext)

  if (!toast?.length) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 p-4">
      {toast.map((t) => {
        const style = styleMap[t.type] || styleMap.info
        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${style.box}`}
          >
            <span className="mt-0.5 shrink-0">{style.icon}</span>
            <span className="flex-1 break-words">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer
