import { useCallback, useEffect, useMemo, useState } from 'react'

import { getAllOrders } from '@/api/orderApi'
import { getPrescriptionsByCustomer } from '@/api/prescriptionApi'
import { getAppointments } from '@/api/appointmentApi'
import { getRequestsByCustomer } from '@/api/requestApi'
import { useCustomers } from '@/hook/UseCustomer'

// Loads everything the customer detail page shows for ONE customer.
//
// The customer itself comes from CustomerContext, which already holds the whole
// registry, so it is not fetched twice. The four related collections are separate
// endpoints and are loaded together with allSettled: one failing call degrades
// that one section instead of blanking the page.
//
// Appointments are the awkward one. GET /api/appointments takes no filter
// parameters (API_DOCUMENT.md 11.2) and there is no /appointments/customer/{id},
// so the staff list is narrowed to this customer here.

const toList = (data) => (Array.isArray(data) ? data : data?.content || [])

// Newest first. Takes several field names because the backend is not consistent:
// Request.createdAt is camelCase while everything else is snake_case, and
// `created_at` is the only field some endpoints are guaranteed to return.
const byTimeDesc = (...fields) => (a, b) => {
  const time = (row) => {
    for (const field of fields) {
      if (row?.[field]) return new Date(row[field]).getTime()
    }
    return 0
  }
  return time(b) - time(a)
}

const COLLECTIONS = [
  { key: 'orders', load: (id) => getAllOrders({ customerId: id }), pick: (data) => toList(data), sort: byTimeDesc('order_date', 'created_at') },
  { key: 'prescriptions', load: (id) => getPrescriptionsByCustomer(id), pick: toList, sort: byTimeDesc('prescription_date', 'created_at') },
  { key: 'appointments', load: () => getAppointments(), pick: (data, id) => toList(data).filter((a) => Number(a?.customer_id) === Number(id)), sort: byTimeDesc('scheduled_at', 'created_at') },
  { key: 'requests', load: (id) => getRequestsByCustomer(id), pick: toList, sort: byTimeDesc('createdAt', 'created_at') },
]

const EMPTY = { orders: [], prescriptions: [], appointments: [], requests: [], failed: [] }

const IDLE = { customerId: null, ...EMPTY }

export function useCustomerDetail(id) {
  const { customers, loading: customersLoading } = useCustomers()

  const customer = useMemo(() => customers.find((c) => c.id === Number(id)) || null, [customers, id])

  // `customerId` inside the state is the id these collections were fetched FOR,
  // which is what tells us whether the result belongs to the customer on screen.
  // That removes the separate loading flag: a mismatch simply means "in flight".
  const [result, setResult] = useState(IDLE)
  const [nonce, setNonce] = useState(0)

  const customerId = customer?.id ?? null

  // Lets the page refetch after it writes something itself, e.g. after booking an
  // appointment from the header, without remounting.
  const reload = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    if (customerId == null) return undefined

    let cancelled = false

    const load = async () => {
      const results = await Promise.allSettled(COLLECTIONS.map((c) => c.load(customerId)))
      if (cancelled) return

      const next = { customerId, orders: [], prescriptions: [], appointments: [], requests: [], failed: [] }

      results.forEach((result, index) => {
        const { key, pick, sort } = COLLECTIONS[index]
        if (result.status === 'rejected') {
          next.failed.push(key)
          return
        }
        next[key] = pick(result.value, customerId).sort(sort)
      })

      setResult(next)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [customerId, nonce])

  // Nothing to load when the id is unknown: either the registry is still loading
  // or no such customer exists. Rows from a previous customer are hidden while
  // the new customer's requests are in flight rather than shown against the
  // wrong name. A reload, by contrast, keeps the rows visible and refreshes them
  // underneath, which is what you want right after saving a new appointment.
  const isCurrent = customerId != null && result.customerId === customerId

  return {
    customer,
    ...(isCurrent ? result : EMPTY),
    loading: customersLoading || (customerId != null && !isCurrent),
    // Named so the page can say which section is empty because of a failed
    // call rather than because the customer has no records.
    failed: isCurrent ? result.failed : [],
    reload,
  }
}

export default useCustomerDetail
