// Prescription registry — reads from the PrescriptionContext (mock data),
// resolves customer names from CustomerContext, and supports search + pagination.

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil } from 'lucide-react'
import SearchBar from '@/components/data/SearchBar'
import DataTable from '@/components/data/DataTable'
import Pagination from '@/components/ui/Pagination'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { usePrescriptions } from '@/hook/UsePrescription'
import { useCustomers } from '@/hook/UseCustomer'
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { formatDate } from '@/utils/format'

const ITEMS_PER_PAGE = 10

const STATUS_VARIANT = {
    Active: 'success',
    Completed: 'info',
    Expired: 'neutral',
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

const prescriptionId = (id) => `RX-${String(id).padStart(5, '0')}`

function PrescriptionList({ onNavigate }) {
    const navigate = useNavigate()
    const { prescriptions } = usePrescriptions()
    const { customers } = useCustomers()

    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const customerById = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return prescriptions.filter((p) => {
            const name = customerById.get(p.customerId)?.name || ''
            return (
                !q ||
                String(p.id).includes(q) ||
                name.toLowerCase().includes(q) ||
                (p.doctorName || '').toLowerCase().includes(q) ||
                (p.status || '').toLowerCase().includes(q)
            )
        })
    }, [prescriptions, customerById, search])

    const goToPage = (page) => setCurrentPage(page)

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
            header: 'Customer',
            render: (row) => {
                const customer = customerById.get(row.customerId)
                return (
                    <div className="flex items-center gap-3">
                        <Avatar name={customer?.name || '?'} id={row.customerId} />
                        <p className="font-medium text-gray-900 dark:text-neutral-100">{customer?.name || '—'}</p>
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
            render: (row) => <Badge text={row.status} variant={STATUS_VARIANT[row.status] || 'neutral'} />,
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye size={14} />}
                        onClick={(e) => {
                            e.stopPropagation()
                            onNavigate?.(`prescriptions/${row.id}`)
                        }}
                    >
                        View
                    </Button>
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
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Prescriptions</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        Manage eyewear prescriptions and their dispensing items.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="w-full shrink-0 lg:max-w-xs">
                    <SearchBar
                        value={search}
                        onChange={(value) => {
                            setSearch(value)
                            setCurrentPage(1)
                        }}
                        placeholder="Search by customer, doctor, or RX ID..."
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
        </div>
    )
}

export default PrescriptionList