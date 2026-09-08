import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import SearchBar from '@/components/data/SearchBar'
import DataTable from '@/components/data/DataTable'
import Pagination from '@/components/ui/Pagination'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { getCustomers, updateCustomer, deleteCustomer } from '@/api/customerApi'
import { getInitials, getAvatarColors } from '@/utils/avatar'
import { formatDate, deriveMemberId } from '@/utils/format'

const cn = (...classes) => classes.filter(Boolean).join(' ')

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

function CustomerEditModal({ customer, onSave, onClose }) {
  const [form, setForm] = useState({
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const setField = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }))

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    try {
      await onSave({ ...customer, ...form })
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to save changes.'
      setError(msg)
      setSaving(false)
    }
  }

  return (
    <div className={modalBackdrop} onClick={onClose}>
      <div className={modalCard} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-50">Update Customer</h3>
        <div className="mt-4 space-y-4">
          <Input label="Name" name="name" value={form.name} onChange={setField('name')} />
          <Input label="Phone" name="phone" value={form.phone} onChange={setField('phone')} />
          <Input label="Email" name="email" value={form.email} onChange={setField('email')} />
          <Input label="Address" name="address" value={form.address} onChange={setField('address')} />
        </div>
        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </div>
    </div>
  )
}

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
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const data = await getCustomers({ page: 0, size: 100, sort: 'id,desc' })
      setCustomers(Array.isArray(data?.content) ? data.content : [])
    } catch (err) {
      console.error('CustomerList: failed to load customers:', err?.response?.status || err?.message || err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return customers.filter((c) => {
      return (
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      )
    })
  }, [customers, search])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

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
    { key: 'created_at', header: 'Registration Date', render: (row) => <span className="text-gray-900 dark:text-neutral-100">{formatDate(row.created_at)}</span> },
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

  const handleUpdate = async (updated) => {
    const saved = await updateCustomer(updated.id, {
      name: updated.name,
      phone: updated.phone,
      email: updated.email,
      address: updated.address,
    })
    setCustomers((list) => list.map((c) => (c.id === saved.id ? saved : c)))
    setEditing(null)
  }

  const handleDelete = async (customer) => {
    try {
      await deleteCustomer(customer.id)
      setCustomers((list) => list.filter((c) => c.id !== customer.id))
      setDeleting(null)
    } catch (err) {
      console.error('CustomerList: failed to delete customer:', err?.response?.status || err?.message || err)
      setDeleting(null)
    }
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

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm dark:bg-[#1c1c28] dark:text-neutral-400">
          Loading customers...
        </div>
      ) : (
        <>
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
        </>
      )}

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
