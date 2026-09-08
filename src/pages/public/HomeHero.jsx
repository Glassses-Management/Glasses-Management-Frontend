import { useState } from 'react'

const HERO_BADGES = [
  '6-Base Lens Buffering',
  '100% UV & Blue Block',
  'Lifetime Alignment Care',
]

const STATIC_IMAGE = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80'

function HomeHero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-6 md:px-6 md:pt-24 md:pb-10 lg:grid-cols-2">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          Couture Optical Eyewear · Est. 1988
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] text-neutral-900 md:text-6xl dark:text-neutral-50">
          Precision Optics.
          <br />
          <span className="italic">Timeless Design.</span>
        </h1>
        <p className="mt-6 max-w-md text-neutral-600 dark:text-neutral-400">
          Handcrafted frames and medical-grade lenses, fitted and aligned by our optometrists so
          every pair feels effortless from the first wear.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/products"
            className="rounded-full bg-[#8fa88f] px-6 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Explore 2025 Collection
          </a>
          <a
            href="/contact"
            className="rounded-full border border-neutral-300 bg-transparent px-6 py-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-white/5"
          >
            Book Consultation
          </a>
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="text-amber-500" aria-hidden="true">★★★★★</span>
          <span className="font-medium text-neutral-800 dark:text-neutral-200">4.9/5</span>
          <span>· 2,300+ verified reviews</span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xs sm:max-w-md">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f7f5f0] shadow-sm ring-1 ring-neutral-200 transition-colors duration-300 dark:bg-neutral-800 dark:ring-neutral-700">
          {imageError ? (
            <div className="flex h-full w-full items-center justify-center">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#a89f91" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="15" r="4" />
                <circle cx="18" cy="15" r="4" />
                <path d="M14 15a2 2 0 0 0-4 0" />
                <path d="M2.5 13L5 7c.7-1.3 2-2 3.5-2h7c1.5 0 2.8.7 3.5 2l2.5 6" />
              </svg>
            </div>
          ) : (
            <img
              src={STATIC_IMAGE}
              alt="Featured eyeglasses"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-900/90 dark:text-neutral-300">
            Featured
          </div>
        </div>

        <div className="absolute bottom-4 right-4 w-44 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-neutral-200 transition-colors duration-300 dark:bg-neutral-800 dark:ring-neutral-700 sm:-bottom-5 sm:right-2">
          <p className="text-[11px] uppercase tracking-wide text-neutral-400">Premium Frame</p>
          <p className="mt-1 truncate font-serif text-base text-neutral-900 dark:text-neutral-50">Featured Frame</p>
          <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-50">—</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-start gap-2.5 lg:col-span-2 lg:justify-center">
        {HERO_BADGES.map((b) => (
          <span key={b} className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            {b}
          </span>
        ))}
      </div>
    </section>
  )
}

export default HomeHero