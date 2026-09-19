import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Phone, Mail, MapPin, Clock, Send, ChevronDown, CalendarClock,
} from 'lucide-react'
import HomeHeader from '@/pages/public/HomeHeader'
import HomeFooter from '@/pages/public/HomeFooter'
import CustomerRequestModal from '@/components/request/CustomerRequestModal'
import Spinner from '@/components/ui/Spinner'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'

const CONTACT_INFO = [
  {
    icon: Phone,
    title: 'Phone',
    href: 'tel:+855000000000',
    lines: ['+855 XX XXX XXX', 'Mon – Sat, 8 AM – 6 PM'],
  },
  {
    icon: Mail,
    title: 'Email',
    href: 'mailto:support@opticshop.com',
    lines: ['support@opticshop.com', 'We reply within 1 business day'],
  },
  {
    icon: MapPin,
    title: 'Location',
    lines: ['Phnom Penh, Cambodia', 'Monivong Boulevard'],
  },
  {
    icon: Clock,
    title: 'Opening Hours',
    lines: ['Monday – Saturday', '8:00 AM – 6:00 PM'],
  },
]

const FAQS = [
  {
    q: 'How do I request an eye examination?',
    a: 'Tap "Request an Eye Exam" or the Request button in the header, pick Eye Examination, add a note, and submit. You will need a customer account.',
  },
  {
    q: 'Can I check my prescription online?',
    a: 'Yes. Once signed in, your prescriptions are stored on your account so we always cut lenses and fit frames to the correct measurements.',
  },
  {
    q: 'Do you offer different lens coatings?',
    a: 'We offer anti-reflective, blue-light, scratch-resistant, and UV coatings. Prices vary by lens package — just mention your preference when ordering.',
  },
  {
    q: 'How long does it take to prepare glasses?',
    a: 'Most orders are ready within 5–7 working days. Once ready, we will contact you to arrange pickup at your nearest showroom.',
  },
]

function FormItem({ label, htmlFor, required, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

function Contact() {
  const { token } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [requestOpen, setRequestOpen] = useState(false)

  const inputClass =
    'w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors duration-300 placeholder:text-neutral-400 focus:border-[#8fa88f] focus:ring-2 focus:ring-[#8fa88f]/30 dark:border-neutral-600 dark:bg-[#111118] dark:text-neutral-100 dark:placeholder:text-neutral-500'
  const errorInputClass =
    'border-red-500 focus:border-red-500 focus:ring-red-500/30'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name'
    if (!form.email.trim()) next.email = 'Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address'
    if (!form.subject.trim()) next.subject = 'Please enter a subject'
    if (!form.message.trim()) next.message = 'Please tell us how we can help'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      toastError('Please fix the highlighted fields before sending.')
      return
    }
    setSending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      toastSuccess('Message sent successfully! We\'ll get back to you soon.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setErrors({})
    } catch {
      toastError('Something went wrong while sending your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  // Reuses the app's existing request flow: guests go to Login/Register,
  // signed-in customers open the customer request modal.
  const handleRequestExam = () => {
    if (!token) {
      navigate('/login', { state: { from: location } })
      return
    }
    setRequestOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#111118] dark:text-neutral-200">
      <HomeHeader />

      {/* Hero */}
      <section className="mx-auto max-w-2xl px-4 pt-20 pb-10 text-center md:pt-28 md:pb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f8a6f]">
          Contact Us
        </p>
        <h1 className="mt-4 font-sans font-semibold text-5xl leading-[1.05] text-neutral-900 md:text-6xl dark:text-neutral-50">
          Get in
          <br />
          <span className="italic">Touch</span>
        </h1>
        <div className="mx-auto mt-5 h-[3px] w-12 rounded-full bg-[#8fa88f]" />
        <p className="mx-auto mt-6 max-w-xl text-neutral-600 dark:text-neutral-400">
          Have a question about our glasses, lenses, appointments, or services? We&apos;re here to help.
        </p>
      </section>

      {/* Contact information */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_INFO.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 transition-shadow duration-300 hover:shadow-md dark:bg-neutral-800 dark:ring-neutral-700"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8fa88f]/15 text-[#6f8a6f]">
                <item.icon className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="font-sans font-semibold text-[#6f8a6f]">{item.title}</h2>
                <p className="mt-1.5 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  {item.href ? (
                    <a href={item.href} className="transition-colors hover:text-[#6f8a6f]">
                      {item.lines[0]}
                    </a>
                  ) : (
                    item.lines[0]
                  )}
                </p>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{item.lines[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact form + store */}
      <section className="bg-white py-16 transition-colors duration-300 md:py-20 dark:bg-neutral-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-6 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-3xl bg-[#faf7f2] p-8 ring-1 ring-neutral-200 transition-colors duration-300 dark:bg-[#161b18] dark:ring-neutral-700 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f8a6f]">
              Contact Form
            </p>
            <h2 className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
              Send us a <span className="italic">message</span>
            </h2>
            <div className="mt-4 h-[3px] w-12 rounded-full bg-[#8fa88f]" />
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <FormItem label="Full Name" htmlFor="name" required error={errors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`${inputClass} ${errors.name ? errorInputClass : ''}`}
                />
              </FormItem>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormItem label="Email" htmlFor="email" required error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
                  />
                </FormItem>
                <FormItem label="Phone Number" htmlFor="phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </FormItem>
              </div>

              <FormItem label="Subject" htmlFor="subject" required error={errors.subject}>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What can we help you with?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  className={`${inputClass} ${errors.subject ? errorInputClass : ''}`}
                />
              </FormItem>

              <FormItem label="Message" htmlFor="message" required error={errors.message}>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={`${inputClass} resize-none ${errors.message ? errorInputClass : ''}`}
                />
              </FormItem>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-full bg-[#8fa88f] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6f8a6f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? <Spinner size="sm" color="current" /> : <Send size={16} />}
                Send Message
              </button>
            </form>
          </div>

          {/* Store */}
          <div className="rounded-3xl bg-[#faf7f2] p-8 ring-1 ring-neutral-200 transition-colors duration-300 dark:bg-[#161b18] dark:ring-neutral-700 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f8a6f]">
              Visit Us
            </p>
            <h2 className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
              Visit Our <span className="italic">Store</span>
            </h2>
            <div className="mt-4 h-[3px] w-12 rounded-full bg-[#8fa88f]" />

            <div
              role="img"
              aria-label="Map showing the Optic Shop location in Phnom Penh"
              className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl bg-[#eef1ea] ring-1 ring-neutral-200 dark:bg-[#111118] dark:ring-neutral-700"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(111,138,111,0.12) 0 1px, transparent 1px 36px), repeating-linear-gradient(90deg, rgba(111,138,111,0.12) 0 1px, transparent 1px 36px)',
              }}
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8fa88f] text-white shadow-lg ring-4 ring-[#8fa88f]/25">
                  <MapPin className="h-7 w-7" strokeWidth={1.8} />
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8fa88f]/15 text-[#6f8a6f]">
                  <MapPin className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Phnom Penh Showroom</p>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">Monivong Boulevard, Phnom Penh, Cambodia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8fa88f]/15 text-[#6f8a6f]">
                  <Clock className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Opening Hours</p>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">Monday – Saturday, 8:00 AM – 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8fa88f]/15 text-[#6f8a6f]">
                  <Phone className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Phone</p>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">+855 XX XXX XXX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:py-20 md:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#6f8a6f]">
          Quick Help
        </p>
        <h2 className="mt-3 text-center font-sans font-semibold text-4xl text-neutral-900 md:text-5xl dark:text-neutral-50">
          Need help with something <span className="italic">specific?</span>
        </h2>
        <div className="mx-auto mt-5 h-[3px] w-12 rounded-full bg-[#8fa88f]" />

        <div className="mt-10 divide-y divide-neutral-100 overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200 dark:divide-neutral-700 dark:bg-neutral-800 dark:ring-neutral-700">
          {FAQS.map((faq, i) => {
            const expanded = openFaq === i
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(expanded ? -1 : i)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#6f8a6f] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {expanded && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#eef1ea] py-16 transition-colors duration-300 md:py-20 dark:bg-[#161b18]">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="grid items-center gap-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#8fa88f]/40 md:p-12 lg:grid-cols-[1fr_auto] dark:bg-neutral-900 dark:ring-[#8fa88f]/30">
            <div>
              <h2 className="font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
                Ready to find the <span className="italic">right glasses?</span>
              </h2>
              <div className="mt-4 h-[3px] w-12 rounded-full bg-[#8fa88f]" />
              <p className="mt-4 max-w-lg text-sm text-neutral-500 dark:text-neutral-400">
                Book an eye examination or explore our collection.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRequestExam}
                className="inline-flex items-center gap-2 rounded-full bg-[#8fa88f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6f8a6f]"
              >
                <CalendarClock size={16} />
                Request an Eye Exam
              </button>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-[#8fa88f] bg-transparent px-6 py-3 text-sm font-semibold text-[#6f8a6f] transition-colors hover:bg-[#8fa88f]/10"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />

      <CustomerRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </div>
  )
}

export default Contact