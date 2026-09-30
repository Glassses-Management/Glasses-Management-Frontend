import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

import ProductCard from '@/components/product/ProductCard'
import { useFavorites } from '@/hook/UseFavorites'
import { useProductImages } from '@/hook/UseProductImages'

// The wishlist body, shared by the account tab and the /favorites route so both
// stay identical. Renders the same ProductCard the catalog uses, which means the
// heart on a saved product can be tapped again to remove it.
function AccountFavorites() {
  const { favorites, loading } = useFavorites()
  // The hook wants product ids, not product objects.
  const imagesByProduct = useProductImages(
    favorites.map((row) => row.product?.id ?? row.productId).filter((id) => id != null),
  )

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Loading your favorites…
      </p>
    )
  }

  if (!favorites.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 py-14 text-center dark:border-neutral-700">
        <Heart size={30} className="mx-auto text-neutral-300 dark:text-neutral-600" />
        <h2 className="mt-3 font-sans text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          No favorites yet
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          Start exploring our products and save the ones you like.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sage-deep"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {favorites.map((row) => {
          const product = row.product
          if (!product) return null
          return (
            <ProductCard
              key={row.id ?? `fav-${product.id}`}
              product={product}
              imageSrc={imagesByProduct[product.id]}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AccountFavorites
