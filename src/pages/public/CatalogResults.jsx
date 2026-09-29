import { SearchX } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import ProductListRow from '@/components/product/ProductListRow'

// Owns the three catalog states (loading, empty, populated) plus the grid/list
// switch, so PublicProductList stays focused on data and filtering.
export default function CatalogResults({
  loading,
  visible,
  hasMore,
  view,
  images,
  onSelect,
  onLoadMore,
  onClearAll,
}) {
  if (loading) {
    return (
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
    )
  }

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-300 bg-white/60 py-20 text-center dark:border-neutral-700 dark:bg-[#16271F]/40">
        <SearchX size={36} className="text-forest dark:text-leaf" />
        <p className="mt-4 font-sans font-semibold text-neutral-900 dark:text-neutral-100">No frames match</p>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Try removing a filter or two.</p>
        <button
          type="button"
          onClick={onClearAll}
          className="mt-5 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-deep"
        >
          Clear all filters
        </button>
      </div>
    )
  }

  // Each card animates on its own: one data-aos on the whole grid hides
  // every product as a single block, so a single missed measurement
  // leaves the entire page empty. Per-card triggers degrade gracefully.
  return (
    <>
      {view === 'list' ? (
        <div className="space-y-3">
          {visible.map((p, i) => (
            <div key={p.id} data-aos="fade-up" data-aos-delay={(i % 6) * 50}>
              <ProductListRow
                product={p}
                images={images[p.id]}
                onClick={() => onSelect(p)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p, i) => (
            <div key={p.id} data-aos="fade-up" data-aos-delay={(i % 6) * 50} className="h-full">
              <ProductCard
                product={p}
                images={images[p.id]}
                onClick={() => onSelect(p)}
              />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-full bg-forest px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-deep"
          >
            Load more frames
          </button>
        </div>
      )}
    </>
  )
}
