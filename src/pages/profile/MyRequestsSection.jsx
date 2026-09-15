import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { getMyRequests } from '@/api/requestApi'
import { formatDate } from '@/utils/FormatDate'

const STATUS_VARIANT = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  PENDING_REVIEW: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'info',
  READY_FOR_PICKUP: 'success',
  COMPLETED: 'neutral',
  CANCELLED: 'neutral',
}

const TYPE_LABEL = {
  exam: 'Eye Examination',
  product: 'Product',
}

// Shows the logged-in customer's submitted requests on their profile page.
// Uses /requests/mine so the backend resolves the customer from the JWT.
export default function MyRequestsSection() {
  const [requests, setRequests] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMyRequests()
      .then((data) => {
        if (!cancelled) setRequests(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (cancelled) return
        // 404 = no linked customer profile (e.g. a staff member) -> treat as empty.
        if (err?.response?.status === 404) {
          if (!cancelled) setRequests([])
          return
        }
        if (!cancelled) setRequests([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-5">
      <p className="text-sm font-semibold text-[#1a1a2e] dark:text-neutral-100">My Requests</p>
      <p className="mt-0.5 mb-4 text-xs text-gray-400 dark:text-neutral-500">Requests you have submitted</p>

      {requests === null ? (
        <p className="rounded-lg bg-gray-50 py-6 text-center text-sm text-gray-400 dark:bg-white/5 dark:text-neutral-500">
          Loading requests…
        </p>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 py-8 text-center dark:bg-white/5">
          <FileText size={20} className="text-gray-300 dark:text-neutral-600" />
          <p className="text-sm text-gray-400 dark:text-neutral-500">No requests yet</p>
          <p className="text-xs text-gray-400 dark:text-neutral-500">Use the Request button to submit one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-xl border border-gray-100 p-4 transition-colors duration-300 dark:border-neutral-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-[#1a1a2e] dark:text-neutral-100">
                  {TYPE_LABEL[req.type] || req.type}
                </p>
                <Badge text={req.status || 'PENDING'} variant={STATUS_VARIANT[req.status] || 'neutral'} />
              </div>
              <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
                Submitted {formatDate(req.createdAt)}
              </p>
              {req.notes && <p className="mt-2 text-sm text-gray-600 dark:text-neutral-300">{req.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}