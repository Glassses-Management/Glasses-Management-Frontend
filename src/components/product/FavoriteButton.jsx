import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'

import { useFavorites } from '@/hook/UseFavorites'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'

// The wishlist heart, shared by the product card and the product detail page so
// the two cannot drift apart.
//
// Signed-out handling lives here rather than in each caller: the protected API is
// never called without a token, and the customer is sent to the existing login
// page with a return path, exactly as the route guards do.
function FavoriteButton({ productId, productName, variant = 'icon', className = '', onPending }) {
  const { isFavorite, toggle } = useFavorites()
  const { token } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [busy, setBusy] = useState(false)

  if (!productId) return null

  const liked = isFavorite(productId)

  const handleClick = async (e) => {
    // The card itself is clickable, so the heart must not also open the product.
    e.stopPropagation()
    e.preventDefault()

    if (!token) {
      navigate('/login', { state: { from: location }, replace: false })
      return
    }

    if (busy) return
    setBusy(true)
    try {
      const nowFavorite = await toggle(productId)
      // toggle resolves to true when the product was just saved, false when it was
      // just removed, so one message covers both directions of the heart.
      const subject = productName || 'This product'
      toastSuccess(
        nowFavorite
          ? `${subject} saved to your favorites.`
          : `${subject} removed from your favorites.`,
      )
      if (nowFavorite) {
        onPending?.()
      }
    } catch (err) {
      const status = err?.response?.status
      if (status === 403) {
        toastError('Favorites are available to customer accounts.')
      } else if (status === 404) {
        toastError('That product is no longer available.')
      } else if (status === 401) {
        // The shared interceptor has already cleared the session.
        navigate('/login', { state: { from: location } })
      } else {
        toastError('Could not update your favorites. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  const label = liked
    ? `Remove ${productName || 'this product'} from favorites`
    : `Add ${productName || 'this product'} to favorites`

  if (variant === 'label') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-pressed={liked}
        aria-label={label}
        className={`inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors disabled:opacity-60 ${
          liked
            ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300'
            : 'border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-100'
        } ${className}`}
      >
        <Heart size={18} className={liked ? 'fill-red-500' : ''} />
        {liked ? 'Saved' : 'Add to Favorites'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={liked}
      aria-label={label}
      title={label}
      className={`absolute right-5 top-5 rounded-full bg-white/90 p-2 text-neutral-500 shadow-sm backdrop-blur transition-colors hover:text-neutral-900 disabled:opacity-60 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:text-white ${
        liked ? 'text-red-500 hover:text-red-500 dark:text-red-500 dark:hover:text-red-500' : ''
      } ${className}`}
    >
      <Heart size={16} className={liked ? 'fill-red-500' : ''} />
    </button>
  )
}

export default FavoriteButton
