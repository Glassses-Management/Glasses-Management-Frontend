import HomeHeader from '@/pages/public/HomeHeader'
import HomeHero from '@/pages/public/HomeHero'
import HomeCategories from '@/pages/public/HomeCategories'
import HomeFeatured from '@/pages/public/HomeFeatured'
import HomeValueProps from '@/pages/public/HomeValueProps'
import HomeBookingBanner from '@/pages/public/HomeBookingBanner'
import HomeTestimonials from '@/pages/public/HomeTestimonials'
import HomeFooter from '@/pages/public/HomeFooter'

function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <HomeHeader />
      <HomeHero />
      <HomeCategories />
      <HomeFeatured />
      <HomeValueProps />
      <HomeBookingBanner />
      <HomeTestimonials />
      <HomeFooter />
    </div>
  )
}

export default Home