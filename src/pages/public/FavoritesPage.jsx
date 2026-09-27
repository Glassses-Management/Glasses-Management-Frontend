import Navbar from '@/components/layout/Navbar'
import HomeFooter from '@/pages/public/HomeFooter'
import AccountFavorites from '@/pages/public/account/AccountFavorites'

// Standalone wishlist page. The body is the same component the account area uses,
// so the two cannot show different data.
function FavoritesPage() {
  return (
    <div className="min-h-screen bg-mist-soft text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
          Your Wishlist
        </p>
        <h1 className="mt-3 font-sans text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-neutral-50">
          My Favorites
        </h1>
        <div className="mt-4 h-[3px] w-12 rounded-full bg-forest" />

        <div className="mt-8">
          <AccountFavorites />
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}

export default FavoritesPage
