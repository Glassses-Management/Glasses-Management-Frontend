import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlarmClock, BadgeCheck, ChevronRight, Sparkles, Star, ShieldCheck } from 'lucide-react'
import { getPublicProducts, getPublicAttachmentsByProduct } from '@/api/publicProductApi'
import { pickImage } from '@/components/product/ProductImage'

const BADGES = [
  { icon: BadgeCheck, label: 'Doctor-Led Eyecare' },
  { icon: Sparkles, label: 'Bespoke Dispensary Concierge' },
]

const TRUST = [
  {
    icon: AlarmClock,
    title: 'Fast response',
    text: 'We reply to every inquiry within one business day.',
  },
  {
    icon: ShieldCheck,
    title: 'Encrypted & secure',
    text: 'Your prescriptions and health details stay private and secure.',
  },
  {
    icon: Star,
    title: 'Complimentary service',
    text: 'In-house adjustments and ultrasonic cleaning are always on us.',
  },
]

// Inline illustration shown while a random product image is loading.
function HeroArt() {
  return (
    <svg viewBox="0 0 560 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Stylised optical clinic illustration">
      <defs>
        <linearGradient id="contactHeroGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1F5F2" />
          <stop offset="1" stopColor="#E3ECE6" />
        </linearGradient>
      </defs>
      <rect width="560" height="420" fill="url(#contactHeroGrad)" />
      <circle cx="470" cy="70" r="130" fill="#FFFFFF" opacity="0.5" />
      <circle cx="60" cy="380" r="110" fill="#FFFFFF" opacity="0.4" />

      {/* lenses */}
      <circle cx="205" cy="215" r="80" fill="#FFFFFF" opacity="0.55" stroke="#8FC0A5" strokeWidth="7" />
      <circle cx="355" cy="215" r="80" fill="#FFFFFF" opacity="0.55" stroke="#8FC0A5" strokeWidth="7" />
      {/* lens highlights */}
      <path d="M170 185 a55 55 0 0 1 30 -25" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
      <path d="M320 185 a55 55 0 0 1 30 -25" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
      {/* bridge + temples */}
      <path d="M285 208 h -10" stroke="#8FC0A5" strokeWidth="7" strokeLinecap="round" />
      <path d="M125 208 L 72 168" stroke="#8FC0A5" strokeWidth="7" strokeLinecap="round" />
      <path d="M435 208 L 488 168" stroke="#8FC0A5" strokeWidth="7" strokeLinecap="round" />

      {/* scan ring */}
      <circle cx="280" cy="215" r="128" fill="none" stroke="#8FC0A5" strokeWidth="1.5" strokeDasharray="5 8" opacity="0.45" />
      <path d="M280 215 m -4 0 a4 4 0 1 1 8 0 a4 4 0 1 1 -8 0" fill="#8FC0A5" />

      {/* decorative refractions */}
      <path d="M180 300 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#1B3B2F" />
      <path d="M405 315 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" fill="#1B3B2F" opacity="0.85" />
      <path d="M470 250 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#1B3B2F" opacity="0.6" />
    </svg>
  )
}

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Number(value))

function Eyebrow({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
      {children}
    </p>
  )
}

export default function ContactHero() {
  const navigate = useNavigate()
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
        // silently fail — hero keeps the placeholder art
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  return (
    <section className="pt-4 pb-14 md:pt-8 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
          <Link to="/" className="transition-colors hover:text-forest dark:hover:text-leaf">Home</Link>
          <ChevronRight size={14} className="text-neutral-300 dark:text-neutral-600" />
          <span className="text-neutral-900 dark:text-neutral-100">Contact &amp; Clinic Concierge</span>
        </nav>

        {/* Badge row */}
        <div className="mt-6 flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="0">
          {BADGES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              <Icon size={14} className="text-forest dark:text-leaf" />
              {label}
            </span>
          ))}
        </div>

        {/* Hero */}
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
          <div data-aos="fade-left" data-aos-delay="100">
            <Eyebrow>Contact &amp; Clinic Concierge</Eyebrow>
            <h1 className="mt-4 font-sans font-semibold text-4xl leading-[1.05] text-neutral-900 md:text-5xl dark:text-neutral-50">
              Personal eyecare and a truly{' '}
              <span className="italic underline decoration-leaf/70 decoration-4 underline-offset-4">bespoke dispensary</span>
            </h1>
            <p className="mt-5 max-w-xl text-neutral-600 dark:text-neutral-400">
              Book a consultation, ask our dispensary about lens and frame fittings, or have your eyewear
              ultrasonically cleaned while you wait. Our concierge team coordinates exams, lab work and fittings
              under one roof.
            </p>
            <a
              href="#inquiry"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-forest-deep"
            >
              Talk to our concierge
            </a>
          </div>

          <div data-aos="fade-right" data-aos-delay="100" className="relative mx-auto w-full max-w-xs sm:max-w-md">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-mist shadow-sm ring-1 ring-neutral-200 transition-colors duration-300 dark:bg-[#15261F] dark:ring-neutral-800">
              {imageError || !featuredImage ? (
                <HeroArt />
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
              className="absolute bottom-4 right-4 w-56 cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-[#15261F] dark:ring-neutral-800"
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
                      {featuredProduct.sale_price != null ? formatPrice(featuredProduct.sale_price) : ''}
                    </span>
                    <span className="text-xs font-medium text-forest dark:text-leaf">View Details →</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-2">
                  <span className="text-sm text-neutral-400">Loading featured frame…</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-14 grid gap-8 border-t border-neutral-200 pt-8 sm:grid-cols-3 dark:border-neutral-800">
          {TRUST.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="flex items-start gap-3" data-aos="fade-up" data-aos-delay={`${(i + 1) * 100}`}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}