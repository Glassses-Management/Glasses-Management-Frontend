import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getProductById } from '@/api/productApi'
import { formatCurrency } from '@/utils/FormatCurrency'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await getProductById(id)
        if (!cancelled) setProduct(data)
      } catch (err) {
        console.error('ProductDetailPage: failed to load product:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-neutral-400">Product not found.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/products')}
          className="mt-4 text-sm font-medium text-[#8fa88f] hover:underline"
        >
          Back to products
        </button>
      </div>
    )
  }

  const fields = [
    { label: 'SKU', value: product.sku },
    { label: 'Model', value: product.model },
    { label: 'Brand', value: product.brand },
    { label: 'Category', value: product.category },
    { label: 'Color', value: product.color },
    { label: 'Material', value: product.material },
    { label: 'Size', value: product.size },
    { label: 'Cost Price', value: formatCurrency(product.cost_price) },
    { label: 'Sale Price', value: formatCurrency(product.sale_price) },
    { label: 'Supplier', value: product.supplier_name },
    { label: 'Supplier Contact', value: product.supplier_contact },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard/products')}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#1a1a2e] dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-100"
          aria-label="Back to products"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-neutral-50">{product.model}</h1>
          <p className="text-sm text-gray-400 dark:text-neutral-500">{product.brand} · {product.category}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
        <div className="grid gap-0 divide-y divide-gray-100 dark:divide-neutral-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {fields.map((f) => (
            <div key={f.label} className="px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500">{f.label}</p>
              <p className="mt-1 text-sm font-medium text-[#1a1a2e] dark:text-neutral-100">{f.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
