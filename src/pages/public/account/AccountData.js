// Placeholder dataset for the patient account dashboard. All values are demo
// content for previews — swap these out for real API data when it exists.
//
// The order-related entries that used to live here (QUICK_STATS, GLAZE_STEPS,
// GLAZE_ACTIVE_STEP, GLAZE_ORDER) are gone. They described a fabricated order
// "Aurora Round / FRA-2051" permanently sitting at step 2, which the overview
// rendered as if it were real. Order figures now come from useCustomerOrders.

export const PATIENT = {
  name: 'Sarah Chen',
  accountType: 'Primary Care Patient',
  doctor: 'Dr. S. Prak',
  memberSince: 'Aug 2024',
  offlineDays: 3,
}

export const REFRACTION_ROWS = [
  { param: 'Sphere', od: '-3.25 D', os: '-3.00 D' },
  { param: 'Cylinder', od: '-0.75 D', os: '-0.50 D' },
  { param: 'Axis', od: '178°', os: '5°' },
  { param: 'Add Power', od: '+1.75 D', os: '+1.75 D' },
  { param: 'Prism', od: 'None', os: 'None' },
]

export const SUB_METRICS = [
  { label: 'Pupillary Distance', value: '62.5 mm' },
  { label: 'Segment Height', value: '23 mm' },
  { label: 'Pantoscopic Tilt', value: '8°' },
  { label: 'Wrap Angle', value: '4°' },
]

export const LENS_TAGS = ['Anti-Reflective', 'Blue-Light Shield', 'UV400', 'Photochromic']

export const APPOINTMENTS = [
  {
    day: '14',
    month: 'OCT',
    title: 'Comprehensive Eye Exam',
    doctor: 'Dr. S. Prak',
    time: '10:30 AM',
    location: '48 Story St, El Cajon',
    status: 'Confirmed',
  },
  {
    day: '28',
    month: 'OCT',
    title: 'Follow-up · New Lenses Fitting',
    doctor: 'Dr. M. Lim',
    time: '2:00 PM',
    location: 'OptiCraft Optical, El Cajon',
    status: 'Confirmed',
  },
  {
    day: '05',
    month: 'DEC',
    title: 'Annual Retina Screening',
    doctor: 'Dr. S. Prak',
    time: '9:15 AM',
    location: '48 Story St, El Cajon',
    status: 'Confirmed',
  },
]

export const BENEFITS = {
  provider: 'TrueLife Vision Care',
  memberId: 'TL-8842-113',
  breakdown: [
    { label: 'Comprehensive exam', value: 'Covered 100%' },
    { label: 'Annual frame allowance', value: '$180' },
    { label: 'Next eligible date', value: 'Aug 1, 2027' },
  ],
}

export const CARE_PASS = {
  title: 'OptiCraft Care+ Pass',
  blurb: 'Save 15% on future lenses, one free ultrasonic cleaning and polish per year, plus priority lab slots.',
  membership: 'Membership #0214 · Auto-applied at checkout',
}

export const CONTACT_INFO = {
  address: ['48 Story St', 'El Cajon, CA 92020', 'United States'],
  phone: '+1 (619) 555-0142',
  email: 'hello@opticraft.example',
  memberNumber: '004 521 883',
}

export const COMPLIANCE = {
  label: 'Next Compensated Medical Refraction',
  value: 'Tue, Oct 14 · 10:30 AM',
  doctor: 'Dr. S. Prak',
}

export const ACCOUNT_TABS = [
  { key: 'overview', label: 'Overview & Prescriptions' },
  { key: 'requests', label: 'My Requests' },
  { key: 'personal', label: 'Personal & Insurance' },
  { key: 'orders', label: 'Order History' },
  { key: 'appointments', label: 'Appointments & Recalls' },
  { key: 'saved', label: 'Saved Eyewear' },
  { key: 'security', label: 'Security & MFA' },
]
