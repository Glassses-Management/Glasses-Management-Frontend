import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Stethoscope, Clock, Calendar } from 'lucide-react'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { composeValidators, required } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { createAppointment, updateAppointment } from '@/api/appointmentApi'

const minDateTime = () => {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const AppointmentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success: toastSuccess } = useToast()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    customer_id: '',
    optometrist_id: '',
    scheduled_at: '',
    status: 'SCHEDULED',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const nextErrors = {
      customer_id: composeValidators(required)(form.customer_id),
      scheduled_at: composeValidators(required)(form.scheduled_at) ||
        (form.scheduled_at && new Date(form.scheduled_at) <= new Date() ? 'Date & time must be in the future' : ''),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some((err) => err)) return

    setSubmitting(true)
    try {
      const payload = {
        customer_id: Number(form.customer_id),
        optometrist_id: form.optometrist_id ? Number(form.optometrist_id) : undefined,
        scheduled_at: form.scheduled_at,
        status: form.status,
        notes: form.notes || '',
      }

      if (isEdit) {
        await updateAppointment(id, payload)
        toastSuccess('Appointment updated successfully.')
      } else {
        await createAppointment(payload)
        toastSuccess('Appointment created successfully.')
      }
      navigate('/dashboard/appointments')
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to save appointment'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const goBack = isEdit ? `/dashboard/appointments/${id}` : '/dashboard/appointments'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
        <Link to="/dashboard/appointments" className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Appointments
        </Link>
        <span aria-hidden="true" className="text-gray-300 dark:text-neutral-600">/</span>
        <span className="font-medium text-gray-900 dark:text-neutral-50">
          {isEdit ? 'Edit Appointment' : 'New Appointment'}
        </span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">
          {isEdit ? 'Edit Appointment' : 'New Appointment'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          {isEdit ? 'Update the appointment details.' : 'Schedule a new eye exam or consultation.'}
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>
      )}

      <Card title="Appointment Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Customer ID" icon={User} name="customer_id" required value={form.customer_id} onChange={(e) => set('customer_id', e.target.value)} error={errors.customer_id} placeholder="Enter customer ID" />
          <Field label="Optometrist ID" icon={Stethoscope} name="optometrist_id" value={form.optometrist_id} onChange={(e) => set('optometrist_id', e.target.value)} error={errors.optometrist_id} placeholder="Optional" />
          <Field label="Date & Time" icon={Clock} name="scheduled_at" type="datetime-local" min={minDateTime()} required value={form.scheduled_at} onChange={(e) => set('scheduled_at', e.target.value)} error={errors.scheduled_at} />
          <Field label="Status" icon={Calendar} name="status" value={form.status} onChange={(e) => set('status', e.target.value)}>
            <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-100 dark:focus:border-[#8fa88f]">
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </Field>
        </div>
      </Card>

      <Card title="Notes">
        <div className="flex flex-col gap-2">
          <textarea
            name="notes"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Add any relevant notes about this appointment..."
            rows={4}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-100 dark:focus:border-[#8fa88f] dark:placeholder:text-neutral-500"
          />
        </div>
      </Card>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200/60 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#1c1c28]/80 md:-mx-6 md:px-6 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-xs text-gray-400 dark:text-neutral-500 sm:block">
            {isEdit ? 'Changes apply immediately.' : 'The appointment will appear in the list after saving.'}
          </p>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(goBack)}>Cancel</Button>
            <Button type="submit" loading={submitting}>
              {isEdit ? 'Update Appointment' : 'Create Appointment'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AppointmentForm
