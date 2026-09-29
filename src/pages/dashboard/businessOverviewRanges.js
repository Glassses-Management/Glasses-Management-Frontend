// Period windows and axis layout for the Business Overview card.
//
// Nothing here talks to the API or reads an order's money. It answers two
// questions: which dates does a period cover, and which evenly spaced buckets
// should the x-axis show for that window.
//
// ALL dates are handled in the browser's local timezone on purpose. The backend
// filters with plain YYYY-MM-DD strings, and new Date('2026-09-29') is parsed as
// UTC midnight, which formats as the 28th anywhere west of Greenwich. So day keys
// are built from the local getFullYear/getMonth/getDate fields rather than from
// toISOString(), and axis labels are formatted from a Date instead of a string.

const DAY_MS = 86400000

// `days` counts inclusive days, so 7 produces seven points on the axis.
// `months` counts back from the start of the current month.
export const PERIODS = [
  { key: '7d', label: 'Last 7 Days', bucket: 'day', days: 7 },
  { key: '30d', label: 'Last 30 Days', bucket: 'day', days: 30 },
  { key: '3m', label: 'Last 3 Months', bucket: 'week', months: 3 },
  { key: '6m', label: 'Last 6 Months', bucket: 'month', months: 6 },
  { key: 'ytd', label: 'This Year', bucket: 'month' },
]

export const DEFAULT_PERIOD = '30d'

const pad = (n) => String(n).padStart(2, '0')

// Local-time YYYY-MM-DD. Doubles as the bucket id and as the dateFrom/dateTo
// query parameter the backend expects.
export const dayKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1)
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1)

// Weeks start Monday, matching how an optical shop's working week reads.
const startOfWeek = (d) => {
  const day = startOfDay(d)
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() - ((day.getDay() + 6) % 7))
}

export const orderDayKey = (order) => {
  const stamp = order?.order_date || order?.created_at
  const date = stamp ? new Date(stamp) : null
  return date && !Number.isNaN(date.getTime()) ? dayKey(date) : null
}

export const periodFor = (key) => PERIODS.find((p) => p.key === key) || PERIODS[1]

// The window the chart covers, and the bucket size its x-axis uses.
export const rangeFor = (key, today = new Date()) => {
  const period = periodFor(key)
  const to = startOfDay(today)

  if (period.key === 'ytd') return { bucket: 'month', from: new Date(to.getFullYear(), 0, 1), to }
  if (period.months) {
    const from = addMonths(startOfMonth(to), -(period.months - 1))
    // Weekly buckets are pulled back to their Monday so the first bucket is a
    // whole week. Without this it would start mid-week and undercount the days
    // before the fetch window opened.
    return { bucket: period.bucket, from: period.bucket === 'week' ? startOfWeek(from) : from, to }
  }
  return { bucket: period.bucket, from: addDays(to, -(period.days - 1)), to }
}

// The equivalent window immediately before it, for the "vs previous period"
// figures. Year to date compares against the same stretch of last year: "the 272
// days before 1 January" is a different thing entirely and would make the
// percentage meaningless.
export const previousRangeFor = (key, today = new Date()) => {
  const { from, to } = rangeFor(key, today)

  if (periodFor(key).key === 'ytd') {
    const year = from.getFullYear() - 1
    return { from: new Date(year, 0, 1), to: new Date(year, to.getMonth(), to.getDate()) }
  }

  const span = Math.round((to - from) / DAY_MS) + 1
  const previousTo = addDays(from, -1)
  return { from: addDays(previousTo, -(span - 1)), to: previousTo }
}

const tickOf = (date, bucket) =>
  bucket === 'month' ? new Date(date.getFullYear(), date.getMonth(), 1)
    : bucket === 'week' ? startOfWeek(date)
      : startOfDay(date)

const stepOf = (date, bucket) => {
  if (bucket === 'month') return addMonths(date, 1)
  return addDays(date, bucket === 'week' ? 7 : 1)
}

// Every bucket in the window, zero filled, so the x-axis is continuous. Without
// this a quiet day is simply absent from the series and the line joins straight
// across it, which reads as "no change" rather than "nothing happened".
export const buildBuckets = (range) => {
  const buckets = []
  let cursor = tickOf(range.from, range.bucket)

  while (cursor <= range.to) {
    buckets.push({
      key: dayKey(cursor),
      label: cursor.toLocaleDateString(undefined, range.bucket === 'month' ? { month: 'short' } : { month: 'short', day: 'numeric' }),
      tooltipLabel: cursor.toLocaleDateString(
        undefined,
        range.bucket === 'month'
          ? { month: 'long', year: 'numeric' }
          : { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' },
      ),
      orders: 0,
      revenue: 0,
      // Orders that actually generated revenue. Tracked per bucket because a
      // bucket can hold a paid order and a cancelled one on the same day, and
      // the average has to divide by the paid one only.
      billable: 0,
    })
    cursor = stepOf(cursor, range.bucket)
  }
  return buckets
}
