import { useState } from 'react'

const SHOWROOMS = [
  { city: 'Phnom Penh', addr: 'Monivong Boulevard, Phnom Penh, Cambodia', phone: '(023) 555-0148' },
  { city: 'Toul Kork', addr: 'Russian Federation Boulevard, Phnom Penh, Cambodia', phone: '(023) 555-0173' },
  { city: 'Siem Reap', addr: 'Charles de Gaulle Boulevard, Siem Reap, Cambodia', phone: '(063) 555-0192' },
]

const LEGAL = ['HIPAA Compliance', 'Prescription Verification', 'Lens Warranty', 'Privacy Policy']

function HomeFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <footer className="border-t border-neutral-200 bg-[#faf7f2] transition-colors duration-300 dark:border-neutral-800 dark:bg-[#111118]">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {SHOWROOMS.map((s) => (
            <div key={s.city} className="text-sm">
              <h4 className="mb-2 font-serif text-lg text-neutral-900 dark:text-neutral-50">{s.city} Showroom</h4>
              <p className="text-neutral-600 dark:text-neutral-400">{s.addr}</p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">{s.phone}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl bg-white p-8 ring-1 ring-neutral-200 transition-colors duration-300 dark:bg-neutral-800 dark:ring-neutral-700 md:flex-row md:items-center">
          <div>
            <h4 className="font-serif text-2xl text-neutral-900 dark:text-neutral-50">Join the Newsletter</h4>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">New frames, private events, and optical tips — once a month.</p>
          </div>
          {subscribed ? (
            <p className="text-sm font-medium text-[#6f8a6f]">Thanks — you&apos;re on the list.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-full border border-neutral-300 bg-[#faf7f2] px-4 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-xs text-neutral-500 transition-colors duration-300 dark:border-neutral-800 dark:text-neutral-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Atelier Lunetterie. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LEGAL.map((item) => (
              <span key={item} className="cursor-pointer transition-colors hover:text-neutral-800 dark:hover:text-neutral-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default HomeFooter
