import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Download, FileText, MoreHorizontal, PlusCircle, Search } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { useToast } from '@/hook/UseToast'
import { getRequests, approveRequest, rejectRequest } from '@/api/requestApi'
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { formatDate } from '@/utils/FormatDate'

const STATUS_VARIANT = {
  PENDING: 'info',
  PENDING_REVIEW: 'info',
  APPROVED: 'success',
  CONFIRMED: 'success',
  IN_PROGRESS: 'info',
  READY_FOR_PICKUP: 'success',
  COMPLETED: 'neutral',
  REJECTED: 'danger',
  CANCELLED: 'neutral',
}

const STATUS_ACCENT = {
  PENDING: 'bg-blue-500',
  PENDING_REVIEW: 'bg-blue-500',
  IN_PROGRESS: 'bg-amber-500',
  APPROVED: 'bg-emerald-500',
  CONFIRMED: 'bg-emerald-500',
  READY_FOR_PICKUP: 'bg-emerald-500',
  COMPLETED: 'bg-gray-400',
  REJECTED: 'bg-red-500',
  CANCELLED: 'bg-red-500',
}

const TYPE_LABEL = {
  exam: 'Eye Examination',
  product: 'Product',
}

function Avatar({ name, id }) {
  const { bg, text } = getAvatarColors(id)
  return (
    <span
      className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {getInitials(name)}
    </span>
  )
}

function typeLabel(type) {
  return TYPE_LABEL[type] || type
}

function StatusPill({ dot, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-300">
      <span className={`size-2 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  )
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
      await approveRequest(id)
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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1a2e] dark:text-neutral-50">Requests</h1>
        </div>
        <div className="flex items-center justify-center py-20 text-gray-500 dark:text-neutral-400">
          Loading requests...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1a2e] dark:text-neutral-50">Requests</h1>
            <span className="rounded-full bg-gray-200/70 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
              {requests.length} Total
            </span>
          </div>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-neutral-400">
            Review and process customer requests for the clinic.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusPill dot="bg-blue-500" label={`${pendingCount} Pending`} />
          <StatusPill dot="bg-emerald-500" label={`${approvedCount} Approved`} />
          <StatusPill dot="bg-red-500" label={`${rejectedCount} Rejected`} />
          <Button
            variant="forest"
            className="shadow-sm"
            icon={<PlusCircle size={16} />}
            onClick={() => navigate('/dashboard/requests/add')}
          >
            New Request
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Rx, frames, barcode, or patient..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none transition-colors duration-300 focus:border-[#8fa88f] focus:ring-2 focus:ring-[#8fa88f]/20 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-44">
            <Select
              name="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </div>
          <div className="w-40" aria-hidden="true">
            <Select
              name="typeFilter"
              value="all"
              onChange={() => {}}
              options={[{ value: 'all', label: 'All Types' }]}
            />
          </div>
          <div className="w-44" aria-hidden="true">
            <Select
              name="optometristFilter"
              value="all"
              onChange={() => {}}
              options={[{ value: 'all', label: 'All Optometrists' }]}
            />
          </div>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors duration-300 hover:bg-gray-50 dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Download size={16} className="text-gray-400 dark:text-neutral-500" />
            Export
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-neutral-500">
          Clinical Queue <span className="font-medium normal-case tracking-normal text-gray-300 dark:text-neutral-600">•</span> Sorted by date received
        </p>
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="text-xs font-medium text-gray-500 transition-colors duration-300 hover:text-forest dark:text-neutral-400 dark:hover:text-leaf"
        >
          Batch Review Pending ({pendingCount})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
          <FileText size={40} className="mx-auto mb-3 text-gray-300 dark:text-neutral-600" />
          <p className="text-base font-medium text-gray-600 dark:text-neutral-300">No requests found</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">
            Customer requests will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="flex overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-[#1c1c28]"
            >
              <div aria-hidden="true" className={`w-1 shrink-0 ${STATUS_ACCENT[req.status] || 'bg-gray-300'}`} />
              <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-start">
                <Avatar name={req.customer_name || '?'} id={req.customer_id} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <span className="font-semibold text-gray-900 dark:text-neutral-100">
                      {req.customer_name || 'Unknown customer'}
                    </span>
                    <span className="text-xs font-medium text-gray-400 dark:text-neutral-500">#{req.id}</span>
                    <Badge text={req.status || 'PENDING'} variant={STATUS_VARIANT[req.status] || 'neutral'} />
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
                      {typeLabel(req.type)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-gray-800 dark:text-neutral-200">
                    "{req.notes || 'No notes provided'}"
                  </p>
                  <p className="mt-1.5 text-xs text-gray-400 dark:text-neutral-500">
                    Requested {formatDate(req.createdAt)} · Patient ID {req.customer_id || '–'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {req.status === 'PENDING' ? (
                    <>
                      <Button
                        size="sm"
                        className="!bg-green-600 hover:!bg-green-700"
                        onClick={() => handleApprove(req.id)}
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(req.id)}>
                        Decline
                      </Button>
                    </>
                  ) : req.status === 'APPROVED' ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
                      Intake Done
                    </span>
                  ) : (
                    <Button size="sm" variant="outline" className="!text-forest dark:!text-leaf">
                      Re-open
                    </Button>
                  )}
                  <button
                    type="button"
                    aria-label="More actions"
                    className="flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-500 dark:hover:bg-white/10"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Showing 1–{filtered.length} of {filtered.length} requests
          </p>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <button
              type="button"
              tabIndex={-1}
              disabled
              className="flex size-8 items-center justify-center rounded-lg text-gray-400 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="flex size-8 items-center justify-center rounded-lg bg-forest text-sm font-semibold text-white"
            >
              1
            </button>
            <button
              type="button"
              tabIndex={-1}
              disabled
              className="flex size-8 items-center justify-center rounded-lg text-gray-400 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}