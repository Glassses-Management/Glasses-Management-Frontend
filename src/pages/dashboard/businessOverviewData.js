// Turning orders into the figures the Business Overview card displays.
//
// Nothing here talks to the API and nothing here decides which dates to cover;
// the window and the bucket layout come from businessOverviewRanges.

import { buildBuckets, dayKey, orderDayKey } from '@/pages/dashboard/businessOverviewRanges'
import { isCancelled } from '@/utils/OrderStatus'

// Returns a new array; the orders passed in are not modified.
export const bucketize = (orders, range) => {
  const buckets = buildBuckets(range)
  const slotOf = new Map(buckets.map((bucket, index) => [bucket.key, index]))

  for (const order of orders || []) {
    const key = orderDayKey(order)
    const slot = key ? slotOf.get(key) : undefined
    if (slot === undefined) continue

    buckets[slot].orders += 1
    // A cancelled order is still an order that happened, but it contributes no
    // money, so the revenue line never reports a sale that was walked away from.
    if (!isCancelled(order.status)) {
      buckets[slot].revenue += Number(order.total) || 0
      buckets[slot].billable += 1
    }
  }
  return buckets
}

export const summarise = (buckets = []) => {
  let revenue = 0
  let billable = 0

  for (const bucket of buckets) {
    revenue += bucket.revenue
    billable += bucket.billable || 0
  }

  return {
    revenue,
    orders: buckets.reduce((sum, bucket) => sum + bucket.orders, 0),
    // Averaged over the orders that actually generated revenue. Dividing by every
    // order instead would quietly understate the value of a sale each time one
    // was cancelled.
    averageOrderValue: billable ? revenue / billable : 0,
  }
}

// Percentage change against the previous period, or null when there is no honest
// answer. A percentage against zero is undefined, so nothing is rendered rather
// than Infinity or an invented figure.
export const percentChange = (current, previous) => {
  const now = Number(current) || 0
  const before = Number(previous) || 0
  if (before === 0) return null
  return ((now - before) / before) * 100
}

// Orders that fall inside a window, used for the previous-period comparison.
export const ordersBetween = (orders, range) => {
  const from = dayKey(range.from)
  const to = dayKey(range.to)
  return (orders || []).filter((order) => {
    const key = orderDayKey(order)
    return key !== null && key >= from && key <= to
  })
}
