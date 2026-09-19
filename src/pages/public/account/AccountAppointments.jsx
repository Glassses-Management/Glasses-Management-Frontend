import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, Plus } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import AccountCard from '@/pages/public/account/AccountCard'
import { APPOINTMENTS } from '@/pages/public/account/AccountData'

function AccountAppointments() {
  return (
    <AccountCard>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 pt-6 pb-4 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
            <CalendarDays size={16} />
          </span>
          <div>
            <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Appointments & Recall Schedule
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Confirmed visits and upcoming recalls</p>
          </div>
        </div>
        <Link
          to="/request"
          className="inline-flex items-center gap-1.5 rounded-lg border border-forest px-3.5 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white dark:border-leaf dark:text-leaf dark:hover:bg-leaf dark:hover:text-forest"
        >
          <Plus size={15} />
          New Booking
        </Link>
      </div>

      <ul className="divide-y divide-neutral-100 px-6 dark:divide-neutral-800">
        {APPOINTMENTS.map((appointment) => (
          <li key={appointment.title} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-mist dark:bg-[#1E332B]">
              <span className="text-base font-semibold leading-none text-forest dark:text-leaf">{appointment.day}</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {appointment.month}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{appointment.title}</p>
                <Badge text={appointment.status} variant="success" />
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1">{appointment.doctor}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {appointment.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} />
                  {appointment.location}
                </span>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 pl-1">
              <button className="text-xs font-semibold text-forest hover:underline dark:text-leaf">Reschedule</button>
              <button className="text-xs font-semibold text-neutral-500 hover:text-forest dark:text-neutral-400 dark:hover:text-leaf">
                Add to Calendar
              </button>
              <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300">
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </AccountCard>
  )
}

export default AccountAppointments