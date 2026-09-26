import { CalendarPlus } from 'lucide-react'
import { formatCurrency } from '@/utils/FormatCurrency'
import { isPrescriptionRequest } from '@/utils/OrderAppointment'
import { orderTarget } from '@/hook/UseScheduleTarget'

// One unscheduled order in the queue.
//
// A prescription change or eye exam needs an optometrist and a clinic visit; a
// plain product such as sunglasses only needs a collection date. request_type is
// not always populated, so the PENDING_REVIEW status is the dependable signal
// that the order came from a request at all.
export default function PendingScheduleRow({ order, appointment = null, focused, onSchedule }) {
  const isRequest = Boolean(order.request_type) || order.status === 'PENDING_REVIEW'
  const needsExam = isPrescriptionRequest(order)
  const itemCount = (order.items || []).length

  return (
    <li
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-3 dark:bg-[#1c1c28] ${
        focused
          ? 'border-blue-400 ring-2 ring-blue-300 dark:border-blue-600 dark:ring-blue-800'
          : 'border-blue-100 dark:border-neutral-800'
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
          {isRequest ? `Request #${order.id}` : `Order #${order.id}`}
          <span className="ml-2 font-normal text-gray-500 dark:text-neutral-400">
            {order.customer_name || `Customer #${order.customer_id ?? '?'}`}
          </span>
        </p>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-500">
          {needsExam
            ? 'Prescription change · needs an optometrist'
            : isRequest
              ? 'Product request · collection date only'
              : `${itemCount} item${itemCount === 1 ? '' : 's'} · ${formatCurrency(order.total)}`}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onSchedule(orderTarget(order, appointment))}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        <CalendarPlus size={15} />
        Schedule
      </button>
    </li>
  )
}
