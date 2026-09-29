import ProductImage from '@/components/product/ProductImage'
import FavoriteButton from '@/components/product/FavoriteButton'
import { BADGE_STYLES, DEFAULT_BADGE_STYLE } from '@/components/product/badgeStyles'
import { Eye, ShoppingCart, Star } from 'lucide-react'
import { formatCurrency } from '@/utils/FormatCurrency'
import { useCart } from '@/hook/UseCart'
import { useToast } from '@/hook/UseToast'

// Horizontal counterpart to ProductCard, used by the catalog's list view. Where
// the grid card stacks everything vertically, this row spends its width on a
// spec table so a shopper can compare frames without opening each one.
function ProductListRow({ product, images, onClick }) {
  const { addItem } = useCart()
  const { success: toastSuccess } = useToast()

  if (!product) return null

  const src = (Array.isArray(images) ? images.filter(Boolean)[0] : null) || null
  const badge = product?.badge
  const rating = product?.rating
  const reviewCount = product?.reviewCount
  const originalPrice = product?.original_price ?? product?.regular_price ?? product?.price
  const quantity = product?.quantity
  const inStock = quantity == null ? true : Number(quantity) > 0

  const specs = [
    ['Category', product.category],
    ['Material', product.material],
    ['Colour', product.color],
    ['Size', product.size],
  ].filter(([, value]) => value)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem(product)
    toastSuccess(`${product.model} added to cart.`)
  }

  const handleViewDetails = (e) => {
    e.stopPropagation()
    onClick?.()
  }

  return (
    <article
      onClick={onClick}
      className="group flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-neutral-200/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-neutral-300 sm:flex-row sm:items-stretch dark:bg-neutral-800/90 dark:ring-neutral-700 dark:hover:ring-neutral-600"
    >
      {/* Thumbnail */}
      <div className="relative w-full shrink-0 sm:w-48">
        <ProductImage
          src={src}
          alt={product.model}
          className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f7f5f0] object-cover dark:bg-neutral-800/80"
        />

        {badge && (
          <span className={`absolute left-5 top-5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${BADGE_STYLES[badge] || DEFAULT_BADGE_STYLE}`}>
            {badge}
          </span>
        )}

        <FavoriteButton productId={product.id} productName={product.model} />
      </div>

      {/* Specs */}
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          {product.brand || 'Optical Frame'}
        </p>

        <h3
          className="mt-0.5 line-clamp-1 text-lg font-semibold text-neutral-900 dark:text-neutral-50"
          title={product.model}
        >
          {product.model}
        </h3>

        {rating != null && (
          <p className="mt-1 flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">{rating}</span>
            {reviewCount != null && (
              <span className="text-neutral-400 dark:text-neutral-500">({reviewCount} reviews)</span>
            )}
          </p>
        )}

        {specs.length > 0 && (
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 xl:grid-cols-4">
            {specs.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {label}
                </dt>
                <dd className="truncate text-sm text-neutral-700 dark:text-neutral-300" title={value}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Price and actions */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-neutral-200 pt-3 sm:w-44 sm:border-t-0 sm:border-l sm:pl-5 sm:pt-0 dark:border-neutral-700">
        <div>
          <span className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            {formatCurrency(product.sale_price)}
          </span>
          {originalPrice && Number(originalPrice) > Number(product.sale_price) && (
            <span className="ml-2 text-sm text-neutral-400 line-through dark:text-neutral-500">
              {formatCurrency(originalPrice)}
            </span>
          )}
          <p
            className={`mt-1 text-xs font-medium ${
              inStock ? 'text-forest dark:text-leaf' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {inStock ? (quantity == null ? 'In stock' : `${quantity} in stock`) : 'Out of stock'}
          </p>
        </div>

        {inStock ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-forest/25 transition-all duration-200 hover:bg-forest-deep hover:shadow-md active:scale-[0.98] dark:bg-leaf dark:text-forest dark:shadow-none dark:hover:opacity-90"
            aria-label={`Add ${product.model} to cart`}
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-400 dark:border-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-500"
          >
            Out of Stock
          </button>
        )}

        <button
          type="button"
          onClick={handleViewDetails}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-200 hover:border-forest hover:text-forest active:scale-[0.98] dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-leaf dark:hover:text-leaf"
        >
          <Eye size={15} />
          View Details
        </button>
      </div>
    </article>
  )
}

export default ProductListRow
