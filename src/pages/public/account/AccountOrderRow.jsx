import { useState } from 'react'
import { CalendarCheck, ChevronDown, Clock, ShoppingBag } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import AccountOrderDetails from '@/pages/public/account/AccountOrderDetails'
import { formatDate, formatTime } from '@/utils/FormatDate'
import { orderStatusView } from '@/utils/OrderStatus'

// Shown while there is no dated appointment, so the customer is never left
// wondering whether the clinic has simply forgotten.
const NO_DATE_YET = {
  PENDING: 'We are confirming your order. A collection date follows once it is confirmed.',
  PENDING_REVIEW: 'The clinic is reviewing your request. A collection date follows approval.',
  CONFIRMED: 'Confirmed. The clinic will add a collection date shortly.',
  IN_PROGRESS: 'Your order is being prepared. A collection date follows once it is ready.',
  READY_FOR_PICKUP: 'Ready now. The clinic will confirm a collection time with you.',
  COMPLETED: 'Collected. Thank you.',
}

// A dateless placeholder deliberately does not count as a collection date: staff
// still have to give it a date, so promising one to the customer would be a lie.
function CollectionNote({ order, appointment }) {
  if (order.status === 'CANCELLED') return null

  const time = formatTime(appointment?.scheduled_at)

  if (appointment?.scheduled_at) {
    return (
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-700 dark:text-neutral-300">
        <CalendarCheck size={15} className="shrink-0 text-forest dark:text-leaf" />
        <span className="font-semibold">
          Collect on {formatDate(appointment.scheduled_at)}
          {time ? ` at ${time}` : ''}
        </span>
      </p>
    )
  }

  return (
    <p className="flex items-start gap-2 text-sm text-neutral-500 dark:text-neutral-400">
      <Clock size={15} className="mt-0.5 shrink-0 text-neutral-400" />
      <span>{NO_DATE_YET[order.status] || 'The clinic will contact you to arrange collection.'}</span>
    </p>
  )
}

// One order in the customer's history. The summary stays collapsed to a glance;
// clicking it opens the progress track, the line items and the total.
export default function AccountOrderRow({ order, appointment }) {
  const [open, setOpen] = useState(false)
  const status = orderStatusView(order.status)
  const placed = order.order_date || order.created_at || order.createdAt
  const panelId = `order-panel-${order.id}`

  return (
    <li className="px-6 py-5" data-aos="fade-up">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full flex-col gap-3 text-left"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              <ShoppingBag size={15} className="shrink-0 text-forest dark:text-leaf" />
              Order #{order.id}
            </p>
            {placed && (
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Placed {formatDate(placed)}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge text={status.label} variant={status.variant} />
            <ChevronDown
              size={16}
              className={`text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        <CollectionNote order={order} appointment={appointment} />

        <span className="text-xs font-semibold text-forest dark:text-leaf">
          {open ? 'Hide details' : 'View progress and items'}
        </span>
      </button>

      {open && (
        <div id={panelId} className="mt-4">
          <AccountOrderDetails order={order} />
        </div>
      )}
    </li>
  )
}
