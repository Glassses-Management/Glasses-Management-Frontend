import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Search } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { useToast } from '@/hook/UseToast'
import { getRequests, approveRequest, rejectRequest } from '@/api/requestApi'
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { formatDate } from '@/utils/FormatDate'

const STATUS_VARIANT = {
  PENDING: 'warning',
  PENDING_REVIEW: 'warning',
  APPROVED: 'success',
  CONFIRMED: 'success',
  IN_PROGRESS: 'info',
  READY_FOR_PICKUP: 'success',
  COMPLETED: 'neutral',
  REJECTED: 'danger',
  CANCELLED: 'neutral',
}

const TYPE_LABEL = {
  exam: 'Eye Examination',
  product: 'Product',
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

function typeLabel(type) {
  return TYPE_LABEL[type] || type
}

export default function RequestListPage() {
  const navigate = useNavigate()
  const { success: toastSuccess, error: toastError } = useToast()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await getRequests()
        if (!cancelled) setRequests(data.content || data)
      } catch {
        if (!cancelled) setRequests([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleApprove = async (id) => {
    try {
      const order = await approveRequest(id)
      toastSuccess('Request approved. Order created.')
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r)))
      navigate('/dashboard/orders')
    } catch (err) {
      toastError(err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to approve request')
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectRequest(id)
      toastSuccess('Request rejected.')
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r)))
    } catch (err) {
      toastError(err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to reject request')
    }
  }

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(requests.map((r) => r.status).filter(Boolean))]
    return [
      { value: 'all', label: 'All statuses' },
      ...statuses.map((s) => ({ value: s, label: s })),
    ]
  }, [requests])

const filtered = useMemo(() => {
    	const q = query.trim().toLowerCase()
    	const result = requests.filter((r) => {
	      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
	      const matchesQuery =
	        !q ||
	        String(r.customer_name || '').toLowerCase().includes(q) ||
	        typeLabel(r.type).toLowerCase().includes(q) ||
	        String(r.notes || '').toLowerCase().includes(q)
	      return matchesStatus && matchesQuery
	    })
    	result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    	return result
    }, [requests, query, statusFilter])

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length

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
        <div className="flex gap-2">
          <Badge text={`Pending: ${pendingCount}`} variant="warning" />
          <Badge text={`Approved: ${approvedCount}`} variant="success" />
          <Badge text={`Rejected: ${rejectedCount}`} variant="danger" />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer, type, or notes…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-colors duration-300 focus:border-[#8fa88f] focus:ring-2 focus:ring-[#8fa88f]/20 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </div>
        <div className="sm:w-56">
          <Select
            name="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-[#1c1c28]">
          <FileText size={48} className="mx-auto mb-4 text-gray-300 dark:text-neutral-600" />
          <p className="text-lg font-medium text-gray-500 dark:text-neutral-400">No requests found</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">
            Customer requests will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <Avatar name={req.customer_name || '?'} id={req.customer_id} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-neutral-100">
                      {req.customer_name || 'Unknown customer'}
                    </span>
                    <Badge text={typeLabel(req.type)} variant={req.type === 'exam' ? 'success' : 'info'} />
                    <Badge text={req.status || 'PENDING'} variant={STATUS_VARIANT[req.status] || 'neutral'} />
                  </div>
                  <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
                    Request #{req.id} · Created {formatDate(req.createdAt)}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-neutral-300">{req.notes || 'No notes'}</p>
                </div>
                {req.status === 'PENDING' && (
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="!bg-green-600 hover:!bg-green-700"
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(req.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}