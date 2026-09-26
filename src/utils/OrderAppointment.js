import { requestReference } from '@/utils/RequestOrder'

// Appointments have no order_id field, so the link between an appointment and
// the order it was booked for lives in the appointment notes
// (AppointmentRequest.notes is capped at 255 chars - API_DOCUMENT.md section
// 11). Same idea as the request reference in utils/RequestOrder.

export const orderReference = (orderId) => `Order #${orderId}`

export const ORDER_NOTES_MAX = 255

// Pulls the order id back out of an appointment's notes. Returns null when the
// appointment was not booked from an order.
export const parseOrderRef = (notes) => {
  const match = /Order #(\d+)/.exec(String(notes || ''))
  return match ? Number(match[1]) : null
}

// Notes for the appointment booked from an order: the reference first so it
// stays parseable, then any extra detail, trimmed to the limit.
//
// A request-created order is the same row the Requests page tracks, so it gets
// both references written. That way the Requests page still recognises the
// request as scheduled, and the queue still knows not to list it again.
export const buildOrderAppointmentNotes = (order, detail) => {
  const reference = order.request_type
    ? `${orderReference(order.id)} - ${requestReference(order.id)}`
    : orderReference(order.id)
  const extra = String(detail || '').trim()
  if (!extra) return reference.slice(0, ORDER_NOTES_MAX)
  return `${reference} - ${extra}`.slice(0, ORDER_NOTES_MAX)
}

// True when the order came from a request that needs a prescription or an eye
// exam, as opposed to a plain product such as sunglasses.
//
// Orders created by the request flow carry request_type, but the stored value is
// not documented (API_DOCUMENT.md section 10.1 only says "request_type set"), so
// this matches on the wording rather than an exact string. An order with no
// request_type at all came from the cart and is a plain product.
export function isPrescriptionRequest(order) {
  const type = String(order?.request_type || '').toLowerCase()
  if (!type) return false
  return /exam|prescription|spectacle|glass/.test(type)
}

// Picks the appointment row a booking should write into: the one already linked
// to this order/request by its notes.
//
// Deliberately reference-only. Matching a dateless appointment by customer as a
// fallback was tried and reverted - it overwrote appointments that had nothing
// to do with the booking. A booking with no linked row creates a new
// appointment instead, which never destroys existing data.
export function findBookableAppointment({ linked = {}, id } = {}) {
  return linked[id] || null
}
