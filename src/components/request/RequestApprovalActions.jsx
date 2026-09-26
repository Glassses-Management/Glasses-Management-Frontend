import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarPlus, Check, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { approveRequest, rejectRequest } from '@/api/requestApi'
import { useToast } from '@/hook/UseToast'
import { REQUEST_PENDING, REQUEST_APPROVED, REQUEST_REJECTED } from '@/utils/RequestOrder'

// Product-request flow: the clinic approves the request first, and only an
// approved request can be given an appointment. Booking happens on the
// Appointments page so there is one place where fittings are scheduled.
export default function RequestApprovalActions({ request, onChanged }) {
  const { success: toastSuccess, error: toastError } = useToast()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(null)

  const handleApprove = async () => {
    setBusy('approve')
    try {
      await approveRequest(request.id)
      toastSuccess('Request approved. You can now schedule an appointment.')
      onChanged?.()
    }
    catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to approve request'
      toastError(msg)
    }
    finally {
      setBusy(null)
    }
  }

  const handleDecline = async () => {
    setBusy('decline')
    try {
      await rejectRequest(request.id)
      toastSuccess('Request declined.')
      onChanged?.()
    }
    catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to decline request'
      toastError(msg)
    }
    finally {
      setBusy(null)
    }
  }

  if (request.status === REQUEST_PENDING) {
    return (
      <>
        <Button size="sm" className="!bg-green-600 hover:!bg-green-700" icon={<Check size={14} />} loading={busy === 'approve'} disabled={busy != null} onClick={handleApprove}>
          Approve
        </Button>
        <Button size="sm" variant="danger" icon={<X size={14} />} loading={busy === 'decline'} disabled={busy != null} onClick={handleDecline}>
          Decline
        </Button>
      </>
    )
  }

  if (request.status === REQUEST_APPROVED) {
    return (
      <Button
        size="sm"
        variant="forest"
        icon={<CalendarPlus size={14} />}
        onClick={() => navigate('/dashboard/appointments', { state: { scheduleId: request.id } })}
      >
        Schedule Appointment
      </Button>
    )
  }

  if (request.status === REQUEST_REJECTED) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30">
        <X size={12} /> Declined
      </span>
    )
  }

  return null
}
