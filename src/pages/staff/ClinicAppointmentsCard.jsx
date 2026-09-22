import { useMemo } from 'react'
import { CalendarClock } from 'lucide-react'
import Badge from '@/components/ui/Badge'

function toName(customer) {
  return customer?.name || `Customer #${customer?.id || '?'}`
}

function timeLabel(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  const day = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time}`
}

function ClinicAppointmentsCard({ appointments, customers }) {
  const customersById = useMemo(() => {
    const map = new Map()
    ;(Array.isArray(customers) ? customers : []).forEach((c) => map.set(c.id, c))
    return map
  }, [customers])

  const list = useMemo(() => (Array.isArray(appointments) ? appointments : []), [appointments])

  return (
    <div className="rounded-xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-center justify-between gap-2 border-b border-edge px-5 py-4 dark:border-neutral-800">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink dark:text-neutral-50">
          <CalendarClock size={16} className="text-forest dark:text-leaf" />
          Upcoming Appointments
        </h2>
        <Badge text={`${list.length} upcoming`} variant="info" />
      </div>

      {list.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-500 dark:text-neutral-400">
          No scheduled appointments.
        </p>
      ) : (
        <ul className="divide-y divide-edge dark:divide-neutral-800">
          {list.map((appt) => {
            const customer = customersById.get(appt.customer_id)
            return (
              <li key={appt.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink dark:text-neutral-100">
                    {toName(customer)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                    {timeLabel(appt.scheduled_at)}
                  </p>
                </div>
                <Badge text={appt.status} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ClinicAppointmentsCard