import { useEffect, useState } from 'react'
import { getProducts } from '@/api/productApi'
import { getAttachmentsByProduct } from '@/api/attachmentApi'
import { useAuth } from '@/hook/UseAuth'
import { formatCurrency } from '@/utils/FormatCurrency'

const FILE_PATH_REGEX = /\.(jpg|jpeg|png|webp|avif)([?#]|$)/i

function pickImage(attachments) {
  const list = Array.isArray(attachments) ? attachments : []
  return (
    list.find((a) => a?.fileType?.startsWith('image/') && a?.filePath) ||
    list.find((a) => a?.filePath && FILE_PATH_REGEX.test(a.filePath)) ||
    list.find((a) => a?.filePath) ||
    null
  )
}

function GlassesFallback() {
  return (
    <svg className="absolute inset-0 m-auto" width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#a09a8e" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translate(-50%,-50%)', top: '50%', left: '50%' }}>
      <circle cx="6" cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      <path d="M14 15a2 2 0 0 0-4 0" />
      <path d="M2.5 13L5 7c.7-1.3 2-2 3.5-2h7c1.5 0 2.8.7 3.5 2l2.5 6" />
    </svg>
  )
}

function NewArrivals() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    const load = async () => {
      try {
        const page = await getProducts({ page: 0, size: 4, sort: 'createdAt,desc' })
        const items = page?.content || []
        if (cancelled) return
        setProducts(items)

        const imageResults = await Promise.all(
          items.map((p) => getAttachmentsByProduct(p.id).catch(() => []))
        )
        if (cancelled) return

        const imgMap = {}
        items.forEach((p, i) => {
          const att = pickImage(imageResults[i])
          if (att?.filePath) imgMap[p.id] = att.filePath
        })
        setImages(imgMap)
      } catch (err) {
        console.error('NewArrivals: failed to load products:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [token])

  return (
    <section id="frames" className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Spring/Summer 2025 · New Optical Arrivals
          </p>
          <h2 className="font-serif text-4xl text-neutral-900 dark:text-neutral-50">New Arrivals</h2>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500 dark:text-neutral-400">
          {token ? 'No products available yet.' : 'Sign in to see our latest arrivals.'}
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article key={p.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-neutral-800 dark:ring-neutral-700 dark:hover:shadow-neutral-900/50">
              <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-700">
                {images[p.id] ? (
                  <img
                    src={images[p.id]}
                    alt={p.model}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <GlassesFallback />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-lg text-neutral-900 dark:text-neutral-50">{p.model}</h3>
                <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                  {[p.material, p.color, p.category].filter(Boolean).join(' · ')}
                </p>
                <div className="mt-auto pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                      {formatCurrency(p.sale_price)}
                    </span>
                  </div>
                  <button className="mt-4 w-full rounded-full border border-neutral-300 py-2 text-sm font-medium text-neutral-800 transition-colors duration-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900">
                    Try On / Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default NewArrivals
