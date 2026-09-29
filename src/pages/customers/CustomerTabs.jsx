import { card } from '@/pages/customers/customerDetailStyles'

// Segmented control above the main column. Each tab filters the same four
// collections, so the count travels with the label and staff can see where the
// history is before switching.
//
// Counts come from the loaded arrays, so they read 0 while loading rather than
// flashing a wrong number.

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CustomerTabs({ tabs, active, counts, onChange }) {
  return (
    <div className={`${card} overflow-x-auto p-1.5`}>
      <div className="flex min-w-max gap-1" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.key === active
          const count = counts?.[tab.key]

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-300',
                isActive
                  ? 'bg-violet-600 text-white shadow-sm dark:bg-violet-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-100',
              )}
            >
              {tab.label}
              {count != null && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-neutral-400',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
