import { HeartHandshake, Scan, ShieldCheck } from 'lucide-react'

export const fieldLabel = 'mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300'

export const inputClass =
  'w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-forest dark:border-neutral-600 dark:bg-[#0E1A15] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-leaf'

export const CARRIERS = [
  'TrueLife Vision Care',
  'VSP',
  'EyeMed',
  'Cigna Vision',
  'Blue Shield Vision',
  'Davis Vision',
]

export const RX_SNIPPET = {
  label: 'Wavefront Summary',
  code: 'OD/OS -3.75/-3.75 x 176°',
}

export const BENEFITS = [
  {
    icon: HeartHandshake,
    title: 'Lifetime Frame Care & Adjustments',
    desc: 'Free re-tunes, nose pads and alignment, forever.',
  },
  {
    icon: Scan,
    title: 'HD Wavefront Accuracy Vault',
    desc: 'Your refraction stays stored, versioned and portable.',
  },
  {
    icon: ShieldCheck,
    title: 'Automatic Vision Insurance',
    desc: 'Eligibility and copay checks run right at checkout.',
  },
]

export const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', check: (pw) => pw.length >= 8 },
  { key: 'case', label: 'Upper & lowercase letters', check: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { key: 'number', label: 'Contains a number', check: (pw) => /\d/.test(pw) },
  { key: 'symbol', label: 'Contains a symbol', check: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

export const CONSENT_OPTIONS = [
  { key: 'hipaa', label: 'HIPAA Clinical Notice & Terms of Service', required: true },
  { key: 'biometric', label: 'Biometric Extension / Multiplatform Passkey' },
  { key: 'sms', label: 'Premium Lab Telemetry via SMS' },
]