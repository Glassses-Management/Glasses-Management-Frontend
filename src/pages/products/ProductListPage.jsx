import { useEffect, useState, useRef, useCallback } from 'react'
import { Search, Glasses, Plus, Pencil, Trash2 } from 'lucide-react'
import { getProducts, deleteProduct } from '@/api/productApi'
import { formatCurrency } from '@/utils/FormatCurrency'
import { useDebouce } from '@/hook/UseDebounce'
import ProductForm from '@/pages/products/ProductForm'
import Button from '@/components/ui/Button'

const PAGE_SIZE = 10

export default function ProductListPage({ onNavigate }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const debouncedSearch = useDebouce(search)

  const prevSearchRef = useRef(debouncedSearch)

  const fetchProducts = useCallback(async (currentPage) => {
    const params = { page: currentPage, size: PAGE_SIZE, sort: 'id,desc' }
    if (debouncedSearch?.trim()) {
      params.search = debouncedSearch.trim()
    }
    return getProducts(params)
  }, [debouncedSearch])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (prevSearchRef.current !== debouncedSearch) {
        prevSearchRef.current = debouncedSearch
        setPage(0)
        return
      }
      setLoading(true)
      try {
        const data = await fetchProducts(page)
        if (cancelled) return
        setProducts(data?.content || [])
        setTotalPages(data?.totalPages || 0)
      } catch (err) {
        console.error('ProductListPage: failed to load products:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [page, debouncedSearch, fetchProducts])

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await fetchProducts(page)
      setProducts(data?.content || [])
      setTotalPages(data?.totalPages || 0)
      if (data?.content?.length === 0 && page > 0) {
        setPage((p) => p - 1)
      }
    } catch (err) {
      console.error('ProductListPage: failed to refresh products:', err?.response?.status || err?.message || err)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (id) => {
    onNavigate?.(`products/${id}`)
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteError('')
    try {
      await deleteProduct(deleting.id)
      setDeleting(null)
      refresh()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to delete product'
      setDeleteError(msg)
      console.error('ProductListPage: failed to delete product:', msg)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-neutral-50">Products</h1>
          <p className="text-sm text-gray-400 dark:text-neutral-500">Manage your optical product catalog</p>
        </div>
        <Button
          icon={<Plus size={18} />}
          onClick={() => { setEditing(null); setFormOpen(true) }}
        >
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, brand, or SKU..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#8fa88f]"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
        {loading ? (
          <div className="space-y-4 p-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Glasses size={40} className="mb-3 text-gray-300 dark:text-neutral-600" />
            <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
              {search ? 'No products match your search.' : 'No products yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 dark:border-neutral-800 dark:text-neutral-500">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Model</th>
                  <th className="px-5 py-3">Brand</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Material</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => handleRowClick(p.id)}
                    className="cursor-pointer border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-3 font-medium text-[#1a1a2e] dark:text-neutral-50">#{p.id}</td>
                    <td className="px-5 py-3 font-medium text-[#1a1a2e] dark:text-neutral-50">{p.model}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-neutral-400">{p.brand}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-neutral-400">{p.category}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-neutral-400">{p.material || '—'}</td>
                    <td className="px-5 py-3 font-medium text-[#1a1a2e] dark:text-neutral-50">
                      {formatCurrency(p.sale_price)}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500 dark:text-neutral-400">{p.sku}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Pencil size={14} />}
                          onClick={(e) => { e.stopPropagation(); setEditing(p); setFormOpen(true) }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          onClick={(e) => { e.stopPropagation(); setDeleting(p) }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-neutral-800">
            <p className="text-xs text-gray-400 dark:text-neutral-500">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {formOpen && (
        <ProductForm
          product={editing}
          onClose={() => { setFormOpen(false); setEditing(null) }}
          onSaved={() => { setFormOpen(false); setEditing(null); refresh() }}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => setDeleting(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-[#1c1c28]">
            <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-neutral-50">Delete Product</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
              Are you sure you want to delete <span className="font-medium text-[#1a1a2e] dark:text-neutral-200">{deleting.model}</span>? This action cannot be undone.
            </p>
            {deleteError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{deleteError}</p>
            )}
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => { setDeleting(null); setDeleteError('') }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
