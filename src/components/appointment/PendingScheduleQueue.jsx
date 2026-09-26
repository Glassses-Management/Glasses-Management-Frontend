import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PackageCheck } from 'lucide-react'
import CreateAppointmentModal from '@/components/appointment/CreateAppointmentModal'
import PendingScheduleRow from '@/components/appointment/PendingScheduleRow'
import PendingScheduleEmptyState from '@/components/appointment/PendingScheduleEmptyState'
import { getAllOrders } from '@/api/orderApi'
import { getAppointments } from '@/api/appointmentApi'
import { findBookableAppointment, parseOrderRef } from '@/utils/OrderAppointment'
import { parseRequestRef } from '@/utils/RequestOrder'
import { useScheduleTarget } from '@/hook/UseScheduleTarget'

// Status is compared case- and whitespace-insensitively. An exact
// === 'CONFIRMED' test silently emptied this queue whenever the backend
// answered with different casing, and the page gave no hint why.
const statusOf = (order) => String(order?.status ?? '').trim().toUpperCase()

// CONFIRMED covers cart orders the clinic has accepted. PENDING_REVIEW covers
// requests, because POST /api/requests creates an Order at that status. No
// request_type check: that field has been observed null on request-created
// orders, which is what used to empty this queue without warning.
const isBookable = (order) => {
  const status = statusOf(order)
  return status === 'CONFIRMED' || status === 'PENDING_REVIEW'
}

// Orders the clinic has confirmed but not yet booked a fitting for. They are
// not appointments yet - scheduled_at is required on create (API_DOCUMENT.md
// section 11) - so they are queued here until staff pick a date.
//
// Arriving from the Requests page with state.scheduleRequestId opens the
// booking modal straight away for that request.
export default function PendingScheduleQueue({ onScheduled }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Captured once. window.history.state survives a reload, so the id is read
  // into state and then cleared from history below - otherwise refreshing the
  // page would pop the booking modal open again.
  // Keyed as scheduleId because it can be an order id or a request id; both
  // entry points (the requests page and an order's detail page) use this.
  const [focusId] = useState(() => location.state?.scheduleId ?? null)

  const [orders, setOrders] = useState(null)
  // Tracked separately from orders. A failed load used to leave orders empty,
  // which made "the request failed" look exactly like "nothing to schedule".
  const [loadError, setLoadError] = useState('')
  // Orders that already have a dated appointment, and orders not confirmed yet.
  // Both were previously invisible, so a correctly-filtered empty list was
  // indistinguishable from an order that had gone missing.
  const [unconfirmed, setUnconfirmed] = useState(0)
  const [scheduled, setScheduled] = useState([])
  // Appointments already linked to an order/request id, including dateless
  // placeholders. Kept so booking can fill one in instead of adding a second
  // row, which is what used to leave a permanent "Not scheduled yet" behind.
  const [booked, setBooked] = useState({})
  const [target, setTarget, resolveFailed] = useScheduleTarget(focusId, orders, booked)

  // Drop the one-shot flag from history now that it has been captured.
  useEffect(() => {
    if (focusId == null) return
    navigate(location.pathname, { replace: true, state: {} })
  }, [focusId, navigate, location.pathname])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        // Fetched unfiltered and sorted here rather than with two status
        // queries. Relying on GET /orders?status=... meant an order the server
        // did not consider a match simply vanished with no explanation, and it
        // also left no way to tell "confirmed" apart from "never confirmed".
        const [all, appointments] = await Promise.all([
          getAllOrders(),
          getAppointments().catch(() => []),
        ])

        // An appointment may reference its order or the request it came from,
        // so index it under both. Reference matching only - see
        // findBookableAppointment for why we do not guess by customer.
        const linked = {}
        for (const appointment of (Array.isArray(appointments) ? appointments : [])) {
          const orderId = parseOrderRef(appointment?.notes)
          if (orderId != null && !linked[orderId]) linked[orderId] = appointment
          const requestId = parseRequestRef(appointment?.notes)
          if (requestId != null && !linked[requestId]) linked[requestId] = appointment
        }

        if (cancelled) return
        setBooked({ linked })
        setLoadError('')

        // An order with a dated appointment is done. One with only a dateless
        // placeholder stays queued, because it still needs a date.
        const isBooked = (id) => Boolean(linked[id]?.scheduled_at)
        const unique = (list) => list.filter((o, i, all) => all.findIndex((x) => x.id === o.id) === i)

        setOrders(unique(all.filter(isBookable).filter((o) => !isBooked(o.id))))

        // Accounted for explicitly rather than dropped. Every order ends up in
        // exactly one of these three buckets, so the empty state can say which.
        setScheduled(
          unique(all.filter(isBookable).filter((o) => isBooked(o.id))).map((o) => ({
            id: o.id,
            code: o.code,
            date: linked[o.id]?.scheduled_at,
          })),
        )
        setUnconfirmed(all.filter((o) => statusOf(o) === 'PENDING' && !isBooked(o.id)).length)
      }
      catch (err) {
        const status = err?.response?.status
        const detail = err?.response?.data?.message || err?.response?.data?.error || err?.message
        console.error('PendingScheduleQueue: failed to load:', status || detail || err)
        if (!cancelled) {
          setOrders([])
          setBooked({})
          setScheduled([])
          setUnconfirmed(0)
          setLoadError(
            `Could not load orders awaiting a fitting${status ? ` (HTTP ${status})` : ''}: ${detail || 'unknown error'}`,
          )
        }
      }
    }

    void load()
    return () => { cancelled = true }
  }, [])

  // Newest first, same rule as the requests list.
  const sorted = useMemo(
    () => [...(orders || [])].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    [orders],
  )

  if (orders === null) return null

  return (
    <>
      {loadError && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          {loadError}
        </p>
      )}

      {resolveFailed && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          Could not open the booking form for item #{focusId}. It may already have a
          collection date, or it may have been deleted. Pick it from the list below
          instead.
        </p>
      )}

      {sorted.length > 0 ? (
        <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-200">
              <PackageCheck size={16} />
              Orders awaiting a fitting date
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                {sorted.length}
              </span>
            </h2>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Click Schedule to pick a collection date
            </p>
          </div>

          <ul className="mt-4 space-y-2">
            {sorted.map((order) => (
              <PendingScheduleRow
                key={order.id}
                order={order}
                appointment={findBookableAppointment({ linked: booked.linked, id: order.id })}
                focused={focusId != null && order.id === focusId}
                onSchedule={setTarget}
              />
            ))}
          </ul>
        </section>
      ) : (
        !loadError && (
          <PendingScheduleEmptyState unconfirmed={unconfirmed} scheduled={scheduled} />
        )
      )}

      <CreateAppointmentModal
        open={Boolean(target)}
        customerId={target?.customerId}
        customerName={target?.customerName}
        context={target?.context}
        initialNotes={target?.initialNotes}
        optometristRequired={target?.optometristRequired ?? false}
        appointment={target?.appointment || null}
        onClose={() => setTarget(null)}
        onSaved={() => {
          const bookedId = target?.id
          setTarget(null)
          // Drop it locally right away, then let the page refresh its own lists.
          setOrders((prev) => (prev || []).filter((o) => o.id !== bookedId))
          onScheduled?.()
        }}
      />
    </>
  )
}
