// Order status helpers. Backend statuses (see API_DOCUMENT.md 10.1):
// PENDING, CONFIRMED, IN_PROGRESS, READY_FOR_PICKUP, COMPLETED, CANCELLED.
// Plus PENDING_REVIEW used by the customer request flow (12).

export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'READY_FOR_PICKUP',
  'COMPLETED',
  'CANCELLED',
]

// Which status a given status may transition to (from the API doc 10.1).
export const STATUS_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

// Terminal statuses (no transitions allowed).
export const TERMINAL_STATUSES = ['COMPLETED', 'CANCELLED']

// Tailwind badge color per status, for use with the Badge component.
export const STATUS_COLORS = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  IN_PROGRESS: 'indigo',
  READY_FOR_PICKUP: 'purple',
  COMPLETED: 'green',
  CANCELLED: 'red',
  PENDING_REVIEW: 'orange',
}

export const isTerminal = (status) => TERMINAL_STATUSES.includes(status)

export const nextStatuses = (status) => STATUS_TRANSITIONS[status] || []
