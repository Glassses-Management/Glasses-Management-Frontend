import { Link } from 'react-router-dom'
import { ArrowRight, PhoneCall } from 'lucide-react'

function RegisterCalloutCard() {
  return (
    <section className="rounded-2xl border border-forest bg-forest p-6 shadow-sm transition-colors duration-300 dark:border-forest-deep dark:bg-forest-deep">
      <h3 className="font-sans text-base font-semibold text-white">Need an Exam Right Away?</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-white/80">
        Walk in before close or book a slot and get your refraction done the same week.
      </p>

      <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
        <PhoneCall size={15} />
        +1 (619) 555-0142
      </p>
      <Link
        to="/request"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:opacity-90"
      >
        Book Now
        <ArrowRight size={15} />
      </Link>
    </section>
  )
}

export default RegisterCalloutCard