import { Check } from 'lucide-react'

const STEPS = ['Personal Details', 'Clinical & Insurance', 'Security & Credentials']

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function RegisterStepTracker({ activeStep }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <div className="flex min-w-max items-center gap-2">
        {STEPS.map((label, index) => {
          const done = index < activeStep
          const current = index === activeStep
          return (
            <div key={label} className="flex items-center gap-2">
              {index > 0 && (
                <span
                  className={cn(
                    'h-0.5 w-10 sm:w-14',
                    index <= activeStep ? 'bg-forest dark:bg-leaf' : 'bg-neutral-200 dark:bg-neutral-700',
                  )}
                />
              )}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    done || current
                      ? 'bg-forest text-white dark:bg-leaf dark:text-forest'
                      : 'border-2 border-neutral-300 text-neutral-400 dark:border-neutral-600 dark:text-neutral-500',
                  )}
                >
                  {done ? <Check size={14} /> : index + 1}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium',
                    done || current ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500',
                  )}
                >
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RegisterStepTracker