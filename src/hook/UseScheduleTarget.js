import { useEffect, useRef, useState } from 'react'
import { getRequestById } from '@/api/requestApi'
import { getOrderById } from '@/api/orderApi'
import { buildOrderAppointmentNotes, findBookableAppointment, isPrescriptionRequest } from '@/utils/OrderAppointment'
import { buildAppointmentNotes, REQUEST_TYPE_LABEL } from '@/utils/RequestOrder'

// Booking target built from a queued order row.
//
// A plain product order (sunglasses, a frame bought from the cart) is a purchase,
// not an exam, so no optometrist is needed. An order that came from a
// prescription-change or eye-exam request does need one - that appointment is
// the clinical visit, so the optometrist must be chosen.
//
// `existing` is the appointment already linked to this order or request, if
// any. Approving a request can leave a placeholder with no date on it, so the
// modal fills that row in with PUT rather than adding a second one.
export const orderTarget = (order, existing = null) => {
  const needsExam = isPrescriptionRequest(order)
  return {
    id: order.id,
    customerId: order.customer_id,
    customerName: order.customer_name,
    context: needsExam
      ? 'Prescription change'
      : order.request_type
        ? 'Customer request'
        : `Confirmed order #${order.id}`,
    initialNotes: buildOrderAppointmentNotes(order),
    optometristRequired: needsExam,
    appointment: existing,
  }
}

// Booking target built from a customer request. An eye exam is carried out by an
// optometrist, so that one still has to be chosen; a product request does not.
const requestTarget = (request, existing = null) => ({
  id: request.id,
  customerId: request.customer_id,
  customerName: request.customer_name,
  context: REQUEST_TYPE_LABEL[request?.type] || request?.type || 'Customer request',
  initialNotes: buildAppointmentNotes(request),
  optometristRequired: request?.type === 'exam',
  appointment: existing,
})

// Works out what a "Schedule" click was pointing at, so the Appointments page
// can open the booking modal on it straight away.
//
// The id can be a request id or an order id, and neither is assumed to be in
// the queue list. Both are fetched directly by id; the queue list is only the
// last fallback. That matters because an order stuck at PENDING_REVIEW is
// filtered out of the CONFIRMED query, and relying on the list meant the click
// silently did nothing.
//
// `booked` holds the appointment index built by PendingScheduleQueue:
// { linked: { [orderOrRequestId]: appointment } }. Waits for `orders` to finish
// loading before resolving.
export function useScheduleTarget(focusId, orders, booked = {}) {
  const [target, setTarget] = useState(null)
  const [failed, setFailed] = useState(false)
  const handledFocus = useRef(null)

  useEffect(() => {
    if (focusId == null || orders === null) return
    if (handledFocus.current === focusId) return

    // Already has a dated appointment, so there is nothing left to book. This
    // also stops the modal reopening on a refresh once the booking is saved.
    if (booked.linked?.[focusId]?.scheduled_at) {
      handledFocus.current = focusId
      return
    }

    let cancelled = false

    const resolve = async () => {
      const existing = () => findBookableAppointment({ linked: booked.linked, id: focusId })

      // A request id resolves here. For an order id this 404s, which is fine.
      try {
        const request = await getRequestById(focusId)
        if (cancelled) return
        if (request) {
          handledFocus.current = focusId
          setTarget(requestTarget(request, existing()))
          return
        }
      }
      catch {
        // Not a request id, or requests are unavailable. Fall through.
      }

      // An order id resolves here, whatever its status.
      try {
        const order = await getOrderById(focusId)
        if (cancelled) return
        if (order) {
          handledFocus.current = focusId
          setTarget(orderTarget(order, existing()))
          return
        }
      }
      catch (err) {
        console.error('useScheduleTarget: order lookup failed:', err?.response?.status || err?.message || err)
      }

      // Last resort: the queue row we were handed.
      const match = orders.find((o) => o.id === focusId)
      if (!cancelled && match) {
        handledFocus.current = focusId
        setTarget(orderTarget(match, existing()))
        return
      }

      // Nothing matched. Say so, rather than leaving the user on a page with no
      // modal and no explanation.
      if (!cancelled) {
        handledFocus.current = focusId
        setFailed(true)
      }
    }

    void resolve()
    return () => { cancelled = true }
  }, [focusId, orders, booked])

  return [target, setTarget, failed]
}
