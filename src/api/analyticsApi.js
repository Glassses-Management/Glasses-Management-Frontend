import { getAllOrders } from '@/api/orderApi'
import { getCustomers } from '@/api/customerApi'

// Data access for the Business Overview card.
//
// The backend has no dashboard or analytics endpoint. API_DOCUMENT.md is
// explicit about this - "if something you need is not listed here, it does not
// exist in the backend" - so this module composes the two list endpoints that
// already support the date filtering the chart needs:
//
//   GET /api/orders     ?dateFrom&dateTo&sort=order_date,asc
//                        -> OrderResponse[] carrying `total` and `order_date`
//   GET /api/customers  ?createdFrom&createdTo&page=0&size=1
//                        -> Page; only totalElements is read, so the rows are
//                           never transferred just to count them
//
// Both go through the shared axios instance, so the Bearer JWT and the 401
// handler are the application's existing ones. Nothing here re-implements auth,
// and there is no second client.
//
// ---------------------------------------------------------------------------
// SEAM FOR A SERVER-SIDE ENDPOINT
// If a dedicated endpoint is added later, for example
// GET /api/dashboard/analytics?period=30d, replace the body of
// loadBusinessOverview with that call and keep returning the same shape. The
// hook, the derivations and the chart need no changes.
// ---------------------------------------------------------------------------

// Counts rows the backend already counts. size=1 because the body is discarded.
const countCustomersBetween = async (createdFrom, createdTo) => {
  const page = await getCustomers({ createdFrom, createdTo, page: 0, size: 1 })
  return Number(page?.totalElements) || 0
}

/**
 * Raw payloads for one period and the equivalent period before it.
 *
 * @param current  { from, to } local YYYY-MM-DD strings
 * @param previous { from, to } local YYYY-MM-DD strings
 * @returns { orders: OrderResponse[], newCustomers: number, newCustomersPrevious: number }
 */
export const loadBusinessOverview = async ({ current, previous }) => {
  // One orders call spanning both windows. Fetching twice would request the same
  // rows twice, and getAllOrders walks pages at 100 rows a page.
  const ordersFrom = previous.from < current.from ? previous.from : current.from
  const ordersTo = current.to > previous.to ? current.to : previous.to

  const [orders, newCustomers, newCustomersPrevious] = await Promise.all([
    getAllOrders({ dateFrom: ordersFrom, dateTo: ordersTo, sort: 'order_date,asc' }),
    countCustomersBetween(current.from, current.to),
    countCustomersBetween(previous.from, previous.to),
  ])

  return { orders: orders || [], newCustomers, newCustomersPrevious }
}
