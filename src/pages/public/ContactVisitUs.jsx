import { Accessibility, Bus, ParkingSquare } from 'lucide-react'

import StoreMap from '@/components/ui/StoreMap'
import { ADDRESS_LINE, directionsUrl } from '@/components/ui/storeLocation'

const INFO = [
  {
    icon: Bus,
    title: 'Transit',
    text: 'A short walk from the Monivong Boulevard bus stops, with tuk-tuk and remorque pickups on Norodom.',
  },
  {
    icon: ParkingSquare,
    title: 'Parking',
    text: 'Free on-site parking is reserved for consultation and frame-fitting bookings.',
  },
  {
    icon: Accessibility,
    title: 'Accessibility',
    text: 'Step-free entrance, low-height consultation chairs and large-print documents on request.',
  },
]

// Real Google map, with the address overlaid. The map itself lives in
// components/ui/StoreMap so the Contact and About pages cannot drift apart.
function MapPanel() {
  return (
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-3xl border border-neutral-200 shadow-sm dark:border-neutral-700">
      <StoreMap className="absolute inset-0 h-full w-full" title="Map showing the clinic on Monivong Boulevard, Phnom Penh" />

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-neutral-200 dark:bg-surface-storefront dark:ring-neutral-800 sm:right-auto">
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Optic Shop Showroom &amp; Clinic</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{ADDRESS_LINE}</p>
        </div>
        <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">Open until 6 PM</span>
      </div>
    </div>
  )
}

export default function ContactVisitUs() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">Visit Us</p>
        <h2 data-aos="fade-up" className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
          Plan your visit to the clinic
        </h2>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-5">
          <div data-aos="fade-left" className="lg:col-span-3">
            <MapPanel />
          </div>

          <div data-aos="fade-right" className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-surface-storefront lg:col-span-2">
            <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-100">Getting here</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Free parking and step-free access throughout the clinic and showroom.
            </p>
            <ul className="mt-6 space-y-5">
              {INFO.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-forest hover:text-forest dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-leaf dark:hover:text-leaf"
            >
              Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}