// Prescription registry — reads from the PrescriptionContext (seeded from the
// mock data), resolves the customer name from mockCustomers, and supports
// search + status filter with client-side pagination.

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import SearchBar from '@/components/data/SearchBar'
import DataTable from '@/components/data/DataTable'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { usePrescriptions } from '@/hook/UsePrescription'
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { deriveMemberId, formatDate } from '@/utils/format'
import customerData from '@/mockData/mockCustomers.json'

const ITEMS_PER_PAGE = 10
const STATUS_FILTERS = ['Active', 'Completed', 'Expired']
const STATUS_VARIANTS = { Active: 'success', Completed: 'info', Expired: 'warning' }

const prescriptionId = (id) => `RX-${String(id).padStart(5, '0')}`

const modalBackdrop = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
const modalCard = 'w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-colors duration-300 dark:bg-[#1c1c28] dark:ring-1 dark:ring-neutral-800'

function PrescriptionDeleteModal({ prescription, customerName, onConfirm, onClose }) {
    return (
        <div className={modalBackdrop} onClick={onClose}>
            <div className={modalCard} onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-50">Delete prescription?</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                    This will remove prescription{' '}
                    <span className="font-medium text-gray-900 dark:text-neutral-100">{prescriptionId(prescription.id)}</span>{' '}
                    for <span className="font-medium text-gray-900 dark:text-neutral-100">{customerName || 'this patient'}</span>.
                    This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="danger" onClick={onConfirm}>Delete</Button>
                </div>
            </div>
        </div>
    )
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

function PrescriptionList({ onNavigate }) {
    const navigate = useNavigate()
    const { prescriptions, deletePrescription } = usePrescriptions()

    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [deleting, setDeleting] = useState(null)

    const customerById = useMemo(
        () => new Map(customerData.customers.map((c) => [c.id, c])),
        [],
    )

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return prescriptions.filter((p) => {
            const name = customerById.get(p.customerId)?.name || ''
            const matchesSearch =
                !q ||
                String(p.id).includes(q) ||
                name.toLowerCase().includes(q) ||
                (p.doctorName || '').toLowerCase().includes(q) ||
                (p.dateIssued || '').toLowerCase().includes(q)
            const matchesStatus = !status || p.status === status
            return matchesSearch && matchesStatus
        })
    }, [prescriptions, customerById, search, status])

    const goToPage = (page) => {
        setCurrentPage(page)
        setDeleting(null)
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const effectivePage = Math.min(currentPage, totalPages)
    const paged = filtered.slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE)

    const columns = [
        {
            key: 'id',
            header: 'ID',
            render: (row) => (
                <span className="font-medium text-gray-900 dark:text-neutral-100">{prescriptionId(row.id)}</span>
            ),
        },
        {
            key: 'customer',
            header: 'Customer Name',
            render: (row) => {
                const customer = customerById.get(row.customerId)

                return (
                    <div className="flex items-center gap-3">
                        <Avatar name={customer?.name || '?'} id={row.customerId} />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-neutral-100">{customer?.name || '—'}</p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">
                                {customer ? deriveMemberId(customer.id) : ''}
                            </p>
                        </div>
                    </div>
                )
            },
        },
        {
            key: 'doctorName',
            header: 'Doctor',
            render: (row) => <span className="text-gray-900 dark:text-neutral-100">{row.doctorName || '—'}</span>,
        },
        {
            key: 'dateIssued',
            header: 'Date Issued',
            render: (row) => <span className="text-gray-900 dark:text-neutral-100">{formatDate(row.dateIssued)}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => <Badge text={row.status} variant={STATUS_VARIANTS[row.status] || 'neutral'} />,
        },
        {
            key: 'actions',
            header: <div className="text-center">Actions</div>,
            render: (row) => (
                <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<Pencil size={14} />}
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/dashboard/prescriptions/${row.id}/edit`)
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={(e) => {
                            e.stopPropagation()
                            setDeleting(row)
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ]

    const handleDelete = (prescription) => {
        deletePrescription(prescription.id)
        setDeleting(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Prescriptions</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        Manage eyewear prescriptions issued to your patients.
                    </p>
                </div>
                <Button onClick={() => navigate('/dashboard/prescriptions/new')}>+ New Prescription</Button>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="w-full shrink-0 lg:max-w-xs">
                    <SearchBar
                        value={search}
                        onChange={(value) => {
                            setSearch(value)
                            setCurrentPage(1)
                        }}
                        placeholder="Search by ID, customer, doctor, or date..."
                    />
                </div>
                <div className="w-full shrink-0 lg:w-48">
                    <Select
                        name="status"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value)
                            setCurrentPage(1)
                        }}
                        options={[
                            { value: '', label: 'All Statuses' },
                            ...STATUS_FILTERS.map((s) => ({ value: s, label: s })),
                        ]}
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={paged}
                onRowClick={(row) => onNavigate?.(`prescriptions/${row.id}`)}
            />

            <Pagination
                currentPage={effectivePage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={goToPage}
            />

            {deleting && (
                <PrescriptionDeleteModal
                    prescription={deleting}
                    customerName={customerById.get(deleting.customerId)?.name}
                    onConfirm={() => handleDelete(deleting)}
                    onClose={() => setDeleting(null)}
                />
            )}
        </div>
    )
}

export default PrescriptionList