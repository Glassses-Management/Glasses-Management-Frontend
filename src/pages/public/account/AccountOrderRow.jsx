import { CalendarCheck, Clock, ShoppingBag } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import { formatDate, formatTime } from '@/utils/FormatDate'
import { formatCurrency } from '@/utils/FormatCurrency'

// Plain-language status for the customer. The raw status strings come from
// API_DOCUMENT.md section 10.1; PENDING_REVIEW is the extra one that the
// product/exam request flow creates.
const ORDER_STATUS_VIEW = {
  PENDING: { label: 'Awaiting confirmation', variant: 'warning' },
  PENDING_REVIEW: { label: 'Awaiting clinic approval', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  IN_PROGRESS: { label: 'Being prepared', variant: 'info' },
  READY_FOR_PICKUP: { label: 'Ready for pickup', variant: 'success' },
  COMPLETED: { label: 'Collected', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
}

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

export default function AccountOrderRow({ order, appointment }) {
  const status = ORDER_STATUS_VIEW[order.status] || { label: order.status, variant: 'info' }
  const items = Array.isArray(order.items) ? order.items : []
  const placed = order.order_date || order.created_at || order.createdAt

  return (
    <li className="flex flex-col gap-3 px-6 py-5" data-aos="fade-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            <ShoppingBag size={15} className="text-forest dark:text-leaf" />
            Order #{order.id}
            {order.request_type && (
              <span className="text-xs font-medium text-neutral-400">· {order.request_type}</span>
            )}
          </p>
          {placed && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Placed {formatDate(placed)}</p>}
        </div>
        <Badge text={status.label} variant={status.variant} />
      </div>

      {items.length > 0 && (
        <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
          {items.map((item, index) => (
            <li key={item?.id ?? index} className="flex justify-between gap-4">
              <span className="min-w-0 truncate">
                {item?.quantity ?? 1} × {item?.name || item?.product_name || `Product #${item?.product_id}`}
              </span>
              {item?.price != null && (
                <span className="shrink-0 tabular-nums text-neutral-500 dark:text-neutral-400">
                  {formatCurrency(item.price * (item?.quantity ?? 1))}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {order.total != null && (
        <p className="flex justify-between border-t border-neutral-100 pt-3 text-sm font-semibold text-neutral-900 dark:border-neutral-800 dark:text-neutral-50">
          <span>Total</span>
          <span className="tabular-nums">{formatCurrency(order.total)}</span>
        </p>
      )}

      <CollectionNote order={order} appointment={appointment} />
    </li>
  )
}
