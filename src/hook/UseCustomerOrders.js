import { useEffect, useMemo, useState } from 'react'

import { getMyOrders } from '@/api/orderApi'
import { getMyAppointments } from '@/api/appointmentApi'
import { useOwnCustomerId } from '@/hook/UseOwnCustomerId'
import { parseOrderRef } from '@/utils/OrderAppointment'

// Loads the signed-in customer's orders, joined to the appointment that holds
// their collection date.
//
// The customer's own id comes from GET /api/customers/me (useOwnCustomerId),
// because /auth/me has no customer_id field. Orders are then read through the
// paged /api/orders search filtered by that id.
//
// A collection date is NOT a field on the order - the backend has no pickup
// column (API_DOCUMENT.md section 10.1). The date lives on the appointment staff
// create when booking the order, and the two are linked by an "Order #<id>"
// marker in the appointment notes (utils/OrderAppointment).
export function useCustomerOrders() {
  const { customerId, needsProfile, loading: customerLoading, error: customerError } = useOwnCustomerId()
  const [orders, setOrders] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      // No profile yet, so there is nothing to list. The page routes to
      // complete-profile instead of showing an error.
      if (needsProfile) {
        setOrders([])
        setAppointments([])
        setError('')
        return
      }

      // Still resolving the id, or there is none: nothing to ask for yet.
      if (customerId == null) {
        setOrders([])
        return
      }

      try {
        const [orderRes, apptRes] = await Promise.allSettled([
          getMyOrders(customerId),
          getMyAppointments(customerId),
        ])
        if (cancelled) return

        if (orderRes.status === 'rejected') {
          const detail = orderRes.reason?.response?.data?.error || orderRes.reason?.response?.data?.message || orderRes.reason?.message
          setError(`Could not load your orders: ${detail || 'unknown error'}`)
          setOrders([])
          return
        }

        const data = orderRes.value
        setOrders(Array.isArray(data) ? data : data?.content || [])
        setAppointments(apptRes.status === 'fulfilled' && Array.isArray(apptRes.value) ? apptRes.value : [])
        setError('')
      }
      catch (err) {
        if (cancelled) return
        setError(err?.message || 'Failed to load your orders.')
        setOrders([])
      }
    }

    void load()
    return () => { cancelled = true }
  }, [needsProfile, customerId])

  // Appointments carry no order_id, so the link back to an order is the
  // reference text in the notes.
  const appointmentByOrder = useMemo(() => {
    const map = new Map()
    for (const appointment of appointments) {
      const orderId = parseOrderRef(appointment?.notes)
      if (orderId != null && !map.has(orderId)) map.set(orderId, appointment)
    }
    return map
  }, [appointments])

  return {
    orders: orders || [],
    appointmentByOrder,
    error: customerError || error,
    loading: customerLoading || (orders === null && !needsProfile),
  }
}
