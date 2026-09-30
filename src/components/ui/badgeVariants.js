// Maps a backend enum string onto a Badge colour variant.
// Kept out of Badge.jsx so that file only exports components and stays
// fast-refresh friendly.

export const getVariantFromStatus = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'READY':
    case 'PAID':
      return 'success'
    case 'SCHEDULED':
    case 'PROCESSING':
    case 'PARTIAL':
    case 'CONFIRMED':
    case 'IN_PROGRESS':
      return 'info'
    // PENDING_SCHEDULING is the state an approved eye-exam request sits in until
    // staff give it a date (RequestService.approve). Not a neutral grey: it is
    // still waiting on the clinic.
    case 'PENDING':
    case 'PENDING_REVIEW':
    case 'PENDING_SCHEDULING':
    case 'UNPAID':
      return 'warning'
    case 'CANCELLED':
    case 'FAILED':
      return 'danger'
    case 'READY_FOR_PICKUP':
      return 'success'
    default:
      return 'neutral'
  }
}
