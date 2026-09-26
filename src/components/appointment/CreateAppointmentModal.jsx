import { useEffect, useState } from 'react'
import { CalendarCheck, Clock, FileText, Stethoscope } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { createAppointment, updateAppointment } from '@/api/appointmentApi'
import { getOptometrists } from '@/api/userApi'
import { useToast } from '@/hook/UseToast'
import { REQUEST_NOTES_MAX } from '@/utils/RequestOrder'

function minDateTime() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function displayName(optometrist) {
  return optometrist?.name || optometrist?.email || `Optometrist #${optometrist?.id}`
}

// Books a fitting appointment for a customer. Used by the request flow and by
// the orders flow when staff confirm a cart order.
//
// `appointment` is an already-linked appointment row. Approving a request can
// leave a placeholder with no date on it; when one exists we fill it in with
// PUT instead of POSTing a second row, otherwise the Appointments page keeps
// showing the empty placeholder as "not scheduled" forever.
// `optometristRequired` defaults to true because an eye exam needs one. A
// product/eyewear order does not: the backend treats optometrist_id as
// optional (API_DOCUMENT.md section 11), so the form must not force it either.
export default function CreateAppointmentModal({
  open,
  customerId,
  customerName,
  context,
  initialNotes = '',
  appointment = null,
  optometristRequired = true,
  onClose,
  onSaved,
  onSkip,
  skipLabel = 'Skip',
}) {
  if (!open || customerId == null) return null

  return (
    <AppointmentDialog
      customerId={customerId}
      customerName={customerName}
      context={context}
      initialNotes={initialNotes}
      appointment={appointment}
      optometristRequired={optometristRequired}
      onClose={onClose}
      onSaved={onSaved}
      onSkip={onSkip}
      skipLabel={skipLabel}
    />
  )
}

function AppointmentDialog({ customerId, customerName, context, initialNotes, appointment, optometristRequired, onClose, onSaved, onSkip, skipLabel }) {
  const { success: toastSuccess, error: toastError } = useToast()
  const [optometrists, setOptometrists] = useState([])
  const [form, setForm] = useState(() => ({ optometrist_id: '', scheduled_at: '', notes: initialNotes }))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    getOptometrists()
      .then((list) => { if (!cancelled) setOptometrists(Array.isArray(list) ? list : []) })
      .catch(() => { if (!cancelled) setOptometrists([]) })
    return () => { cancelled = true }
  }, [])

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = {}
    if (optometristRequired && !form.optometrist_id) nextErrors.optometrist_id = 'Select an optometrist'
    if (!form.scheduled_at) nextErrors.scheduled_at = 'Date & time is required'
    else if (new Date(form.scheduled_at) <= new Date()) nextErrors.scheduled_at = 'Date & time must be in the future'
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setSaving(true)
    try {
      const payload = {
        customer_id: customerId,
        // Number('') is 0, not NaN, so an empty picker must become null rather
        // than 0 or the backend rejects it as a bad foreign key.
        optometrist_id: form.optometrist_id ? Number(form.optometrist_id) : null,
        scheduled_at: `${form.scheduled_at}:00`,
        status: 'SCHEDULED',
        notes: form.notes.slice(0, REQUEST_NOTES_MAX),
      }
      const saved = appointment
        ? await updateAppointment(appointment.id, payload)
        : await createAppointment(payload)
      toastSuccess('Appointment scheduled.')
      onSaved?.(saved)
      onClose()
    }
    catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to schedule appointment'
      toastError(msg)
    }
    finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Schedule appointment"
      maxWidth="max-w-lg"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          {onSkip ? (
            <Button type="button" variant="ghost" onClick={onSkip} disabled={saving}>
              {skipLabel}
            </Button>
          ) : <span />}
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} loading={saving}>
              Save &amp; Schedule
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-white/5 dark:text-neutral-400">
          {context || 'Appointment'} for {customerName || `customer #${customerId}`}
        </p>

        <Field
          label={optometristRequired ? 'Optometrist' : 'Optometrist (optional)'}
          icon={Stethoscope}
          required={optometristRequired}
        >
          <select
            name="optometrist_id"
            value={form.optometrist_id}
            onChange={(e) => set('optometrist_id', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100"
          >
            <option value="">{optometristRequired ? 'Select an optometrist…' : 'Not assigned yet'}</option>
            {optometrists.map((optometrist) => (
              <option key={optometrist.id} value={optometrist.id}>{displayName(optometrist)}</option>
            ))}
          </select>
          {errors.optometrist_id && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.optometrist_id}</p>}
          {optometrists.length === 0 && !errors.optometrist_id && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              No optometrists found. Check that users with the OPTOMETRIST role exist.
            </p>
          )}
        </Field>

        <Field
          label="Date & Time"
          icon={Clock}
          required
          name="scheduled_at"
          type="datetime-local"
          min={minDateTime()}
          value={form.scheduled_at}
          onChange={(e) => set('scheduled_at', e.target.value)}
          error={errors.scheduled_at}
        />

        <Field
          label="Notes"
          icon={FileText}
          name="notes"
          helper={`Max ${REQUEST_NOTES_MAX} characters.`}
        >
          <textarea
            name="notes"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={3}
            maxLength={REQUEST_NOTES_MAX}
            className="h-20 w-full resize-none overflow-y-auto rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100"
          />
        </Field>

        <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-neutral-500">
          <CalendarCheck size={13} /> The customer sees this appointment on their account page.
        </p>
      </form>
    </Modal>
  )
}
