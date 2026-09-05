import { useEffect, useState } from 'react'
import { Users, Glasses, ClipboardList, Package, AlertTriangle } from 'lucide-react'
import { getCustomers } from '@/api/customerApi'
import { getProducts } from '@/api/productApi'
import { getOrders } from '@/api/orderApi'
import { getLowStock } from '@/api/inventoryApi'
import { formatCurrency } from '@/utils/FormatCurrency'
import { formatDate } from '@/utils/FormatDate'
import { STATUS_COLORS } from '@/utils/OrderStatus'

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8fa88f]/10">
        <Icon size={22} className="text-[#8fa88f]" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-[#1a1a2e]">{value}</p>
      </div>
    </div>
  )
}

const statusBadge = (status) => {
  const base = STATUS_COLORS[status] || 'gray'
  const colors = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    purple: 'bg-purple-100 text-purple-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    gray: 'bg-gray-100 text-gray-700',
  }
  return `inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[base]}`
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ customers: 0, products: 0, orders: 0, lowStock: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [customers, products, orders, lowStock] = await Promise.all([
          getCustomers({ page: 0, size: 1 }),
          getProducts({ page: 0, size: 1 }),
          getOrders({ page: 0, size: 5, sort: 'order_date,desc' }),
          getLowStock(),
        ])
        if (cancelled) return
        setStats({
          customers: customers.totalElements || 0,
          products: products.totalElements || 0,
          orders: orders.totalElements || 0,
          lowStock: lowStock?.length || 0,
        })
        setRecentOrders(orders.content || [])
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Dashboard</h1>
        <p className="text-sm text-gray-400">Overview of your optical shop</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard icon={Users} label="Customers" value={stats.customers} />
            <SummaryCard icon={Glasses} label="Products" value={stats.products} />
            <SummaryCard icon={ClipboardList} label="Orders" value={stats.orders} />
            <SummaryCard icon={Package} label="Low stock items" value={stats.lowStock} />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <AlertTriangle size={16} className="text-[#8fa88f]" />
              <h2 className="text-base font-semibold text-[#1a1a2e]">Recent orders</h2>
            </div>
            {recentOrders.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-400">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                      <th className="px-5 py-3">Order</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Total</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 font-medium text-[#1a1a2e]">#{order.id}</td>
                        <td className="px-5 py-3 text-gray-500">{order.customer_id}</td>
                        <td className="px-5 py-3 font-medium text-[#1a1a2e]">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-5 py-3">
                          <span className={statusBadge(order.status)}>{order.status}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {formatDate(order.order_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}