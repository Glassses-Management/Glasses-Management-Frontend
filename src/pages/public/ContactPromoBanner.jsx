import { CheckCircle2, ScanEye, ShieldCheck, Timer } from 'lucide-react'

const STATS = [
  { icon: CheckCircle2, label: 'Complimentary eye screening' },
  { icon: Timer, label: 'Same-day alignment check' },
  { icon: ShieldCheck, label: '10-day lens guarantee' },
]

// Dark band matching CraftSection on the home page.
export default function ContactPromoBanner() {
  return (
    <section className="bg-neutral-900 text-white transition-colors duration-300 dark:bg-[#0a0a12]">
      <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-20">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/10 text-[#8fa88f]">
          <ScanEye size={26} />
        </span>
        <h2 className="mt-6 font-sans font-semibold text-3xl text-white md:text-4xl">
          Most eyewear, ready in 5–7 working days
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
          Standard single-vision lenses are typically completed within one week of confirming your prescription —
          and your final alignment check is always on us.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {STATS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 text-xs font-medium text-white"
            >
              <Icon size={14} className="text-[#8fa88f]" />
              {label}
            </span>
          ))}
        </div>

        <a
          href="#inquiry"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#8fa88f] px-6 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Start your inquiry
        </a>
      </div>
    </section>
  )
}