import { formatCurrency } from '@/utils/FormatCurrency'

// The tooltip is a small readout of the two values under the cursor, so it is
// handed the series colours as a prop rather than re-deriving the theme itself.

export default function TrendTooltip({ active, payload, colors }) {
  if (!active || !payload?.length) return null

  const point = payload[0].payload

  return (
    <div className="rounded-xl border border-edge bg-white px-3 py-2 shadow-lg dark:border-neutral-700 dark:bg-[#1c1c28]">
      <p className="text-xs font-medium text-ink dark:text-neutral-100">{point.tooltipLabel || point.label}</p>
      <dl className="mt-1.5 space-y-1 text-xs">
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-1.5 text-gray-500 dark:text-neutral-400">
            <span className="size-2 rounded-full" style={{ backgroundColor: colors.revenue }} />
            Revenue
          </dt>
          <dd className="font-semibold tabular-nums text-ink dark:text-neutral-100">{formatCurrency(point.revenue)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-1.5 text-gray-500 dark:text-neutral-400">
            <span className="size-2 rounded-full" style={{ backgroundColor: colors.orders }} />
            Orders
          </dt>
          <dd className="font-semibold tabular-nums text-ink dark:text-neutral-100">{point.orders}</dd>
        </div>
      </dl>
    </div>
  )
}
