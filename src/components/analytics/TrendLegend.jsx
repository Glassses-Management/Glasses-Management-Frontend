// Swatch colours come from the same theme map the chart series uses, so the key
// can never drift out of step with the lines it is explaining.

export default function TrendLegend({ colors }) {
  return (
    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-neutral-400">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ backgroundColor: colors.revenue }} />
        Revenue
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ backgroundColor: colors.orders }} />
        Orders
      </span>
    </div>
  )
}
