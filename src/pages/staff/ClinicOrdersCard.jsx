import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/utils/format'

function ClinicOrdersCard({ orders }) {
  const navigate = useNavigate()
  const list = useMemo(() => (Array.isArray(orders) ? orders : []), [orders])

  return (
    <div className="rounded-xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge px-5 py-4 dark:border-neutral-800">
        <h2 className="text-base font-semibold text-ink dark:text-neutral-50">Recent Orders</h2>
        <button
          type="button"
          onClick={() => navigate('/dashboard/orders')}
          className="inline-flex items-center gap-1 text-sm font-medium text-forest hover:underline dark:text-leaf"
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      {list.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-500 dark:text-neutral-400">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-edge text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-neutral-800 dark:text-neutral-400">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  className="cursor-pointer border-b border-edge last:border-0 hover:bg-mist-soft dark:border-neutral-800 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-3 font-semibold text-ink dark:text-neutral-100">#{order.id}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-neutral-300">
                    {order.customer_name || `Customer #${order.customer_id}`}
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-neutral-400">
                    {formatDate(order.order_date || order.created_at)}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-neutral-100">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge text={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ClinicOrdersCard