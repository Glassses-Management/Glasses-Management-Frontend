import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Download, FileText, PlusCircle, Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import RequestCard from '@/components/request/RequestCard'
import { getRequests } from '@/api/requestApi'
import { getAppointments } from '@/api/appointmentApi'
import { parseRequestRef, REQUEST_TYPE_LABEL } from '@/utils/RequestOrder'

function typeLabel(type) {
  return REQUEST_TYPE_LABEL[type] || type
}

function StatusPill({ dot, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-300">
      <span className={`size-2 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}

// Sort key for "newest first". Returns null when the request has no usable
// timestamp, so the caller can fall back to the id.
function timeOf(request) {
  const raw = request?.createdAt ?? request?.created_at
  if (!raw) return null
  const t = Date.parse(raw)
  return Number.isNaN(t) ? null : t
}

export default function RequestListPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Plain fetch, no setState, so it is safe to call from anywhere.
  const fetchAll = useCallback(async () => {
    const [reqs, appts] = await Promise.all([getRequests(), getAppointments()])
    return { reqs: Array.isArray(reqs) ? reqs : [], appts: Array.isArray(appts) ? appts : [] }
  }, [])

  // Reloads the queue, e.g. after a request was approved or scheduled.
  const refresh = useCallback(async () => {
    try {
      const { reqs, appts } = await fetchAll()
      setRequests(reqs)
      setAppointments(appts)
      setLoadError('')
    }
    catch (err) {
      const status = err?.response?.status
      const detail = err?.response?.data?.error || err?.response?.data?.message || err?.message
      // A failed load must not look like "no requests" - surface the reason.
      setLoadError(`Could not load requests${status ? ` (HTTP ${status})` : ''}: ${detail || 'unknown error'}`)
      console.error('RequestListPage: failed to load requests:', status || err?.message || err)
      setRequests([])
      setAppointments([])
    }
  }, [fetchAll])

  useEffect(() => {
    const run = async () => {
      await refresh()
      setLoading(false)
    }
    void run()
  }, [refresh])

  // Appointments carry no order_id, so the link back to a request is the
  // reference text in the notes (see utils/RequestOrder). A request can end up
  // with more than one row (a dateless placeholder plus the real booking), so
  // prefer whichever one actually carries a date.
  const appointmentByRequest = useMemo(() => {
    const map = new Map()
    for (const appointment of appointments) {
      const requestId = parseRequestRef(appointment?.notes)
      if (requestId == null) continue
      const existing = map.get(requestId)
      if (!existing) map.set(requestId, appointment)
      else if (!existing.scheduled_at && appointment.scheduled_at) map.set(requestId, appointment)
    }
    return map
  }, [appointments])

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
    // Newest first. Ids only ever increase, so they settle the order whenever
    // createdAt is missing or unparseable instead of scrambling the list.
    return result.sort((a, b) => {
      const ta = timeOf(a)
      const tb = timeOf(b)
      if (ta != null && tb != null && ta !== tb) return tb - ta
      return (b.id ?? 0) - (a.id ?? 0)
    })
  }, [requests, query, statusFilter])

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length
  const declinedCount = requests.filter((r) => r.status === 'REJECTED').length
  const unscheduledCount = requests.filter(
    (r) => r.status === 'APPROVED' && !appointmentByRequest.get(r.id)?.scheduled_at,
  ).length

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
          <StatusPill dot="bg-blue-500" label={`${pendingCount} Awaiting Approval`} />
          <StatusPill dot="bg-emerald-500" label={`${approvedCount} Approved`} />
          {unscheduledCount > 0 && <StatusPill dot="bg-amber-500" label={`${unscheduledCount} Need Scheduling`} />}
          <StatusPill dot="bg-red-500" label={`${declinedCount} Declined`} />
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

      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">Could not load requests</p>
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{loadError}</p>
        </div>
      )}

      {!loadError && filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
          <FileText size={40} className="mx-auto mb-3 text-gray-300 dark:text-neutral-600" />
          <p className="text-base font-medium text-gray-600 dark:text-neutral-300">
            {query || statusFilter !== 'all' ? 'No requests match your filters' : 'No requests found'}
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">
            Customer requests will appear here for review.
          </p>
        </div>
      ) : (        <div className="space-y-3">
          {filtered.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              appointment={appointmentByRequest.get(req.id)}
              onChanged={refresh}
            />
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