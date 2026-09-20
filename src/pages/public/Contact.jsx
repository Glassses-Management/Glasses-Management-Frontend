import Navbar from '@/components/layout/Navbar'
import HomeFooter from '@/pages/public/HomeFooter'
import ContactHero from '@/pages/public/ContactHero'
import ContactPointOfCare from '@/pages/public/ContactPointOfCare'
import ContactInquiryForm from '@/pages/public/ContactInquiryForm'
import ContactPromoBanner from '@/pages/public/ContactPromoBanner'
import ContactVisitUs from '@/pages/public/ContactVisitUs'
import ContactFaq from '@/pages/public/ContactFaq'

function Contact() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <Navbar />
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