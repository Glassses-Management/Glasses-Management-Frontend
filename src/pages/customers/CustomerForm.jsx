import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Phone, User, UserRound } from 'lucide-react'
import Field from '@/components/ui/Field'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { composeValidators, required, email, phone } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { useCustomers } from '@/hook/UseCustomer'

function CustomerForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success: toastSuccess } = useToast()
  const { customers, addCustomer, updateCustomer } = useCustomers()

  const isEdit = Boolean(id)
  const existing = isEdit ? customers.find((c) => c.id === Number(id)) : null

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        phone: existing.phone,
        email: existing.email,
        address: existing.address,
      })
    }
  }, [existing])

  if (isEdit && !existing) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customer not found</h1>
        <p className="text-sm text-gray-500">No client matches id {id}.</p>
        <Button variant="outline" onClick={() => navigate('/dashboard/customers')}>Back to Customers</Button>
      </section>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {
      name: composeValidators(required)(form.name),
      phone: composeValidators(required, phone)(form.phone),
      email: composeValidators(required, email)(form.email),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some((error) => error)) return

    if (isEdit) {
      const updated = { ...existing, ...form, updatedAt: new Date().toISOString() }
      updateCustomer(updated)
      toastSuccess('Customer updated successfully.')
      navigate(`/dashboard/customers/${updated.id}`)
    } else {
      const nextId = customers.reduce((max, c) => Math.max(max, c.id), 0) + 1
      const now = new Date().toISOString()
      const created = {
        id: nextId,
        ...form,
        dateOfBirth: '',
        createdAt: now,
        updatedAt: now,
        appointments: [],
        prescriptions: [],
        orders: [],
      }
      addCustomer(created)
      toastSuccess('Customer created successfully.')
      navigate('/dashboard/customers')
    }
  }

  const goBack = isEdit ? `/dashboard/customers/${existing.id}` : '/dashboard/customers'
  const pageTitle = isEdit ? 'Edit Customer' : 'New Customer'
  const pageSubtitle = isEdit
    ? 'Update the client details in the registry.'
    : 'Add a new client and their contact details to the registry.'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/dashboard/customers" className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700">
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Customers
        </Link>
        <span aria-hidden="true" className="text-gray-300">/</span>
        <span className="font-medium text-gray-900">{pageTitle}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500">{pageSubtitle}</p>
      </div>

      <Card title="Contact Details">
        <div className="flex items-center gap-3">
          {isEdit ? (
            <Avatar name={existing.name} id={existing.id} />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white text-gray-400">
              <UserRound size={18} />
            </span>
          )}
          <p className="text-sm text-gray-500">
            {isEdit
              ? 'Review and update the client contact information.'
              : 'Start with the basics; clinical records can be added later.'}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Name" icon={User} name="name" required value={form.name} onChange={handleChange} error={errors.name} placeholder="John Doe" />
          <Field label="Phone" icon={Phone} name="phone" required value={form.phone} onChange={handleChange} error={errors.phone} placeholder="012 345 678" />
          <Field label="Email" icon={Mail} name="email" type="email" required value={form.email} onChange={handleChange} error={errors.email} placeholder="john.doe@example.com" helper="Used for order updates and receipts." />
          <Field label="Address" icon={MapPin} name="address" value={form.address} onChange={handleChange} placeholder="Street, District, City" helper="Delivery and billing address for orders." />
        </div>
      </Card>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200/60 bg-white/80 px-4 py-4 backdrop-blur-md md:-mx-6 md:px-6 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-xs text-gray-400 sm:block">
            {isEdit ? 'Changes apply immediately.' : 'New clients appear in the registry right away.'}
          </p>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(goBack)}>Cancel</Button>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Create Customer'}</Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CustomerForm