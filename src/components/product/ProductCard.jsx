import { useState } from 'react'
import ProductImage from '@/components/product/ProductImage'
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react'
import { formatCurrency } from '@/utils/FormatCurrency'
import { useCart } from '@/hook/UseCart'
import { useToast } from '@/hook/UseToast'

const BADGE_STYLES = {
  'BEST SELLER': 'bg-[#6f8a6f] text-white',
  NEW: 'bg-[#6f8a6f] text-white',
  SALE: 'bg-red-600 text-white',
  'LOW STOCK': 'bg-amber-500 text-white',
}

function ProductCard({ product, imageSrc, images, onClick }) {
  const { addItem } = useCart()
  const { success: toastSuccess } = useToast()
  const [liked, setLiked] = useState(false)

  if (!product) return null

  const imageList = (
    Array.isArray(images) && images.filter(Boolean).length > 0
      ? images.filter(Boolean)
      : imageSrc
      ? [imageSrc]
      : []
  )

  const src = imageList[0] || null
  const badge = product?.badge
  const rating = product?.rating
  const reviewCount = product?.reviewCount
  const originalPrice = product?.original_price ?? product?.regular_price ?? product?.price
  const inStock = product?.quantity == null ? true : Number(product.quantity) > 0

  const specLine = [product.material, product.color].filter(Boolean).join(' · ')

  const handleWishlist = (e) => {
    e.stopPropagation()
    setLiked((prev) => !prev)
  }

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
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/80 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg hover:ring-neutral-300 dark:bg-neutral-800/90 dark:ring-neutral-700 dark:hover:shadow-neutral-900/50 dark:hover:ring-neutral-600"
    >
      {/* Image area */}
      <div className="relative p-3 pb-0">
        <ProductImage
          src={src}
          alt={product.model}
          className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#f7f5f0] object-cover dark:bg-neutral-800/80"
        />

        {badge && (
          <span className={`absolute left-5 top-5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${BADGE_STYLES[badge] || 'bg-neutral-900 text-white'}`}>
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={liked}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-5 top-5 rounded-full bg-white/90 p-2 text-neutral-500 shadow-sm backdrop-blur transition-colors hover:text-neutral-900 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:text-white ${
            liked ? 'text-red-500 hover:text-red-500 dark:text-red-500 dark:hover:text-red-500' : ''
          }`}
        >
          <Heart size={16} className={`${liked ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          {product.brand || 'Optical Frame'}
        </p>

        <h3
          className="mt-0.5 line-clamp-1 text-lg font-semibold text-neutral-900 dark:text-neutral-50"
          title={product.model}
        >
          {product.model}
        </h3>

        {specLine && (
          <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">{specLine}</p>
        )}

        {rating != null && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">{rating}</span>
            {reviewCount != null && <span className="text-neutral-400 dark:text-neutral-500">({reviewCount})</span>}
          </p>
        )}

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
            {formatCurrency(product.sale_price)}
          </span>
          {originalPrice && Number(originalPrice) > Number(product.sale_price) && (
            <span className="text-sm text-neutral-400 line-through dark:text-neutral-500">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-auto space-y-1.5 pt-2.5">
          {inStock ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#8fa88f] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#6f8a6f] active:scale-[0.98] lg:rounded-full"
              aria-label={`Add ${product.model} to cart`}
            >
              <ShoppingCart size={15} />
              Add to Cart
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-400 dark:border-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-500 lg:rounded-full"
            >
              Out of Stock
            </button>
          )}

          <button
            type="button"
            onClick={handleViewDetails}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-transparent px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-200 hover:border-neutral-900 hover:text-neutral-900 active:scale-[0.98] lg:rounded-full dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-100 dark:hover:text-white"
          >
            <Eye size={15} />
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard