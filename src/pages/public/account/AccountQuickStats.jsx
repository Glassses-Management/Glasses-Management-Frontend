import { formatCurrency } from '@/utils/FormatCurrency'
import { isActive, isCancelled, isCollected, orderStatusView } from '@/utils/OrderStatus'

// Every figure below is derived from the customer's real orders.
//
// This previously rendered four hard-coded values from AccountData: a fake
// "Current Order - In Progress - Order #4521" and "Lifetime Spend $1,240 - 18
// verified purchases", next to a fake prescription and a fake appointment. Only
// order-derived numbers are shown now, because those are the ones this page can
// actually stand behind.
function buildStats(orders) {
  const list = orders || []
  const active = list.find((order) => isActive(order.status))
  const ready = list.filter((order) => order.status === 'READY_FOR_PICKUP').length
  const collected = list.filter((order) => isCollected(order.status))

  // Cancelled orders are excluded so a refund does not inflate the total.
  const spend = list
    .filter((order) => !isCancelled(order.status) && order.total != null)
    .reduce((sum, order) => sum + Number(order.total || 0), 0)

  return [
    {
      label: 'Current order',
      value: active ? orderStatusView(active.status).label : 'None',
      sub: active ? `Order #${active.id}` : 'Nothing at the clinic',
    },
    {
      label: 'Ready to collect',
      value: String(ready),
      sub: ready === 1 ? 'Waiting for you' : 'Waiting for you',
    },
    {
      label: 'Orders placed',
      value: String(list.length),
      sub: `${collected.length} collected`,
    },
    {
      label: 'Total spend',
      value: formatCurrency(spend),
      sub: 'Excludes cancelled',
    },
  ]
}

export default function AccountQuickStats({ orders }) {
  const stats = buildStats(orders)

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {stat.label}
          </p>
          <p className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">{stat.value}</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{stat.sub}</p>
        </div>
      ))}
    </div>
  )
}
