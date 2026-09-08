import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight } from 'lucide-react'
import Badge, { getVariantFromStatus } from '@/components/ui/Badge'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format'
import mockData from '@/mockData/mockOrders.json'

const FLOW = ['PENDING', 'PROCESSING', 'READY', 'COMPLETED']

const STATUS_STEP = {
    PENDING: 0,
    PROCESSING: 1,
    READY: 2,
    COMPLETED: 3,
    CANCELLED: 3,
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
    { track: 'bg-green-200', dot: 'bg-green-500', text: 'text-green-600' },
]

function OrderDetail() {
    const { id } = useParams()
    const orderId = Number(id)
    const found = mockData.orders.find((o) => o.id === orderId)

    // Keep mutable status state per session so the workflow buttons can advance it.
    const [status, setOrderStatus] = useState(found?.status || 'PENDING')
    const [history, setHistory] = useState(found?.status_history || [])

    if (!found) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-gray-500">Order #{orderId} not found.</p>
                <Link to="/orders" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
                    Back to Orders
                </Link>
            </div>
        )
    }

    const step = STATUS_STEP[status]
    const canTransition = status !== 'COMPLETED' && status !== 'CANCELLED'

    const advance = () => {
        const nextIndex = step + 1
        if (nextIndex >= FLOW.length) return
        const next = FLOW[nextIndex]
        setOrderStatus(next)
        setHistory((prev) => [
            ...prev,
            { status: next, changed_at: new Date().toISOString(), note: 'current' },
        ].map((h) =>
            h.status === status || (!h.note && h.status !== next)
                ? { ...h, note: h.status === status ? '' : h.note }
                : h,
        ))
    }

    return (
        <div className="space-y-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/orders" className="inline-flex items-center gap-1 hover:text-gray-700">
                    <ArrowLeft size={16} />
                    Orders
                </Link>
                <span aria-hidden="true">/</span>
                <span className="font-medium text-gray-900">Order #{found.id}</span>
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{found.id}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Placed on {formatDate(found.order_date)} · {found.customer.name}
                    </p>
                </div>
                <Badge text={status} variant={getVariantFromStatus(status)} />
            </div>

            {/* Status steps */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    {FLOW.map((s, i) => (
                        <div key={s} className="flex flex-1 items-center gap-2">
                            <div className="flex flex-1 flex-col gap-1.5">
                                <div className={`h-2 rounded-full ${i <= step ? stepColors[i].track : 'bg-gray-100'}`}>
                                    <div
                                        className="h-2 rounded-full transition-all"
                                        style={{ width: i < step ? '100%' : i === step ? '50%' : '0%' }}
                                    />
                                </div>
                                <span className={`text-xs font-medium ${i <= step ? stepColors[i].text : 'text-gray-400'}`}>
                                    {s.charAt(0) + s.slice(1).toLowerCase()}
                                </span>
                            </div>
                            {i < FLOW.length - 1 && <ChevronRight size={16} className="mb-4 text-gray-300" />}
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
                            {status === 'PENDING' ? 'Start Processing' : status === 'PROCESSING' ? 'Mark Ready' : 'Mark Completed'}
                            <Check size={16} />
                        </button>
                    </div>
                )}
                {!canTransition && (
                    <p className="mt-4 text-right text-xs text-gray-400">
                        {status === 'COMPLETED' ? 'This order is completed.' : 'This order was cancelled.'}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Order information */}
                <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
                    <h2 className="text-base font-semibold text-gray-900">Order Information</h2>
                    <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-gray-500">Order ID</dt>
                            <dd className="mt-1 font-medium text-gray-900">#{found.id}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Customer Name</dt>
                            <dd className="mt-1 font-medium text-gray-900">{found.customer.name}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Order Date</dt>
                            <dd className="mt-1 text-gray-900">{formatDate(found.order_date)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Payment Method</dt>
                            <dd className="mt-1 text-gray-900">{found.payment_method}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Order Status</dt>
                            <dd className="mt-1"><Badge text={status} variant={getVariantFromStatus(status)} /></dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Payment Status</dt>
                            <dd className="mt-1"><Badge text={found.payment_status} variant={PAYMENT_VARIANT[found.payment_status]} /></dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-xs text-gray-500">Total</dt>
                            <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(found.total)}</dd>
                        </div>
                    </dl>
                </div>

                {/* Status history timeline */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-900">Status History</h2>
                    <ol className="mt-4 space-y-4">
                        {[...history].reverse().map((h) => (
                            <li key={`${h.status}-${h.changed_at}`} className="relative pl-6">
                                <span className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ${getVariantFromStatus(h.status) === 'success' ? 'bg-green-500 ring-green-100' : getVariantFromStatus(h.status) === 'warning' ? 'bg-amber-500 ring-amber-100' : getVariantFromStatus(h.status) === 'info' ? 'bg-blue-500 ring-blue-100' : getVariantFromStatus(h.status) === 'danger' ? 'bg-red-500 ring-red-100' : 'bg-gray-400 ring-gray-100'}`} />
                                <p className="text-sm font-medium text-gray-900">
                                    {h.status.charAt(0) + h.status.slice(1).toLowerCase()}
                                    {h.note === 'current' && <span className="ml-2 text-xs font-normal text-blue-600">Current</span>}
                                </p>
                                <p className="text-xs text-gray-500">{h.changed_at ? formatDateTime(h.changed_at) : '—'}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Items table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-900">Items</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Product</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Quantity</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Unit Price</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Lens Type</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Coating</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {found.items.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{item.product.brand} {item.product.model}</p>
                                        <p className="text-xs text-gray-500">{item.product.sku}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">{item.quantity}</td>
                                    <td className="px-6 py-4 text-gray-900">{formatCurrency(item.unit_price)}</td>
                                    <td className="px-6 py-4 text-gray-900">{item.len_type}</td>
                                    <td className="px-6 py-4 text-gray-900">{item.len_coating}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(item.total_price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-500">Total</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatCurrency(found.total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail