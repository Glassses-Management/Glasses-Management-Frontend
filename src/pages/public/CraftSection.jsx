const FEATURES = [
  {
    title: 'Wavefront Aberrometry',
    text: 'We map every imperfection in your optics to deliver razor-sharp clarity, not just 20/20.',
    icon: <path d="M2 12h4l2-7 3 14 3-9 2 2h6" />,
  },
  {
    title: 'In-Clinic Lens Scaling',
    text: 'Lenses are surfaced and measured on site, so your prescription fits your exact fit every time.',
    icon: <path d="M4 7h16M7 7V4m10 3V4M8 20h8M5 7l-3 9m17-9l3 9m-7 2v-3m-3 3v-3" />,
  },
  {
    title: 'Ultrasonic Retreatment',
    text: 'Deep ultrasonic baths keep frames pristine across years of everyday wear and tear.',
    icon: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 3v6l4 2" />,
  },
]

function CraftSection() {
  return (
    <section id="craft" className="bg-neutral-900 text-white dark:bg-[#0a0a12]">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Science Meets Artisanal Craft
          </p>
          <h2 className="font-sans font-semibold text-4xl text-white md:text-5xl">
            Measured by machine.
            <br />
            <span className="italic">Finished by hand.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#8fa88f]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-sans font-semibold text-xl text-white">{f.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-neutral-400">{f.text}</p>
              <a href="/about" className="mt-4 inline-block text-sm font-medium text-[#a9c0a9] transition-opacity hover:opacity-80">
                Learn more →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:flex-row md:p-10">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="font-sans font-semibold text-2xl text-white">Complimentary fit consultation</h3>
            <p className="mt-2 text-sm text-neutral-400">
              First visit is on us — and most major vision insurance plans are accepted in-house.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/contact" className="rounded-full bg-[#8fa88f] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Reserve Appointment
            </a>
            <a href="/contact" className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
              Check Insurance
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CraftSection
