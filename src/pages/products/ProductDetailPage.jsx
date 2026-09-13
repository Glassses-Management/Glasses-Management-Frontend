import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Hash, Palette, Layers, Ruler, Factory, Phone, Package } from 'lucide-react'
import { getProductById } from '@/api/productApi'
import { getAttachmentsByProduct } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'
import ProductImage from '@/components/product/ProductImage'
import { formatCurrency } from '@/utils/FormatCurrency'
import Button from '@/components/ui/Button'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await getProductById(id)
        if (cancelled) return
        setProduct(data)

        const atts = await getAttachmentsByProduct(id).catch(() => [])
        const pick = pickImage(atts)
        if (!cancelled) setImage(pick?.filePath || '')
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
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
          <div className="space-y-2">
            <div className="h-6 w-52 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
            <div className="h-4 w-32 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800 lg:col-span-2" />
          <div className="h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
        <Package size={40} className="mb-3 text-gray-300 dark:text-neutral-600" />
        <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">Product not found.</p>
        <Button variant="outline" className="mt-5" icon={<ArrowLeft size={16} />} onClick={() => navigate('/dashboard/products')}>
          Back to Products
        </Button>
      </div>
    )
  }

  const specRows = [
    { icon: Hash, label: 'SKU', value: product.sku },
    { icon: Palette, label: 'Color', value: product.color },
    { icon: Layers, label: 'Material', value: product.material },
    { icon: Ruler, label: 'Size', value: product.size },
    { icon: Factory, label: 'Supplier', value: product.supplier_name },
    { icon: Phone, label: 'Supplier Contact', value: product.supplier_contact },
  ]

  const summary = [product.material, product.color, product.size].filter(Boolean).join(' · ')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <Button variant="outline" icon={<Pencil size={16} />} onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}>
          Edit Product
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
            <header className="border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-[#1a1a2e] dark:text-neutral-100">Product Overview</h2>
            </header>
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-neutral-500">
                  {product.category || 'Eyewear'}
                </p>
                <h3 className="mt-2 text-xl font-bold text-[#1a1a2e] dark:text-neutral-50">{product.model}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{product.brand}</p>
                {summary && <p className="mt-3 text-sm text-gray-400 dark:text-neutral-500">{summary}</p>}
              </div>
              <div className="rounded-2xl bg-gray-50 px-5 py-4 text-right dark:bg-neutral-800/60">
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500">Sale Price</p>
                <p className="mt-1 text-2xl font-bold text-[#1a1a2e] dark:text-neutral-50">{formatCurrency(product.sale_price)}</p>
                <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">Cost: {formatCurrency(product.cost_price)}</p>
              </div>
            </div>
          </section>
          
          {/* Details */}
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
            <header className="border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-[#1a1a2e] dark:text-neutral-100">Details</h2>
            </header>
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {specRows.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-neutral-700/60 dark:text-neutral-300">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <span className="text-sm text-gray-500 dark:text-neutral-400">{label}</span>
                  <span className="ml-auto text-right text-sm font-semibold text-[#1a1a2e] dark:text-neutral-50">
                    {value || '—'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <section className="h-max rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28] lg:sticky lg:top-6">
          <header className="border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-[#1a1a2e] dark:text-neutral-100">Product Image</h2>
          </header>
          <div className="p-5">
            <ProductImage src={image} alt={product.model} className="h-64 w-full rounded-xl" />
          </div>
        </section>
      </div>
    </div>
  )
}