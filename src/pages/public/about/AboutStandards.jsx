import { Check, X } from 'lucide-react'

const ROWS = [
  {
    label: 'Eye Examination',
    ours: 'Comprehensive digital eye exams with a thorough consultation.',
    theirs: 'Quick checks that often skip detailed refraction.',
  },
  {
    label: 'Frame Selection',
    ours: 'Frames fitted to your face shape, bridge and lifestyle.',
    theirs: 'Limited rack display with little fitting guidance.',
  },
  {
    label: 'Lens Quality',
    ours: 'Quality-checked lenses matched precisely to your prescription.',
    theirs: 'Basic stock lenses with few options.',
  },
  {
    label: 'Prescription Accuracy',
    ours: 'Prescriptions verified carefully before any order is placed.',
    theirs: 'Details re-entered by hand, leaving room for error.',
  },
  {
    label: 'Customer Consultation',
    ours: 'One-on-one consultation and advice at every step.',
    theirs: 'Rushed service with limited time.',
  },
  {
    label: 'Product Quality',
    ours: 'Every frame and lens checked before it reaches you.',
    theirs: 'Little visible quality control.',
  },
  {
    label: 'After-Sales Service',
    ours: 'Fitting, adjustments and support long after purchase.',
    theirs: 'Limited support after the sale.',
  },
]

function AboutStandards() {
  return (
    <section className="bg-white py-16 transition-colors duration-300 md:py-20 dark:bg-[#0E1A15]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
          Why Choose Us
        </p>
        <h2 data-aos="fade-up" className="mt-3 font-sans font-semibold text-4xl text-neutral-900 dark:text-neutral-50 md:text-5xl">
          Our Standards
        </h2>
        <div className="mt-4 h-[3px] w-12 rounded-full bg-forest" />
        <p data-aos="fade-up" data-aos-delay="100" className="mt-6 max-w-2xl text-neutral-600 dark:text-neutral-400">
          From the first eye exam to final fitting, we hold every step to the same
          standard — careful, precise and personal.
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="150"
          className="mt-12 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#16271F]"
        >
          <div className="hidden grid-cols-[minmax(0,1.2fr)_1fr_1fr] gap-6 border-b border-neutral-200 bg-mist px-6 py-4 lg:grid dark:border-neutral-700 dark:bg-[#121F18]">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              What matters
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-forest dark:text-leaf">
              Our Optical Service
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Traditional Optical Shop
            </span>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.label}
              data-aos="fade-up"
              data-aos-delay={`${(i % 4) * 100}`}
              className="grid grid-cols-1 gap-3 border-b border-neutral-100 px-6 py-5 last:border-b-0 lg:grid-cols-[minmax(0,1.2fr)_1fr_1fr] lg:gap-6 dark:border-neutral-800"
            >
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{row.label}</p>

              <div className="flex items-start gap-2.5">
                <Check size={16} strokeWidth={2.25} className="mt-0.5 shrink-0 text-forest dark:text-leaf" />
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-forest lg:hidden dark:text-leaf">
                    Our service
                  </span>
                  {row.ours}
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <X size={16} strokeWidth={2.25} className="mt-0.5 shrink-0 text-neutral-300 dark:text-neutral-600" />
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-500">
                  <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 lg:hidden dark:text-neutral-600">
                    Traditional
                  </span>
                  {row.theirs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutStandards