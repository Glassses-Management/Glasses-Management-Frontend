import { useCallback, useEffect, useMemo, useState } from 'react'

import { loadBusinessOverview } from '@/api/analyticsApi'
import { bucketize, ordersBetween, percentChange, summarise } from '@/pages/dashboard/businessOverviewData'
import {
  DEFAULT_PERIOD,
  dayKey,
  periodFor,
  previousRangeFor,
  rangeFor,
} from '@/pages/dashboard/businessOverviewRanges'

// Loads and derives the Business Overview card. The fetch is keyed on the
// selected period, so changing the filter refetches from the real endpoints.
//
// Loading is derived rather than stored: the response records which period it
// belongs to, and anything else counts as "in flight". That keeps the effect free
// of setState calls and means the previous period's numbers are never left on
// screen under the newly selected period's label.
//
// `today` is captured once per mount so the window does not silently shift if
// the page is left open across midnight.

const IDLE = { period: null, payload: null, error: '' }

const readError = (err) =>
  err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Request failed'

export function useBusinessOverview() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD)
  const [result, setResult] = useState(IDLE)
  const [nonce, setNonce] = useState(0)
  const [today] = useState(() => new Date())

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false

    const current = rangeFor(period, today)
    const previous = previousRangeFor(period, today)

    loadBusinessOverview({
      current: { from: dayKey(current.from), to: dayKey(current.to) },
      previous: { from: dayKey(previous.from), to: dayKey(previous.to) },
    })
      .then((payload) => {
        if (!cancelled) setResult({ period, payload, error: '' })
      })
      .catch((err) => {
        if (!cancelled) setResult({ period, payload: null, error: readError(err) })
      })

    return () => {
      cancelled = true
    }
  }, [period, nonce, today])

  const isCurrent = result.period === period
  const payload = isCurrent ? result.payload : null
  const loading = !isCurrent
  const error = isCurrent ? result.error : ''

  const series = useMemo(
    () => (payload ? bucketize(payload.orders, rangeFor(period, today)) : []),
    [payload, period, today],
  )

  const totals = useMemo(() => summarise(series), [series])

  const previous = useMemo(() => {
    if (!payload) return null
    return summarise(bucketize(ordersBetween(payload.orders, previousRangeFor(period, today)), previousRangeFor(period, today)))
  }, [payload, period, today])

  const kpis = useMemo(() => {
    if (!payload) return []

    return [
      { key: 'revenue', label: 'Total Revenue', value: totals.revenue, format: 'currency', change: previous && percentChange(totals.revenue, previous.revenue) },
      { key: 'orders', label: 'Total Orders', value: totals.orders, format: 'number', change: previous && percentChange(totals.orders, previous.orders) },
      { key: 'aov', label: 'Average Order Value', value: totals.averageOrderValue, format: 'currency', change: previous && percentChange(totals.averageOrderValue, previous.averageOrderValue) },
      { key: 'customers', label: 'New Customers', value: payload.newCustomers, format: 'number', change: percentChange(payload.newCustomers, payload.newCustomersPrevious) },
    ]
  }, [payload, totals, previous])

  return {
    period,
    periodLabel: periodFor(period).label,
    setPeriod,
    series,
    kpis,
    loading,
    error,
    reload,
    // Distinguishes "the period genuinely has no activity" from "still loading".
    hasActivity: series.some((bucket) => bucket.orders > 0 || bucket.revenue > 0),
  }
}

export default useBusinessOverview
