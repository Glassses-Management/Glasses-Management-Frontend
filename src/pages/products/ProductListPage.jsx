import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { getProducts, deleteProduct } from '@/api/productApi'
import { formatCurrency } from '@/utils/FormatCurrency'
import Button from '@/components/ui/Button'

const CATEGORY_ORDER = ['Frames', 'Sunglasses', 'Lenses', 'Accessories']

function groupByCategory(products) {
  const groups = {}
  const ordered = []
  products.forEach((p) => {
    const cat = p.category || 'Other'
    if (!groups[cat]) {
      groups[cat] = []
      ordered.push(cat)
    }
    groups[cat].push(p)
  })
  ordered.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a)
    const ib = CATEGORY_ORDER.indexOf(b)
    if (ia !== -1 && ib !== -1) return ia - ib
    if (ia !== -1) return -1
    if (ib !== -1) return 1
    return a.localeCompare(b)
  })
  return { groups, ordered }
}

export default function ProductListPage({ onNavigate }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [openCategories, setOpenCategories] = useState(new Set())

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        (p.model || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q),
    )
  }, [products, search])

  const { groups, ordered } = useMemo(() => groupByCategory(filtered), [filtered])

  const toggleCategory = (cat) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProducts({})
      const list = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : [])
      setProducts(list)
    } catch (err) {
      console.error('ProductListPage: failed to load products:', err?.response?.status || err?.message || err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteError('')
    try {
      await deleteProduct(deleting.id)
      setDeleting(null)
      fetchProducts()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to delete product'
      setDeleteError(msg)
    }
  }

  const catCount = (cat) => (groups[cat] || []).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-neutral-50">Products</h1>
          <p className="text-sm text-gray-400 dark:text-neutral-500">Manage your optical product catalog</p>
        </div>
        <Button
          icon={<Plus size={18} />}
          onClick={() => onNavigate?.('products/add')}
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

      {/* Categories */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
        {loading ? (
          <div className="space-y-4 p-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
                <div className="space-y-2 pl-4">
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="h-12 animate-pulse rounded-lg bg-gray-50 dark:bg-neutral-800/50" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : ordered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="mb-3 text-4xl">📦</span>
            <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
              {search ? 'No products match your search.' : 'No products yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {ordered.map((cat) => {
              const items = groups[cat]
              const isOpen = openCategories.has(cat)
              return (
                <div key={cat}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    <span className="font-semibold text-gray-900 dark:text-neutral-100">{cat}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
                      {catCount(cat)}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="space-y-2 px-5 pb-3">
                      {items.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onNavigate?.(`products/${p.id}`)}
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-800/30 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/5"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 dark:text-neutral-100">{p.model}</span>
                              <span className="text-xs text-gray-500 dark:text-neutral-400">{p.brand} · {p.sku}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-[#1a1a2e] dark:text-neutral-50">
                              {formatCurrency(p.sale_price)}
                            </span>
                            <div className="inline-flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Pencil size={14} />}
                                onClick={(e) => { e.stopPropagation(); onNavigate?.(`products/edit/${p.id}`) }}
                              >
                                Edit
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

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
              <Button variant="ghost" onClick={() => { setDeleting(null); setDeleteError('') }}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
