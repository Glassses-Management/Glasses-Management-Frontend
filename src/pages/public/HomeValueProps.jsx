import { CheckCircle2, Eye, Microscope, Scan, ShieldCheck, Sparkles } from 'lucide-react'

const PROPS = [
  {
    number: '1',
    icon: Microscope,
    title: 'Clinical Eye Exams',
    text: 'Doctor-led screenings with digital refractors and retinal imaging.',
    tag: 'Same-day prescription',
  },
  {
    number: '2',
    icon: Scan,
    title: 'Precision Lens Lab',
    text: 'Lenses surfaced, edged and verified in our in-clinic laboratory.',
    tag: 'ISO 9001 certified lab',
  },
  {
    number: '3',
    icon: Sparkles,
    title: 'Titanium Frame Studio',
    text: 'Bespoke frames hand-set, torqued and aligned to your face.',
    tag: 'Adjustment included',
  },
  {
    number: '4',
    icon: ShieldCheck,
    title: 'Specialist Coatings',
    text: 'Anti-reflective, blue-light and UV400 coatings applied on site.',
    tag: '10-day coat guarantee',
  },
]

export default function HomeValueProps() {
  return (
    <section className="bg-mist py-16 transition-colors duration-300 md:py-20 dark:bg-[#121F18]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
            <Eye size={14} />
            The Optic Dispensary
          </p>
          <h2 className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
            Medical Precision Meets Luxury Dispensary
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up" data-aos-delay="150">
          {PROPS.map(({ number, icon: Icon, title, text, tag }, i) => (
            <div
              key={number}
              data-aos-delay={`${i * 100}`}
              className="group rounded-2xl bg-white p-6 ring-1 ring-edge shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-[#16271F] dark:ring-neutral-800"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-lg bg-mist text-forest transition-colors group-hover:bg-forest group-hover:text-white dark:bg-[#1E332B] dark:text-leaf dark:group-hover:bg-leaf dark:group-hover:text-forest">
                  <Icon size={20} />
                </span>
                <span className="font-sans text-2xl font-bold text-neutral-200 dark:text-neutral-700">{number}.</span>
              </div>
              <h3 className="mt-4 font-sans text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{text}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-semibold text-forest dark:bg-[#1E332B] dark:text-leaf">
                <CheckCircle2 size={13} />
                {tag}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}