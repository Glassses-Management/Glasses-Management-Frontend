import { useState } from 'react'
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/FormatCurrency'
import { formatDate } from '@/utils/FormatDate'

const PAGE_SIZE = 5

const FILTERS = [
  { key: 'all', label: 'All statuses' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'processing', label: 'Processing (Lab)' },
]

export default function RecentOrdersCard({ orders, onViewAll, onPage }) {
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)

  const filtered = (orders || []).filter((o) =>
    filter === 'all' ? true : String(o.status || '').toLowerCase().includes(filter)
  )
  const numPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, numPages - 1)
  const rows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)
  const from = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1
  const to = Math.min(filtered.length, safePage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="flex h-full flex-col rounded-2xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-5 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-leaf dark:text-leaf" />
          <h2 className="text-base font-semibold text-ink dark:text-neutral-50">Recent orders</h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-edge bg-white px-3 py-1.5 text-sm text-ink outline-none transition-colors duration-300 focus:border-forest focus:ring-2 focus:ring-forest/20 dark:border-neutral-700 dark:bg-[#14141e] dark:text-neutral-200"
          >
            {FILTERS.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={onViewAll}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-forest transition-colors duration-300 hover:bg-leaf/10 dark:text-leaf"
          >
            View all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-edge text-left text-xs uppercase tracking-wide text-gray-400 dark:border-neutral-800 dark:text-neutral-500">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Rx &amp; Lens Details</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge dark:divide-neutral-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400 dark:text-neutral-500">
                  No orders match the current filter.
                </td>
              </tr>
            ) : (
              rows.map((order) => (
                <tr key={order.id} className="hover:bg-mist-soft dark:hover:bg-white/5">
                  <td className="px-5 py-3 font-medium text-ink dark:text-neutral-100">#{order.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={order.customer_name || `Customer ${order.customer_id}`} id={order.customer_id} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink dark:text-neutral-100">
                          {order.customer_name || `Customer ${order.customer_id}`}
                        </p>
                        <p className="truncate text-xs text-gray-400 dark:text-neutral-500">
                          {order.customer_email || `cust${order.customer_id || ''}@example.com`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-neutral-400">
                    {(order.items || []).slice(0, 2).map((item, i) => (
                      <span key={i} className="mr-1 inline-flex items-center gap-1">
                        <span className="text-forest dark:text-leaf">{item.product_name || item.type || `Lens #${item.product_id}`}</span>
                        {item.sph_number != null && <span className="text-xs text-gray-400 dark:text-neutral-500">{item.sph_number}D</span>}
                      </span>
                    ))}
                    {(order.items?.length || 0) > 2 && <span className="text-xs text-gray-400 dark:text-neutral-500">+{order.items.length - 2} more</span>}
                  </td>
                  <td className="px-5 py-3 font-semibold text-ink dark:text-neutral-100">{formatCurrency(order.total)}</td>
                  <td className="px-5 py-3"><Badge text={order.status} /></td>
                  <td className="px-5 py-3 text-gray-500 dark:text-neutral-400">{formatDate(order.order_date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-edge px-5 py-3 text-sm text-gray-400 dark:border-neutral-800 dark:text-neutral-500">
        <p>
          Showing <span className="font-medium text-ink dark:text-neutral-200">{from}–{to}</span> of{' '}
          <span className="font-medium text-ink dark:text-neutral-200">{filtered.length}</span> orders
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPage?.(0) || setPage(Math.max(0, safePage - 1))}
            disabled={safePage === 0}
            className={cn('flex h-8 w-8 items-center justify-center rounded-lg border border-edge text-gray-500 transition-colors duration-300 dark:border-neutral-700 dark:text-neutral-400', safePage === 0 ? 'cursor-not-allowed opacity-40' : 'hover:bg-mist-soft dark:hover:bg-white/5')}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => onPage?.(numPages - 1) || setPage(Math.min(numPages - 1, safePage + 1))}
            disabled={safePage === numPages - 1}
            className={cn('flex h-8 w-8 items-center justify-center rounded-lg border border-edge text-gray-500 transition-colors duration-300 dark:border-neutral-700 dark:text-neutral-400', safePage === numPages - 1 ? 'cursor-not-allowed opacity-40' : 'hover:bg-mist-soft dark:hover:bg-white/5')}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
