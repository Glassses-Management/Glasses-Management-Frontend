import { Check } from 'lucide-react'
import { REQUEST_STEPS } from '@/utils/RequestOrder'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Visual only: pass in how many steps are done (see reachedStep in utils/RequestOrder).
export default function RequestStepper({ current }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5">
      {REQUEST_STEPS.map((label, index) => {
        const done = index + 1 <= current
        return (
          <li key={label} className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                done
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-500',
              )}
            >
              {done && <Check size={10} />}
              {label}
            </span>
            {index < REQUEST_STEPS.length - 1 && (
              <span className="text-gray-300 dark:text-neutral-700">→</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
