import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getAppointmentById } from '@/api/appointmentApi'
import { formatDateTime } from '@/utils/format'

function AppointmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await getAppointmentById(id)
        if (!cancelled) setAppointment(data)
      } catch (err) {
        console.error('AppointmentDetailPage: failed to load:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800" />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-neutral-400">Appointment not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/appointments')}>
          Back to Appointments
        </Button>
      </div>
    )
  }

  const customerName = appointment.customer_name || `Customer #${appointment.customer_id || '?'}`
  const optometristName = appointment.optometrist_name || appointment.optometrist_id || '—'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard/appointments')}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#1a1a2e] dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-100"
          aria-label="Back to appointments"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-neutral-50">Appointment #{appointment.id}</h1>
          <p className="text-sm text-gray-400 dark:text-neutral-500">
            {formatDateTime(appointment.scheduled_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
          <h3 className="mb-4 font-semibold text-[#1a1a2e] dark:text-neutral-50">Details</h3>
          <div className="space-y-3">
            {[
              ['Customer', customerName],
              ['Optometrist', optometristName],
              ['Date & Time', formatDateTime(appointment.scheduled_at)],
              ['Status', appointment.status],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-500 dark:text-neutral-400">{label}</span>
                <span className="font-medium text-[#1a1a2e] dark:text-neutral-100">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
          <h3 className="mb-4 font-semibold text-[#1a1a2e] dark:text-neutral-50">Notes</h3>
          <p className="text-sm text-gray-600 dark:text-neutral-300">
            {appointment.notes || 'No notes provided.'}
          </p>
          <div className="mt-4">
            <Badge text={appointment.status} variant="info" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate(`/dashboard/appointments/${id}/edit`)}>
          Edit
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/appointments')}>
          Back to List
        </Button>
      </div>
    </div>
  )
}

export default AppointmentDetailPage
