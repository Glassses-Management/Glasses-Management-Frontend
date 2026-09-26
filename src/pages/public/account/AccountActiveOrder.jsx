import { CalendarCheck, PackageCheck, ShoppingBag } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import AccountCard from '@/pages/public/account/AccountCard'
import OrderStatusTrack from '@/pages/public/account/OrderStatusTrack'
import { formatDate, formatTime } from '@/utils/FormatDate'
import { isActive, orderNextStep, orderStatusView } from '@/utils/OrderStatus'

// The customer's live order, on the overview tab.
//
// This replaces AccountGlazingProgress, which drew a four-step lab progress bar
// from hard-coded constants in AccountData (GLAZE_ACTIVE_STEP was always 2, and
// the "order" was always Aurora Round / FRA-2051). It showed a confident,
// detailed-looking tracker for an order that did not exist, while the real order
// was hidden on another tab.
export default function AccountActiveOrder({ orders, appointmentByOrder }) {
  // Newest first, which is how the hook already sorts them.
  const active = (orders || []).find((order) => isActive(order.status))

  if (!active) {
    return (
      <AccountCard>
        <div className="flex items-start gap-3 px-6 py-6" data-aos="fade-up">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-mist text-forest dark:bg-[#1E332B] dark:text-leaf">
            <PackageCheck size={16} />
          </span>
          <div>
            <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Nothing in progress
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              You have no order at the clinic right now. Anything you order will show its
              progress here.
            </p>
          </div>
        </div>
      </AccountCard>
    )
  }

  const status = orderStatusView(active.status)
  const next = orderNextStep(active.status)
  const appointment = appointmentByOrder?.get(active.id)
  const time = formatTime(appointment?.scheduled_at)

  return (
    <AccountCard>
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 pt-6 pb-4 dark:border-neutral-800"
        data-aos="fade-up"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
            <ShoppingBag size={16} />
          </span>
          <div>
            <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Your current order
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Order #{active.id}
            </p>
          </div>
        </div>
        <Badge text={status.label} variant={status.variant} />
      </div>

      <div className="px-6 py-5" data-aos="fade-up" data-aos-delay="100">
        <OrderStatusTrack status={active.status} />

        {next ? (
          <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Next: <span className="font-semibold text-neutral-900 dark:text-neutral-50">{next}</span>
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Nothing further is needed from you.
          </p>
        )}

        {appointment?.scheduled_at ? (
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-neutral-700 dark:text-neutral-300">
            <CalendarCheck size={15} className="shrink-0 text-forest dark:text-leaf" />
            <span className="font-semibold">
              Collect on {formatDate(appointment.scheduled_at)}
              {time ? ` at ${time}` : ''}
            </span>
          </p>
        ) : (
          <p className="mt-3 text-center text-sm text-neutral-500 dark:text-neutral-400">
            A collection date will appear here once the clinic books one.
          </p>
        )}
      </div>
    </AccountCard>
  )
}
