import { Info, Search, X } from 'lucide-react'
import CatalogFilterGroups from '@/pages/public/CatalogFilterGroups'

const inputClass =
  'w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#8fa88f]'

export default function CatalogSidebar({ search, onSearchChange, hasActive, onClearAll, chips, groupProps, className = '' }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 ${className}`}>
      {/* Quick search */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Quick Search</p>
        {(hasActive || search) && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-[#6f8a6f] underline underline-offset-4 transition-colors hover:text-[#8fa88f]"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="relative mt-2">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search frames, brands…"
          className={inputClass}
        />
      </div>

      {/* Active facets */}
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map(({ label, onRemove }) => (
            <button
              key={label}
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#8fa88f]/15 px-3 py-1 text-xs font-medium text-[#6f8a6f] transition-colors hover:bg-[#8fa88f]/25"
            >
              {label}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      {/* Filter groups */}
      <div className="mt-5">
        <CatalogFilterGroups {...groupProps} />
      </div>

      {/* Callout */}
      <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#8fa88f]/10 p-4">
        <Info size={17} className="mt-0.5 shrink-0 text-[#6f8a6f]" />
        <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
          Every frame passes a 12-point dimension &amp; lens-fit check before glazing. Bring your latest prescription
          for a same-day alignment.
        </p>
      </div>
    </div>
  )
}