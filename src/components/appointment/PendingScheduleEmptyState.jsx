import { CalendarCheck, PackageCheck } from 'lucide-react'
import { formatDate } from '@/utils/FormatDate'

// Shown when no order is waiting for a date. It exists so the panel can explain
// itself: an empty list is ambiguous on its own, and "I confirmed the order and
// it still shows nothing" is impossible to answer without seeing where the
// order actually went.
export default function PendingScheduleEmptyState({ unconfirmed, scheduled }) {
  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/20">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-200">
        <PackageCheck size={16} />
        Orders awaiting a fitting date
      </h2>

      {unconfirmed > 0 && (
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
          {unconfirmed} order{unconfirmed === 1 ? ' is' : 's are'} still awaiting
          confirmation, so {unconfirmed === 1 ? 'it is' : 'they are'} not listed here yet.
          Confirm {unconfirmed === 1 ? 'it' : 'them'} on the Orders page first.
        </p>
      )}

      {scheduled.length > 0 ? (
        <>
          <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
            {unconfirmed > 0 ? 'Everything else already has' : 'Every confirmed order already has'}{' '}
            a collection date, which is why this list is empty:
          </p>
          <ul className="mt-3 space-y-1.5">
            {scheduled.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm dark:bg-white/5"
              >
                <span className="font-medium text-blue-900 dark:text-blue-200">
                  {item.code || `Order #${item.id}`}
                </span>
                <span className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300">
                  <CalendarCheck size={14} />
                  Collect on {formatDate(item.date)}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
          Nothing is waiting to be booked. To give an order a collection date, open it on
          the Orders page and use <strong>Schedule fitting</strong> — that works even for
          orders still awaiting review.
        </p>
      )}
    </section>
  )
}
