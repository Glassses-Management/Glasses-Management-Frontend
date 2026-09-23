import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, Circle, Gauge, Heart, Hexagon,
  Layers, RotateCw, ShieldCheck, ShoppingCart, Square, Star, Triangle,
  Truck, Weight, ZoomIn, ZoomOut,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import HomeFooter from '@/pages/public/HomeFooter'
import { GlassesFallback } from '@/components/product/ProductImage'
import { getPublicProductById, getPublicAttachmentsByProduct } from '@/api/publicProductApi'
import { formatCurrency } from '@/utils/FormatCurrency'
import { useCart } from '@/hook/UseCart'
import { useToast } from '@/hook/UseToast'

const card = 'rounded-2xl bg-white ring-1 ring-neutral-200/60 transition-colors duration-300 dark:bg-[#16271F] dark:ring-neutral-800'
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.25em] text-forest dark:text-leaf'
const muted = 'text-neutral-500 dark:text-neutral-400'
const cta = 'inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-forest-deep dark:bg-leaf dark:text-forest dark:hover:opacity-90'
const softBtn = 'inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-600 ring-1 ring-neutral-200 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:bg-[#16271F] dark:text-neutral-300 dark:ring-neutral-700 dark:hover:bg-white/10'

const FINISHES = [
  { label: 'Matte Gold', swatch: '#c8a96a' },
  { label: 'Graphite', swatch: '#3a3f47' },
  { label: 'Gunmetal', swatch: '#6e7480' },
  { label: 'Burgundy', swatch: '#7a3b3b' },
]

const GEOMETRIES = [
  { label: 'Round', icon: Circle },
  { label: 'Rectangle', icon: Square },
  { label: 'Flat Top', icon: Triangle },
  { label: 'Hexagonal', icon: Hexagon },
]

const LENS_TYPES = ['Single Vision', 'Progressive', 'Blue Light']

const STAT_CHIPS = [
  { icon: Weight, value: '17g', label: 'Frame Weight' },
  { icon: Gauge, value: '±0.3mm', label: 'Lens Seat Tolerance' },
  { icon: Layers, value: '1.60', label: 'Material Index' },
]

const FEATURES = [
  {
    n: '01', icon: Gauge, title: 'Hand-Polished Acetate',
    desc: 'Blocks are cut, tumbled and polished for 14 days so every edge carries an even, featherlight finish.',
  },
  {
    n: '02', icon: Circle, title: 'Deckled Rim Geometry',
    desc: 'The lens groove is CNC-milled to a ±0.3mm seat so thick prescriptions sit flush without visible edge.',
  },
  {
    n: '03', icon: ShieldCheck, title: 'Low-Stress Hinge Mount',
    desc: 'Five-barrel hinges are torque-screwed by hand and cycled 10,000 times before the frame ships.',
  },
]

const DIMENSIONS = [
  { value: '137', label: 'Lens Width' },
  { value: '19', label: 'Bridge' },
  { value: '145', label: 'Temple Length' },
  { value: '52', label: 'Lens Height' },
  { value: '17g', label: 'Total Weight' },
]

const TRUST_ROWS = [
  { icon: Truck, title: 'Free Express Shipping', sub: '3–5 day door-to-door' },
  { icon: ShieldCheck, title: '2-Year Calibration Warranty', sub: 'Lens alignment & coating' },
  { icon: BadgeCheck, title: '30-Day Fit Guarantee', sub: 'Free reshape or swap' },
]

function ProductThumb({ src, alt, active, onClick }) {
  const [failed, setFailed] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${alt}`}
      className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${active ? 'ring-forest dark:ring-leaf' : 'ring-neutral-200 opacity-75 hover:opacity-100 dark:ring-neutral-700'}`}
    >
      {src && !failed ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} className="h-full w-full bg-white object-cover" />
      ) : (
        <GlassesFallback className="h-full w-full" />
      )}
    </button>
  )
}

function OptionRows({ num, title, helper, selected, onSelect, children }) {
  return (
    <fieldset className="mt-7 border-t border-neutral-100 pt-5 dark:border-neutral-800">
      <legend className="flex w-full items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest dark:bg-leaf/10 dark:text-leaf">{num}</span>
          {title}
        </span>
        {helper && <span className="text-xs text-neutral-400 dark:text-neutral-500">{helper}</span>}
      </legend>
      <div className="mt-3 flex flex-wrap items-center gap-3">{children({ selected, onSelect })}</div>
    </fieldset>
  )
}

export default function PublicProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { success: toastSuccess } = useToast()
  const [product, setProduct] = useState(null)
  const [images, setImages] = useState([])
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(true)
  const [zoomed, setZoomed] = useState(false)
  const [rotated, setRotated] = useState(0)
  const [liked, setLiked] = useState(false)
  const [finish, setFinish] = useState(FINISHES[0].label)
  const [geometry, setGeometry] = useState(GEOMETRIES[0].label)
  const [lensType, setLensType] = useState(LENS_TYPES[0])

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

  const handleAdd = () => {
    addItem(product, 1)
    toastSuccess(`${product.model} added to cart.`)
  }

  const rating = product?.rating ?? 4.8
  const reviews = product?.reviewCount ?? 124
  const monthly = Math.max(4, Math.round((Number(product?.sale_price) || 0) / 12))

  return (
    <div className="min-h-screen bg-mist-soft font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-forest dark:text-neutral-400 dark:hover:text-leaf"
        >
          <ArrowLeft size={16} /> Continue shopping
        </button>

        {loading ? (
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-neutral-200/60 dark:bg-neutral-800" />
            <div className="space-y-5 py-4">
              <div className="h-4 w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-1/2 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-24 w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-20 w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        ) : !product ? (
          <div className="py-16 text-center">
            <p className={muted}>Product not found.</p>
            <Link to="/products" className="mt-4 inline-block text-sm font-medium text-forest underline dark:text-leaf">
              Back to products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              {/* Left — gallery */}
              <div className="min-w-0" data-aos="fade-right">
                <div className={`${card} overflow-hidden rounded-3xl`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    {images[active] ? (
                      <img
                        src={images[active]}
                        alt={product.model}
                        className="h-full w-full object-cover transition-transform duration-300 ease-out"
                        style={{ transform: `rotate(${rotated}deg) scale(${zoomed ? 1.6 : 1})` }}
                      />
                    ) : (
                      <GlassesFallback className="absolute inset-0" />
                    )}
                    <div className="absolute right-4 top-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setZoomed((z) => !z)}
                        aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
                        className={softBtn}
                      >
                        {zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRotated((r) => (r + 90) % 360)}
                        aria-label="Rotate image"
                        className={softBtn}
                      >
                        <RotateCw size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                    {images.slice(0, 4).map((img, i) => (
                      <ProductThumb key={i} src={img} alt={`${product.model} view ${i + 1}`} active={active === i} onClick={() => setActive(i)} />
                    ))}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {STAT_CHIPS.map(({ icon: Icon, value, label }) => (
                    <div key={label} className={`${card} flex flex-col items-start gap-1 p-3.5`}>
                      <Icon size={16} className="text-forest dark:text-leaf" />
                      <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{value}</p>
                      <p className="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — purchase panel */}
              <div className="min-w-0 py-1" data-aos="fade-left">
                <div className="flex items-start justify-between gap-4">
                  <p className={`${eyebrow} pt-1`}>{product.category || 'Eyewear'}</p>
                  <p className="text-right text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-semibold text-forest dark:text-leaf">In Stock</span>
                    <br />Batch #24B · Lens-ready
                  </p>
                </div>

                <h1 className="mt-3 font-sans font-semibold text-3xl leading-[1.05] text-neutral-900 md:text-4xl dark:text-neutral-50">
                  {product.model}
                </h1>

                <div className="mt-2.5 flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-0.5 text-amber-400" aria-label={`Rated ${rating} out of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={14} className={n <= Math.round(rating) ? 'fill-amber-400' : 'text-neutral-300 dark:text-neutral-600'} />
                    ))}
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-50">{rating}</span>
                  <span className={muted}>({reviews} verified reviews)</span>
                </div>

                <p className={`mt-3 text-sm ${muted}`}>
                  {product.brand || 'Optical'} frame with titanium-free polish and a featherlight deckled rim.
                </p>

                <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {formatCurrency(product.sale_price)}
                  </p>
                  <p className={`text-xs ${muted}`}>
                    or as low as <span className="font-semibold text-neutral-900 dark:text-neutral-50">${monthly}/mo</span> with flexible financing
                  </p>
                </div>

                <OptionRows num={1} title="Frame Finish" helper="4 tints" selected={finish} onSelect={setFinish}>
                  {({ selected, onSelect }) => FINISHES.map((f) => (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => onSelect(f.label)}
                      aria-label={f.label}
                      aria-pressed={selected === f.label}
                      title={f.label}
                      className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium ring-1 transition-colors ${
                        selected === f.label
                          ? 'bg-forest/5 text-neutral-900 ring-forest dark:bg-leaf/10 dark:text-neutral-50 dark:ring-leaf'
                          : 'text-neutral-500 ring-neutral-200 hover:ring-neutral-300 dark:text-neutral-400 dark:ring-neutral-700 dark:hover:ring-neutral-500'
                      }`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: f.swatch }}>
                        {selected === f.label && <Check size={12} className="text-white" />}
                      </span>
                      {f.label}
                    </button>
                  ))}
                </OptionRows>

                <OptionRows num={2} title="Lens Geometry" helper="Custom" selected={geometry} onSelect={setGeometry}>
                  {({ selected, onSelect }) => GEOMETRIES.map((g) => {
                    const Icon = g.icon
                    return (
                      <button
                        key={g.label}
                        type="button"
                        onClick={() => onSelect(g.label)}
                        aria-pressed={selected === g.label}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ring-1 transition-colors ${
                          selected === g.label
                            ? 'bg-forest text-white ring-forest dark:bg-leaf dark:text-forest dark:ring-leaf'
                            : 'bg-white text-neutral-600 ring-neutral-200 hover:ring-neutral-300 dark:bg-[#16271F] dark:text-neutral-300 dark:ring-neutral-700 dark:hover:ring-neutral-500'
                        }`}
                      >
                        <Icon size={15} />
                        {g.label}
                      </button>
                    )
                  })}
                </OptionRows>

                <OptionRows num={3} title="Lens Type" helper="Rx-ready" selected={lensType} onSelect={setLensType}>
                  {({ selected, onSelect }) => LENS_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onSelect(t)}
                      aria-pressed={selected === t}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ring-1 transition-colors ${
                        selected === t
                          ? 'bg-forest text-white ring-forest dark:bg-leaf dark:text-forest dark:ring-leaf'
                          : 'bg-white text-neutral-600 ring-neutral-200 hover:ring-neutral-300 dark:bg-[#16271F] dark:text-neutral-300 dark:ring-neutral-700 dark:hover:ring-neutral-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </OptionRows>

                <div className="mt-8 flex items-center gap-3">
                  <button type="button" onClick={handleAdd} className={`${cta} flex-1`}>
                    <ShoppingCart size={16} /> Configure Lenses &amp; Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiked((l) => !l)}
                    aria-pressed={liked}
                    aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`${softBtn} h-12 w-12 ${liked ? 'text-red-500 ring-red-300 dark:text-red-400 dark:ring-red-500/40' : ''}`}
                  >
                    <Heart size={18} className={liked ? 'fill-red-500' : ''} />
                  </button>
                </div>

                <p className="mt-4 text-center">
                  <Link to="/contact" className="text-sm font-medium text-forest underline-offset-4 transition-colors hover:underline dark:text-leaf">
                    Book In-Person Fitting
                  </Link>
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {TRUST_ROWS.map(({ icon: Icon, title, sub }) => (
                    <div key={title} className={`${card} flex flex-col items-center gap-1 p-3 text-center`}>
                      <Icon size={17} className="text-forest dark:text-leaf" />
                      <p className="text-xs font-semibold leading-tight text-neutral-900 dark:text-neutral-50">{title}</p>
                      <p className="text-[11px] leading-tight text-neutral-400 dark:text-neutral-500">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Craft Architecture */}
            <section className="mt-20 text-center" data-aos="fade-up">
              <p className={eyebrow}>Craft Architecture</p>
              <h2 className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
                Built for daily <span className="italic text-forest dark:text-leaf">wear</span>
              </h2>
              <p className={`mx-auto mt-3 max-w-xl text-sm ${muted}`}>
                Every Optic Shop frame passes the same 38-step bench protocol before it reaches a showcase.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-3" data-aos="fade-up" data-aos-delay="150">
                {FEATURES.map((f) => {
                  const Icon = f.icon
                  return (
                    <div key={f.n} className={`${card} p-6 text-left`}>
                      <div className="flex items-center justify-between">
                        <span className={`${eyebrow}`}>{f.n}</span>
                        <Icon size={18} className="text-forest dark:text-leaf" />
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-50">{f.title}</h3>
                      <p className={`mt-1.5 text-sm leading-relaxed ${muted}`}>{f.desc}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Dimensional matrix */}
            <section className={`${card} mt-16 flex flex-col gap-6 rounded-3xl p-8 lg:flex-row lg:items-center lg:justify-between`} data-aos="fade-up">
              <div className="min-w-0">
                <p className={eyebrow}>Dimensional Matrix</p>
                <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">Technical Specifications</h3>
                <p className={`mt-1 text-xs ${muted}`}>Measurements refer to the finished frame; tolerances ±0.5mm.</p>
              </div>
              <div className="grid w-full max-w-2xl grid-cols-5 gap-4">
                {DIMENSIONS.map((d) => (
                  <div key={d.label} className="text-center">
                    <p className="text-xl font-bold text-forest dark:text-leaf">{d.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{d.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-12 flex justify-center" data-aos="fade-up">
              <Link to="/products" className="inline-flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-deep dark:bg-leaf dark:text-forest dark:hover:opacity-90">
                Explore the Collection <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>

      <HomeFooter />
    </div>
  )
}