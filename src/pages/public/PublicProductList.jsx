import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import HomeHeader from '@/pages/public/HomeHeader'
import HomeFooter from '@/pages/public/HomeFooter'
import ProductCard from '@/components/product/ProductCard'
import { getPublicProducts, getPublicAttachmentsByProduct } from '@/api/publicProductApi'

export default function PublicProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const params = { page: 0, size: 12, sort: 'createdAt,desc' }
        if (search.trim()) params.search = search.trim()
        const page = await getPublicProducts(params)
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
        console.error('PublicProductList: failed to load products:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [search])

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#111118] dark:text-neutral-200">
      <HomeHeader />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Our Optical Collection
            </p>
            <h1 className="font-sans font-semibold text-4xl text-neutral-900 dark:text-neutral-50">Products</h1>
          </div>

          <div className="relative max-w-sm md:w-72">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search frames, brands..."
              className="w-full rounded-full border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-800 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
<div key={i} className="animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  <div className="h-48 w-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-3 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-neutral-500 dark:text-neutral-400">
            {search ? 'No products match your search.' : 'Our collection is coming soon.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>

      <HomeFooter />
    </div>
  )
}
