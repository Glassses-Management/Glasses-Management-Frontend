const RANGE_CLASS = [
  'absolute left-0 top-1/2 h-2 w-full -translate-y-1/2',
  'pointer-events-auto appearance-none bg-transparent',
  '[&::-webkit-slider-thumb]:size-4',
  '[&::-webkit-slider-thumb]:appearance-none',
  '[&::-webkit-slider-thumb]:rounded-full',
  '[&::-webkit-slider-thumb]:border-2',
  '[&::-webkit-slider-thumb]:border-white',
  '[&::-webkit-slider-thumb]:bg-[#8fa88f]',
  '[&::-webkit-slider-thumb]:shadow-md',
  '[&::-webkit-slider-thumb]:transition-transform',
  '[&::-webkit-slider-thumb]:hover:scale-110',
  'dark:[&::-webkit-slider-thumb]:border-neutral-900',
  '[&::-moz-range-thumb]:size-4',
  '[&::-moz-range-thumb]:rounded-full',
  '[&::-moz-range-thumb]:border-2',
  '[&::-moz-range-thumb]:border-white',
  '[&::-moz-range-thumb]:bg-[#8fa88f]',
  'dark:[&::-moz-range-thumb]:border-neutral-900',
  'focus:outline-none',
].join(' ')

const numInputClass =
  'w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-[#8fa88f]'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export default function CatalogPriceRange({ bounds, value, onChange }) {
  const range = Math.max(bounds.max - bounds.min, 1)
  const minPct = ((value.min - bounds.min) / range) * 100
  const maxPct = ((value.max - bounds.min) / range) * 100

  const setMix = (min) => onChange({ min, max: Math.max(value.max, min) })
  const setMax = (max) => onChange({ min: Math.min(value.min, max), max })

  const updateMinInput = (e) => setMix(clamp(Number(e.target.value) || bounds.min, bounds.min, value.max))
  const updateMaxInput = (e) => setMax(clamp(Number(e.target.value) || bounds.max, value.min, bounds.max))

  return (
    <div>
      <div className="relative h-4">
        {/* base track */}
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        {/* filled range */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#8fa88f]"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step="1"
          value={value.min}
          onChange={(e) => setMix(Number(e.target.value))}
          aria-label="Minimum price"
          className={RANGE_CLASS}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step="1"
          value={value.max}
          onChange={(e) => setMax(Number(e.target.value))}
          aria-label="Maximum price"
          className={RANGE_CLASS}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">Min</span>
          <input type="number" value={value.min} onChange={updateMinInput} className={numInputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">Max</span>
          <input type="number" value={value.max} onChange={updateMaxInput} className={numInputClass} />
        </label>
      </div>
    </div>
  )
}