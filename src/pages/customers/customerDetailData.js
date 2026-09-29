// Display-only derivations for the customer detail page.
//
// Nothing here talks to the API. The backend has no customer status column, no
// prescription expiry column and no gender column (API_DOCUMENT.md 6.5 and 11.1),
// so those three values are computed here and the comments say so. Everything
// else is a plain read of a field the backend really sends.

import { formatCurrency, formatDate } from '@/utils/format'

// The register form posts date_of_birth but the old mock rows used dateOfBirth.
// Both are accepted so a page does not render a blank DOB depending on which
// source the row came from.
export const birthDateOf = (customer) => customer?.date_of_birth || customer?.dateOfBirth || ''

// There is no gender field on CustomerResponse, so the header must not invent
// one. 'Not recorded' is the honest display value.
export const genderOf = (customer) => customer?.gender || 'Not recorded'

// Optical convention: a prescription is treated as current for two years. The
// backend stores prescription_date only, so the expiry is derived.
export const RX_VALID_YEARS = 2

export const rxExpiry = (prescription) => {
  const date = new Date(prescription?.prescription_date)
  if (Number.isNaN(date.getTime())) return null
  date.setFullYear(date.getFullYear() + RX_VALID_YEARS)
  return date
}

export const isRxExpired = (prescription) => {
  const expiry = rxExpiry(prescription)
  return expiry ? expiry.getTime() < Date.now() : false
}

const toTime = (value) => {
  if (!value) return NaN
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? NaN : time
}

// "2 days ago" / "today" / "3 months ago". Used for the supporting line on the
// summary cards and for the activity timeline.
export const relativeDay = (value) => {
  const time = toTime(value)
  if (Number.isNaN(time)) return '—'

  const days = Math.round((Date.now() - time) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`

  const months = Math.round(days / 30.44)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`

  const years = Math.round(days / 365.25)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

const MONTH_MS = 1000 * 60 * 60 * 24 * 30.44
const ACTIVE_WINDOW_MONTHS = 12

// Active / Inactive is derived from the most recent order or appointment
// because the backend has no customer status field. Inactive means "no recorded
// activity in the last 12 months", not "blocked".
export const customerStatus = ({ orders = [], appointments = [] }) => {
  const stamps = [
    ...orders.map((o) => o.order_date || o.created_at),
    ...appointments.map((a) => a.scheduled_at || a.created_at),
  ]
    .map(toTime)
    .filter((t) => !Number.isNaN(t))

  if (stamps.length === 0) {
    return { label: 'Inactive', variant: 'neutral', hint: 'No orders or visits on record' }
  }

  const months = (Date.now() - Math.max(...stamps)) / MONTH_MS
  const label = months <= ACTIVE_WINDOW_MONTHS ? 'Active' : 'Inactive'
  return { label, variant: label === 'Active' ? 'success' : 'neutral', hint: `Last seen ${relativeDay(Math.max(...stamps))}` }
}

// One line describing what was actually ordered. OrderItemResponse carries the
// lens configuration but no product name (API_DOCUMENT.md 10.2), so the frame is
// referenced by id rather than invented.
export const lensSummary = (order) => {
  const items = order?.items || []
  if (items.length === 0) return 'No line items recorded'

  return items
    .map((item) =>
      [item.len_type, item.len_coating, item.len_index && `index ${item.len_index}`].filter(Boolean).join(' · '),
    )
    .filter((text) => text)
    .join('  /  ') || 'No lens configuration recorded'
}

export const itemCount = (order) => (order?.items || []).reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)

const isClosedAppointment = (status) => /cancelled|completed|noshow/i.test(String(status || ''))

// The four summary cards. Every number is read from the loaded collections, so
// the cards cannot drift from the tables underneath them.
export const summaryStats = ({ orders = [], appointments = [], requests = [] }) => {
  const totalSpent = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
  const average = orders.length ? totalSpent / orders.length : 0
  const lastOrderDate = orders[0]?.order_date || orders[0]?.created_at

  const upcoming = appointments
    .filter((a) => toTime(a.scheduled_at) >= Date.now() && !isClosedAppointment(a.status))
    .sort((a, b) => toTime(a.scheduled_at) - toTime(b.scheduled_at))
  const next = upcoming[0]

  const settled = requests.filter((r) => /completed|approved|fulfilled/i.test(r.status || ''))
  const handled = requests.length ? `${settled.length} of ${requests.length} handled` : 'None submitted yet'

  return [
    {
      key: 'orders',
      label: 'Total Orders',
      value: String(orders.length),
      hint: lastOrderDate ? `Last order ${relativeDay(lastOrderDate)}` : 'No orders yet',
    },
    {
      key: 'appointments',
      label: 'Appointments',
      value: String(appointments.length),
      hint: next
        ? `${upcoming.length} upcoming · ${formatDate(next.scheduled_at, { weekday: 'long' })}`
        : 'None upcoming',
    },
    { key: 'requests', label: 'Clinical Requests', value: String(requests.length), hint: handled },
    {
      key: 'spent',
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      hint: orders.length ? `Average ${formatCurrency(average)} per order` : 'No spend recorded',
    },
  ]
}
