import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { getPublicProducts, getPublicAttachmentsByProduct } from '@/api/publicProductApi'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'titanium', label: 'Titanium' },
]

const genderOf = (p) => p.gender || 'unisex'
const isTitanium = (p) => /titanium/i.test(p.material || '')

function matchesTab(p, tab) {
  if (tab === 'all') return true
  if (tab === 'titanium') return isTitanium(p)
  return genderOf(p) === tab
}

export default function HomeFeatured() {
  const navigate = useNavigate()
  const [pool, setPool] = useState([])
  const [images, setImages] = useState({})
  const [tab, setTab] = useState('all')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const page = await getPublicProducts({ page: 0, size: 8, sort: 'createdAt,desc' })
        const items = (Array.isArray(page) ? page : (page?.content || [])).filter((p) => p.id > 0)
        if (cancelled) return
        setPool(items.slice(0, 8))
        const imageResults = await Promise.all(
          items.map((p) => getPublicAttachmentsByProduct(p.id).catch(() => []))
        )
        if (cancelled) return
        const imgMap = {}
        items.forEach((p, i) => {
          const paths = (imageResults[i] || [])
            .filter((a) => a?.filePath && (a?.fileType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif)([?#]|$)/i.test(a.filePath)))
            .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
            .map((a) => a.filePath)
          if (paths.length) imgMap[p.id] = paths
        })
        setImages(imgMap)
      } catch {
        // fall back to the demo frames already in state
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const shown = useMemo(() => pool.filter((p) => matchesTab(p, tab)).slice(0, 8), [pool, tab])

  return (
    <section className="bg-white py-16 transition-colors duration-300 md:py-20 dark:bg-[#0E1A15]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-forest px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                Featured Catalog
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                <RefreshCw size={12} className="text-forest dark:text-leaf" />
                Live · Synced with Spring Boot REST
              </span>
            </div>
            <h2 className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
              Featured frames, glazed &amp; ready
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {TABS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                aria-pressed={tab === value}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === value
                    ? 'bg-forest text-white'
                    : 'border border-edge bg-white text-ink hover:border-forest hover:text-forest dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:hover:text-leaf'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              images={images[p.id]}
              onClick={() => navigate(`/products/${p.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}