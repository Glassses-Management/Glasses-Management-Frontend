// Placeholder operational data for the clinician command center.
// Mirrors the real backend shapes (orders, appointments, inventories, users)
// so each card can be wired to live APIs later by swapping these arrays.

export const GLAZING_JOBS = [
  { id: 'GLZ-0421', patient: 'Sarah Chen', optometrist: 'Dr. Sean Jenks, OD', frame: 'Aurora Round — Single-Vue / Blue-Light', tech: 'J. Morales', eta: 'Today, 3:00 PM', status: 'Running', progress: 72 },
  { id: 'GLZ-0419', patient: 'Marcus Reid', optometrist: 'Dr. Lena Okafor, OD', frame: 'Vertex Slim — Progressive / Anti-Reflective', tech: 'T. Wu', eta: 'Today, 4:30 PM', status: 'Ready to Ship', progress: 100 },
  { id: 'GLZ-0420', patient: 'Priya Nair', optometrist: 'Dr. Sean Jenks, OD', frame: 'Eclipse Wide — Toric / UV400', tech: 'R. Alvarez', eta: 'Tomorrow, 10:00 AM', status: 'Telemetry', progress: 45 },
  { id: 'GLZ-0418', patient: 'David Okonkwo', optometrist: 'Dr. Marcus Webb, OD', frame: 'Horizon Narrow — Bifocal / Photochromic', tech: 'J. Morales', eta: 'Today, 5:00 PM', status: 'Running', progress: 60 },
  { id: 'GLZ-0417', patient: 'Lin Wei', optometrist: 'Dr. Lena Okafor, OD', frame: 'Nova Sport — Single-Vue / Photochromic', tech: 'T. Wu', eta: 'Tomorrow, 11:00 AM', status: 'QC Hold', progress: 30 },
]

export const LAB_FEED = {
  product: 'Aurora Round — Single-Vue / Blue-Light',
  specs: ['Ø62 mm', '2.0 mm', '24 g'],
  location: 'Lab 1 · CNC Bay A',
}

export const LOW_STOCK_ITEMS = [
  { sku: 'FV-2201', model: 'Aurora Round', brand: 'OptiCraft', current: 3, threshold: 10, urgency: 'critical' },
  { sku: 'LV-1088', model: 'Vertex Slim', brand: 'OptiCraft', current: 7, threshold: 12, urgency: 'warning' },
  { sku: 'EL-3312', model: 'Eclipse Wide', brand: 'OptiCraft', current: 2, threshold: 8, urgency: 'critical' },
  { sku: 'HZ-4055', model: 'Horizon Narrow', brand: 'OptiCraft', current: 9, threshold: 15, urgency: 'warning' },
]

export const EXAM_SCHEDULE = [
  { name: 'Marcus Reid', complaint: 'Progressive update — computer vision strain', tags: ['Comprehensive', 'Progressive'], doctor: 'Dr. Lena Okafor', status: 'Upcoming', time: '9:00 AM' },
  { name: 'Emma Johansson', complaint: 'Redness & irritation, post-LASIK follow-up', tags: ['Urgent Triage'], doctor: 'Dr. Sean Jenks, OD', status: 'Urgent Triage', time: '9:30 AM' },
  { name: 'Carlos Mendez', complaint: 'Contact lens fitting — astigmatism', tags: ['Fitting', 'Astigmatism'], doctor: 'Dr. Marcus Webb, OD', status: 'Exam Due', time: '10:00 AM' },
  { name: 'Anika Patel', complaint: 'Dry-eye syndrome — lens compatibility check', tags: ['Dry Eye', 'Follow-up'], doctor: 'Dr. Lena Okafor', status: 'Upcoming', time: '10:30 AM' },
  { name: 'James Okafor', complaint: 'Pediatric myopia progression — annual', tags: ['Pediatric', 'Myopia Control'], doctor: 'Dr. Sean Jenks, OD', status: 'Upcoming', time: '11:00 AM' },
]

export const STAFF_ROSTER = [
  { name: 'Dr. Sean Jenks, OD', role: 'Optometrist', status: 'Exam Room A', location: 'Room A' },
  { name: 'J. Morales', role: 'Lab Technician', status: 'Glazing Prep', location: 'Lab 1' },
  { name: 'R. Alvarez', role: 'Dispenser', status: 'Dispenser & Fitting', location: 'Dispensary B' },
  { name: 'Dr. Lena Okafor', role: 'Optometrist', status: 'Consulting', location: 'Room B' },
  { name: 'T. Wu', role: 'Lab Technician', status: 'Quality Check', location: 'Lab 2' },
  { name: 'Dr. Marcus Webb, OD', role: 'Optometrist', status: 'On Call', location: 'Room C' },
]

export const STATS = {
  appointmentsToday: 14,
  appointmentsOnTime: 93,
  glazingJobs: 8,
  glazingComplete: 75,
  revenue: 48260,
  revenueChange: 12.4,
  revenueHistory: [40, 55, 38, 62, 48, 70, 58, 65, 72, 60, 68, 75],
  pendingClaims: 5,
  pendingClaimsDollars: 3420,
  lowStock: 3,
}
