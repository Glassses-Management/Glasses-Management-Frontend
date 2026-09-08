import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import Badge, { getVariantFromStatus } from '@/components/ui/Badge'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format'
import { getOrderById, changeOrderStatus } from '@/api/orderApi'

const FLOW = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED']

const STATUS_STEP = {
  PENDING: 0,
  CONFIRMED: 1,
  IN_PROGRESS: 2,
  READY_FOR_PICKUP: 3,
  COMPLETED: 4,
  CANCELLED: -1,
}

const NEXT_STATUS = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'IN_PROGRESS',
  IN_PROGRESS: 'READY_FOR_PICKUP',
  READY_FOR_PICKUP: 'COMPLETED',
}

const PAYMENT_VARIANT = {
  PAID: 'success',
  PARTIAL: 'info',
  UNPAID: 'warning',
}

const stepColors = [
  { track: 'bg-amber-200', dot: 'bg-amber-500', text: 'text-amber-600' },
  { track: 'bg-blue-200', dot: 'bg-blue-500', text: 'text-blue-600' },
  { track: 'bg-cyan-200', dot: 'bg-cyan-500', text: 'text-cyan-600' },
  { track: 'bg-violet-200', dot: 'bg-violet-500', text: 'text-violet-600' },
  { track: 'bg-green-200', dot: 'bg-green-500', text: 'text-green-600' },
]

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('PENDING')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrder = async () => {
    try {
      const data = await getOrderById(id)
      setOrder(data)
      setStatus(data?.status || 'PENDING')
    } catch (err) {
      setError('Order not found or failed to load.')
      console.error('OrderDetail: failed to load order:', err?.response?.status || err?.message || err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await getOrderById(id)
        if (cancelled) return
        setOrder(data)
        setStatus(data?.status || 'PENDING')
      } catch (err) {
        if (!cancelled) setError('Order not found or failed to load.')
        console.error('OrderDetail: failed to load order:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm dark:bg-[#1c1c28] dark:text-neutral-400">Loading order...</div>
  }

  if (!order || error) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-[#1c1c28]">
        <p className="text-sm text-gray-500 dark:text-neutral-400">{error || `Order #${id} not found.`}</p>
        <Link to="/orders" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          Back to Orders
        </Link>
      </div>
    )
  }

  const step = STATUS_STEP[status]
  const canTransition = step >= 0 && status !== 'COMPLETED' && status !== 'CANCELLED'

  const advance = async () => {
    const next = NEXT_STATUS[status]
    if (!next) return
    try {
      const updated = await changeOrderStatus(order.id, next)
      setStatus(updated?.status || next)
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to update status'
      console.error('OrderDetail: failed to update status:', msg)
    }
  }

  const history = [
    { status: 'PENDING', changed_at: order.order_date, note: '' },
    ...(status && status !== 'PENDING' && status !== 'CANCELLED'
      ? [{ status, changed_at: order.updated_at || order.created_at, note: 'current' }]
      : []),
  ]

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/orders" className="inline-flex items-center gap-1 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white">
          <ArrowLeft size={16} />
          Orders
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-gray-900 dark:text-neutral-100">Order #{order.id}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Placed on {formatDate(order.order_date)} · {order.customer_name || `Customer #${order.customer_id}`}
          </p>
        </div>
        <Badge text={status} variant={getVariantFromStatus(status)} />
      </div>

      {/* Status steps */}
      <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-[#1c1c28]">
        <div className="flex items-center gap-2">
          {FLOW.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <div className={`h-2 rounded-full ${i <= step ? stepColors[i].track : 'bg-gray-100 dark:bg-neutral-700'}`}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: i < step ? '100%' : i === step && step >= 0 ? '50%' : '0%' }}
                  />
                </div>
                <span className={`text-xs font-medium ${i <= step ? stepColors[i].text : 'text-gray-400 dark:text-neutral-500'}`}>
                  {s.replace(/_/g, ' ').charAt(0) + s.replace(/_/g, ' ').slice(1).toLowerCase()}
                </span>
              </div>
              {i < FLOW.length - 1 && <span aria-hidden="true" />}
            </div>
          ))}
        </div>

        {canTransition && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={advance}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Advance to {NEXT_STATUS[status].replace(/_/g, ' ').toLowerCase()}
              <Check size={16} />
            </button>
          </div>
        )}
        {!canTransition && (
          <p className="mt-4 text-right text-xs text-gray-400 dark:text-neutral-500">
            {status === 'COMPLETED' ? 'This order is completed.' : status === 'CANCELLED' ? 'This order was cancelled.' : ''}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order information */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#1c1c28] lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900 dark:text-neutral-50">Order Information</h2>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-gray-500 dark:text-neutral-500">Order ID</dt>
              <dd className="mt-1 font-medium text-gray-900 dark:text-neutral-100">#{order.id}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 dark:text-neutral-500">Customer Name</dt>
              <dd className="mt-1 font-medium text-gray-900 dark:text-neutral-100">{order.customer_name || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 dark:text-neutral-500">Order Date</dt>
              <dd className="mt-1 text-gray-900 dark:text-neutral-100">{formatDate(order.order_date)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 dark:text-neutral-500">Payment Method</dt>
              <dd className="mt-1 text-gray-900 dark:text-neutral-100">{order.payment_method || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 dark:text-neutral-500">Order Status</dt>
              <dd className="mt-1"><Badge text={status} variant={getVariantFromStatus(status)} /></dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 dark:text-neutral-500">Payment Status</dt>
              <dd className="mt-1"><Badge text={order.payment_status} variant={PAYMENT_VARIANT[order.payment_status]} /></dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-gray-500 dark:text-neutral-500">Total</dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900 dark:text-neutral-50">{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </div>

        {/* Status history timeline */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#1c1c28]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-neutral-50">Timeline</h2>
          <ol className="mt-4 space-y-4">
            {[...history].reverse().map((h) => (
              <li key={`${h.status}-${h.changed_at}`} className="relative pl-6">
                <span className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ${getVariantFromStatus(h.status) === 'success' ? 'bg-green-500 ring-green-100 dark:ring-green-900/40' : getVariantFromStatus(h.status) === 'warning' ? 'bg-amber-500 ring-amber-100 dark:ring-amber-900/40' : getVariantFromStatus(h.status) === 'info' ? 'bg-blue-500 ring-blue-100 dark:ring-blue-900/40' : getVariantFromStatus(h.status) === 'danger' ? 'bg-red-500 ring-red-100 dark:ring-red-900/40' : 'bg-gray-400 ring-gray-100 dark:ring-neutral-700'}`} />
                <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                  {h.status.replace(/_/g, ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase())}
                  {h.note === 'current' && <span className="ml-2 text-xs font-normal text-blue-600 dark:text-blue-400">Current</span>}
                </p>
                <p className="text-xs text-gray-500 dark:text-neutral-500">{h.changed_at ? formatDateTime(h.changed_at) : '—'}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Items table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#1c1c28]">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-neutral-50">Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Product</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Quantity</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Unit Price</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Lens Type</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Coating</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-b-0 dark:border-neutral-800">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-neutral-100">Product #{item.product_id}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-neutral-100">{item.quantity}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-neutral-100">{formatCurrency(item.unit_price)}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-neutral-100">{item.len_type || '—'}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-neutral-100">{item.len_coating || '—'}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-neutral-100">{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-neutral-500">Total</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-neutral-50">{formatCurrency(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
