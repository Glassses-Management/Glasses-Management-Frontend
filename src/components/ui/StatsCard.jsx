// Dashboard stat card. The value/trend come from the summary object in mock data
// — this component only styles them, it never touches the data itself.

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function TrendArrow({ up }) {
  return up ? (
    <svg
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  ) : (
    <svg
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  )
}

function StatsCard({ label, value, trend, icon, className = '' }) {
  const hasUpTrend = trend?.startsWith('+')
  const hasDownTrend = trend?.startsWith('-')

  return (
    <div className={cn('rounded-2xl border border-gray-200 bg-white p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-[28px] font-semibold leading-tight text-gray-900">{value}</p>
        </div>
        {icon && <div className="shrink-0 rounded-lg p-2">{icon}</div>}
      </div>

      {(hasUpTrend || hasDownTrend) && (
        <p
          className={cn(
            'mt-2 inline-flex items-center gap-1 text-sm font-medium',
            hasUpTrend ? 'text-green-600' : 'text-red-600',
          )}
        >
          <TrendArrow up={hasUpTrend} />
          {trend}
        </p>
      )}
      {trend && !hasUpTrend && !hasDownTrend && <p className="mt-2 text-sm text-gray-500">{trend}</p>}
    </div>
  )
}

export default StatsCard