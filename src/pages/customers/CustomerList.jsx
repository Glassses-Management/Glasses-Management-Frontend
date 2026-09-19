// Client Registry & Patients — reads from the CustomerContext (mock data shape),
// derives display-only values, and supports search + client-side pagination.

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '@/components/data/SearchBar'
import DataTable from '@/components/data/DataTable'
import Pagination from '@/components/ui/Pagination'
import Button from '@/components/ui/Button'
import { useCustomers } from '@/hook/UseCustomer'
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { formatDate, deriveMemberId } from '@/utils/format'

const ITEMS_PER_PAGE = 10

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

const modalBackdrop = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
const modalCard = 'w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-colors duration-300 dark:bg-[#1c1c28] dark:ring-1 dark:ring-neutral-800'

function CustomerDeleteModal({ customer, onConfirm, onClose }) {
  return (
    <div className={modalBackdrop} onClick={onClose}>
      <div className={modalCard} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-50">Delete customer?</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          This will remove <span className="font-medium text-gray-900 dark:text-neutral-100">{customer.name}</span> from
          the registry. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  )
}

function CustomerList({ onNavigate }) {
  const navigate = useNavigate()
  const { customers: customersData, deleteCustomer } = useCustomers()

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return customersData.filter((c) => {
      return (
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      )
    })
  }, [customersData, search])

  const goToPage = (page) => {
    setCurrentPage(page)
    setDeleting(null)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const effectivePage = Math.min(currentPage, totalPages)
  const paged = filtered.slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE)

  const columns = [
    {
      key: 'client',
      header: 'Client & Member Info',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} id={row.id} />
          <div>
            <p className="font-medium text-gray-900 dark:text-neutral-100">{row.name}</p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">{deriveMemberId(row.id)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (row) => (
        <div>
          <p className="text-gray-900 dark:text-neutral-100">{row.phone || '—'}</p>
          <p className="text-xs text-gray-500 dark:text-neutral-400">{row.email || '—'}</p>
        </div>
      ),
    },
    { key: 'createdAt', header: 'Registration Date', render: (row) => <span className="text-gray-900 dark:text-neutral-100">{formatDate(row.createdAt)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="blue"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/dashboard/customers/${row.id}/edit`)
            }}
          >
            Update
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleting(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const handleDelete = (customer) => {
    deleteCustomer(customer.id)
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Client Registry & Patients</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Manage customers and their contact details.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full shrink-0 lg:max-w-xs">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paged}
        onRowClick={(row) => onNavigate?.(`customers/${row.id}`)}
      />

      <Pagination
        currentPage={effectivePage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={goToPage}
      />

      {deleting && (
        <CustomerDeleteModal
          customer={deleting}
          onConfirm={() => handleDelete(deleting)}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

export default CustomerList