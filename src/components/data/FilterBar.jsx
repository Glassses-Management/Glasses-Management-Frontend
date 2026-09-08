// Row of filter dropdowns + register button above the search/table area.
// Each filter is its own small dropdown; selections only reach the parent via onFilterChange.

import { useEffect, useRef, useState } from 'react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ChevronDown() {
    return (
        <svg className="size-4 text-gray-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}

function FilterBar({ filters, onFilterChange, onClearAll, onAddNew }) {
  const [openKey, setOpenKey] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenKey(null)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const hasActiveFilters = filters.some(
    (f) => f.value !== 'all' && f.value !== '' && f.value !== undefined && f.value !== null,
  )

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => {
        const isOpen = openKey === filter.key
        const selected = filter.options.find((o) => o.value === filter.value)
        return (
          <div key={filter.key} className="relative">
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : filter.key)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300 dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-300 dark:hover:bg-white/5"
            >
              <span>{selected ? selected.label : filter.label}</span>
              <ChevronDown />
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg transition-colors duration-300 dark:border-neutral-700 dark:bg-[#1c1c28]">
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange(filter.key, 'all')
                    setOpenKey(null)
                  }}
                    className={cn(
                        'block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 transition-colors duration-300 dark:text-neutral-300 dark:hover:bg-white/5',
                        (filter.value === 'all' || filter.value === '' || filter.value == null) ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' : 'text-gray-700',
                    )}
                >
                  All
                </button>
                {filter.options
                  .filter((o) => o.value !== 'all')
                  .map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onFilterChange(filter.key, option.value)
                        setOpenKey(null)
                      }}
                      className={cn(
                        'block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 transition-colors duration-300 dark:text-neutral-300 dark:hover:bg-white/5',
                        filter.value === option.value ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' : 'text-gray-700',
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )
      })}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Clear all
        </button>
      )}

      {onAddNew && (
        <button
          type="button"
          onClick={onAddNew}
          className="ml-auto rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          + Register New Client
        </button>
      )}
    </div>
  )
}

export default FilterBar