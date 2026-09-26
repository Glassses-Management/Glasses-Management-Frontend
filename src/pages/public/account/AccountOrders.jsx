import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'

import AccountCard from '@/pages/public/account/AccountCard'
import AccountOrderRow from '@/pages/public/account/AccountOrderRow'

const cardHead =
  'flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 pt-6 pb-4 dark:border-neutral-800'

// The customer's real orders, each with the date they can collect.
//
// Staff book the collection from the Appointments page queue; this is the
// read-only customer side of that. The joining of order to collection date
// happens in useCustomerOrders.
//
// The data is passed in rather than fetched here: PatientAccountPage loads it
// once and shares it with the overview widgets, so opening this tab does not
// re-request the same orders and appointments.
export default function AccountOrders({ orders, appointmentByOrder, error, loading }) {
  return (
    <AccountCard>
      <div className={cardHead} data-aos="fade-up">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
            <ShoppingBag size={16} />
          </span>
          <div>
            <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">Order History</h3>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Your purchases and when to collect them — select one for its progress
            </p>
          </div>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 rounded-lg border border-forest px-3.5 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white dark:border-leaf dark:text-leaf dark:hover:bg-leaf dark:hover:text-forest"
        >
          Browse products
        </Link>
      </div>

      {error ? (
        <p className="px-6 py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : loading ? (
        <div className="space-y-3 px-6 py-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-mist dark:bg-[#1E332B]" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <ShoppingBag size={32} className="mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No orders yet</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Anything you order will appear here with its collection date.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {orders.map((order) => (
            <AccountOrderRow key={order.id} order={order} appointment={appointmentByOrder.get(order.id)} />
          ))}
        </ul>
      )}
    </AccountCard>
  )
}
