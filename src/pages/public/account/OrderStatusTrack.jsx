import { Fragment } from 'react'
import { Check } from 'lucide-react'

import { ORDER_FLOW, orderFlowIndex } from '@/utils/OrderStatus'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// The order's journey, drawn from the real status. Shared by the order history
// rows and the overview card.
//
// The staff equivalent lives in pages/orders/OrderDetail.jsx as a hard-coded
// FLOW array; this reads from utils/OrderStatus instead so customer and staff
// wording cannot drift apart.
export default function OrderStatusTrack({ status }) {
  const current = orderFlowIndex(status)

  // A cancelled order is not on the path, so there is no track to draw. The
  // caller is expected to show the cancelled state instead.
  if (current < 0) return null

  return (
    <ol className="flex items-start">
      {ORDER_FLOW.map((entry, index) => {
        const done = index < current
        const active = index === current

        return (
          <Fragment key={entry.status}>
            {index > 0 && (
              <span
                className={cn(
                  'mt-3.5 h-0.5 flex-1',
                  done || active ? 'bg-forest dark:bg-leaf' : 'bg-neutral-200 dark:bg-neutral-700',
                )}
              />
            )}
            <li className="flex w-20 shrink-0 flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full',
                  done && 'bg-forest text-white dark:bg-leaf dark:text-forest',
                  active && 'bg-forest text-white ring-4 ring-forest/20 dark:bg-leaf dark:text-forest dark:ring-leaf/20',
                  !done && !active && 'bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500',
                )}
              >
                {done ? (
                  <Check size={13} strokeWidth={3} />
                ) : active ? (
                  <span className="size-2.5 rounded-full bg-white dark:bg-forest" />
                ) : (
                  <span className="size-2 rounded-full bg-neutral-400 dark:text-neutral-500" />
                )}
              </span>
              <span
                className={cn(
                  'text-center text-[11px] font-medium leading-tight',
                  active ? 'text-forest dark:text-leaf' : done || active ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500',
                )}
              >
                {entry.step}
              </span>
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
