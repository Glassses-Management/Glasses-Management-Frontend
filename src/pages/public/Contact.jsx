import HomeHeader from '@/pages/public/HomeHeader'
import HomeFooter from '@/pages/public/HomeFooter'
import ContactHero from '@/pages/public/ContactHero'
import ContactPointOfCare from '@/pages/public/ContactPointOfCare'
import ContactInquiryForm from '@/pages/public/ContactInquiryForm'
import ContactPromoBanner from '@/pages/public/ContactPromoBanner'
import ContactVisitUs from '@/pages/public/ContactVisitUs'
import ContactFaq from '@/pages/public/ContactFaq'

function Contact() {
  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#111118] dark:text-neutral-200">
      <HomeHeader />
      <main>
        <ContactHero />
        <ContactPointOfCare />
        <ContactInquiryForm />
        <ContactPromoBanner />
        <ContactVisitUs />
        <ContactFaq />
      </main>
      <HomeFooter />
    </div>
  )
}

export default Contact