import { FileCheck2, Ruler, ScanEye, SlidersHorizontal } from 'lucide-react'

const TOOLS = [
  {
    icon: ScanEye,
    title: 'Digital Vision Testing',
    description:
      'Modern digital examination tools guide a comfortable, thorough check of how your eyes work together.',
  },
  {
    icon: Ruler,
    title: 'Modern Lens Measurement',
    description:
      'Lenses are measured and matched using current optical tools, so every pair sits and performs as it should.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Frame Measurement & Fitting',
    description:
      'Bridge width, temple length and lens height are checked so your frames fit securely and comfortably.',
  },
  {
    icon: FileCheck2,
    title: 'Prescription Verification',
    description:
      'Before any lens order is placed, the prescription is reviewed and confirmed against your fitting details.',
  },
]

function AboutTechnology() {
  return (
    <section className="bg-mist py-16 transition-colors duration-300 md:py-20 dark:bg-[#121F18]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
          Precision Optical Technology
        </p>
        <h2 data-aos="fade-up" className="mt-3 font-sans font-semibold text-4xl text-neutral-900 dark:text-neutral-50 md:text-5xl">
          Technology you can feel
        </h2>
        <div className="mt-4 h-[3px] w-12 rounded-full bg-forest" />
        <p data-aos="fade-up" data-aos-delay="100" className="mt-6 max-w-2xl text-neutral-600 dark:text-neutral-400">
          We use modern, well-maintained equipment at every stage — from testing your vision
          to the final fitting of your frame.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool, i) => (
            <div
              key={tool.title}
              data-aos="fade-up"
              data-aos-delay={`${i * 100}`}
              className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:bg-[#16271F]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                <tool.icon className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <h3 className="font-sans font-semibold text-lg text-neutral-900 dark:text-neutral-50">{tool.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutTechnology