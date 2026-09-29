// The activity timeline and the clinical notes card content.
//
// Both merge the four related collections into one view of a single customer, so
// they live together. Like customerDetailData.js this is pure: no fetching, no
// JSX, and every value comes from a field the backend actually returns.

import { relativeDay } from '@/pages/customers/customerDetailData'
import { REQUEST_TYPE_LABEL } from '@/utils/RequestOrder'

const toTime = (value) => {
  if (!value) return NaN
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? NaN : time
}

const humanStatus = (status) => String(status || '').toLowerCase().replace(/_/g, ' ')

// Merges orders, appointments, prescriptions, requests and the registration
// date into one reverse-chronological feed. This is what makes the relationship
// Customer -> everything visible on a single screen.
//
// `orderSummary` and `lensSummary` are injected so this file stays free of the
// formatting decisions made in customerDetailData.js.
export const buildActivity = ({ customer, orders, appointments, prescriptions, requests, lensSummary }, limit = 8) => {
  const items = []

  orders.forEach((order) => {
    const done = order.status === 'COMPLETED'
    items.push({
      at: order.order_date || order.created_at,
      title: `Order #${order.id} ${done ? 'completed' : humanStatus(order.status)}`,
      detail: lensSummary(order),
      tone: done ? 'success' : 'info',
      to: `/dashboard/orders/${order.id}`,
    })
  })

  appointments.forEach((appointment) => {
    const at = toTime(appointment.scheduled_at)
    const past = at < Date.now()
    items.push({
      at: appointment.scheduled_at,
      title: past
        ? `Eye exam ${humanStatus(appointment.status) || 'held'}`
        : 'Appointment booked',
      detail: appointment.notes || 'Consultation',
      tone: past ? 'neutral' : 'info',
      to: `/dashboard/appointments/${appointment.id}`,
    })
  })

  prescriptions.forEach((prescription) => {
    items.push({
      at: prescription.prescription_date || prescription.created_at,
      title: 'Prescription recorded',
      detail: prescription.notes || `Rx #${prescription.id}`,
      tone: 'info',
      to: `/dashboard/prescriptions/${prescription.id}`,
    })
  })

  requests.forEach((request) => {
    items.push({
      // Request.createdAt is camelCase, unlike every other entity here.
      at: request.createdAt ?? request.created_at,
      title: `${REQUEST_TYPE_LABEL[request.type] || humanStatus(request.type) || 'Clinical'} request ${humanStatus(request.status) || 'submitted'}`,
      detail: request.notes || `Request #${request.id}`,
      tone: /rejected|cancelled/i.test(request.status || '') ? 'danger' : 'info',
      to: '/dashboard/requests',
    })
  })

  if (customer?.created_at) {
    items.push({
      at: customer.created_at,
      title: 'Customer registered',
      detail: 'Account created',
      tone: 'neutral',
    })
  }

  return items
    .filter((item) => !Number.isNaN(toTime(item.at)))
    .sort((a, b) => toTime(b.at) - toTime(a.at))
    .slice(0, limit)
}

// Clinical tags are derived from the prescription and the lens configurations the
// customer actually has, not from a fixed list. A customer with nothing notable
// gets an explicit "no flags" chip rather than a misleading one.
export const clinicalTags = ({ prescriptions = [], orders = [] }) => {
  const rx = prescriptions[0]
  const lensTypes = [
    ...new Set(orders.flatMap((order) => (order.items || []).map((item) => item.len_type)).filter(Boolean)),
  ].map(String)

  const tags = []

  if (rx && Number(rx.near_addition) > 0) tags.push('Progressive Candidate')
  if (lensTypes.some((type) => /progressive/i.test(type))) tags.push('Progressive')
  if (lensTypes.some((type) => /photochrom|blue\s?light|transition/i.test(type))) tags.push('Photochromic')
  if (rx && Number(rx.pupillary_distance) >= 64) tags.push('Wide PD')
  if (rx && (Number(rx.od_sphere) <= -6 || Number(rx.os_sphere) <= -6)) tags.push('Strong Rx')

  return tags.length ? tags : ['No clinical flags']
}

// The observation line. Prescription.notes is the only free-text clinical field
// in the whole schema (API_DOCUMENT.md 11.1), so it is shown when present and a
// factual summary is derived when it is not.
export const staffObservation = ({ prescriptions = [], appointments = [], orders = [] }) => {
  const note = prescriptions[0]?.notes
  if (note) return note

  if (prescriptions.length === 0) {
    return appointments.length
      ? 'Seen in clinic but no prescription on file yet. Add one after the next refraction.'
      : 'No clinical notes recorded. Book an eye exam to start a clinical record.'
  }

  const lastVisit = appointments[0]?.scheduled_at
  const parts = [`${prescriptions.length} prescription${prescriptions.length === 1 ? '' : 's'} on file`]
  if (lastVisit) parts.push(`last visit ${relativeDay(lastVisit)}`)
  if (orders.length) parts.push(`${orders.length} order${orders.length === 1 ? '' : 's'} dispensed`)
  return `${parts.join(' · ')}. No note recorded.`
}
