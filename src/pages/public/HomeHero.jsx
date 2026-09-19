import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CreditCard, Glasses, Server, ShieldCheck } from 'lucide-react'
import { getPublicProducts, getPublicAttachmentsByProduct } from '@/api/publicProductApi'
import { pickImage } from '@/components/product/ProductImage'
import { formatCurrency } from '@/utils/FormatCurrency'

const TRUST = [
  { icon: ShieldCheck, label: 'Board Certified Optometrists' },
  { icon: Server, label: 'Spring Boot REST Synced Inventory' },
  { icon: CreditCard, label: 'HSA/FSA Accepted' },
]

const formatPrice = (value) => formatCurrency(value)

function HeroFallbackArt() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-mist dark:bg-[#15261F]">
      <Glasses size={72} strokeWidth={1} className="text-leaf dark:text-forest" />
    </div>
  )
}

export default function HomeHero() {
  const [featuredProduct, setFeaturedProduct] = useState(null)
  const [featuredImage, setFeaturedImage] = useState('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const page = await getPublicProducts({ page: 0, size: 24, sort: 'createdAt,desc' })
        if (cancelled) return
        const items = page?.content || []
        if (items.length === 0) return
        const chosen = items[Math.floor(Math.random() * items.length)]
        if (cancelled) return
        setFeaturedProduct(chosen)
        const atts = await getPublicAttachmentsByProduct(chosen.id).catch(() => [])
        const img = pickImage(atts)
        if (!cancelled && img?.filePath) setFeaturedImage(img.filePath)
      } catch {
        // silently fail — the illustration art stays visible
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const inStock = featuredProduct?.quantity == null ? true : Number(featuredProduct.quantity) > 0

  return (
    <section className="bg-white py-14 transition-colors duration-300 md:py-20 dark:bg-[#0E1A15]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
            <span className="size-2 rounded-full bg-forest dark:bg-leaf" />
            Clinically Verified Precision Optics
          </p>

          <h1 className="mt-5 font-sans text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
            <span className="block text-ink dark:text-neutral-50">See Better.</span>
            <span className="block text-forest dark:text-leaf">Look Better.</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Handcrafted titanium and acetate frames, doctor-led eye exams and in-house lens
            coatings — fitted and aligned for a lifetime of clarity.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-deep"
            >
              Explore the Catalog
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-edge bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-forest hover:text-forest dark:border-neutral-700 dark:bg-transparent dark:text-neutral-200 dark:hover:text-leaf"
            >
              Request an Eye Exam
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                <Icon size={15} className="text-forest dark:text-leaf" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Hero image + floating product card */}
        <div className="relative">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-mist shadow-sm ring-1 ring-edge dark:bg-[#15261F] dark:ring-neutral-800">
            {imageError || !featuredImage ? (
              <HeroFallbackArt />
            ) : (
              <img
                src={featuredImage}
                alt={featuredProduct?.model ? `Featured ${featuredProduct.model} glasses` : 'Featured eyeglasses'}
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {featuredProduct && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl bg-white p-3 pr-4 shadow-xl ring-1 ring-edge sm:right-auto sm:pr-3 dark:bg-[#15261F] dark:ring-neutral-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mist dark:bg-[#1E332B]">
                {featuredImage && !imageError ? (
                  <img src={featuredImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Glasses size={22} className="text-leaf" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink dark:text-neutral-50">{featuredProduct.model}</p>
                <p className="text-sm font-bold text-forest dark:text-leaf">{formatPrice(featuredProduct.sale_price)}</p>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  <span className={`mr-1 inline-block size-1.5 rounded-full align-middle ${inStock ? 'bg-forest dark:bg-leaf' : 'bg-amber-500'}`} />
                  {inStock ? 'In Stock' : 'Low Stock'}
                </p>
              </div>
              <Link
                to={`/products/${featuredProduct.id}`}
                className="ml-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-forest text-white transition-colors hover:bg-forest-deep dark:bg-leaf dark:text-forest dark:hover:opacity-90"
                aria-label={`View ${featuredProduct.model}`}
              >
                <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}