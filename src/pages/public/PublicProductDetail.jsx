import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import HomeHeader from '@/pages/public/HomeHeader'
import HomeFooter from '@/pages/public/HomeFooter'
import ProductImage, { pickImage } from '@/components/product/ProductImage'
import { getPublicProductById, getPublicAttachmentsByProduct } from '@/api/publicProductApi'
import { formatCurrency } from '@/utils/FormatCurrency'
import { useAuth } from '@/hook/UseAuth'

export default function PublicProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [product, setProduct] = useState(null)
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const data = await getPublicProductById(id)
        if (cancelled) return
        setProduct(data)

        const atts = await getPublicAttachmentsByProduct(id).catch(() => [])
        const pick = pickImage(atts)
        if (!cancelled) setImage(pick?.filePath || '')
      } catch (err) {
        console.error('PublicProductDetail: failed to load product:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#111118] dark:text-neutral-200">
      <HomeHeader />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to products
        </button>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-4 w-1/3 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-32 w-full animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
            </div>
          </div>
        ) : !product ? (
          <div className="py-16 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">Product not found.</p>
            <Link to="/products" className="mt-4 inline-block text-sm font-medium text-neutral-900 underline dark:text-white">
              Back to products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            <ProductImage src={image} alt={product.model} />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                {product.category}
              </p>
              <h1 className="font-serif text-4xl text-neutral-900 dark:text-neutral-50">{product.model}</h1>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">{product.brand}</p>

              <p className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                {formatCurrency(product.sale_price)}
              </p>

              <div className="mt-8 space-y-3 rounded-2xl bg-white p-5 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
                {[
                  ['SKU', product.sku],
                  ['Color', product.color],
                  ['Material', product.material],
                  ['Size', product.size],
                  ['Supplier', product.supplier_name],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-50">{value || '—'}</span>
                  </div>
                ))}
              </div>

              {token ? (
                <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                  Sign in required to place an order. You are currently signed in — go to your dashboard to order.
                </p>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                  Sign in to purchase or book an eye exam.
                  <Link to="/login" className="ml-1 font-medium text-neutral-900 underline dark:text-white">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <HomeFooter />
    </div>
  )
}
