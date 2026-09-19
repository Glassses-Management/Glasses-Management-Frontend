import { useState } from 'react'
import { CalendarDays, Check, Clock, CreditCard } from 'lucide-react'
import { useToast } from '@/hook/UseToast'

const TIMES = ['8:00 AM', '9:30 AM', '11:00 AM', '1:30 PM', '3:00 PM', '4:30 PM']

const buildDates = () => {
  const dayLabel = (offset) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return d.toLocaleDateString('en-US', { weekday: 'short' })
  }
  return [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'later', label: dayLabel(2) },
  ]
}

const TAG_PILLS = [
  { icon: Clock, text: '30–45 min exam' },
  { icon: CreditCard, text: 'HSA/FSA accepted' },
]

export default function HomeBookingBanner() {
  const { success: toastSuccess } = useToast()
  const [date, setDate] = useState('today')
  const [time, setTime] = useState('11:00 AM')
  const dates = buildDates()

  const book = () => toastSuccess('Appointment slot selected — booking opens at checkout shortly.')

  return (
    <section className="bg-white py-16 transition-colors duration-300 md:py-20 dark:bg-[#0E1A15]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid overflow-hidden rounded-3xl shadow-sm ring-1 ring-edge lg:grid-cols-2 dark:ring-neutral-800">
          {/* Brand panel */}
          <div className="flex flex-col justify-center bg-forest p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Appointments</p>
            <h2 className="mt-6 font-sans font-semibold text-3xl text-white md:text-4xl">
              Book your next exam in under a minute
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-white/75">
              Comprehensive eye exams, frame fitting and lens consultations — all with a board-certified
              optometrist at the shop.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {TAG_PILLS.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white"
                >
                  <Icon size={13} className="text-leaf" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Quick scheduling panel */}
          <div className="bg-mist-soft p-8 md:p-10 dark:bg-[#101E18]">
            <h3 className="font-sans text-lg font-semibold text-neutral-900 dark:text-neutral-100">Quick Scheduling</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Pick a day and a time slot.</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {dates.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDate(key)}
                  aria-pressed={date === key}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    date === key
                      ? 'bg-forest text-white'
                      : 'border border-edge bg-white text-ink hover:border-forest dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  aria-pressed={time === t}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                    time === t
                      ? 'border-forest bg-forest text-white'
                      : 'border-edge bg-white text-ink hover:border-forest dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300'
                  }`}
                >
                  {time === t && <Check size={13} />}
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-edge dark:bg-[#15261F] dark:ring-neutral-800">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest font-sans text-sm font-bold text-white">
                SP
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50">Dr. S. Prak</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Lead Optometrist · since 2014</p>
              </div>
            </div>

            <button
              type="button"
              onClick={book}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
            >
              <CalendarDays size={16} />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}