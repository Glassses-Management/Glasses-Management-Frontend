import { useState } from 'react'
import { CalendarClock, Lock, MessageSquare, Phone, Send } from 'lucide-react'
import Spinner from '@/components/ui/Spinner'
import { useToast } from '@/hook/UseToast'

const DEPARTMENTS = [
  'Eye Examination',
  'Prescription',
  'Frame Fitting',
  'Lens & Lab',
  'Aftersales',
  'General Inquiry',
]

const HOURS = [
  { day: 'Monday – Friday', hours: '8:00 AM – 6:00 PM', closed: false },
  { day: 'Saturday', hours: '9:00 AM – 5:00 PM', closed: false },
  { day: 'Sunday & Public Holidays', hours: 'Closed', closed: true },
]

const LAB_NOTES = [
  { label: 'Lab workshop', value: 'Mon–Sat · 8 AM – 5 PM' },
  { label: 'Ultrasonic cleaning', value: 'Same day · no appointment' },
]

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-forest dark:border-neutral-700 dark:bg-[#0E1A15] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-leaf'

function Field({ label, htmlFor, required, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink dark:text-neutral-200">
        {label}
        {required && <span className="ml-1 text-forest dark:text-leaf">*</span>}
      </label>
      {children}
    </div>
  )
}

function Badge({ tone, children }) {
  const tones = {
    green: 'bg-forest/10 text-forest',
    blue: 'bg-blue-50 text-blue-700',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}

const INITIAL = { department: '', name: '', email: '', phone: '', message: '' }

export default function ContactInquiryForm() {
  const { success: toastSuccess, error: toastError } = useToast()
  const [form, setForm] = useState(INITIAL)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      toastError('Please fill in your name and email so we can reply.')
      return
    }
    if (sending) return
    setSending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      toastSuccess('Inquiry sent — our concierge team will reply within one business day.')
      setForm(INITIAL)
    } catch {
      toastError('Something went wrong while sending your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="inquiry" className="scroll-mt-20 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:px-6 lg:grid-cols-2">
        {/* Inquiry form */}
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#16271F]">
          <div className="flex items-center gap-3 bg-gradient-to-r from-forest to-forest-deep px-6 py-5 text-white">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <MessageSquare size={18} />
            </span>
            <div>
              <h3 className="font-sans text-base font-semibold">Send an Inquiry</h3>
              <p className="mt-0.5 text-xs text-white/80">We reply within one business day.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
            <Field label="Department" htmlFor="department">
              <select id="department" name="department" value={form.department} onChange={handleChange} className={inputClass}>
                <option value="">Select a department…</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>

            <Field label="Full Name" htmlFor="name" required>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputClass} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email Address" htmlFor="email" required>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
              </Field>
              <Field label="Phone Number" htmlFor="phone">
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+855 …" className={inputClass} />
              </Field>
            </div>

            <Field label="Message" htmlFor="message">
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your prescription, lens fitting or frame requirements…"
                className={`${inputClass} resize-none`}
              />
            </Field>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {sending ? <Spinner size="sm" color="current" /> : <Send size={15} />}
              {sending ? 'Sending…' : 'Send Inquiry'}
            </button>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              <Lock size={13} className="mt-0.5 shrink-0 text-forest dark:text-leaf" />
              Messages are encrypted. You can attach prescription PDFs and reference images from your customer account.
            </p>
          </form>
        </div>

        {/* Schedule */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-[#16271F]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                <CalendarClock size={18} />
              </span>
              <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-100">Clinic &amp; Lab Schedule</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="green">
                <span className="size-1.5 rounded-full bg-current" />
                Open now
              </Badge>
              <Badge tone="blue">Walk-ins welcome</Badge>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
            {HOURS.map(({ day, hours, closed }, i) => (
              <div
                key={day}
                className={`flex items-center justify-between gap-3 px-4 py-3 text-sm ${i > 0 ? 'border-t border-neutral-200 dark:border-neutral-700' : ''}`}
              >
                <span className="font-medium text-neutral-900 dark:text-neutral-200">{day}</span>
                <span className={closed ? 'font-semibold text-red-600' : 'text-neutral-600 dark:text-neutral-400'}>{hours}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {LAB_NOTES.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Phone size={14} className="text-forest dark:text-leaf" />
                  {label}
                </span>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-white p-4 text-sm leading-relaxed text-neutral-600 ring-1 ring-edge dark:bg-[#0E1A15]/50 dark:text-neutral-400">
            <p>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Good to know:</span> frames brought
              in for lens fitting are glazed and returned within 5–7 working days for standard prescriptions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}