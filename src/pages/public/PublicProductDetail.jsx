import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Factory, Hash, Layers, Palette, Ruler } from 'lucide-react'
import HomeHeader from '@/pages/public/HomeHeader'
import HomeFooter from '@/pages/public/HomeFooter'
import ProductImage from '@/components/product/ProductImage'
import { getPublicProductById, getPublicAttachmentsByProduct } from '@/api/publicProductApi'
import { formatCurrency } from '@/utils/FormatCurrency'
import { useAuth } from '@/hook/UseAuth'

export default function PublicProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [product, setProduct] = useState(null)
  const [images, setImages] = useState([])
  const [active, setActive] = useState(0)
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
        const imgs = (Array.isArray(atts) ? atts : []).filter((a) => a?.filePath).map((a) => a.filePath)
        if (!cancelled) {
          setImages(imgs)
          setActive(0)
        }
      } catch (err) {
        console.error('PublicProductDetail: failed to load product:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const specs = product && [
    { icon: Hash, label: 'SKU', value: product.sku },
    { icon: Palette, label: 'Color', value: product.color },
    { icon: Layers, label: 'Material', value: product.material },
    { icon: Ruler, label: 'Size', value: product.size },
    { icon: Factory, label: 'Supplier', value: product.supplier_name },
  ]

  const chips = product && [product.material, product.color, product.size].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#111118] dark:text-neutral-200">
      <HomeHeader />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mb-10 inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to products
        </button>

        {loading ? (
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="mx-auto w-full max-w-md">
              <div className="aspect-[4/3] w-full animate-pulse rounded-[2rem] bg-[#f1ece2] dark:bg-neutral-800/50" />
            </div>
            <div className="space-y-5 py-4">
              <div className="h-4 w-24 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-4 w-1/2 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-24 w-full animate-pulse rounded-3xl bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-64 w-full animate-pulse rounded-3xl bg-neutral-100 dark:bg-neutral-800" />
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
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            {/* Image column */}
            <div className="md:sticky md:top-24 max-h-[calc(100vh-6rem)] overflow-hidden">
              <div className="mx-auto w-full max-w-md pb-6">
                <div className="rounded-[2rem] bg-[#f1ece2] p-0 ring-1 ring-neutral-200/60 dark:bg-neutral-800/50 dark:ring-neutral-700/60">
                  <ProductImage src={images[active]} alt={product.model} className="aspect-[4/3] w-full overflow-hidden rounded-3xl" />
                </div>
                {images.length > 1 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`View image ${i + 1}`}
                        className={`h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          active === i
                            ? 'border-neutral-900 opacity-100 dark:border-neutral-100'
                            : 'border-neutral-200 opacity-70 hover:opacity-100 dark:border-neutral-700'
                        }`}
                      >
                        <img src={img} alt={`${product.model} view ${i + 1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Details column */}
            <div className="flex flex-col pt-2 lg:pt-2">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-neutral-300 dark:bg-neutral-600" />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
                  {product.category || 'Eyewear'}
                </p>
              </div>
              <h1 className="mt-4 font-sans font-semibold text-3xl leading-[1.1] tracking-tight text-neutral-900 md:text-4xl dark:text-neutral-50">
                {product.model}
              </h1>
              <p className="mt-2.5 text-base text-neutral-500 dark:text-neutral-400">{product.brand}</p>

              <div className="mt-7 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                  Price
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 md:text-2xl dark:text-neutral-50">
                  {formatCurrency(product.sale_price)}
                  <span className="ml-2 align-middle text-sm font-normal text-neutral-400 dark:text-neutral-500">per pair</span>
                </p>
              </div>

              {/* Details */}
              <div className="mt-8">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
                  Details
                </h2>
                <dl className="overflow-hidden rounded-2xl ring-1 ring-neutral-200/60 dark:ring-neutral-700/60">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 border-b border-neutral-200/70 px-3 py-2.5 last:border-b-0 dark:border-neutral-700/50"
                    >
                      <Icon size={14} className="shrink-0 text-neutral-400 dark:text-neutral-500" />
                      <span className="text-[13px] text-neutral-500 dark:text-neutral-400">{label}</span>
                      <span className="ml-auto text-[13px] font-semibold text-neutral-900 dark:text-neutral-50">
                        {value || '—'}
                      </span>
                    </div>
                  ))}
                </dl>
              </div>

              {token ? (
                <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-500/30 dark:bg-emerald-500/10">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                      <CheckCircle2 size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">You're signed in</p>
                      <p className="mt-0.5 text-sm text-emerald-700/80 dark:text-emerald-200/70">
                        Ready to order? Continue to your dashboard.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    Place Order <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Sign in to place an order</p>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    You can order this frame or book an eye exam after signing in.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                    >
                      Sign In <ArrowRight size={16} />
                    </Link>
                    {/* <Link
                      to="/register"
                      className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-900 dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-white"
                    >
                      Create an account
                    </Link> */}
                  </div>
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