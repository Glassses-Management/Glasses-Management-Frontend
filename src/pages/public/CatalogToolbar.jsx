import { ChevronDown, LayoutGrid, List, RefreshCw, SlidersHorizontal } from 'lucide-react'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name A–Z' },
]

function ViewToggle({ view, onChange }) {
  const btn = (target, Icon, label) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={view === target}
      onClick={() => onChange(target)}
      className={`inline-flex size-9 items-center justify-center rounded-lg transition-colors ${
        view === target
          ? 'bg-forest/10 text-forest'
          : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/5 dark:hover:text-neutral-300'
      }`}
    >
      <Icon size={17} />
    </button>
  )
  return (
    <div className="flex items-center rounded-lg border border-neutral-200 p-0.5 shadow-sm dark:border-neutral-700">
      {btn('grid', LayoutGrid, 'Grid view')}
      {btn('list', List, 'List view')}
    </div>
  )
}

export default function CatalogToolbar({
  shownStart,
  shownEnd,
  total,
  sort,
  onSortChange,
  view,
  onViewChange,
  onOpenFilters,
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Showing{' '}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {shownStart}–{shownEnd}
          </span>{' '}
          of <span className="font-semibold text-neutral-900 dark:text-neutral-100">{total}</span> frames
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-2.5 py-1 text-[11px] font-medium text-forest dark:bg-leaf/10 dark:text-leaf">
          <RefreshCw size={11} />
          Live · just synced
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-forest hover:text-forest dark:border-neutral-600 dark:bg-[#16271F] dark:text-neutral-300 dark:hover:border-leaf dark:hover:text-leaf lg:hidden"
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort products"
            className="appearance-none rounded-full border border-neutral-300 bg-white py-2 pl-4 pr-9 text-sm font-medium text-neutral-700 outline-none transition-colors focus:border-forest dark:border-neutral-600 dark:bg-[#16271F] dark:text-neutral-300 dark:focus:border-leaf"
          >
            {SORTS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>

        <ViewToggle view={view} onChange={onViewChange} />
      </div>
    </div>
  )
}