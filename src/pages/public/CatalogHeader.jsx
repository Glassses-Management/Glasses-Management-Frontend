const STATS = [
  { value: null, label: 'Frames', countKey: true },
  { value: '100%', label: 'Titanium & Acetate' },
  { value: '≤48h', label: 'Glaze Lead' },
]

function Pill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
      <span className="size-2 rounded-full bg-forest dark:bg-leaf" />
      Clinical Dispensary &amp; Boutique
    </span>
  )
}

export default function CatalogHeader({ totalCount, shownCount }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Pill />
          <h1 className="mt-4 font-sans font-semibold text-4xl text-neutral-900 md:text-5xl dark:text-neutral-50">
            Precision Eyewear Catalog
          </h1>
          <p className="mt-3 max-w-xl text-neutral-600 dark:text-neutral-400">
            Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100">{shownCount}</span> of{' '}
            {totalCount} verified optical frames — machine-polished, glazing-ready and fitted to prescription by our
            clinical team.
          </p>
        </div>

        <div className="grid grid-cols-3 divide-x divide-neutral-200 rounded-2xl border border-neutral-200 bg-white px-2 py-4 text-center shadow-sm dark:divide-neutral-700 dark:border-neutral-700 dark:bg-[#16271F]">
          {STATS.map(({ value, label, countKey }) => (
            <div key={label} className="px-3 sm:px-5">
              <p className="font-sans text-lg font-bold text-neutral-900 sm:text-2xl dark:text-neutral-50">
                {countKey ? totalCount : value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-neutral-500 sm:text-xs dark:text-neutral-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}