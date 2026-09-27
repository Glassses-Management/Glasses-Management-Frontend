// The backend has a real Request entity behind /api/requests. API_DOCUMENT.md
// section 12 only documents the POST (which creates an Order as a side effect),
// but the list/approve/reject endpoints exist too - see api/requestApi.
//
// Request statuses are PENDING -> APPROVED or REJECTED.

export const REQUEST_TYPE_LABEL = {
  exam: 'Eye Examination',
  product: 'Product',
}

export const REQUEST_PENDING = 'PENDING'
export const REQUEST_APPROVED = 'APPROVED'
export const REQUEST_REJECTED = 'REJECTED'

// The product-request flow, in order. Used by RequestStepper to draw the
// "submitted -> approved -> appointment" progress pills.
export const REQUEST_STEPS = ['Submitted', 'Approved', 'Appointment']

// How far through REQUEST_STEPS a request has got. A rejected request stops
// after the first step.
export const reachedStep = (request, scheduled) => {
  if (request?.status === REQUEST_REJECTED) return 1
  if (request?.status === REQUEST_APPROVED) return scheduled ? 3 : 2
  return 1
}

// Appointments have no order_id field, so the link between an appointment and
// the product request it belongs to is stored as a reference in the notes text
// (AppointmentRequest.notes is capped at 255 chars).
export const requestReference = (requestId) => `Product request #${requestId}`

export const REQUEST_NOTES_MAX = 255

// Pulls the request id back out of an appointment's notes. Returns null when
// the appointment was not created from a request.
export const parseRequestRef = (notes) => {
  const match = /Product request #(\d+)/.exec(String(notes || ''))
  return match ? Number(match[1]) : null
}

// Notes for the appointment created from a request: the reference first (so it
// stays parseable), then the customer's own words, trimmed to the 255 limit.
export const buildAppointmentNotes = (request) => {
    const reference = requestReference(request.id)
    const detail = String(request.notes || '').trim()
    if (!detail) return reference
    return `${reference} - ${detail}`.slice(0, REQUEST_NOTES_MAX)
}

// ---- customer-facing appointment wording ----
//
// Wording only, no link parsing: getAppointmentKind lives in utils/OrderAppointment
// because it needs both note references, and OrderAppointment already imports
// from here - importing back would make the two modules circular.

export const APPOINTMENT_KIND = {
    exam: 'Eye Examination',
    product: 'Product Collection',
    clinic: 'Clinic Visit',
}

// Status wording for customers. The raw enum is not shown: the backend's
// PENDING_SCHEDULING would otherwise read as jargon, and it is the state an
// approved exam request sits in until staff give it a date.
export const APPOINTMENT_STATUS = {
    PENDING_SCHEDULING: { label: 'Awaiting scheduling', variant: 'warning' },
    PENDING_REVIEW: { label: 'Awaiting review', variant: 'warning' },
    SCHEDULED: { label: 'Scheduled', variant: 'info' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'danger' },
}

export const appointmentStatus = (status) =>
    APPOINTMENT_STATUS[status] || { label: status || '', variant: 'neutral' }

// True while the appointment has no date yet, so the UI can say so instead of
// rendering an empty date.
export const isAwaitingScheduling = (appointment) =>
    !appointment?.scheduled_at && appointment?.status === 'PENDING_SCHEDULING'

// Drops the internal "Order #12" / "Product request #3" markers from notes.
// Both note builders write the reference first, joined by " - ", so the markers
// are whole segments and can be removed without touching the wording around
// them. Returns '' when the notes held nothing but markers.
export function stripInternalRefs(notes) {
    const text = String(notes || '').trim()
    if (!text) return ''
    return text
        .split(/\s+-\s+/)
        .filter((part) => !/^(Order #\d+|Product request #\d+)$/i.test(part.trim()))
        .join(' - ')
        .trim()
}
