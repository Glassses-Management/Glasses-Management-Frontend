import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, ClipboardList, Plus, Send } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import AccountCard from '@/pages/public/account/AccountCard'
import Pagination from '@/components/ui/Pagination'
import RequestStepper from '@/components/request/RequestStepper'
import { getMyRequests } from '@/api/requestApi'
import { getMyAppointments } from '@/api/appointmentApi'
import { useOwnCustomerId } from '@/hook/UseOwnCustomerId'
import { formatDate } from '@/utils/FormatDate'
import {
  parseRequestRef,
  reachedStep,
  REQUEST_TYPE_LABEL,
  REQUEST_PENDING,
  REQUEST_APPROVED,
  REQUEST_REJECTED,
} from '@/utils/RequestOrder'

// Matches the other account lists. Paging is done here rather than on the server
// because /api/requests/mine returns the whole list unpaginated.
const ITEMS_PER_PAGE = 5

// Plain-language status so the customer can see where their request is up to.
// Kept to one or two words: the badge sits next to the type, and the stepper
// below already spells out the progress.
const STATUS_LABEL = {
  PENDING: 'Awaiting approval',
  APPROVED: 'Approved',
  REJECTED: 'Declined',
  COMPLETED: 'Completed',
}

function RequestRow({ request, appointment }) {
  const rejected = request.status === REQUEST_REJECTED
  const approved = request.status === REQUEST_APPROVED
  // The backend creates the appointment as soon as the request is approved, with
  // no date until staff schedule it, so an appointment here is not yet a booking.
  const bookedAt = appointment?.scheduled_at

  return (
    <li className="flex flex-col gap-2.5 px-6 py-5" data-aos="fade-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            <ClipboardList size={15} className="text-forest dark:text-leaf" />
            {REQUEST_TYPE_LABEL[request.type] || request.type}
            <span className="text-xs font-medium text-neutral-400">#{request.id}</span>
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {formatDate(request.createdAt)}
          </p>
        </div>
        <Badge
          text={STATUS_LABEL[request.status] || request.status || REQUEST_PENDING}
          variant={rejected ? 'danger' : approved ? 'success' : 'warning'}
        />
      </div>

      {/* The customer's own words. Clamped to one line: this is free text of any
          length, and one long note was enough to swamp the whole list. */}
      {request.notes && (
        <p className="line-clamp-1 text-sm text-neutral-700 dark:text-neutral-300" title={request.notes}>
          {request.notes}
        </p>
      )}

      <RequestStepper current={reachedStep(request, Boolean(appointment))} />

      {rejected && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Give us a call if anything looks wrong.</p>
      )}

      {/* Approved-with-no-date needs no line of its own: the badge reads
          "Approved" and the stepper's last pill is still grey. */}
      {bookedAt && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-600 dark:text-neutral-300">
          <CalendarCheck size={13} className="text-forest dark:text-leaf" />
          <span className="font-semibold">Booked</span>
          <span>{formatDate(bookedAt, { withTime: true })}</span>
        </p>
      )}
    </li>
  )
}

export default function AccountRequests() {
  const { customerId } = useOwnCustomerId()
  const [requests, setRequests] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (customerId == null) {
        setRequests([])
        setAppointments([])
        return
      }
      try {
        // /requests/mine resolves the customer from the JWT. Appointments have no
        // such route, so the id from /customers/me is passed instead. 404 just
        // means this account has no linked customer profile.
        const [reqs, appts] = await Promise.allSettled([getMyRequests(), getMyAppointments()])

        if (cancelled) return

        if (reqs.status === 'rejected') {
          const err = reqs.reason
          const status = err?.response?.status
          if (status === 404) {
            setRequests([])
            setError('')
            return
          }
          const detail = err?.response?.data?.error || err?.response?.data?.message || err?.message
          setError(`Could not load your requests${status ? ` (HTTP ${status})` : ''}: ${detail || 'unknown error'}`)
          setRequests([])
          return
        }

        setRequests(
          (Array.isArray(reqs.value) ? reqs.value : []).sort((a, b) => {
            const ta = Date.parse(a?.createdAt ?? a?.created_at ?? '')
            const tb = Date.parse(b?.createdAt ?? b?.created_at ?? '')
            const aBad = Number.isNaN(ta)
            const bBad = Number.isNaN(tb)
            if (!aBad && !bBad && ta !== tb) return tb - ta
            return (b?.id ?? 0) - (a?.id ?? 0)
          }),
        )
        setAppointments(appts.status === 'fulfilled' && Array.isArray(appts.value) ? appts.value : [])
        setError('')
      }
      catch (err) {
        if (cancelled) return
        setError(err?.message || 'Failed to load your requests.')
        setRequests([])
      }
    }

    void load()
    return () => { cancelled = true }
  }, [customerId])

  // Appointments carry no order_id, so the link back to a request is the
  // reference text in the notes (see utils/RequestOrder).
  const appointmentByRequest = useMemo(() => {
    const map = new Map()
    for (const appointment of appointments) {
      const requestId = parseRequestRef(appointment?.notes)
      if (requestId != null && !map.has(requestId)) map.set(requestId, appointment)
    }
    return map
  }, [appointments])

  // requests is null until the first load settles, and this math runs on every
  // render - before the loading branch below can guard it. Hence the fallback.
  const list = requests ?? []
  const totalPages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE))
  // Clamped so the last page cannot end up showing nothing.
  const effectivePage = Math.min(currentPage, totalPages)
  const paged = list.slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE)

  return (
    <AccountCard>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 pt-6 pb-4 dark:border-neutral-800" data-aos="fade-up">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
            <Send size={16} />
          </span>
          <div>
            <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
              My Requests
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Product and eye exam requests you have submitted
            </p>
          </div>
        </div>
        <Link
          to="/request"
          className="inline-flex items-center gap-1.5 rounded-lg border border-forest px-3.5 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white dark:border-leaf dark:text-leaf dark:hover:bg-leaf dark:hover:text-forest"
        >
          <Plus size={15} />
          New Request
        </Link>
      </div>

      {error ? (
        <p className="px-6 py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : requests === null ? (
        <div className="space-y-3 px-6 py-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-mist dark:bg-[#1E332B]" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <ClipboardList size={32} className="mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No requests yet</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Submit a product or eye exam request and track it here.
          </p>
        </div>
      ) : (
        <>
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {paged.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              appointment={appointmentByRequest.get(request.id)}
            />
          ))}
        </ul>

          {/* One page needs no controls, and an empty bar reads as broken. */}
          {totalPages > 1 && (
            <div className="border-t border-neutral-100 px-6 py-4 dark:border-neutral-800">
              <Pagination
                currentPage={effectivePage}
                totalPages={totalPages}
                totalItems={list.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemLabel="requests"
              />
            </div>
          )}
        </>
      )}
    </AccountCard>
  )
}
