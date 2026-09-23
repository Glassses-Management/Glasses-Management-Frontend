import { Fragment } from 'react'
import { Check, FileText, Glasses, MessageSquare, RotateCcw } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import AccountCard from '@/pages/public/account/AccountCard'
import { GLAZE_ACTIVE_STEP, GLAZE_ORDER, GLAZE_STEPS } from '@/pages/public/account/AccountData'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function AccountGlazingProgress() {
  return (
    <AccountCard>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 pt-6 pb-4 dark:border-neutral-800" data-aos="fade-up">
        <div>
          <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
            Bespoke Glazing & Delivery Progress
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Your current order, verified through our lab</p>
        </div>
        <Badge text={GLAZE_ORDER.status} variant={GLAZE_ORDER.statusVariant} />
      </div>

      <div className="flex items-center gap-4 px-6 pt-5">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-mist text-forest dark:bg-[#1E332B] dark:text-leaf">
          <Glasses size={32} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
            {GLAZE_ORDER.model}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{GLAZE_ORDER.sku}</p>
          <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-50">{GLAZE_ORDER.price}</p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-5" data-aos="fade-up" data-aos-delay="100">
        <div className="flex items-start">
          {GLAZE_STEPS.map((step, index) => {
            const done = index < GLAZE_ACTIVE_STEP
            const active = index === GLAZE_ACTIVE_STEP
            return (
              <Fragment key={step}>
                {index > 0 && (
                  <span className={cn('mt-4 h-0.5 flex-1', done ? 'bg-forest dark:bg-leaf' : 'bg-neutral-200 dark:bg-neutral-700')} />
                )}
                <div className="flex w-24 flex-col items-center gap-2">
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full',
                      done && 'bg-forest text-white dark:bg-leaf dark:text-forest',
                      active && 'bg-forest text-white ring-4 ring-forest/20 dark:bg-leaf dark:text-forest dark:ring-leaf/20',
                      !done && !active && 'bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500',
                    )}
                  >
                    {done ? (
                      <Check size={15} />
                    ) : active ? (
                      <span className="size-2.5 rounded-full bg-white dark:bg-forest" />
                    ) : (
                      <span className="size-2 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-center text-[11px] font-medium leading-tight',
                      done || active ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500',
                    )}
                  >
                    {step}
                  </span>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-neutral-100 px-6 py-4 dark:border-neutral-800">
        <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:underline dark:text-leaf">
          <FileText size={13} />
          View Full Invoice
        </button>
        <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-forest dark:text-neutral-300 dark:hover:text-leaf">
          <RotateCcw size={13} />
          Quick Reorder
        </button>
        <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-forest dark:text-neutral-300 dark:hover:text-leaf">
          <MessageSquare size={13} />
          Contact Lab Specialist
        </button>
      </div>
    </AccountCard>
  )
}

export default AccountGlazingProgress