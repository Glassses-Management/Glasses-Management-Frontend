import { CalendarCheck } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import RequestApprovalActions from '@/components/request/RequestApprovalActions'
import RequestStepper from '@/components/request/RequestStepper'
import { getAvatarColors, getInitials } from '@/utils/avatar'
import { formatDate } from '@/utils/FormatDate'
import {
  REQUEST_TYPE_LABEL,
  REQUEST_PENDING,
  REQUEST_REJECTED,
  reachedStep,
} from '@/utils/RequestOrder'

const STATUS_VARIANT = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  CONFIRMED: 'info',
  IN_PROGRESS: 'info',
  READY_FOR_PICKUP: 'success',
  COMPLETED: 'neutral',
  CANCELLED: 'neutral',
}

const STATUS_ACCENT = {
  PENDING: 'bg-blue-500',
  APPROVED: 'bg-emerald-500',
  REJECTED: 'bg-red-500',
  CONFIRMED: 'bg-emerald-500',
  IN_PROGRESS: 'bg-amber-500',
  READY_FOR_PICKUP: 'bg-emerald-500',
  COMPLETED: 'bg-gray-400',
  CANCELLED: 'bg-red-500',
}

function Avatar({ name, id }) {
  const { bg, text } = getAvatarColors(id)
  return (
    <span
      className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {getInitials(name)}
    </span>
  )
}

export default function RequestCard({ request, appointment, onChanged }) {
  // Only a row that actually has a date counts as booked. A placeholder
  // appointment with no scheduled_at must still show as needing a schedule.
  const scheduled = Boolean(appointment?.scheduled_at)
  const declined = request.status === REQUEST_REJECTED

  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-[#1c1c28]">
      <div aria-hidden="true" className={`w-1 shrink-0 ${STATUS_ACCENT[request.status] || 'bg-gray-300'}`} />
      <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-start">
        <Avatar name={request.customer_name || '?'} id={request.customer_id} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className="font-semibold text-gray-900 dark:text-neutral-100">
              {request.customer_name || 'Unknown customer'}
            </span>
            <span className="text-xs font-medium text-gray-400 dark:text-neutral-500">#{request.id}</span>
            <Badge text={request.status || REQUEST_PENDING} variant={STATUS_VARIANT[request.status] || 'neutral'} />
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
              {REQUEST_TYPE_LABEL[request.type] || request.type}
            </span>
          </div>

          <p className="mt-2 text-sm font-medium leading-relaxed text-gray-800 dark:text-neutral-200">
            "{request.notes || 'No notes provided'}"
          </p>

          <p className="mt-1.5 text-xs text-gray-400 dark:text-neutral-500">
            Requested {formatDate(request.createdAt)} · Patient ID {request.customer_id || '–'}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <RequestStepper current={reachedStep(request, scheduled)} />
            {scheduled && !declined && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
                <CalendarCheck size={12} /> Appointment scheduled
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <RequestApprovalActions request={request} onChanged={onChanged} />
        </div>
      </div>
    </div>
  )
}
