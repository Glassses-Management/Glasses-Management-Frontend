import { useState } from 'react'
import { Users, Calendar, FileText, Package } from 'lucide-react'
import HomeHeader from '@/pages/public/HomeHeader'
import HomeFooter from '@/pages/public/HomeFooter'

const SERVICES = [
  {
    title: 'Client Registry',
    description: 'Keep a complete registry of clients and their contact information.',
    icon: Users,
  },
  {
    title: 'Appointments',
    description: 'Schedule and manage eye exams and follow-up appointments.',
    icon: Calendar,
  },
  {
    title: 'Prescriptions',
    description: 'Store prescriptions so lens and frame orders are always accurate.',
    icon: FileText,
  },
  {
    title: 'Orders',
    description: 'Track every order from first request to pickup or delivery.',
    icon: Package,
  },
]

const SHOP_PHOTO =
  'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80'

function About() {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#111118] dark:text-neutral-200">
      {/* Hero */}
      <HomeHeader />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-6 md:px-6 md:pt-24 md:pb-10 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#6f8a6f]">
            Our Story
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] text-neutral-900 md:text-6xl dark:text-neutral-50">
            About Atelier
            <br />
            <span className="italic">Lunetterie.</span>
          </h1>
          <div className="mt-4 h-[3px] w-12 rounded-full bg-[#8fa88f]" />
          <p className="mt-6 max-w-md text-neutral-600 dark:text-neutral-400">
            Atelier Lunetterie is a vision care system designed like a boutique — every
            customer, appointment, prescription, and order gathered in one warm, well-kept
            place, so your eye care feels personal and effortless from first fitting to final
            pickup.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/products"
              className="rounded-full bg-[#8fa88f] px-6 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Explore the Collection
            </a>
            <a
              href="/contact"
              className="rounded-full border border-[#8fa88f] bg-transparent px-6 py-3 text-sm font-medium text-[#6f8a6f] transition-colors hover:bg-[#8fa88f]/10"
            >
              Book Consultation
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f7f5f0] shadow-sm ring-1 ring-neutral-200 transition-colors duration-300 dark:bg-neutral-800 dark:ring-neutral-700">
            {imageError ? (
              <div className="flex h-full w-full items-center justify-center font-serif text-lg text-[#a89f91]">
                Atelier Lunetterie
              </div>
            ) : (
              <>
                <img
                  src={SHOP_PHOTO}
                  alt="Inside the Atelier Lunetterie boutique"
                  onError={() => setImageError(true)}
                  style={{ filter: 'saturate(0.35) brightness(1.03)' }}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[#8fa88f]/25 mix-blend-multiply"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-white py-16 transition-colors duration-300 md:py-20 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f8a6f]">
            Our Services
          </p>
          <h2 className="mt-3 font-serif text-4xl text-neutral-900 md:text-5xl dark:text-neutral-50">
            What We Do
          </h2>
          <div className="mt-4 h-[3px] w-12 rounded-full bg-[#8fa88f]" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="flex h-full flex-col rounded-2xl bg-[#f7f5f0] p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:bg-neutral-800"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#8fa88f]/15 text-[#6f8a6f]">
                  <service.icon className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <h3 className="font-serif text-lg text-[#6f8a6f]">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-[#eef1ea] py-16 transition-colors duration-300 md:py-20 dark:bg-[#161b18]">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="grid items-center gap-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#8fa88f]/40 md:grid-cols-[1fr_auto] md:p-12 dark:bg-neutral-900 dark:ring-[#8fa88f]/30">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f8a6f]">
                Who We Serve
              </p>
              <h2 className="mt-3 font-serif text-4xl text-neutral-900 dark:text-neutral-50">
                Who It's For
              </h2>
              <div className="mt-4 h-[3px] w-12 rounded-full bg-[#8fa88f]" />
              <p className="mt-6 max-w-xl text-neutral-600 dark:text-neutral-400">
                Built for optometrists, opticians, and clinic front-desk staff who want to
                spend less time on paperwork and more time caring for their patients.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8fa88f]/15 text-[#6f8a6f]">
              <Users className="h-8 w-8" strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}

export default About