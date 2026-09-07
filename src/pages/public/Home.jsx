import HomeHeader from '@/pages/public/HomeHeader'
import HomeHero from '@/pages/public/HomeHero'
import NewArrivals from '@/pages/public/NewArrivals'
import CraftSection from '@/pages/public/CraftSection'
import HomeFooter from '@/pages/public/HomeFooter'

function Home() {
  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#111118] dark:text-neutral-200">
      <HomeHeader />
      <HomeHero />
      <NewArrivals />
      <CraftSection />
      <HomeFooter />
    </div>
  )
}

export default Home
