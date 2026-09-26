import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Pagination from '@/components/ui/Pagination'
import Modal from '@/components/ui/Modal'
import OrderStats from '@/components/order/OrderStats'
import OrderFilter from '@/components/order/OrderFilter'
import OrderTable from '@/components/order/OrderTable'
import { getOrders, deleteOrder, changeOrderStatus } from '@/api/orderApi'
import Button from '@/components/ui/Button'
import { useToast } from '@/hook/UseToast'
import { useProductImages } from '@/hook/UseProductImages'

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
  const location = useLocation()
  const { success: toastSuccess, error: toastError } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: 'all', customer: 'all' })
  const [currentPage, setCurrentPage] = useState(1)

  const [editing, setEditing] = useState(null)
  const [editingLoading, setEditingLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deletingLoading, setDeletingLoading] = useState(false)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getOrders({ page: 0, size: 100, sort: 'id,desc' })
      setOrders(Array.isArray(data?.content) ? data.content : [])
    } catch (err) {
      console.error('OrderList: failed to load orders:', err?.response?.status || err?.message || err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [location.pathname, loadOrders])

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

  // Only the rows actually on screen are looked up, so a page of 10 orders does
  // not fire a request for every product across all 100 loaded orders.
  const images = useProductImages(paged.flatMap((o) => (o.items || []).map((item) => item.product_id)))

  const handleAdd = () => navigate('/dashboard/orders/new')

  const handleEditSave = async () => {
    if (!editing || editingLoading) return
    setEditingLoading(true)
    try {
      await changeOrderStatus(editing.id, editing.status)
      toastSuccess(`Order #${editing.id} updated.`)
      setEditing(null)
      await loadOrders()
    } catch (err) {
      toastError(err?.response?.data?.message || err?.message || 'Failed to update order')
    } finally {
      setEditingLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting || deletingLoading) return
    setDeletingLoading(true)
    try {
      await deleteOrder(deleting.id)
      toastSuccess(`Order #${deleting.id} deleted.`)
      setDeleting(null)
      await loadOrders()
    } catch (err) {
      toastError(err?.response?.data?.message || err?.message || 'Failed to delete order')
    } finally {
      setDeletingLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Orders</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Track dispensing orders, payments, and status.
          </p>
        </div>
        <Button icon={<Plus size={18} />} onClick={handleAdd}>Add Order</Button>
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
          <OrderTable
            orders={paged}
            images={images}
            onRowClick={(row) => navigate(`/dashboard/orders/${row.id}`)}
            onEdit={(row) => setEditing({ id: row.id, status: row.status || 'PENDING' })}
            onDelete={(row) => setDeleting(row)}
          />

          <Pagination
            currentPage={effectivePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={`Edit Order #${editing?.id || ''}`}
        maxWidth="max-w-sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEditing(null)} disabled={editingLoading}>
              Keep it
            </Button>
            <Button type="button" variant="primary" onClick={handleEditSave} loading={editingLoading}>
              Save Changes
            </Button>
          </div>
        }
      >
        <label htmlFor="order-status" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
          Order Status
        </label>
        <select
          id="order-status"
          value={editing?.status || 'PENDING'}
          onChange={(e) => setEditing((prev) => (prev ? { ...prev, status: e.target.value } : prev))}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete order?"
        maxWidth="max-w-sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDeleting(null)} disabled={deletingLoading}>
              Keep it
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete} loading={deletingLoading}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          This will permanently delete order{' '}
          <span className="font-medium text-gray-900 dark:text-neutral-100">#{deleting?.id}</span>.
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default OrderList
