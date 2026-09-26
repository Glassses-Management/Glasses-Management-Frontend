import { Check, Eye, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

// Only an eye exam / prescription change can be submitted here.
//
// A product request used to be an option, but POST /api/requests always creates
// the order at status PENDING_REVIEW, and that status is absent from both the
// valid-status list and the transition table of POST /api/orders/{id}/status
// (API_DOCUMENT.md section 10.1). A product submitted this way could never be
// confirmed or completed. Non-prescription products go through the cart
// instead, which starts at PENDING and works.
const EXAM = {
  value: 'exam',
  icon: Eye,
  title: 'Eye Exam or Prescription Change',
  description: 'Request an eye examination, or glasses made to a new prescription.',
  meta: 'No prescription needed to get started.',
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function RequestTypePicker({ value, onChange }) {
  const selected = value === EXAM.value
  const Icon = EXAM.icon

  return (
    <div className="space-y-4">
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={() => onChange(EXAM.value)}
        className={cn(
          'relative flex w-full flex-col rounded-2xl border p-5 text-left transition-all duration-200',
          selected
            ? 'border-[#8fa88f] bg-[#8fa88f]/5 shadow-sm ring-2 ring-[#8fa88f]/30'
            : 'border-neutral-200 bg-white shadow-sm hover:border-[#8fa88f]/60 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/60 dark:hover:bg-neutral-800',
        )}
      >
        {selected && (
          <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-[#6f8a6f] text-white">
            <Check size={14} strokeWidth={3} />
          </span>
        )}

        <span
          className={cn(
            'flex size-11 items-center justify-center rounded-xl transition-colors duration-200',
            selected ? 'bg-[#6f8a6f] text-white' : 'bg-[#8fa88f]/15 text-[#6f8a6f]',
          )}
        >
          <Icon size={22} strokeWidth={1.8} />
        </span>

        <h3 className="mt-4 font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
          {EXAM.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {EXAM.description}
        </p>
        <p
          className={cn(
            'mt-3 text-xs font-medium',
            selected ? 'text-[#6f8a6f]' : 'text-neutral-400 dark:text-neutral-500',
          )}
        >
          {EXAM.meta}
        </p>
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
        <div className="flex items-start gap-3">
          <ShoppingBag size={18} className="mt-0.5 shrink-0 text-neutral-400" />
          <div>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Buying sunglasses or another non-prescription product?
            </p>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Order it from the catalog instead — no clinic review needed, and you can
              pick a collection date as soon as we confirm it.
            </p>
          </div>
        </div>
        <Link
          to="/products"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-forest px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white dark:border-leaf dark:text-leaf dark:hover:bg-leaf dark:hover:text-forest"
        >
          Browse catalog
        </Link>
      </div>
    </div>
  )
}
