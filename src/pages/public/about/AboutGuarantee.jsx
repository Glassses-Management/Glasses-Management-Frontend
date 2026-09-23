import { CircleCheck, Glasses } from 'lucide-react'

const FEATURES = [
  { title: 'Quality-Checked Products', text: 'Every frame and lens inspected before it reaches you.' },
  { title: 'Professional Fitting', text: 'Frames adjusted to sit securely and comfortably.' },
  { title: 'Prescription Accuracy', text: 'Your prescription verified before any lens order.' },
  { title: 'Transparent Pricing', text: 'Clear, honest pricing with no surprise add-ons.' },
  { title: 'Dedicated Support', text: 'Friendly help at every stage of your visit.' },
  { title: 'After-Sales Service', text: 'Adjustments and care long after you walk out.' },
]

function AboutGuarantee() {
  return (
    <section className="bg-white py-16 transition-colors duration-300 md:py-20 dark:bg-[#0E1A15]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div
          data-aos="fade-up"
          className="relative overflow-hidden rounded-3xl bg-forest px-6 py-12 text-white shadow-sm md:px-12 md:py-16"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 opacity-10" aria-hidden="true">
            <Glasses size={220} strokeWidth={1.2} />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Our Promise</p>
          <h2 className="mt-3 font-sans font-semibold text-4xl text-white md:text-5xl">
            Quality You Can Trust
          </h2>
          <div className="mt-4 h-[3px] w-12 rounded-full bg-leaf" />
          <p className="mt-6 max-w-2xl text-leaf/80">
            We stand behind everything we fit. From meticulous lens work to personal after-sales
            care, your trust is part of every pair we hand over.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                data-aos="fade-up"
                data-aos-delay={`${(i % 3) * 100}`}
                className="flex items-start gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-white/15"
              >
                <CircleCheck size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-leaf" />
                <div>
                  <h3 className="font-sans text-sm font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-leaf/70">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutGuarantee