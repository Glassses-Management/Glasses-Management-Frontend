import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, Plus, Stethoscope } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import AccountCard from '@/pages/public/account/AccountCard'
import Pagination from '@/components/ui/Pagination'
import { getMyAppointments } from '@/api/appointmentApi'
import { getAppointmentKind } from '@/utils/OrderAppointment'
import { appointmentStatus, isAwaitingScheduling, stripInternalRefs } from '@/utils/RequestOrder'
import { useOwnCustomerId } from '@/hook/UseOwnCustomerId'
import { formatDate, formatTime } from '@/utils/FormatDate'

// Matches the other account lists. Paging is done here rather than on the server
// because /api/appointments/mine returns the whole list unpaginated.
const ITEMS_PER_PAGE = 5

// The customer's real appointments. Appointments are created by the clinic when
// a request is approved or a cart order is confirmed.
export default function AccountAppointments() {
  const { customerId, needsProfile, loading: customerLoading, error: customerError } = useOwnCustomerId()
  const [appointments, setAppointments] = useState(null)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // Nothing to load until the account resolves to a profile. The empty state is
    // rendered from `visible`, so no state is set here.
    if (needsProfile || customerId == null) return undefined
    let cancelled = false

    getMyAppointments()
      .then((data) => {
        if (cancelled) return
        setAppointments(Array.isArray(data) ? data : [])
        setError('')
      })
      .catch((err) => {
        if (cancelled) return
        // 404 just means this account has no linked customer profile.
        if (err?.response?.status !== 404) {
          setError(err?.response?.data?.message || err?.message || 'Failed to load your appointments.')
        }
        setAppointments([])
      })

    return () => { cancelled = true }
  }, [needsProfile, customerId])

  const visible = needsProfile ? [] : customerLoading ? [] : appointments

  // visible can still be null here: the customer profile resolves (customerLoading
  // false) before the appointments land, and a signed-out visit leaves both flags
  // false. This math runs on every render, so it needs the fallback.
  const list = visible ?? []
  const totalPages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE))
  // Clamped so the last page cannot end up showing nothing.
  const effectivePage = Math.min(currentPage, totalPages)
  const paged = list.slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE)

  return (
    <AccountCard>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 pt-6 pb-4 dark:border-neutral-800" data-aos="fade-up">
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

      {error ? (
        <p className="px-6 py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : customerError ? (
        <p className="px-6 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">{customerError}</p>
      ) : visible === null ? (
        <div className="space-y-3 px-6 py-6">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-mist dark:bg-[#1E332B]" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No appointments booked yet.
        </p>
      ) : (
        <>
        <ul className="divide-y divide-neutral-100 px-6 dark:divide-neutral-800" data-aos="fade-up" data-aos-delay="100">
          {paged.map((appointment) => {
            const awaiting = isAwaitingScheduling(appointment)
            const notes = stripInternalRefs(appointment.notes)
            const status = appointmentStatus(appointment.status)

            return (
            <li key={appointment.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-mist dark:bg-[#1E332B]">
                {awaiting ? (
                  // The backend creates the appointment the moment an eye-exam
                  // request is approved, with no date until staff schedule it
                  // (RequestService.approve). An empty tile read as a bug.
                  <CalendarDays size={18} className="text-neutral-400 dark:text-neutral-500" />
                ) : (
                  <>
                    <span className="text-base font-semibold leading-none text-forest dark:text-leaf">
                      {formatDate(appointment.scheduled_at, { only: true, day: 'numeric' })}
                    </span>
                    <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      {formatDate(appointment.scheduled_at, { only: true, month: 'short' })}
                    </span>
                  </>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    {getAppointmentKind(appointment)}
                  </p>
                  <Badge text={status.label} variant={status.variant} />
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {awaiting
                      ? 'Awaiting a date from the clinic'
                      : `${formatDate(appointment.scheduled_at)} · ${formatTime(appointment.scheduled_at)}`}
                  </span>
                  {notes && (
                    <span className="inline-flex min-w-0 items-center gap-1">
                      <Stethoscope size={12} />
                      <span className="truncate">{notes}</span>
                    </span>
                  )}
                </p>
              </div>
            </li>
            )
          })}
        </ul>

          {/* One page needs no controls, and an empty bar reads as broken. */}
          {totalPages > 1 && (
            <div className="border-t border-neutral-100 px-6 py-4 dark:border-neutral-800">
              <Pagination
                currentPage={effectivePage}
                totalPages={totalPages}
                totalItems={list.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemLabel="appointments"
              />
            </div>
          )}
        </>
      )}
    </AccountCard>
  )
}
