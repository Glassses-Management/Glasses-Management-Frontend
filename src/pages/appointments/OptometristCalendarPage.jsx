import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { getAppointmentsByOptometrist, updateAppointment } from '@/api/appointmentApi'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { formatDateTime } from '@/utils/format'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const STATUS_BADGE = { PENDING_REVIEW: 'warning', SCHEDULED: 'info', COMPLETED: 'success', CANCELLED: 'danger' }

const toDateKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const chipClasses = {
  SCHEDULED: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300',
  COMPLETED: 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300',
  CANCELLED: 'border-red-200 bg-red-50 text-red-500 line-through dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400',
  PENDING_REVIEW: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300',
}

function OptometristCalendarPage() {
  const { user } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()

  const [month, setMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const data = await getAppointmentsByOptometrist(user.id)
      setAppointments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('OptometristCalendarPage: failed to load:', err?.response?.status || err?.message || err)
      toastError(err?.response?.data?.message || err?.message || 'Failed to load your appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    if (!user?.id) return undefined
    getAppointmentsByOptometrist(user.id)
      .then((data) => { if (!cancelled) setAppointments(Array.isArray(data) ? data : []) })
      .catch((err) => {
        if (cancelled) return
        console.error('OptometristCalendarPage: failed to load:', err?.response?.status || err?.message || err)
        toastError(err?.response?.data?.message || err?.message || 'Failed to load your appointments')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [user?.id])

  const days = useMemo(() => {
    const cells = []
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    for (let i = 0; i < first.getDay(); i++) cells.push(null)
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    for (let d = 1; d <= total; d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d)
      cells.push({ date, key: toDateKey(date) })
    }
    return cells
  }, [month])

  const byDate = useMemo(() => {
    const map = {}
    appointments.forEach((a) => {
      if (!a.scheduled_at) return
      const key = toDateKey(new Date(a.scheduled_at))
      map[key] = map[key] || []
      map[key].push(a)
    })
    return map
  }, [appointments])

  const todayKey = toDateKey(new Date())
  const shiftMonth = (delta) => setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))

  const handleComplete = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await updateAppointment(selected.id, {
        customer_id: selected.customer_id ?? null,
        optometrist_id: selected.optometrist_id ?? null,
        scheduled_at: selected.scheduled_at ?? null,
        status: 'COMPLETED',
        notes: selected.notes || '',
      })
      toastSuccess(`Appointment #${selected.id} marked as completed.`)
      setSelected(null)
      await load()
    } catch (err) {
      toastError(err?.response?.data?.message || err?.message || 'Failed to update appointment')
    } finally {
      setSaving(false)
    }
  }

  const canComplete = selected && selected.status !== 'COMPLETED' && selected.status !== 'CANCELLED'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">My Calendar</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          Your scheduled appointments for {monthLabel(month)}.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-neutral-50">{monthLabel(month)}</h2>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" icon={<ChevronLeft size={16} />} onClick={() => shiftMonth(-1)} aria-label="Previous month" />
            <Button variant="ghost" size="sm" onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>
              Today
            </Button>
            <Button variant="outline" size="sm" icon={<ChevronRight size={16} />} onClick={() => shiftMonth(1)} aria-label="Next month" />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500 dark:text-neutral-400">Loading your calendar…</div>
        ) : (
          <>
            <div className="grid grid-cols-7 border-b border-gray-100 text-center text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-neutral-800 dark:text-neutral-500">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((cell, i) =>
                cell ? (
                  <div
                    key={cell.key}
                    className={`min-h-24 border-b border-r border-gray-100 p-1.5 dark:border-neutral-800 ${
                      i % 7 === 6 ? 'border-r-0' : ''
                    }`}
                  >
                    <div className="flex justify-end">
                      <span
                        className={`inline-flex size-6 items-center justify-center rounded-full text-xs ${
                          cell.key === todayKey
                            ? 'bg-violet-600 font-semibold text-white'
                            : 'text-gray-600 dark:text-neutral-300'
                        }`}
                      >
                        {cell.date.getDate()}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1">
                      {(byDate[cell.key] || []).map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setSelected(a)}
                          className={`block w-full truncate rounded-md border px-1.5 py-1 text-left text-[11px] transition-colors duration-200 hover:opacity-80 ${chipClasses[a.status] || chipClasses.PENDING_REVIEW}`}
                        >
                          {formatTime(a.scheduled_at)} · {a.customer_name || `#${a.customer_id}`}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div key={`blank-${i}`} className="min-h-24 border-b border-r border-gray-100 bg-gray-50/60 dark:border-neutral-800 dark:bg-black/20" />
                ),
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={`Appointment #${selected?.id ?? ''}`}
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setSelected(null)} disabled={saving}>Close</Button>
            {canComplete && (
              <Button onClick={handleComplete} loading={saving}>Mark as Completed</Button>
            )}
          </div>
        }
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <Badge text={selected?.status} variant={STATUS_BADGE[selected?.status] || 'neutral'} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500 dark:text-neutral-400">Customer</span>
            <span className="font-medium text-gray-900 dark:text-neutral-100">{selected?.customer_name || `Customer #${selected?.customer_id}`}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500 dark:text-neutral-400">Scheduled</span>
            <span className="font-medium text-gray-900 dark:text-neutral-100">{selected?.scheduled_at ? formatDateTime(selected.scheduled_at) : '—'}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500 dark:text-neutral-400">Notes</span>
            <span className="max-w-[60%] text-right font-medium text-gray-900 dark:text-neutral-100">{selected?.notes || '—'}</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const formatTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return formatDateTime(iso)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

const monthLabel = (date) =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

export default OptometristCalendarPage