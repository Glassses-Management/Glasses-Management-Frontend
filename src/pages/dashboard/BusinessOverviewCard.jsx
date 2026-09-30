import { BarChart3 } from 'lucide-react'

import BusinessChartPanel from '@/components/analytics/BusinessChartPanel'
import BusinessKpiRow from '@/components/analytics/BusinessKpiRow'
import { useBusinessOverview } from '@/hook/UseBusinessOverview'
import { PERIODS } from '@/pages/dashboard/businessOverviewRanges'

// The Business Overview card: period filter, four KPI figures, and the revenue
// and orders trend. This file owns only the shell - the header, the period
// picker, and which state the two panels are in. The figures come from the hook,
// the KPI cells from BusinessKpiRow and the chart states from BusinessChartPanel.
//
// The header and KPI row render in every state, so switching periods or
// recovering from an error never shifts the rest of the dashboard.

export default function BusinessOverviewCard() {
  const { period, periodLabel, setPeriod, series, kpis, loading, error, reload, hasActivity } = useBusinessOverview()

  return (
    <section className="mb-6 flex flex-col rounded-2xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-surface-dark">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-5 py-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-leaf" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-ink dark:text-neutral-50">Business Overview</h2>
            <p className="text-xs text-gray-400 dark:text-neutral-500">Revenue and orders over {periodLabel.toLowerCase()}</p>
          </div>
        </div>

        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          aria-label="Time period"
          className="rounded-lg border border-edge bg-white px-3 py-1.5 text-sm text-ink outline-none transition-colors duration-300 focus:border-forest focus:ring-2 focus:ring-forest/20 dark:border-neutral-700 dark:bg-surface-ink-soft dark:text-neutral-200"
        >
          {PERIODS.map((option) => (
            <option key={option.key} value={option.key}>{option.label}</option>
          ))}
        </select>
      </div>

      <BusinessKpiRow kpis={kpis} loading={loading} />

      <BusinessChartPanel
        series={series}
        hasActivity={hasActivity}
        loading={loading}
        error={error}
        onRetry={reload}
      />
    </section>
  )
}
