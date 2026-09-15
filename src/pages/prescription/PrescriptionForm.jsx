// Prescription form — shared by /prescriptions/new and /prescriptions/:id/edit.
// Mirrors CustomerForm: reads/writes the shared PrescriptionContext and supports
// create + edit modes. Line items link products from mockInventory to this RX.

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, UserRound } from 'lucide-react'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { composeValidators, required } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { usePrescriptions } from '@/hook/UsePrescription'
import customerData from '@/mockData/mockCustomers.json'
import inventoryData from '@/mockData/mockInventory.json'

const STATUS_OPTIONS = ['Active', 'Completed', 'Expired']

const today = () => new Date().toISOString().slice(0, 10)

function newItemRow() {
  return {
    rowId: Date.now() + Math.random(),
    productId: '',
    dosage: '',
    quantity: 1,
  }
}

function PrescriptionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success: toastSuccess } = useToast()
  const { prescriptions, addPrescription, updatePrescription } = usePrescriptions()

  const isEdit = Boolean(id)
  const existing = isEdit ? prescriptions.find((p) => p.id === Number(id)) : null

  const [form, setForm] = useState({
    customerId: '',
    doctorName: '',
    dateIssued: today(),
    items: [newItemRow()],
    status: 'Active',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (existing) {
      void Promise.resolve().then(() => {
        setForm({
          customerId: existing.customerId || '',
          doctorName: existing.doctorName || '',
          dateIssued: existing.dateIssued || today(),
          items: (existing.items || []).map((item) => ({
            rowId: Date.now() + Math.random(),
            productId: item.productId ?? '',
            dosage: item.dosage || '',
            quantity: item.quantity ?? 1,
          })),
          status: existing.status || 'Active',
          notes: existing.notes || '',
        })
      })
    }
  }, [existing])

  if (isEdit && !existing) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">Prescription not found</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400">No prescription matches id {id}.</p>
        <Button variant="outline" onClick={() => navigate('/dashboard/prescriptions')}>Back to Prescriptions</Button>
      </section>
    )
  }

  const customers = customerData.customers
  const products = inventoryData.items

  const customerOptions = [
    { value: '', label: 'Select customer...' },
    ...customers.map((c) => ({ value: c.id, label: c.name })),
  ]
  const productOptions = [
    { value: '', label: 'Select product...' },
    ...products.map((p) => ({ value: p.id, label: `${p.brand} ${p.model} (${p.sku})` })),
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const updateItem = (rowId, patch) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.rowId === rowId ? { ...item, ...patch } : item)),
    }))
  }

  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, newItemRow()] }))

  const removeItem = (rowId) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.length === 1 ? prev.items : prev.items.filter((item) => item.rowId !== rowId),
    }))

  const handleSubmit = (e) => {
    e.preventDefault()

    const itemErrors = form.items.map((item) => ({
      productId: composeValidators(required)(item.productId),
      dosage: composeValidators(required)(item.dosage),
      quantity: !item.quantity || Number(item.quantity) < 1 ? 'Must be at least 1' : '',
    }))

    const nextErrors = {
      customerId: composeValidators(required)(form.customerId),
      doctorName: composeValidators(required)(form.doctorName),
      dateIssued: composeValidators(required)(form.dateIssued),
      itemRows: itemErrors,
      items: itemErrors.some((err) => Object.values(err).some(Boolean))
        ? 'Add at least one completed line item.'
        : '',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some((error) => error)) return

    const payload = {
      customerId: Number(form.customerId),
      doctorName: form.doctorName.trim(),
      dateIssued: form.dateIssued,
      items: form.items.map((item) => ({
        productId: Number(item.productId),
        dosage: item.dosage.trim(),
        quantity: Number(item.quantity),
      })),
      status: form.status,
      notes: form.notes.trim(),
    }

    if (isEdit) {
      const updated = { ...existing, ...payload }
      updatePrescription(existing.id, updated)
      toastSuccess('Prescription updated successfully.')
      navigate(`/dashboard/prescriptions/${updated.id}`)
    } else {
      const nextId = prescriptions.reduce((max, p) => Math.max(max, p.id), 0) + 1
      addPrescription({ id: nextId, ...payload })
      toastSuccess('Prescription created successfully.')
      navigate('/dashboard/prescriptions')
    }
  }

  const goBack = isEdit ? `/dashboard/prescriptions/${existing.id}` : '/dashboard/prescriptions'
  const pageTitle = isEdit ? 'Edit Prescription' : 'New Prescription'
  const pageSubtitle = isEdit
    ? 'Update the prescription details and line items.'
    : 'Issue a new prescription with the products to dispense.'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
        <Link to="/dashboard/prescriptions" className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Prescriptions
        </Link>
        <span aria-hidden="true" className="text-gray-300 dark:text-neutral-600">/</span>
        <span className="font-medium text-gray-900 dark:text-neutral-50">{pageTitle}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">{pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{pageSubtitle}</p>
      </div>

      <Card title="Prescription Details">
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            name="customerId"
            label="Customer"
            required
            options={customerOptions}
            value={form.customerId}
            onChange={handleChange}
            error={errors.customerId}
          />
          <Field label="Doctor Name" icon={UserRound} name="doctorName" required value={form.doctorName} onChange={handleChange} error={errors.doctorName} placeholder="Dr. Claire Lawson" />
          <Field label="Date Issued" icon={UserRound} name="dateIssued" type="date" required value={form.dateIssued} onChange={handleChange} error={errors.dateIssued} />
          <Select
            name="status"
            label="Status"
            required
            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
            value={form.status}
            onChange={handleChange}
            error={errors.status}
          />
        </div>
      </Card>

      <Card title="Prescribed Items">
        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
          Add the products (frames, lenses, accessories) to dispense for this prescription.
        </p>
        {errors.items && <p className="mt-2 text-xs text-red-500 dark:text-red-400">{errors.items}</p>}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-neutral-800 dark:text-neutral-500">
                <th className="pb-3 pr-3 font-medium">Product</th>
                <th className="pb-3 pr-3 font-medium">Dosage</th>
                <th className="pb-3 pr-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, index) => (
                <tr key={item.rowId} className="border-b border-gray-100 dark:border-neutral-800">
                  <td className="py-3 pr-3">
                    <Select
                      name={`item-${index}-productId`}
                      options={productOptions}
                      value={item.productId}
                      onChange={(e) => updateItem(item.rowId, { productId: e.target.value })}
                      error={errors.itemRows?.[index]?.productId}
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <Field name={`item-${index}-dosage`} value={item.dosage} onChange={(e) => updateItem(item.rowId, { dosage: e.target.value })} placeholder="Daily wear" error={errors.itemRows?.[index]?.dosage} />
                  </td>
                  <td className="py-3 pr-3">
                    <Field name={`item-${index}-quantity`} type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.rowId, { quantity: e.target.value })} error={errors.itemRows?.[index]?.quantity} />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(item.rowId)}
                      disabled={form.items.length === 1}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" variant="outline" size="sm" icon={<Plus size={14} />} onClick={addItem}>
          Add Item
        </Button>
      </Card>

      <Card title="Notes">
        <div className="mt-2">
          <Field label="Notes" icon={UserRound} name="notes" value={form.notes} onChange={handleChange} placeholder="Clinical notes for the dispensing team..." helper="Optional notes about the prescription." />
        </div>
      </Card>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200/60 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#1c1c28]/80 md:-mx-6 md:px-6 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-xs text-gray-400 dark:text-neutral-500 sm:block">
            {isEdit ? 'Changes apply immediately.' : 'New prescriptions appear in the registry right away.'}
          </p>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(goBack)}>Cancel</Button>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Create Prescription'}</Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PrescriptionForm