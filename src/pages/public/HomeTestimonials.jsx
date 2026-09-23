import { BadgeCheck, Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    initials: 'PK',
    name: 'Piseth K.',
    quote: 'The titanium fitting session changed how my glasses sit — no more slipping after an eight-hour workday.',
  },
  {
    initials: 'MR',
    name: 'Malin R.',
    quote: 'Same-day glazing for my progressives. My prescription was re-verified before I ever left the shop.',
  },
  {
    initials: 'AT',
    name: 'Anna T.',
    quote: 'They re-torqued and ultrasonically cleaned my frames at no charge. This is genuinely doctor-led care.',
  },
]

const STAR_SUMMARY = '4.97/5.00 over 1,240 exams'

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export default function HomeTestimonials() {
  return (
    <section className="bg-white py-16 transition-colors duration-300 md:py-20 dark:bg-[#0E1A15]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
            Patient Testimonials
          </p>
          <h2 className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
            Trusted by a thousand smiles
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Stars />
            <span className="text-sm font-semibold text-ink dark:text-neutral-100">{STAR_SUMMARY}</span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3" data-aos="fade-up" data-aos-delay="150">
          {TESTIMONIALS.map(({ initials, name, quote }, i) => (
            <figure
              key={initials}
              data-aos-delay={`${i * 100}`}
              className="flex flex-col rounded-2xl bg-white p-6 ring-1 ring-edge shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-[#16271F] dark:ring-neutral-800"
            >
              <Stars />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                “{quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mist font-sans text-xs font-bold text-forest dark:bg-[#1E332B] dark:text-leaf">
                  {initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{name}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-[10px] font-semibold text-forest dark:bg-[#1E332B] dark:text-leaf">
                    <BadgeCheck size={11} />
                    Verified Patient
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}