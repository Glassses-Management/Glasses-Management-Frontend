import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Glasses, ClipboardList, Package } from 'lucide-react'
import { getCustomers } from '@/api/customerApi'
import { getProducts } from '@/api/productApi'
import { getOrders } from '@/api/orderApi'
import { getLowStock } from '@/api/inventoryApi'
import { formatCurrency } from '@/utils/FormatCurrency'
import { useAuth } from '@/hook/UseAuth'
import Button from '@/components/ui/Button'
import StatCard from '@/pages/dashboard/StatCard'
import QuickDeskCard from '@/pages/dashboard/QuickDeskCard'
import StockAttentionCard from '@/pages/dashboard/StockAttentionCard'
import StatusBar from '@/pages/dashboard/StatusBar'
import RecentOrdersCard from '@/pages/dashboard/RecentOrdersCard'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [customers, setCustomers] = useState(0)
  const [products, setProducts] = useState(0)
  const [orders, setOrders] = useState([])
  const [revenue, setRevenue] = useState(0)
  const [lowStock, setLowStock] = useState(0)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [cs, ps, os] = await Promise.all([
          getCustomers({ page: 0, size: 1 }),
          getProducts({ page: 0, size: 1 }),
          getOrders({ page: 0, size: 10 }),
        ])
        if (cancelled) return
        setCustomers(cs.totalElements || 0)
        setProducts(ps.totalElements || 0)
        setOrders(os.content || [])
        setRevenue((os.content || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0))
        const low = await getLowStock().catch(() => [])
        if (!cancelled) setLowStock(low?.length || 0)
      } catch (err) {
        console.error('DashboardPage: failed to load:', err?.response?.status || err?.message || err)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-neutral-50">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">
            Overview of your optical shop performance and daily prescriptions
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="md">
            Export Report
          </Button>
          <Button variant="outline" size="md">
            Add Product
          </Button>
          <Button variant="forest" size="md">
            New Order
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Customers" value={customers} badge={{ text: '+12%', tone: 'green' }} />
        <StatCard icon={Package} label="Products" value={products} badge={{ text: 'Catalog', tone: 'neutral' }} />
        <StatCard icon={ClipboardList} label="Orders" value={revenue ? formatCurrency(revenue) : 0} badge={{ text: '$ Volume', tone: 'neutral' }} />
        <StatCard
          icon={Glasses}
          label="Low Stock Items"
          value={lowStock}
          badge={{ text: 'Alert', tone: 'red' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersCard orders={orders} onViewAll={() => navigate('/dashboard/orders')} />
        </div>

        <div className="flex flex-col gap-6">
          <StockAttentionCard />
          <QuickDeskCard />
        </div>
      </div>

      <div className="mt-8 border-t border-edge pt-4">
        <StatusBar user={user} />
      </div>
    </div>
  )
}
