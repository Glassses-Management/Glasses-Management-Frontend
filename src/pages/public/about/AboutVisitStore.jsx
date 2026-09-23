import { Clock, Mail, MapPin, Phone } from 'lucide-react'

const HOURS = [
  { day: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' },
  { day: 'Saturday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Sunday & Public Holidays', hours: 'Closed' },
]

function MapPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Stylised map of our optical store on Monivong Boulevard, Phnom Penh"
      className="relative min-h-[320px] w-full overflow-hidden rounded-3xl border border-neutral-200 shadow-sm dark:border-neutral-700 lg:min-h-[420px]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(143,192,165,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(143,192,165,0.18) 1px, transparent 1px), linear-gradient(#F1F5F2, #F1F5F2)',
        backgroundSize: '34px 34px, 34px 34px, auto',
      }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="relative flex size-14 items-center justify-center rounded-full bg-forest text-white shadow-lg ring-8 ring-forest/15">
          <MapPin size={24} strokeWidth={2} />
        </span>
      </div>
      <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-neutral-200 dark:bg-[#16271F] dark:ring-neutral-800">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Optic Shop Store &amp; Clinic</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Monivong Boulevard, Phnom Penh</p>
      </div>
    </div>
  )
}

function AboutVisitStore() {
  return (
    <section className="bg-white py-16 transition-colors duration-300 md:py-20 dark:bg-[#0E1A15]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div data-aos="fade-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
              Visit Us
            </p>
            <h2 className="mt-3 font-sans font-semibold text-4xl text-neutral-900 dark:text-neutral-50 md:text-5xl">
              Visit our optical store
            </h2>
            <div className="mt-4 h-[3px] w-12 rounded-full bg-forest" />
            <p className="mt-6 max-w-xl text-neutral-600 dark:text-neutral-400">
              Step in for an eye exam, frame fitting or a simple adjustment. Our team is here to
              make sure every pair works for you.
            </p>

            <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-[#16271F]">
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Address</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      Monivong Boulevard, Phnom Penh
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                    <Clock size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Opening hours</p>
                    <ul className="mt-1 space-y-0.5">
                      {HOURS.map((h) => (
                        <li key={h.day} className="flex justify-between gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                          <span>{h.day}</span>
                          <span className={h.hours === 'Closed' ? 'text-neutral-400 dark:text-neutral-500' : 'font-medium text-neutral-800 dark:text-neutral-200'}>
                            {h.hours}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                    <Phone size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Phone</p>
                    <a
                      href="tel:+855235550148"
                      className="mt-0.5 block text-sm text-neutral-600 transition-colors hover:text-forest dark:text-neutral-400 dark:hover:text-leaf"
                    >
                      (023) 555-0148
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                    <Mail size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Email</p>
                    <a
                      href="mailto:care@opticshop.example"
                      className="mt-0.5 block text-sm text-neutral-600 transition-colors hover:text-forest dark:text-neutral-400 dark:hover:text-leaf"
                    >
                      care@opticshop.example
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/contact"
                  className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-forest-deep"
                >
                  Visit Us
                </a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-forest bg-transparent px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-forest/5"
                >
                  Get directions
                </a>
              </div>
            </div>
          </div>

          <div data-aos="fade-right" data-aos-delay="100" className="lg:sticky lg:top-6">
            <MapPlaceholder />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutVisitStore