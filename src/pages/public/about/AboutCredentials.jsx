import { BadgeCheck, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'

const CREDENTIALS = [
  {
    icon: BadgeCheck,
    title: 'Professional Optical Service',
    description: 'Trained staff guide you from your eye exam to the final fitting.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Prescription Handling',
    description: 'Prescriptions are reviewed and confirmed before any lens order.',
  },
  {
    icon: Sparkles,
    title: 'Quality Product Standards',
    description: 'Frames and lenses checked against our in-house quality standards.',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Customer Care',
    description: 'Friendly, patient support before, during and after your visit.',
  },
]

function AboutCredentials() {
  return (
    <section className="bg-mist py-16 transition-colors duration-300 md:py-20 dark:bg-[#121F18]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
          Professional Credentials
        </p>
        <h2 data-aos="fade-up" className="mt-3 font-sans font-semibold text-4xl text-neutral-900 dark:text-neutral-50 md:text-5xl">
          The standards we hold
        </h2>
        <div className="mt-4 h-[3px] w-12 rounded-full bg-forest" />
        <p data-aos="fade-up" data-aos-delay="100" className="mt-6 max-w-2xl text-neutral-600 dark:text-neutral-400">
          These are the service standards we hold ourselves to — the way we work, every single day.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CREDENTIALS.map((item, i) => (
            <div
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={`${i * 100}`}
              className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:bg-[#16271F]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                <item.icon className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <h3 className="font-sans font-semibold text-lg text-neutral-900 dark:text-neutral-50">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutCredentials