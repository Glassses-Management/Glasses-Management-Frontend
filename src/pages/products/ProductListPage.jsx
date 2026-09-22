import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { getProducts } from '@/api/productApi'
import { getAttachmentsByProduct } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'
import ProductStats from '@/components/product/ProductStats'
import ProductTable from '@/components/product/ProductTable'
import DeleteProductModal from '@/components/product/DeleteProductModal'
import Button from '@/components/ui/Button'

export default function ProductListPage({ onNavigate }) {
  const [products, setProducts] = useState([])
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [brand, setBrand] = useState('all')
  const [deleting, setDeleting] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts({})
      const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : []
      setProducts(list)
    } catch (err) {
      console.error('ProductListPage: failed to load products:', err?.response?.status || err?.message || err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const run = async () => {
      await fetchProducts()
    }
    run()
  }, [fetchProducts])

  useEffect(() => {
    if (loading || products.length === 0) return
    if (products.every((p) => p.id in images)) return
    let cancelled = false
    const pending = products.filter((p) => !(p.id in images))
    Promise.all(
      pending.map(async (p) => {
        const atts = await getAttachmentsByProduct(p.id).catch(() => [])
        const list = Array.isArray(atts) ? atts : Array.isArray(atts?.content) ? atts.content : []
        const src = pickImage(list)?.filePath || ''
        return [p.id, src]
      }),
    ).then((entries) => {
      if (!cancelled) setImages((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
    })
    return () => {
      cancelled = true
    }
  }, [products, images, loading])

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category || 'Other'))].sort(),
    [products],
  )
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand || 'Uncategorized'))].sort(),
    [products],
  )

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchSearch =
        !q || [p.model, p.brand, p.sku, p.category].some((v) => (v || '').toLowerCase().includes(q))
      const matchCategory = category === 'all' || (p.category || 'Other') === category
      const matchBrand = brand === 'all' || (p.brand || 'Uncategorized') === brand
      return matchSearch && matchCategory && matchBrand
    })
  }, [products, search, category, brand])

  const stats = useMemo(
    () => ({
      total: products.length,
      categories: categories.length,
      brands: brands.length,
      withImages: Object.values(images).filter(Boolean).length,
    }),
    [products, categories, brands, images],
  )

  const fieldClass =
    'rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-forest dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-leaf'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Products</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Manage your optical products, frames, lenses, and catalog information.
          </p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => onNavigate?.('products/add')}>
          Add Product
        </Button>
      </div>

      <ProductStats {...stats} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, brand, or SKU..."
              className={`${fieldClass} w-full pl-9 pr-4 sm:w-64`}
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${fieldClass} cursor-pointer`}>
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className={`${fieldClass} cursor-pointer`}>
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <p className="shrink-0 text-sm text-gray-500 dark:text-neutral-400">
          Showing <span className="font-medium text-gray-900 dark:text-neutral-50">{visible.length}</span> of {products.length} products
        </p>
      </div>

      {loading ? (
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-50 dark:bg-neutral-800/50" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
            {search || category !== 'all' || brand !== 'all' ? 'No products match your filters.' : 'No products yet.'}
          </p>
        </div>
      ) : (
        <ProductTable products={visible} images={images} onNavigate={onNavigate} onDelete={setDeleting} />
      )}

      {deleting && (
        <DeleteProductModal
          product={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setDeleting(null)
            fetchProducts()
          }}
        />
      )}
    </div>
  )
}