import { useEffect, useState } from 'react'
import { CalendarClock, Stethoscope, Clock, FileText } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { getMyAppointments } from '@/api/appointmentApi'
import { useOwnCustomerId } from '@/hook/UseOwnCustomerId'
import { getAppointmentKind } from '@/utils/OrderAppointment'
import { appointmentStatus, stripInternalRefs } from '@/utils/RequestOrder'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { formatDate, formatDateTime } from '@/utils/format'

const STATUS_BADGE = { PENDING_REVIEW: 'warning', PENDING_SCHEDULING: 'warning', SCHEDULED: 'info', COMPLETED: 'success', CANCELLED: 'danger' }

function row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <Icon size={16} className="shrink-0 text-gray-400 dark:text-neutral-500" />
      <span className="text-gray-500 dark:text-neutral-400">{label}</span>
      <span className="ml-auto text-right font-medium text-gray-900 dark:text-neutral-100">{value}</span>
    </div>
  )
}

function MyAppointmentPage() {
  const { user } = useAuth()
  const { customerId } = useOwnCustomerId()
  const { error: toastError } = useToast()
  // While there is no signed-in customer record yet there is nothing to fetch,
  // so "loading" is derived from this rather than being cleared inside the
  // effect - setting it there would be a synchronous cascading render.
  const canFetch = Boolean(user?.id) && customerId != null
  const [appointments, setAppointments] = useState([])
  const [fetching, setFetching] = useState(true)
  const loading = canFetch && fetching

  useEffect(() => {
    if (!canFetch) return undefined
    let cancelled = false
    getMyAppointments()
      .then((data) => { if (!cancelled) setAppointments(Array.isArray(data) ? data : []) })
      .catch((err) => {
        if (cancelled) return
        console.error('MyAppointmentPage: failed to load:', err?.response?.status || err?.message || err)
        toastError(err?.response?.data?.message || err?.message || 'Failed to load your appointments')
      })
      .finally(() => { if (!cancelled) setFetching(false) })
    return () => { cancelled = true }
  }, [user?.id, customerId, canFetch, toastError])

  const sorted = [...appointments].sort((a, b) => {
    const da = (a.scheduled_at || a.created_at || '').toString()
    const db = (b.scheduled_at || b.created_at || '').toString()
    return db.localeCompare(da)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">My Appointments</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          Track your eye exam requests and scheduled visits.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm dark:bg-surface-dark dark:text-neutral-400">
          Loading your appointments…
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center dark:bg-surface-dark">
          <CalendarClock size={40} className="mx-auto text-gray-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">You don't have any appointments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sorted.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-surface-dark"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-neutral-50">{getAppointmentKind(a)}</p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500">Requested {formatDate(a.createdAt)}</p>
                </div>
                <Badge
                  text={appointmentStatus(a.status).label}
                  variant={STATUS_BADGE[a.status] || appointmentStatus(a.status).variant}
                />
              </div>

              <div className="space-y-2.5">
                {a.scheduled_at
                  ? row({ icon: Clock, label: 'Scheduled', value: formatDateTime(a.scheduled_at) })
                  : row({ icon: Clock, label: 'Scheduled', value: 'Waiting for staff to schedule' })}
                {a.optometrist_name
                  ? row({ icon: Stethoscope, label: 'Optometrist', value: a.optometrist_name })
                  : row({ icon: Stethoscope, label: 'Optometrist', value: 'To be assigned' })}
                {stripInternalRefs(a.notes) &&
                  row({ icon: FileText, label: 'Notes', value: stripInternalRefs(a.notes) })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointmentPage