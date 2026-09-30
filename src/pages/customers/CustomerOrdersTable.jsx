import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/utils/format'
import { itemCount, lensSummary } from '@/pages/customers/customerDetailData'
import { card, cardHead, cardTitle, linkAction, tableCell, tableHead, tableRow } from '@/pages/customers/customerDetailStyles'

// The commercial side of the customer: what was ordered, what it cost, where it
// is in the workshop. `limit` trims it to the few most recent rows for the
// Overview tab; the Orders tab passes no limit for the full history.
//
// The table collapses to a card list under `md` instead of scrolling sideways,
// because staff check this on a tablet at the counter.

function StatusCell({ status }) {
  return <Badge text={status} />
}

function OrderCard({ order }) {
  return (
    <li className="border-t border-gray-100 px-4 py-3 first:border-t-0 dark:border-neutral-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-neutral-50">Order #{order.id}</p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
            {formatDate(order.order_date || order.created_at)} · {itemCount(order)} item{itemCount(order) === 1 ? '' : 's'}
          </p>
        </div>
        <StatusCell status={order.status} />
      </div>

      <p className="mt-2 text-xs text-gray-600 dark:text-neutral-300">{lensSummary(order)}</p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900 dark:text-neutral-50">{formatCurrency(order.total)}</span>
        <Link to={`/dashboard/orders/${order.id}`} className="inline-flex items-center gap-0.5 text-sm font-medium text-forest-600 dark:text-forest-400">
          View
          <ChevronRight size={14} />
        </Link>
      </div>
    </li>
  )
}

function EmptyState({ limited }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-medium text-gray-700 dark:text-neutral-200">No orders yet</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500 dark:text-neutral-400">
        {limited
          ? 'This customer has no dispensing history. Create the first order from the profile header.'
          : 'Nothing has been dispensed for this customer.'}
      </p>
    </div>
  )
}

export default function CustomerOrdersTable({ orders, limit }) {
  const rows = limit ? orders.slice(0, limit) : orders
  const trimmed = rows.length < orders.length

  return (
    <section className={card}>
      <div className={cardHead}>
        <div>
          <h2 className={cardTitle}>{limit ? 'Recent Dispensing Orders' : 'Dispensing Orders'}</h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
            {orders.length} order{orders.length === 1 ? '' : 's'} on record
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState limited={Boolean(limit)} />
      ) : (
        <>
          {/* Desktop: real table. */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px]">
              <thead className={tableHead}>
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Order</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Date</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Lens Configuration</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Status</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((order) => (
                  <tr key={order.id} className={tableRow}>
                    <td className={tableCell}>
                      <span className="font-semibold">#{order.id}</span>
                      <span className="ml-2 text-xs text-gray-400 dark:text-neutral-500">
                        {itemCount(order)} item{itemCount(order) === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className={`${tableCell} whitespace-nowrap`}>{formatDate(order.order_date || order.created_at)}</td>
                    <td className={`${tableCell} max-w-xs truncate text-gray-600 dark:text-neutral-300`} title={lensSummary(order)}>
                      {lensSummary(order)}
                    </td>
                    <td className={`${tableCell} text-right font-semibold tabular-nums`}>{formatCurrency(order.total)}</td>
                    <td className={tableCell}>
                      <StatusCell status={order.status} />
                    </td>
                    <td className={`${tableCell} text-right`}>
                      <Link to={`/dashboard/orders/${order.id}`} className="text-sm font-medium text-forest-600 hover:text-forest-700 dark:text-forest-400">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: one card per order. */}
          <ul className="md:hidden">
            {rows.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>
        </>
      )}

      {trimmed && (
        <div className="border-t border-gray-100 px-5 py-3 text-right dark:border-neutral-800">
          <Link to="/dashboard/orders" className={linkAction}>
            View All Orders
          </Link>
        </div>
      )}
    </section>
  )
}
