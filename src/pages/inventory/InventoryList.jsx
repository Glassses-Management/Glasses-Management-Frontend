import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus, AlertCircle } from 'lucide-react'
import InventoryStats from '@/components/inventory/InventoryStats'
import InventoryFilter from '@/components/inventory/InventoryFilter'
import InventoryTable from '@/components/inventory/InventoryTable'
import { getInventories, deleteInventory } from '@/api/inventoryApi'
import { inventoryStatus, INVENTORY_STATUS, INVENTORY_STATUS_OPTIONS } from '@/utils/InventoryStatus'
import { useToast } from '@/hook/UseToast'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Pagination from '@/components/ui/Pagination'

const PAGE_SIZE = 10

function InventoryList() {
  const navigate = useNavigate()
  const location = useLocation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { success: toastSuccess, error: toastError } = useToast()

  const normalizeData = (data) => {
    if (Array.isArray(data)) return data
    if (data?.content) return data.content
    return []
  }

  // Only the search term is sent to the server; category and status are pure
  // client-side filters over the rows that come back.
  // setLoading(true) is not called here on purpose - doing it synchronously
  // from the filter effect would be a cascading render. `loading` starts true,
  // and the delete-reload below runs behind the modal's own spinner.
  const fetchData = useCallback(async (searchTerm) => {
    setError('')
    try {
      const params = {}
      if (searchTerm?.trim()) params.search = searchTerm.trim()
      const data = await getInventories(params)
      setItems(normalizeData(data))
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to load inventory'
      setError(msg)
      console.error('InventoryList:', err?.response?.status || err?.message || err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Deferred by one microtask so the state updates inside fetchData land in a
    // promise callback instead of synchronously in the effect body.
    void Promise.resolve().then(() => fetchData(search))
  }, [search, location.key, fetchData])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((i) => {
      const itemStatus = inventoryStatus(i.quantity, i.reorder_threshold)
      const matchesSearch = !q || (i.sku || '').toLowerCase().includes(q) || (i.model || '').toLowerCase().includes(q) || (i.brand || '').toLowerCase().includes(q)
      const matchesCategory = category === 'all' || i.category === category
      const matchesStatus = status === 'all' || itemStatus === status
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [items, search, category, status])

  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const categories = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(), [items])
  const statuses = INVENTORY_STATUS_OPTIONS

  const stats = useMemo(() => ({
    total: items.length,
    inStock: items.filter((i) => inventoryStatus(i.quantity, i.reorder_threshold) === INVENTORY_STATUS.IN_STOCK).length,
    lowStock: items.filter((i) => inventoryStatus(i.quantity, i.reorder_threshold) === INVENTORY_STATUS.LOW_STOCK).length,
    outOfStock: items.filter((i) => inventoryStatus(i.quantity, i.reorder_threshold) === INVENTORY_STATUS.OUT_OF_STOCK).length,
  }), [items])

  const handleAdd = () => navigate('/dashboard/inventory/new')
  const handleEdit = (item) => navigate(`/dashboard/inventory/${item.id}/edit`)
  const handleDeleteClick = (item) => setDeleting(item)

  const handleDeleteConfirm = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await deleteInventory(deleting.id)
      toastSuccess('Inventory item deleted.')
      setDeleting(null)
      fetchData(search)
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to delete'
      toastError(msg)
    } finally {
      setDeleteLoading(false)
    }
  }

  const updateSearch = (value) => { setSearch(value); setCurrentPage(1) }
  const updateCategory = (value) => { setCategory(value); setCurrentPage(1) }
  const updateStatus = (value) => { setStatus(value); setCurrentPage(1) }
  const resetFilters = () => { setSearch(''); setCategory('all'); setStatus('all'); setCurrentPage(1) }

  const effectiveTotalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, effectiveTotalPages)

  return (
    <div className="min-h-screen p-4 text-gray-900 md:p-6 transition-colors duration-300 dark:text-neutral-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold dark:text-neutral-50">Inventory</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">Manage product stock levels.</p>
          </div>
          <Button icon={<Plus size={18} />} onClick={handleAdd}>Add Inventory</Button>
        </div>

        <InventoryStats stats={stats} />

        <InventoryFilter
          search={search}
          setSearch={updateSearch}
          category={category}
          setCategory={updateCategory}
          status={status}
          setStatus={updateStatus}
          categories={categories}
          statuses={statuses}
          onReset={resetFilters}
        />

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm transition-colors duration-300 dark:bg-surface-dark dark:text-neutral-400">
            Loading inventory...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/30 dark:bg-red-500/10">
            <AlertCircle size={32} className="mx-auto mb-3 text-red-500" />
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">Check the backend connection and try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => fetchData(search)}>Retry</Button>
          </div>
        ) : (
          <>
            <InventoryTable products={paged} onEdit={handleEdit} onDelete={handleDeleteClick} />

            <Pagination
              currentPage={safePage}
              totalPages={effectiveTotalPages}
              totalItems={filtered.length}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete Inventory Item?"
        maxWidth="max-w-sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleting(null)} disabled={deleteLoading}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm} loading={deleteLoading}>Delete</Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-900 dark:text-neutral-100">{deleting?.sku || 'this item'}</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default InventoryList
