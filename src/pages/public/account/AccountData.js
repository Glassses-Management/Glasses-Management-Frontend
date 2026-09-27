// Account page configuration. Every figure a customer sees now comes from the
// API, so this file holds no demo data.
//
// The placeholder dataset that used to live here (PATIENT, REFRACTION_ROWS,
// SUB_METRICS, LENS_TAGS, APPOINTMENTS, BENEFITS, CARE_PASS, CONTACT_INFO,
// COMPLIANCE) has been removed. Each of those was rendered as if it were real:
// a fixed "-3.25 D / 178°" prescription under a "Signed" badge, an insurance
// plan with invented coverage percentages, a care-pass membership number, a
// street address belonging to nobody, and a "next refraction" date that never
// changed. The backend has no insurance, plan or loyalty entity to back any of
// it, so the cards were dropped rather than left to lie.
//
// Real sources now: prescriptions via /api/prescriptions/mine, orders via
// /api/orders/mine, appointments via /api/appointments/mine, contact details
// via /api/customers/me, and the avatar via /api/attachments/mine.

export const ACCOUNT_TABS = [
  { key: 'overview', label: 'Overview & Prescriptions' },
  { key: 'requests', label: 'My Requests' },
  { key: 'personal', label: 'Personal & Insurance' },
  { key: 'orders', label: 'Order History' },
  { key: 'appointments', label: 'Appointments & Recalls' },
  { key: 'saved', label: 'Saved Eyewear' },
  { key: 'security', label: 'Security & MFA' },
]
