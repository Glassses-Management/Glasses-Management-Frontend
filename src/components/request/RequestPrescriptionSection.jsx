import { Check, FileText, Info } from 'lucide-react'
import { formatDate } from '@/utils/FormatDate'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Formats a prescription summary line: OD x.xx / OS x.xx.
function rxSummary(p) {
  const od = p?.od_sphere ?? '—'
  const os = p?.os_sphere ?? '—'
  return `OD ${od} / OS ${os}`
}

// Optional prescription reference. Never required for an eye exam — a customer
// can request an exam first and get a prescription afterwards. For product
// requests it can be attached so staff cut the lenses correctly.
export default function RequestPrescriptionSection({
  type,
  prescriptions,
  loading,
  enabled,
  selectedId,
  onToggle,
  onSelect,
  error,
}) {
  if (type === 'exam' && prescriptions.length === 0) {
    return null
  }

  const title = type === 'exam' ? 'Attach a prescription' : 'Use existing prescription'

  // No prescription on file for a product request: explain instead of offering a toggle.
  if (type === 'product' && prescriptions.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
        <Info size={16} className="mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          No prescription is linked to your account yet. You may need an eye examination first — our
          optical staff can guide you when they review your request.
        </p>
      </div>
    )
  }

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          className="mt-0.5 size-4 shrink-0 rounded border-neutral-300 accent-[#6f8a6f]"
        />
        <span>
          <span className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">{title}</span>
          <span className="block text-xs text-neutral-400 dark:text-neutral-500">
            {type === 'exam'
              ? 'Optional — only if you already have a prescription.'
              : 'We will use this prescription to prepare your lenses.'}
          </span>
        </span>
      </label>

      {enabled && (
        <div className="mt-3">
          {loading ? (
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
              ))}
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <Info size={16} className="mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                No prescription is linked to your account yet. You may need an eye examination first — our
                optical staff can guide you when they review your request.
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {prescriptions.map((p) => {
                const selected = Number(selectedId) === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelect(selected ? undefined : p.id)}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl border bg-white p-4 text-left transition-colors duration-200 dark:bg-neutral-900',
                      selected
                        ? 'border-[#8fa88f] bg-[#8fa88f]/5 ring-1 ring-[#8fa88f]'
                        : 'border-neutral-200 hover:border-[#8fa88f]/60 dark:border-neutral-700 dark:hover:border-neutral-500',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                        <FileText size={14} className="shrink-0 text-[#6f8a6f]" />
                        Prescription #{p.id}
                      </span>
                      <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">
                        {p.prescription_date ? formatDate(p.prescription_date) : rxSummary(p)}
                      </span>
                      <span className="mt-0.5 block text-xs text-neutral-400 dark:text-neutral-500">
                        {rxSummary(p)}
                      </span>
                    </span>
                    {selected && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#6f8a6f] text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {error?.prescription && (
        <p className="mt-2 text-xs text-red-500" role="alert">{error.prescription}</p>
      )}
    </div>
  )
}