import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, FileText } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { useCustomers } from '@/hook/UseCustomer'
import { getRequests } from '@/api/requestApi'
import { getInitials, getAvatarColors } from '@/utils/avatar'

const STATUS_VARIANT = {
    PENDING_REVIEW: 'warning',
    PENDING: 'info',
    CONFIRMED: 'success',
    IN_PROGRESS: 'info',
    READY_FOR_PICKUP: 'success',
    COMPLETED: 'neutral',
    CANCELLED: 'neutral',
}

function Avatar({ name, id }) {
    const { bg, text } = getAvatarColors(id)
    return (
        <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            style={{ backgroundColor: bg, color: text }}
        >
            {getInitials(name)}
        </span>
    )
}

export default function RequestListPage() {
    const navigate = useNavigate()
    const { customers } = useCustomers()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getRequests()
                const list = data.content || data
                setRequests(list)
            }
            catch {
                setRequests([])
            }
            finally {
                setLoading(false)
            }
        }
        void load()
    }, [])

    const customerById = {}
    customers.forEach((c) => { customerById[c.id] = c })

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Requests</h1>
                <div className="flex items-center justify-center py-20 text-gray-500 dark:text-neutral-400">
                    Loading requests...
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Requests</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        Review and process customer requests.
                    </p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-[#1c1c28]">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300 dark:text-neutral-600" />
                    <p className="text-lg font-medium text-gray-500 dark:text-neutral-400">No requests yet</p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">
                        Customer requests will appear here for review.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => {
                        const customer = customerById[req.customer_id]
                        return (
                            <button
                                key={req.id}
                                onClick={() => navigate(`/dashboard/orders/${req.id}`)}
                                className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition-colors duration-300 hover:border-violet-400 hover:bg-violet-50 dark:border-neutral-800 dark:bg-[#1c1c28] dark:hover:border-violet-400 dark:hover:bg-violet-900/20"
                            >
                                <Avatar name={customer?.name || '?'} id={req.customer_id} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900 dark:text-neutral-100">
                                            {customer?.name || 'Unknown customer'}
                                        </span>
                                        <Badge
                                            text={req.type === 'exam' ? 'Eye Exam' : 'Product'}
                                            variant={req.type === 'exam' ? 'success' : 'info'}
                                        />
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
                                        {req.notes || 'No notes'}
                                    </p>
                                    {req.prescriptionId && (
                                        <p className="text-xs text-gray-400 dark:text-neutral-500">
                                            Prescription: RX-{String(req.prescriptionId).padStart(5, '0')}
                                        </p>
                                    )}
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <Badge text={req.status || 'PENDING_REVIEW'} variant={STATUS_VARIANT[req.status] || 'neutral'} />
                                    <Eye size={18} className="text-gray-400" />
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}