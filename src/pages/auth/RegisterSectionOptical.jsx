import { Building2, Check, Hash } from 'lucide-react'
import RegistrationCard from '@/pages/auth/RegistrationCard'
import { CARRIERS, fieldLabel, inputClass } from '@/pages/auth/RegisterData'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function RxChoice({ active, title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
        active
          ? 'border-forest bg-forest/5 dark:border-leaf dark:bg-forest/20'
          : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-transparent dark:hover:border-neutral-600',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
          active
            ? 'border-forest bg-forest text-white dark:border-leaf dark:bg-leaf dark:text-forest'
            : 'border-neutral-300 text-transparent dark:border-neutral-600',
        )}
      >
        <Check size={12} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-neutral-900 dark:text-neutral-50">{title}</span>
        <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">{desc}</span>
      </span>
    </button>
  )
}

function RegisterSectionOptical({ form, update }) {
  return (
    <RegistrationCard step={2} title="Optical Profile & Insurance" status="Optional">
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Do you currently hold an active prescription with OptiCraft or need to activate one?
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <RxChoice
          active={form.needsRx === 'yes'}
          title="Yes, I have it"
          desc="Import my verified refraction on file."
          onClick={() => update('needsRx', 'yes')}
        />
        <RxChoice
          active={form.needsRx === 'no'}
          title="Need an Rx First"
          desc="Book a comprehensive exam to activate."
          onClick={() => update('needsRx', 'no')}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="carrier" className={fieldLabel}>Primary Vision Carrier</label>
          <div className="relative">
            <Building2 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <select
              id="carrier"
              name="insuranceCarrier"
              value={form.insuranceCarrier}
              onChange={(e) => update('insuranceCarrier', e.target.value)}
              className={`${inputClass} pl-10`}
            >
              <option value="">Select a carrier</option>
              {CARRIERS.map((carrier) => (
                <option key={carrier} value={carrier}>{carrier}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="memberId" className={fieldLabel}>Member / Subscriber ID</label>
          <div className="relative">
            <Hash size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="memberId"
              name="memberId"
              type="text"
              value={form.memberId}
              onChange={(e) => update('memberId', e.target.value)}
              placeholder="TL-8842-113"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
      </div>

      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <input
          type="checkbox"
          checked={form.autoCopay}
          onChange={(e) => update('autoCopay', e.target.checked)}
          className="size-3.5 rounded accent-forest"
        />
        Let my plan auto-compute the copay at checkout and notify me by email.
      </label>
    </RegistrationCard>
  )
}

export default RegisterSectionOptical