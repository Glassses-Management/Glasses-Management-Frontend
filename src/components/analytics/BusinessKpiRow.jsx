import { TrendingDown, TrendingUp } from 'lucide-react'

import { formatCurrency } from '@/utils/FormatCurrency'

// The four KPI figures. Split out of the card so this file stays about layout
// while the card stays about the four display states.

const formatValue = (value, format) =>
  format === 'currency' ? formatCurrency(value) : Number(value || 0).toLocaleString()

// The layout is driven by this list rather than by the array the hook returns, so
// the four cells exist during loading and cannot appear out of order as the
// figures arrive. `kpi` is undefined while loading.
const KPI_LAYOUT = [
  { key: 'revenue', label: 'Total Revenue' },
  { key: 'orders', label: 'Total Orders' },
  { key: 'aov', label: 'Average Order Value' },
  { key: 'customers', label: 'New Customers' },
]

// A null change means the previous period was zero, where a percentage has no
// meaning. Nothing is rendered rather than a fabricated figure.
function Change({ value }) {
  if (value == null) return null

  const rounded = Math.round(value * 10) / 10
  const flat = rounded === 0
  const Icon = flat ? null : rounded > 0 ? TrendingUp : TrendingDown

  return (
    <p
      className={
        'mt-0.5 flex items-center gap-1 text-xs font-medium ' +
        (flat
          ? 'text-gray-400 dark:text-neutral-500'
          : rounded > 0
            ? 'text-forest dark:text-leaf'
            : 'text-red-600 dark:text-red-400')
      }
    >
      {Icon && <Icon size={12} />}
      {flat ? 'No change' : `${rounded > 0 ? '+' : ''}${rounded}%`}
      {!flat && <span className="font-normal text-gray-400 dark:text-neutral-500">vs previous</span>}
    </p>
  )
}

function KpiCell({ slot, kpi, pending }) {
  return (
    <div className="bg-white px-4 py-3 dark:bg-surface-dark">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500">{slot.label}</p>
      {pending ? (
        <div className="mt-1.5 h-6 w-20 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
      ) : (
        <>
          <p className="mt-0.5 text-xl font-semibold leading-tight text-ink dark:text-neutral-50">
            {formatValue(kpi.value, kpi.format)}
          </p>
          <Change value={kpi.change} />
        </>
      )}
    </div>
  )
}

export default function BusinessKpiRow({ kpis, loading }) {
  const byKey = Object.fromEntries(kpis.map((kpi) => [kpi.key, kpi]))

  return (
    <div className="grid grid-cols-2 gap-px border-b border-edge bg-edge lg:grid-cols-4 dark:bg-neutral-800">
      {KPI_LAYOUT.map((slot) => {
        const kpi = byKey[slot.key]
        // A missing figure means there is nothing to show, whatever the reason:
        // the request is in flight, or it failed and there are no numbers at all.
        // Defaulting to the skeleton here rather than trusting `loading` alone
        // keeps this row from ever rendering an empty cell, and never invents a
        // zero where the real figure is unknown.
        return <KpiCell key={slot.key} slot={slot} kpi={kpi} pending={loading || !kpi} />
      })}
    </div>
  )
}
