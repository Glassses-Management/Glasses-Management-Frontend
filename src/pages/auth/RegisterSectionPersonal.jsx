import { BadgeCheck, CalendarDays, Mail, MapPin, Phone, User } from 'lucide-react'
import RegistrationCard from '@/pages/auth/RegistrationCard'
import { fieldLabel, inputClass } from '@/pages/auth/RegisterData'

function VerifyTag({ label }) {
  return (
    <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-forest dark:text-leaf">
      <BadgeCheck size={12} />
      {label}
    </span>
  )
}

function RegisterSectionPersonal({ form, errors, update }) {
  return (
    <RegistrationCard
      step={1}
      title="Personal Demographics"
      status="Verified"
      tone="ok"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={fieldLabel}>Legal First Name</label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              placeholder="Sarah"
              className={`${inputClass} pl-10`}
            />
          </div>
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className={fieldLabel}>Legal Last Name</label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              placeholder="Chen"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="dateOfBirth" className={fieldLabel}>Date of Birth</label>
          <div className="relative">
            <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => update('dateOfBirth', e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
          <VerifyTag label="Prescription Verification" />
          {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={fieldLabel}>Mobile Phone Number</label>
          <div className="relative">
            <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="0123456789"
              className={`${inputClass} pl-10`}
            />
          </div>
          <VerifyTag label="SMS/2FA Verified" />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className={fieldLabel}>Email Address (login)</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="sarah@example.com"
              className={`${inputClass} pl-10`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className={fieldLabel}>Postal / Mailing Address</label>
          <div className="relative">
            <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="48 Story St, El Cajon, CA 92020"
              className={`${inputClass} pl-10`}
            />
          </div>
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={form.sameAsBilling}
              onChange={(e) => update('sameAsBilling', e.target.checked)}
              className="size-3.5 rounded accent-forest"
            />
            Same as billing address
          </label>
        </div>
      </div>
    </RegistrationCard>
  )
}

export default RegisterSectionPersonal