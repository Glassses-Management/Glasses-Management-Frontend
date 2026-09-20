import { Stethoscope, User } from 'lucide-react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const OPTIONS = [
  { key: 'patient', label: 'Patient', icon: User },
  { key: 'clinician', label: 'Doctor & Staff', icon: Stethoscope },
]

function AuthSegmentedToggle({ value, onChange }) {
  return (
    <div className="inline-flex w-full gap-1 rounded-xl border border-neutral-200 bg-mist p-1 dark:border-neutral-700 dark:bg-[#0E1A15]">
      {OPTIONS.map(({ key, label, icon: Icon }) => {
        const isActive = key === value
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
              isActive
                ? 'bg-white text-forest shadow-sm dark:bg-white/10 dark:text-leaf'
                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200',
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default AuthSegmentedToggle