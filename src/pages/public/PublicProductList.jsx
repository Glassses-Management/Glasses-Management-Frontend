import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchX, X } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import HomeFooter from '@/pages/public/HomeFooter'
import ProductCard from '@/components/product/ProductCard'
import CatalogHeader from '@/pages/public/CatalogHeader'
import CatalogToolbar from '@/pages/public/CatalogToolbar'
import CatalogSidebar from '@/pages/public/CatalogSidebar'
import { getPublicProducts, getPublicAttachmentsByProduct } from '@/api/publicProductApi'
import {
  LENS_OPTIONS,
  STOCK_OPTIONS,
  applyFilters,
  applySort,
  buildFacetCounts,
  buildFacetOptions,
  fallbackCatalog,
} from '@/pages/public/CatalogData'
import { formatCurrency } from '@/utils/FormatCurrency'

const PAGE_SIZE = 12

const INITIAL_FILTERS = {
  categories: [],
  materials: [],
  geometries: [],
  price: { min: null, max: null },
  lens: 'all',
  stock: 'all',
  search: '',
  sort: 'featured',
  view: 'grid',
}

export default function PublicProductList() {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState([])
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const all = []
        for (let pageIdx = 0; pageIdx < 3; pageIdx += 1) {
          const page = await getPublicProducts({ page: pageIdx, size: 100, sort: 'createdAt,desc' }).catch(() => null)
          const content = page?.content || []
          if (cancelled || content.length === 0) break
          all.push(...content)
          if (pageIdx + 1 >= (page?.totalPages ?? 1)) break
        }
        if (cancelled) return
        const merged = fallbackCatalog(all)
        setCatalog(merged)

        const imageResults = await Promise.all(
          merged.map((p) => p.id > 0 ? getPublicAttachmentsByProduct(p.id).catch(() => []) : Promise.resolve([]))
        )
        if (cancelled) return
        const imgMap = {}
        merged.forEach((p, i) => {
          const paths = (imageResults[i] || [])
            .filter((a) => a?.filePath && (a?.fileType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif)([?#]|$)/i.test(a.filePath)))
            .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
            .map((a) => a.filePath)
          if (paths.length) imgMap[p.id] = paths
        })
        setImages(imgMap)
      } catch {
        if (!cancelled) setCatalog(fallbackCatalog([]))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Reset pagination to the first page whenever the active filters change.
  // Done during render (React-sanctioned state adjustment) to avoid an effect.
  const filterKey = JSON.stringify(filters)
  const [resetKey, setResetKey] = useState(filterKey)
  if (resetKey !== filterKey) {
    setResetKey(filterKey)
    setVisibleCount(PAGE_SIZE)
  }

  const { categories, materials, priceBounds } = useMemo(() => buildFacetOptions(catalog), [catalog])
  const counts = useMemo(() => buildFacetCounts(catalog), [catalog])

  const filtered = useMemo(() => applyFilters(catalog, filters), [catalog, filters])
  const sorted = useMemo(() => applySort(filtered, filters.sort), [filtered, filters.sort])
  const visible = sorted.slice(0, visibleCount)

  const priceDisplay = {
    min: filters.price.min ?? priceBounds.min,
    max: filters.price.max ?? priceBounds.max,
  }

  const toggleIn = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }))

  const toggleCategory = (v) => toggleIn('categories', v)
  const toggleMaterial = (v) => toggleIn('materials', v)
  const toggleGeometry = (v) => toggleIn('geometries', v)
  const setLens = (lens) => setFilters((f) => ({ ...f, lens }))
  const setStock = (stock) => setFilters((f) => ({ ...f, stock }))
  const setPrice = (price) => setFilters((f) => ({ ...f, price }))
  const setSearch = (search) => setFilters((f) => ({ ...f, search }))
  const setSort = (sort) => setFilters((f) => ({ ...f, sort }))
  const setView = (view) => setFilters((f) => ({ ...f, view }))

  const clearAll = () =>
    setFilters((f) => ({
      ...f,
      categories: [],
      materials: [],
      geometries: [],
      price: { min: null, max: null },
      lens: 'all',
      stock: 'all',
      search: '',
    }))

  const priceSet = filters.price.min != null || filters.price.max != null
  const chips = [
    ...filters.categories.map((c) => ({ label: c, onRemove: () => toggleCategory(c) })),
    ...filters.materials.map((m) => ({ label: m, onRemove: () => toggleMaterial(m) })),
    ...filters.geometries.map((g) => ({ label: g, onRemove: () => toggleGeometry(g) })),
    ...(priceSet
      ? [{ label: `${formatCurrency(priceDisplay.min)} – ${formatCurrency(priceDisplay.max)}`, onRemove: () => setPrice({ min: null, max: null }) }]
      : []),
    ...(filters.lens !== 'all'
      ? [{ label: LENS_OPTIONS.find((o) => o.value === filters.lens)?.label, onRemove: () => setLens('all') }]
      : []),
    ...(filters.stock !== 'all'
      ? [{ label: STOCK_OPTIONS.find((o) => o.value === filters.stock)?.label, onRemove: () => setStock('all') }]
      : []),
  ].filter((c) => c.label)

  const groupProps = {
    categories,
    categoryCounts: counts.categories,
    selectedCategories: filters.categories,
    toggleCategory,
    materials,
    materialCounts: counts.materials,
    selectedMaterials: filters.materials,
    toggleMaterial,
    geometryCounts: counts.geometries,
    selectedGeometries: filters.geometries,
    toggleGeometry,
    priceBounds,
    price: priceDisplay,
    onPriceChange: setPrice,
    lens: filters.lens,
    setLens,
    lensCounts: counts.lens,
    stock: filters.stock,
    setStock,
    stockCounts: counts.stock,
  }

  const sidebar = (
    <CatalogSidebar
      search={filters.search}
      onSearchChange={setSearch}
      hasActive={chips.length > 0}
      onClearAll={clearAll}
      chips={chips}
      groupProps={groupProps}
    />
  )

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <Navbar />

      <CatalogHeader totalCount={catalog.length} shownCount={filtered.length} />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pt-10">
        <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <aside className="sticky top-24 hidden lg:block">
            {sidebar}
          </aside>

          {/* Mobile drawer */}
          <div
            className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            aria-hidden={!drawerOpen}
          >
            <div
              className={`absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setDrawerOpen(false)}
            />
            <div
              className={`absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-white p-4 shadow-xl transition-transform duration-300 dark:bg-[#0E1A15] ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-sans font-semibold text-neutral-900 dark:text-neutral-50">Filters</p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-white/10"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
              {sidebar}
            </div>
          </div>

          {/* Main content */}
          <div>
            <CatalogToolbar
              shownStart={visible.length === 0 ? 0 : 1}
              shownEnd={visible.length}
              total={sorted.length}
              sort={filters.sort}
              onSortChange={setSort}
              view={filters.view}
              onViewChange={setView}
              onOpenFilters={() => setDrawerOpen(true)}
            />

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-neutral-100 dark:bg-[#16271F]">
                    <div className="aspect-[4/3] rounded-2xl bg-neutral-200 dark:bg-[#1E332B]" />
                    <div className="space-y-3 p-4">
                      <div className="h-3 w-1/3 rounded bg-neutral-200 dark:bg-[#1E332B]" />
                      <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-[#1E332B]" />
                      <div className="h-3 w-1/4 rounded bg-neutral-200 dark:bg-[#1E332B]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-300 bg-white/60 py-20 text-center dark:border-neutral-700 dark:bg-[#16271F]/40">
                <SearchX size={36} className="text-forest dark:text-leaf" />
                <p className="mt-4 font-sans font-semibold text-neutral-900 dark:text-neutral-100">No frames match</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Try removing a filter or two.</p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-5 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-deep"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className={filters.view === 'list' ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'}>
                  {visible.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      images={images[p.id]}
                      onClick={() => navigate(`/products/${p.id}`)}
                    />
                  ))}
                </div>
                {visibleCount < sorted.length && (
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                      className="rounded-full bg-forest px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-deep"
                    >
                      Load more frames
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  )
}