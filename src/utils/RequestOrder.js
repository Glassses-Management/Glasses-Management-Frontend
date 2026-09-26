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
