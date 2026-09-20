import { Link } from 'react-router-dom'
import { CircleCheck, Glasses, Mail, MapPin, Phone } from 'lucide-react'

const HOURS = 'Mon - Sat · 9:00 AM - 10:00 PM'

const COLLECTION_LINKS = [
  { label: 'Prescription Glasses', href: '/products?category=prescription-glasses' },
  { label: 'Blue Light Filter', href: '/products?category=blue-light-filter' },
  { label: 'Polarized Sunglasses', href: '/products?category=polarized-sunglasses' },
  { label: 'Progressive Lenses', href: '/products?category=progressive-lenses' },
  { label: 'Kids Frames', href: '/products?category=kids-frames' },
]

const EYE_CARE_LINKS = [
  { label: 'Book Eye Exam', href: '/request' },
  { label: 'Lens Consultation', href: '/contact' },
  { label: 'Prescription Upload', href: '/account' },
  { label: 'Frame Fitting & Repair', href: '/contact' },
]

const SHOWROOMS = [
  { city: 'Phnom Penh', phone: '(023) 555-0148', tel: '+855235550148' },
  { city: 'Toul Kork', phone: '(023) 555-0173', tel: '+855235550173' },
  { city: 'Siem Reap', phone: '(063) 555-0192', tel: '+855635550192' },
]

const LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Lens Warranty']

const headingClass =
  'flex h-7 items-center text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'

// Link rows in every column share one height so they line up on the same lines.
const rowClass =
  'flex h-7 items-center text-[13px] text-neutral-600 transition-colors duration-200 hover:text-forest dark:text-neutral-400 dark:hover:text-leaf'

const iconBtnClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 hover:bg-leaf/10 hover:text-forest dark:text-neutral-400 dark:hover:bg-leaf/15 dark:hover:text-leaf'

function HomeFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-white transition-colors duration-300 dark:border-neutral-800 dark:bg-[#0E1A15]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div className="md:col-span-2 lg:col-span-1 lg:pr-12">
            <Link to="/" className="inline-flex h-7 items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest text-white dark:bg-leaf dark:text-forest">
                <Glasses size={15} strokeWidth={2} />
              </span>
              <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                Optic <span className="italic">Shop</span>
              </span>
            </Link>
            <p className="mt-3 max-w-[300px] text-[13px] leading-6 text-neutral-600 dark:text-neutral-400">
              Eyeglasses, lenses and eye exams in Cambodia. Precision fitting and verified
              prescriptions, with care you can trust.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-3 py-1 text-[11px] font-medium text-forest dark:bg-leaf/15 dark:text-leaf">
              <CircleCheck size={12} strokeWidth={2.25} />
              Certified Optical Care
            </span>
          </div>

          {/* Collection */}
          <nav>
            <h4 className={headingClass}>Collection</h4>
            <ul className="mt-2">
              {COLLECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className={rowClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Eye care */}
          <nav>
            <h4 className={headingClass}>Eye Care</h4>
            <ul className="mt-2">
              {EYE_CARE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className={rowClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Showrooms */}
          <div>
            <h4 className={headingClass}>Showrooms</h4>
            <ul className="mt-2">
              {SHOWROOMS.map((s) => (
                <li key={s.city} className="flex h-7 items-center justify-between gap-6">
                  <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">{s.city}</span>
                  <a href={`tel:${s.tel}`} className="text-xs tabular-nums text-neutral-500 transition-colors duration-200 hover:text-forest dark:text-neutral-400 dark:hover:text-leaf">
                    {s.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-5 text-xs text-neutral-500 transition-colors duration-300 dark:border-neutral-800 dark:text-neutral-500 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-3">
            <p>&copy; {year} Optic Shop. All rights reserved.</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-2.5 py-0.5 text-[11px] font-medium text-forest dark:bg-leaf/15 dark:text-leaf">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {HOURS}
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {LEGAL_LINKS.map((item) => (
                <span key={item} className="cursor-pointer transition-colors duration-200 hover:text-forest dark:hover:text-leaf">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <a
                href="mailto:care@opticshop.example"
                aria-label="Email us"
                className={iconBtnClass}
              >
                <Mail size={15} strokeWidth={1.75} />
              </a>
              <a
                href="tel:+855235550148"
                aria-label="Call us"
                className={iconBtnClass}
              >
                <Phone size={15} strokeWidth={1.75} />
              </a>
              <Link
                to="/contact"
                aria-label="Find a showroom"
                className={iconBtnClass}
              >
                <MapPin size={15} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default HomeFooter