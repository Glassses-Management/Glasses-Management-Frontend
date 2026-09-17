import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pickImage } from '@/components/product/ProductImage'
import CustomerRequestModal from '@/components/request/CustomerRequestModal'
import { getPublicProducts, getPublicAttachmentsByProduct } from '@/api/publicProductApi'

const FEATURE_PILLS = [
  'Precision Fitting',
  'UV Protection',
  'Frame Adjustments',
]

export default function HomeHero() {
  const navigate = useNavigate()
  const [featuredProduct, setFeaturedProduct] = useState(null)
  const [featuredImage, setFeaturedImage] = useState('')
  const [imageError, setImageError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const page = await getPublicProducts({ page: 0, size: 1, sort: 'createdAt,desc' })
        if (cancelled) return
        const products = page?.content || []
        if (products.length > 0) {
          setFeaturedProduct(products[0])
        }
      } catch {
        // silently fail — hero will show fallback
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!featuredProduct) return
    let cancelled = false
    const loadImage = async () => {
      try {
        const atts = await getPublicAttachmentsByProduct(featuredProduct.id)
        if (!cancelled) {
          const img = pickImage(atts)
          if (img?.filePath) setFeaturedImage(img.filePath)
        }
      } catch {
        // silently fail
      }
    }
    void loadImage()
    return () => { cancelled = true }
  }, [featuredProduct])

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-8 pb-6 md:px-6 md:pt-14 md:pb-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Couture Optical Eyewear · Est. 1988
          </p>
          <h1 className="font-sans font-semibold text-4xl leading-[1.05] text-neutral-900 md:text-5xl dark:text-neutral-50">
            Precision Optics.
            <br />
            <span className="italic">Timeless Design.</span>
          </h1>
          <p className="mt-5 max-w-md text-neutral-600 dark:text-neutral-400">
            Handcrafted frames and medical-grade lenses, fitted and aligned by our
            optometrists so every pair feels effortless from the first wear.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#8fa88f] px-6 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Explore Collection
            </a>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-full border border-neutral-300 bg-transparent px-6 py-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-white/5"
            >
              Request an Eye Exam
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Trusted optical care since 1988
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs sm:max-w-md">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f7f5f0] shadow-sm ring-1 ring-neutral-200 transition-colors duration-300 dark:bg-neutral-800 dark:ring-neutral-700">
            {imageError || !featuredImage ? (
              <div className="flex h-full w-full items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#a89f91" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="15" r="4" />
                  <circle cx="18" cy="15" r="4" />
                  <path d="M14 15a2 2 0 0 0-4 0" />
                  <path d="M2.5 13L5 7c.7-1.3 2-2 3.5-2h7c1.5 0 2.8.7 3.5 2l2.5 6" />
                </svg>
              </div>
            ) : (
              <img
                src={featuredImage}
                alt={featuredProduct?.model ? `Featured ${featuredProduct.model} glasses` : 'Featured eyeglasses'}
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-900/90 dark:text-neutral-300">
              Featured
            </div>
          </div>

          <div
            className="absolute bottom-4 right-4 w-52 cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-neutral-800 dark:ring-neutral-700"
            onClick={() => featuredProduct && navigate(`/products/${featuredProduct.id}`)}
            onKeyDown={(e) => { if (e.key === 'Enter' && featuredProduct) navigate(`/products/${featuredProduct.id}`) }}
            role="link"
            tabIndex={featuredProduct ? 0 : -1}
            aria-label={featuredProduct ? `View ${featuredProduct.model} details` : undefined}
          >
            {featuredProduct ? (
              <>
                <p className="text-[11px] uppercase tracking-wide text-neutral-400">
                  {featuredProduct.category || 'Eyewear'}
                </p>
                <p className="mt-1 truncate font-sans font-semibold text-base text-neutral-900 dark:text-neutral-50">
                  {featuredProduct.model}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    {featuredProduct.sale_price != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Number(featuredProduct.sale_price)) : ''}
                  </span>
                  <span className="text-xs font-medium text-[#8fa88f] transition-colors group-hover:text-[#6f8a6f]">
                    View Details →
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-2">
                <span className="text-sm text-neutral-400">Loading featured frame…</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-start gap-2.5 lg:col-span-2 lg:justify-center">
          {FEATURE_PILLS.map((b) => (
            <span key={b} className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {b}
            </span>
          ))}
        </div>
      </section>

      <CustomerRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
