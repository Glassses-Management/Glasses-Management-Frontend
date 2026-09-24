import { useEffect, useMemo, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import AppointmentStats from '@/components/appointment/AppointmentStats'
import AppointmentFilter from '@/components/appointment/AppointmentFilter'
import AppointmentTable from '@/components/appointment/AppointmentTable'
import ScheduleAppointmentModal from '@/components/appointment/ScheduleAppointmentModal'
import { getAppointments, updateAppointment, deleteAppointment } from '@/api/appointmentApi'
import { getCustomers } from '@/api/customerApi'
import { getOptometrists } from '@/api/userApi'
import { useToast } from '@/hook/UseToast'

const ITEMS_PER_PAGE = 10

const STATUS_OPTIONS = [
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

function AppointmentListPage() {
  const { success: toastSuccess, error: toastError } = useToast()
  const [appointments, setAppointments] = useState([])
  const [customers, setCustomers] = useState([])
  const [optometrists, setOptometrists] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: 'all' })
  const [currentPage, setCurrentPage] = useState(1)

  const [modal, setModal] = useState({ open: false, mode: 'edit', appointment: null })
  const [cancelling, setCancelling] = useState(null)
  const [cancellingLoading, setCancellingLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deletingLoading, setDeletingLoading] = useState(false)

  const customersById = useMemo(() => {
    const map = new Map()
    customers.forEach((c) => map.set(c.id, c))
    return map
  }, [customers])

  const optometristsById = useMemo(() => {
    const map = new Map()
    optometrists.forEach((o) => map.set(o.id, o))
    return map
  }, [optometrists])

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const [apptData, custData, optData] = await Promise.all([
        getAppointments(),
        getCustomers({ page: 0, size: 1000 }).catch(() => ({ content: [] })),
        getOptometrists().catch(() => []),
      ])
      const list = Array.isArray(apptData) ? apptData : apptData?.content ?? []
      const custList = Array.isArray(custData) ? custData : custData?.content ?? []
      const optList = Array.isArray(optData) ? optData : optData?.content ?? []
      setCustomers(custList)
      setOptometrists(optList)
      setAppointments(list)
    } catch (err) {
      console.error('AppointmentListPage: failed to load appointments:', err?.response?.status || err?.message || err)
      toastError(err?.response?.data?.message || err?.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    loadAppointments().then(() => {
      if (cancelled) return
    })
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((a) => a.status === 'PENDING_REVIEW').length,
      scheduled: appointments.filter((a) => a.status === 'SCHEDULED').length,
      completed: appointments.filter((a) => a.status === 'COMPLETED').length,
      cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
    }),
    [appointments],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return appointments
      .map((a) => ({
        ...a,
        customer_name: a.customer_name || customersById.get(a.customer_id)?.name || '',
        optometrist_name: a.optometrist_name || optometristsById.get(a.optometrist_id)?.name || '',
      }))
      .filter((a) => {
        const matchesSearch =
          !q ||
          String(a.id).includes(q) ||
          (a.customer_name || '').toLowerCase().includes(q) ||
          (a.customer_id != null && String(a.customer_id).includes(q))
        const matchesStatus = filters.status === 'all' || a.status === filters.status
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        const time = (row) => (row.created_at ? new Date(row.created_at).getTime() : -Number(row.id))
        return time(b) - time(a)
      })
  }, [appointments, search, filters, customersById, optometristsById])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const effectivePage = Math.min(currentPage, totalPages)
  const paged = filtered.slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE)

  const openSchedule = (row) => setModal({ open: true, mode: 'schedule', appointment: row })
  const openEdit = (row) => setModal({ open: true, mode: 'edit', appointment: row })
  const closeModal = () => setModal({ open: false, mode: 'edit', appointment: null })

  const handleCancel = async () => {
    if (!cancelling) return
    setCancellingLoading(true)
    try {
      await updateAppointment(cancelling.id, {
        customer_id: cancelling.customer_id ?? null,
        optometrist_id: cancelling.optometrist_id ?? null,
        scheduled_at: cancelling.scheduled_at ?? null,
        status: 'CANCELLED',
        notes: cancelling.notes || '',
      })
      toastSuccess(`Appointment #${cancelling.id} cancelled.`)
      setCancelling(null)
      await loadAppointments()
    } catch (err) {
      toastError(err?.response?.data?.message || err?.message || 'Failed to cancel appointment')
    } finally {
      setCancellingLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingLoading(true)
    try {
      await deleteAppointment(deleting.id)
      toastSuccess(`Appointment #${deleting.id} deleted.`)
      setDeleting(null)
      await loadAppointments()
    } catch (err) {
      toastError(err?.response?.data?.message || err?.message || 'Failed to delete appointment')
    } finally {
      setDeletingLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Appointments</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          Review incoming requests, schedule, and manage appointments.
        </p>
      </div>

      <AppointmentStats stats={stats} />

      <AppointmentFilter
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onClearAll={() => setFilters({ status: 'all' })}
        statusOptions={STATUS_OPTIONS}
      />

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm dark:bg-[#1c1c28] dark:text-neutral-400">
          Loading appointments…
        </div>
      ) : (
        <>
<AppointmentTable
            appointments={paged}
            onOpenSchedule={openSchedule}
            onEdit={openEdit}
            onCancel={(row) => setCancelling(row)}
            onDelete={(row) => setDeleting(row)}
          />

          <Pagination
            currentPage={effectivePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ScheduleAppointmentModal
        open={modal.open}
        mode={modal.mode}
        appointment={modal.appointment}
        onClose={closeModal}
        onSaved={loadAppointments}
      />

      <Modal
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        title="Cancel appointment?"
        maxWidth="max-w-sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setCancelling(null)} disabled={cancellingLoading}>
              Keep it
            </Button>
            <Button type="button" variant="danger" onClick={handleCancel} loading={cancellingLoading}>
              Cancel Appointment
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          This will mark appointment{' '}
          <span className="font-medium text-gray-900 dark:text-neutral-100">#{cancelling?.id}</span> as cancelled.
          The customer will no longer be scheduled.
        </p>
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete appointment?"
        maxWidth="max-w-sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDeleting(null)} disabled={deletingLoading}>
              Keep it
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete} loading={deletingLoading}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          This will permanently delete appointment{' '}
          <span className="font-medium text-gray-900 dark:text-neutral-100">#{deleting?.id}</span>.
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default AppointmentListPage