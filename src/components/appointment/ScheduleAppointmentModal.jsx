import { useEffect, useState } from 'react'
import { Stethoscope, Clock, Calendar, FileText } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { updateAppointment } from '@/api/appointmentApi'
import { getOptometrists } from '@/api/userApi'
import { useToast } from '@/hook/UseToast'
import { required } from '@/utils/Validators'

const STATUS_OPTIONS = [
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

function toDateTimeLocal(iso) {
  if (!iso) return ''
  const match = String(iso).match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)
  return match ? match[0] : ''
}

function displayName(opt) {
  return opt?.name || opt?.email || opt?.username || `Optometrist #${opt?.id}`
}

function ScheduleAppointmentModal({ open, appointment, mode = 'edit', onClose, onSaved }) {
  const isSchedule = mode === 'schedule'
  const { success: toastSuccess, error: toastError } = useToast()

  const [optometrists, setOptometrists] = useState([])
  const [form, setForm] = useState({ optometrist_id: '', scheduled_at: '', status: 'SCHEDULED', notes: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm({
      optometrist_id: appointment?.optometrist_id != null ? String(appointment.optometrist_id) : '',
      scheduled_at: appointment?.scheduled_at ? toDateTimeLocal(appointment.scheduled_at) : '',
      status: appointment?.status || 'SCHEDULED',
      notes: appointment?.notes || '',
    })
    setErrors({})
  }, [open, appointment])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    getOptometrists()
      .then((list) => { if (!cancelled) setOptometrists(Array.isArray(list) ? list : []) })
      .catch((err) => {
        if (cancelled) return
        console.error('ScheduleAppointmentModal: failed to load optometrists:', err?.response?.status || err?.message || err)
        toastError(err?.response?.data?.message || err?.message || 'Failed to load optometrists')
        if (!cancelled) setOptometrists([])
      })
    return () => { cancelled = true }
  }, [open])

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}

    if (isSchedule) {
      nextErrors.optometrist_id = required(form.optometrist_id)
      if (!form.scheduled_at) {
        nextErrors.scheduled_at = 'Date & time is required when scheduling'
      } else if (new Date(form.scheduled_at) <= new Date()) {
        nextErrors.scheduled_at = 'Date & time must be in the future'
      }
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setSaving(true)
    try {
      await updateAppointment(appointment.id, {
        optometrist_id: form.optometrist_id ? Number(form.optometrist_id) : null,
        scheduled_at: form.scheduled_at ? `${form.scheduled_at}:00` : null,
        status: isSchedule ? 'SCHEDULED' : form.status,
        notes: form.notes || '',
      })
      toastSuccess(isSchedule ? 'Appointment scheduled successfully.' : 'Appointment updated successfully.')
      onSaved?.()
      onClose()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to save appointment'
      toastError(msg)
    } finally {
      setSaving(false)
    }
  }

  const title = isSchedule ? `Schedule Appointment #${appointment?.id ?? ''}` : `Edit Appointment #${appointment?.id ?? ''}`

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-neutral-500">
            {(appointment?.customer_name || `Customer #${appointment?.customer_id ?? '?'}`)} · {appointment?.status || '—'}
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} loading={saving}>
              {isSchedule ? 'Save & Schedule' : 'Save Changes'}
            </Button>
          </div>
        </div>
      }
    >
      <form id="schedule-appointment-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="Optometrist" icon={Stethoscope} required={isSchedule} helper={isSchedule ? 'Assign an optometrist to this appointment.' : undefined}>
          <select
            name="optometrist_id"
            value={form.optometrist_id}
            onChange={(e) => set('optometrist_id', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100"
          >
            <option value="">{isSchedule ? 'Select an optometrist…' : 'Unassigned'}</option>
            {optometrists.map((opt) => (
              <option key={opt.id} value={opt.id}>{displayName(opt)}</option>
            ))}
          </select>
          {errors.optometrist_id && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.optometrist_id}</p>}
          {isSchedule && optometrists.length === 0 && !errors.optometrist_id && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              No optometrists found. Check the console for errors or that users with the OPTOMETRIST role exist.
            </p>
          )}
        </Field>

        <Field
          label="Date & Time"
          icon={Clock}
          required={isSchedule}
          name="scheduled_at"
          type="datetime-local"
          value={form.scheduled_at}
          onChange={(e) => set('scheduled_at', e.target.value)}
          error={errors.scheduled_at}
        />

        {!isSchedule && (
          <Field label="Status" icon={Calendar} name="status">
            <select
              name="status"
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Notes" icon={FileText} helper="Pre-filled from the customer's original request.">
          <textarea
            name="notes"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={3}
            placeholder="Add any relevant notes about this appointment…"
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500 h-20 overflow-y-auto"
          />
        </Field>
      </form>
    </Modal>
  )
}

export default ScheduleAppointmentModal