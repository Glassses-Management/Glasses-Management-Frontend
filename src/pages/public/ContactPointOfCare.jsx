import { ArrowRight, Eye, Glasses, MessageSquare, Scissors } from 'lucide-react'

const POINTS = [
  {
    icon: Eye,
    title: 'Optical Clinic',
    detail: '+855 23 555 0148',
    href: 'tel:+855235550148',
    description: 'Eye examinations, prescription updates and pre-surgical checks with our optometrists.',
    hours: 'Mon–Sat · 8 AM – 6 PM',
    statusClass: 'text-[#8fa88f] bg-[#8fa88f]',
    cta: 'Book an Exam',
    primary: true,
  },
  {
    icon: Scissors,
    title: 'Dispensary & Lab',
    detail: 'lab@opticshop.com',
    href: 'mailto:lab@opticshop.com',
    description: 'Lens glazing, edging, frame repairs and ultrasonic cleaning for your eyewear.',
    hours: 'Mon–Sat · 8 AM – 6 PM',
    statusClass: 'text-blue-600 bg-blue-600',
    cta: 'Ask the Lab',
    primary: false,
  },
  {
    icon: Glasses,
    title: 'Frame Showroom',
    detail: '+855 23 555 0173',
    href: 'tel:+855235550173',
    description: 'Bespoke frame selection, fitting and styling guidance for your face shape.',
    hours: 'Mon–Sat · 9 AM – 7 PM',
    statusClass: 'text-emerald-600 bg-emerald-600',
    cta: 'Browse Frames',
    primary: false,
  },
  {
    icon: MessageSquare,
    title: 'Aftersales Support',
    detail: 'support@opticshop.com',
    href: 'mailto:support@opticshop.com',
    description: 'Warranty claims, re-polishing, adjustments and replacement parts.',
    hours: 'Online · reply within 1 day',
    statusClass: 'text-slate-500 bg-slate-500',
    cta: 'Get Support',
    primary: false,
  },
]

export default function ContactPointOfCare() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          Choose Your Point of Care
        </p>
        <h2 className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
          Every step of your eyewear journey, in one place
        </h2>
        <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
          From the clinical exam to frame styling and lab finishing — contact the right team directly.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ icon: Icon, title, detail, href, description, hours, statusClass, cta, primary }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-[#8fa88f]/15 text-[#6f8a6f]">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-sans text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
              <a
                href={href}
                className="mt-1 text-sm font-medium text-[#6f8a6f] transition-colors hover:text-[#8fa88f] hover:underline dark:text-[#a9c0a9]"
              >
                {detail}
              </a>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>

              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                <span className={`size-2 rounded-full ${statusClass} opacity-80`} />
                <span>{hours}</span>
              </div>

              <button
                type="button"
                className={
                  primary
                    ? 'mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#8fa88f] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6f8a6f]'
                    : 'mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-white/5'
                }
              >
                {cta}
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}