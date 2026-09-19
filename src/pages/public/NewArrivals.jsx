import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/product/ProductCard'
import { getPublicProducts, getPublicAttachmentsByProduct } from '@/api/publicProductApi'

function NewArrivals() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const page = await getPublicProducts({ page: 0, size: 4, sort: 'createdAt,desc' })
        const items = page?.content || []
        if (cancelled) return
        setProducts(items)

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
      } catch (err) {
        console.error('NewArrivals: failed to load products:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section id="frames" className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              New Optical Arrivals
            </p>
          <h2 className="font-sans font-semibold text-4xl text-neutral-900 dark:text-neutral-50">New Arrivals</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="self-start text-sm font-medium text-neutral-800 underline underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white md:self-auto"
        >
          View all products →
        </button>
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
          Our latest arrivals are coming soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              images={images[p.id]}
              onClick={() => navigate(`/products/${p.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default NewArrivals
