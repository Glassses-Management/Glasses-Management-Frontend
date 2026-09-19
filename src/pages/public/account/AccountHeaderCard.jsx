import { Link } from 'react-router-dom'
import { CalendarPlus, Clock } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { PATIENT } from '@/pages/public/account/AccountData'

function AccountHeaderCard() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <span className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
        <span className="size-1.5 animate-pulse rounded-full bg-forest dark:bg-leaf" />
        Wavefront Clinical Record Synced
      </span>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={PATIENT.name} id={1} size="size-16 text-xl" />
          <div className="min-w-0">
            <h2 className="truncate font-sans text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              {PATIENT.name}
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {PATIENT.accountType} · Assigned to {PATIENT.doctor} · Member since {PATIENT.memberSince}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link
            to="/request"
            className="inline-flex items-center gap-2 rounded-lg border border-forest px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white dark:border-leaf dark:text-leaf dark:hover:bg-leaf dark:hover:text-forest"
          >
            <CalendarPlus size={16} />
            Book Follow-up Exam
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-neutral-500 ring-1 ring-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:ring-neutral-700">
            <Clock size={12} />
            Offline for {PATIENT.offlineDays} Days
          </span>
          <Link to="/contact" className="text-xs font-semibold text-forest hover:underline dark:text-leaf">
            Update availability
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AccountHeaderCard