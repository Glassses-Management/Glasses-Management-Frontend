import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '@/components/ui/Pagination'
import OrderStats from '@/components/order/OrderStats'
import OrderFilter from '@/components/order/OrderFilter'
import OrderTable from '@/components/order/OrderTable'
import { getOrders } from '@/api/orderApi'

const ITEMS_PER_PAGE = 10

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'READY_FOR_PICKUP', label: 'Ready For Pickup' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

function OrderList() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: 'all', customer: 'all' })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const data = await getOrders({ page: 0, size: 100, sort: 'id,desc' })
        if (cancelled) return
        setOrders(Array.isArray(data?.content) ? data.content : [])
      } catch (err) {
        console.error('OrderList: failed to load orders:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const customerOptions = useMemo(() => {
    const map = new Map()
    orders.forEach((o) => {
      if (o.customer_id != null && o.customer_name) {
        map.set(o.customer_id, o.customer_name)
      }
    })
    return [...map.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ value: id, label: name }))
  }, [orders])

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      processing: orders.filter((o) => o.status === 'IN_PROGRESS').length,
      ready: orders.filter((o) => o.status === 'READY_FOR_PICKUP').length,
      completed: orders.filter((o) => o.status === 'COMPLETED').length,
    }),
    [orders],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        String(o.id).includes(q) ||
        (o.customer_name || '').toLowerCase().includes(q)
      const matchesStatus = filters.status === 'all' || o.status === filters.status
      const matchesCustomer = filters.customer === 'all' || o.customer_id === filters.customer
      return matchesSearch && matchesStatus && matchesCustomer
    })
  }, [orders, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const effectivePage = Math.min(currentPage, totalPages)
  const paged = filtered.slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE)

  const handleViewDetail = (row) => navigate(`/dashboard/orders/${row.id}`)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Orders</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          Track dispensing orders, payments, and status.
        </p>
      </div>

      <OrderStats stats={stats} />

      <OrderFilter
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onClearAll={() => setFilters({ status: 'all', customer: 'all' })}
        statusOptions={STATUS_OPTIONS}
        customerOptions={customerOptions}
      />

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm dark:bg-[#1c1c28] dark:text-neutral-400">
          Loading orders...
        </div>
      ) : (
        <>
          <OrderTable orders={paged} onViewDetail={handleViewDetail} />

          <Pagination
            currentPage={effectivePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

export default OrderList
