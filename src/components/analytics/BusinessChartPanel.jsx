import { AlertCircle, BarChart3 } from 'lucide-react'

import BusinessTrendChart from '@/components/analytics/BusinessTrendChart'
import Button from '@/components/ui/Button'

// The lower half of the Business Overview card, which is in exactly one of four
// states: loading, error, no activity, or data. Each branch reserves the same
// chart height so the dashboard below never shifts.

export default function BusinessChartPanel({ series, hasActivity, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="px-5 pb-5">
        <div className="mb-3 flex justify-end">
          <div className="h-3 w-28 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
        </div>
        <div className="h-72 animate-pulse rounded-xl bg-gray-50 dark:bg-white/5" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-3 px-5 text-center">
        <AlertCircle size={24} className="text-red-500" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-neutral-200">Unable to load analytics.</p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-500">{error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  if (!hasActivity) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-2 px-5 text-center">
        <BarChart3 size={28} className="text-gray-300 dark:text-neutral-600" aria-hidden="true" />
        <p className="text-sm text-gray-500 dark:text-neutral-400">No data available for this period.</p>
      </div>
    )
  }

  return (
    <div className="px-5 pb-5">
      <BusinessTrendChart data={series} />
    </div>
  )
}
