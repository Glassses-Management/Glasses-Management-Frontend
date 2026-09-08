import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '@/components/ui/Pagination'
import OrderStats from '@/components/order/OrderStats'
import OrderFilter from '@/components/order/OrderFilter'
import OrderTable from '@/components/order/OrderTable'
import mockData from '@/mockData/mockOrders.json'

const ITEMS_PER_PAGE = 10

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'READY', label: 'Ready' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

function OrderList() {
  const navigate = useNavigate()
  const orders = mockData.orders

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: 'all', customer: 'all' })
  const [currentPage, setCurrentPage] = useState(1)

  const customerOptions = useMemo(() => {
    const map = new Map()
    orders.forEach((o) => map.set(o.customer.id, o.customer.name))
    return [...map.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ value: id, label: name }))
  }, [orders])

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      processing: orders.filter((o) => o.status === 'PROCESSING').length,
      ready: orders.filter((o) => o.status === 'READY').length,
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
        o.customer.name.toLowerCase().includes(q)
      const matchesStatus = filters.status === 'all' || o.status === filters.status
      const matchesCustomer = filters.customer === 'all' || o.customer.id === filters.customer
      return matchesSearch && matchesStatus && matchesCustomer
    })
  }, [orders, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const effectivePage = Math.min(currentPage, totalPages)
  const paged = filtered.slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE)

  const handleViewDetail = (row) => navigate(`/orders/${row.id}`)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Orders</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          Track dispensing orders, payments, and status across all branches.
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

      <OrderTable orders={paged} onViewDetail={handleViewDetail} />

      <Pagination
        currentPage={effectivePage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default OrderList