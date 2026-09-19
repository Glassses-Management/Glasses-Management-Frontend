import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'Do I need a current prescription for an eye exam?',
    a: 'No. Book a consultation and one of our optometrists will run a full examination and issue your updated prescription on the spot.',
  },
  {
    q: 'How long does it take to prepare glasses?',
    a: 'Standard single-vision lenses are typically ready within 5–7 working days. Progressive and bespoke tinted lenses may take up to 10 working days.',
  },
  {
    q: 'Can I bring my own frames for lens fitting?',
    a: 'Yes. Our lab will measure, glaze and edge matched lenses into most frame styles — just ask about compatible lens and coating options when you book.',
  },
  {
    q: 'Do you offer same-day services?',
    a: 'In-house ultrasonic cleaning, frame alignment and small adjustments are completed while you wait, at no charge.',
  },
  {
    q: 'How do I book a frame fitting?',
    a: 'Call the showroom, email us, or submit a request through your customer account and we will reserve a fitting session for you.',
  },
  {
    q: 'What does the complimentary adjustment service cover?',
    a: 'Nose-pad and temple alignment, screw and hinge servicing, plus a follow-up comfort review within 10 days of collection.',
  },
]

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => setOpenIndex((prev) => (prev === index ? -1 : index))

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">Quick Answers</p>
          <h2 className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
            Frequently asked questions
          </h2>
          <div className="mx-auto mt-5 h-[3px] w-12 rounded-full bg-forest" />
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map(({ q, a }, i) => {
            const open = openIndex === i
            return (
              <div
                key={q}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow duration-300 dark:border-neutral-700 dark:bg-[#16271F]"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 md:text-base">{q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-forest transition-transform duration-300 dark:text-leaf ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{a}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}