import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Modal({ open, onClose, title, children, maxWidth = 'max-w-md', footer }) {
  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[999] overflow-y-auto bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className={cn(
            'my-auto w-full rounded-2xl bg-white p-6 shadow-xl transition-colors duration-300 dark:bg-[#1c1c28] dark:ring-1 dark:ring-neutral-800',
            maxWidth,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-50">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-gray-400 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-600 dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-200"
            >
              <X size={18} />
            </button>
          </div>

          <div>{children}</div>

          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal