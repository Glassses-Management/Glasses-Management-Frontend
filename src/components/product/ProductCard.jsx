import ProductImage from '@/components/product/ProductImage'
import { formatCurrency } from '@/utils/FormatCurrency'

function ProductCard({ product, imageSrc, onClick }) {
  if (!product) return null

  return (
    <article
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-neutral-800/90 dark:ring-neutral-700 dark:hover:shadow-neutral-900/50"
    >
      {/* Product Image & Category Badge */}
      <div className="relative">
        <ProductImage src={imageSrc} alt={product.model} />
        {product.category && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-neutral-700 shadow-xs backdrop-blur-xs dark:bg-neutral-900/90 dark:text-neutral-300">
            {product.category}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          {product.brand || 'Optical Frame'}
        </p>

        <h3
          className="mt-1 line-clamp-1 font-serif text-lg font-medium text-neutral-900 transition-colors group-hover:text-neutral-700 dark:text-neutral-50 dark:group-hover:text-neutral-200"
          title={product.model}
        >
          {product.model}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
          {[product.material, product.color].filter(Boolean).join(' · ') || 'Premium Eyewear'}
        </p>

        {/* Card Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-700/60">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Price
            </span>
            <span className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              {formatCurrency(product.sale_price)}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-800 transition-all duration-200 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white dark:border-neutral-600 dark:text-neutral-300 dark:group-hover:border-neutral-100 dark:group-hover:bg-neutral-100 dark:group-hover:text-neutral-900">
            View
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
