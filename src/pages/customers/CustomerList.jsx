// Client Registry & Patients — reads from mock data so the shape matches what a
// future fetch() to /api/customers would return (customer + nested relations).
// Display-only values (avatar, memberId, provider, latest status) are derived here.

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import StatsCard from '@/components/ui/StatsCard'
import SearchBar from '@/components/data/SearchBar'
import FilterBar from '@/components/data/FilterBar'
import DataTable from '@/components/data/DataTable'
import Pagination from '@/components/ui/Pagination'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge, { getVariantFromStatus } from '@/components/ui/Badge'
import { usersIcon, calendarIcon, clipboardIcon, dollarIcon } from '@/components/ui/icons'
import mockData from "@/mockData/mockCustomers.json";
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { formatDate, deriveMemberId, formatCurrency } from '@/utils/format'

const cn = (...classes) => classes.filter(Boolean).join(' ')

const ITEMS_PER_PAGE = 10

const TABS = ['All Clients', 'Recent Sign-Ups', 'Upcoming Appointments', 'Active Orders']

const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'READY', label: 'Ready' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

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
const modalCard = 'w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'

function CustomerEditModal({ customer, onSave, onClose }) {
  const [form, setForm] = useState({
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
  })
  const setField = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }))

  return (
    <div className={modalBackdrop} onClick={onClose}>
      <div className={modalCard} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900">Update Customer</h3>
        <div className="mt-4 space-y-4">
          <Input label="Name" name="name" value={form.name} onChange={setField('name')} />
          <Input label="Phone" name="phone" value={form.phone} onChange={setField('phone')} />
          <Input label="Email" name="email" value={form.email} onChange={setField('email')} />
          <Input label="Address" name="address" value={form.address} onChange={setField('address')} />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ ...customer, ...form })}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

function CustomerDeleteModal({ customer, onConfirm, onClose }) {
  return (
    <div className={modalBackdrop} onClick={onClose}>
      <div className={modalCard} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900">Delete customer?</h3>
        <p className="mt-2 text-sm text-gray-500">
          This will remove <span className="font-medium text-gray-900">{customer.name}</span> from
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
  const { summary } = mockData

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ provider: 'all', orderStatus: 'all' })
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [customerList, setCustomerList] = useState(() => mockData.customers)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // Attach derived, display-only values to each customer.
  const customers = useMemo(
    () =>
      customerList.map((customer) => {
        const appointments = [...(customer.appointments || [])].sort(
          (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt),
        )
        const orders = [...(customer.orders || [])].sort(
          (a, b) => new Date(b.order_date) - new Date(a.order_date),
        )
        return {
          ...customer,
          careProvider: appointments[0]?.optometrist?.name || null,
          latestOrderStatus: orders[0]?.status || null,
        }
      }),
    [customerList],
  )

  const providerOptions = useMemo(
    () => [...new Set(customers.map((c) => c.careProvider).filter(Boolean))].sort(),
    [customers],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return customers.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      const matchesProvider = filters.provider === 'all' || c.careProvider === filters.provider
      const matchesStatus =
        filters.orderStatus === 'all' || c.latestOrderStatus === filters.orderStatus
      return matchesSearch && matchesProvider && matchesStatus
    })
  }, [customers, search, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const effectivePage = Math.min(currentPage, totalPages)
  const paged = filtered.slice(
    (effectivePage - 1) * ITEMS_PER_PAGE,
    effectivePage * ITEMS_PER_PAGE,
  )

  const columns = [
    {
      key: 'client',
      header: 'Client & Member Info',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} id={row.id} />
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{deriveMemberId(row.id)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (row) => (
        <div>
          <p className="text-gray-900">{row.phone}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'careProvider', header: 'Vision Care Provider', render: (row) => <span className="text-gray-900">{row.careProvider || 'No visits yet'}</span> },
    { key: 'createdAt', header: 'Registration Date', render: (row) => <span className="text-gray-900">{formatDate(row.createdAt)}</span> },
    {
      key: 'latestOrderStatus',
      header: 'Latest Order Status',
      render: (row) =>
        row.latestOrderStatus ? (
          <Badge text={row.latestOrderStatus} variant={getVariantFromStatus(row.latestOrderStatus)} />
        ) : (
          <span className="text-sm text-gray-500">No orders yet</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            icon={<Pencil size={14} />}
            onClick={() => setEditing(row)}
          >
            Update
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={() => setDeleting(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const filterOptions = [
    { key: 'provider', label: 'Care Provider', value: filters.provider, options: providerOptions.map((name) => ({ label: name, value: name })) },
    { key: 'orderStatus', label: 'Order Status', value: filters.orderStatus, options: ORDER_STATUS_OPTIONS },
  ]

  const statCards = [
    { label: 'Total Customers', value: summary.totalCustomers, trend: summary.trends.totalCustomers, icon: <span className="flex size-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">{usersIcon}</span> },
    { label: 'Appointments This Month', value: summary.totalAppointmentsThisMonth, trend: summary.trends.totalAppointmentsThisMonth, icon: <span className="flex size-9 items-center justify-center rounded-lg bg-green-100 text-green-600">{calendarIcon}</span> },
    { label: 'Total Active Orders', value: summary.totalActiveOrders, trend: summary.trends.totalActiveOrders, icon: <span className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">{clipboardIcon}</span> },
    { label: 'Total Revenue', value: formatCurrency(summary.totalRevenue), trend: summary.trends.totalRevenue, icon: <span className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">{dollarIcon}</span> },
  ]

  const handleUpdate = (updated) => {
    setCustomerList((list) => list.map((c) => (c.id === updated.id ? updated : c)))
    setEditing(null)
  }

  const handleDelete = (customer) => {
    setCustomerList((list) => list.filter((c) => c.id !== customer.id))
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Registry & Patients</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customers, their appointments, prescriptions, and orders.
          </p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatsCard key={card.label} label={card.label} value={card.value} trend={card.trend} icon={card.icon} />
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full shrink-0 lg:max-w-xs">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <FilterBar
          filters={filterOptions}
          onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
          onClearAll={() => setFilters({ provider: 'all', orderStatus: 'all' })}
          onAddNew={() => navigate('/customers/new')}
        />
      </div>

      <div className="flex gap-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-3 text-sm font-medium transition-colors',
              activeTab === tab
                ? '-mb-px border-b-2 border-violet-600 text-violet-600'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {tab}
          </button>
        ))}
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
        onPageChange={setCurrentPage}
      />

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gray-900 p-6 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">{calendarIcon}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">Annual Refractive Recall Campaign</h3>
            <p className="mt-1 max-w-xl text-sm text-gray-400">
              Remind patients whose prescription is more than a year old to rebook an exam and
              keep their vision sharp.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Run Campaign
        </button>
      </div>

      {editing && (
        <CustomerEditModal
          key={editing.id}
          customer={editing}
          onSave={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}

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