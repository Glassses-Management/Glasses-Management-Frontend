// Customer-facing order status.
//
// The raw status strings come from API_DOCUMENT.md section 10.1. PENDING_REVIEW
// is the one the documented list omits: POST /api/requests creates orders at
// that status (section 12) even though the status endpoint neither accepts nor
// transitions it. It has to be handled here, or those orders reach the customer
// with a raw enum as their status.

export const ORDER_STATUSES = [
  'PENDING',
  'PENDING_REVIEW',
  'CONFIRMED',
  'IN_PROGRESS',
  'READY_FOR_PICKUP',
  'COMPLETED',
  'CANCELLED',
]

// Plain-language wording. Staff terms like PENDING_REVIEW and IN_PROGRESS are
// not shown to customers.
export const ORDER_STATUS_VIEW = {
  PENDING: { label: 'Awaiting confirmation', variant: 'warning' },
  PENDING_REVIEW: { label: 'Awaiting clinic approval', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  IN_PROGRESS: { label: 'Being prepared', variant: 'info' },
  READY_FOR_PICKUP: { label: 'Ready for pickup', variant: 'success' },
  COMPLETED: { label: 'Collected', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
}

// Never falls back to the raw status. An unrecognised enum used to render
// verbatim, so a backend addition showed the customer "Some_New_Status".
const UNKNOWN = { label: 'In progress', variant: 'info' }

export const orderStatusView = (status) => ORDER_STATUS_VIEW[status] || UNKNOWN

// The path a customer follows. PENDING_REVIEW sits second because a request has
// to clear clinic review before it behaves like an ordinary order.
export const ORDER_FLOW = [
  { status: 'PENDING', step: 'Received' },
  { status: 'PENDING_REVIEW', step: 'Clinic review' },
  { status: 'CONFIRMED', step: 'Confirmed' },
  { status: 'IN_PROGRESS', step: 'In the workshop' },
  { status: 'READY_FOR_PICKUP', step: 'Ready to collect' },
  { status: 'COMPLETED', step: 'Collected' },
]

// How far along the flow an order is, as an index into ORDER_FLOW. -1 for a
// cancelled order, which has no place on the path.
export const orderFlowIndex = (status) => ORDER_FLOW.findIndex((entry) => entry.status === status)

// The step the customer is waiting on, or null when there is nothing left to
// wait for. Used for the "what happens next" line.
export const orderNextStep = (status) => {
  const index = orderFlowIndex(status)
  if (index < 0) return null
  return ORDER_FLOW[index + 1]?.step || null
}

export const isCancelled = (status) => status === 'CANCELLED'
export const isCollected = (status) => status === 'COMPLETED'

// An order still moving through the clinic, used for the overview card.
export const isActive = (status) =>
  !isCancelled(status) && !isCollected(status) && orderFlowIndex(status) >= 0
