import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, ClipboardList, ClipboardPlus, Plus, Stethoscope, Trash2, UserRound } from 'lucide-react'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { composeValidators, required } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { usePrescriptions } from '@/hook/UsePrescription'
import { useCustomers } from '@/hook/UseCustomer'
import inventoryData from '@/mockData/mockInventory.json'

const STATUS_OPTIONS = ['Active', 'Completed', 'Expired']
const PRODUCTS = inventoryData.items

function newItem() {
    return { rowId: Date.now() + Math.random(), productId: '', dosage: '', quantity: 1 }
}

function PrescriptionForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { success: toastSuccess } = useToast()
    const { prescriptions, addPrescription, updatePrescription } = usePrescriptions()
    const { customers } = useCustomers()

    const isEdit = Boolean(id)
    const existing = isEdit ? prescriptions.find((p) => p.id === Number(id)) : null

    const [form, setForm] = useState({
        customerId: '',
        doctorName: '',
        dateIssued: '',
        status: 'Active',
        notes: '',
    })
    const [items, setItems] = useState([newItem()])
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (existing) {
            setForm({
                customerId: existing.customerId,
                doctorName: existing.doctorName,
                dateIssued: existing.dateIssued,
                status: existing.status,
                notes: existing.notes || '',
            })
            setItems(
                existing.items.map((item, i) => ({
                    rowId: `${item.productId}-${i}`,
                    productId: item.productId,
                    dosage: item.dosage || '',
                    quantity: item.quantity,
                })),
            )
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

    const customerOptions = [
        { value: '', label: 'Select customer...' },
        ...customers.map((c) => ({ value: c.id, label: c.name })),
    ]
    const productOptions = [
        { value: '', label: 'Select product' },
        ...PRODUCTS.map((p) => ({ value: p.id, label: `${p.brand} ${p.model} (${p.sku})` })),
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: name === 'customerId' ? (value === '' ? '' : Number(value)) : value,
        }))
    }

    const handleItemChange = (rowId, patch) => {
        setItems((prev) => prev.map((item) => (item.rowId === rowId ? { ...item, ...patch } : item)))
    }

    const addItem = () => setItems((prev) => [...prev, newItem()])
    const removeItem = (rowId) => setItems((prev) => (prev.length === 1 ? prev : prev.filter((i) => i.rowId !== rowId)))

    const handleSubmit = (e) => {
        e.preventDefault()
        const itemsValid =
            items.length > 0 &&
            items.every((i) => i.productId !== '' && i.productId != null && (i.dosage ?? '').trim() !== '' && Number(i.quantity) > 0)

        const nextErrors = {
            customerId: composeValidators(required)(form.customerId),
            doctorName: composeValidators(required)(form.doctorName),
            dateIssued: composeValidators(required)(form.dateIssued),
            items: itemsValid ? '' : 'Add at least one item with product, dosage, and quantity.',
        }
        setErrors(nextErrors)
        if (Object.values(nextErrors).some((error) => error)) return

        const cleanItems = items.map(({ rowId: _, ...item }) => item)

        if (isEdit) {
            const updated = {
                ...existing,
                ...form,
                items: cleanItems,
                updatedAt: new Date().toISOString(),
            }
            updatePrescription(updated)
            toastSuccess('Prescription updated successfully.')
            navigate(`/dashboard/prescriptions/${updated.id}`)
        } else {
            const nextId = prescriptions.reduce((max, p) => Math.max(max, p.id), 0) + 1
            const now = new Date().toISOString()
            addPrescription({
                id: nextId,
                ...form,
                items: cleanItems,
                createdAt: now,
                updatedAt: now,
            })
            toastSuccess('Prescription created successfully.')
            navigate('/dashboard/prescriptions')
        }
    }

    const goBack = isEdit ? `/dashboard/prescriptions/${existing.id}` : '/dashboard/prescriptions'
    const pageTitle = isEdit ? 'Edit Prescription' : 'New Prescription'
    const pageSubtitle = isEdit
        ? 'Update the prescription details and dispensing items.'
        : 'Issue a new prescription and attach the dispensing items.'

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
                <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white text-gray-400 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-500">
                        {isEdit ? <ClipboardPlus size={18} /> : <UserRound size={18} />}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {isEdit
                            ? 'Review and update the prescription record.'
                            : 'Start with the patient; attach dispensing items next.'}
                    </p>
                </div>

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
                    <Field label="Doctor Name" icon={Stethoscope} name="doctorName" required value={form.doctorName} onChange={handleChange} error={errors.doctorName} placeholder="Dr. Claire Lawson" />
                    <Field label="Date Issued" icon={CalendarDays} name="dateIssued" type="date" required value={form.dateIssued} onChange={handleChange} error={errors.dateIssued} />
                    <Select
                        name="status"
                        label="Status"
                        required
                        options={STATUS_OPTIONS}
                        value={form.status}
                        onChange={handleChange}
                    />
                    <div className="md:col-span-2">
                        <Field label="Notes" icon={ClipboardList} name="notes" value={form.notes} onChange={handleChange} placeholder="Clinical notes for the dispensing team..." helper="Optional notes about the prescription." />
                    </div>
                </div>
            </Card>

            <Card title="Prescription Items">
                {errors.items && <p className="mb-3 text-xs text-red-600 dark:text-red-400">{errors.items}</p>}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500 dark:border-neutral-800 dark:text-neutral-500">
                                <th className="pb-3 pr-3 font-medium">Product</th>
                                <th className="pb-3 pr-3 font-medium">Dosage</th>
                                <th className="pb-3 pr-3 font-medium">Quantity</th>
                                <th className="pb-3 font-medium" />
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.rowId} className="border-b border-gray-100 dark:border-neutral-800">
                                    <td className="py-3 pr-3">
                                        <Select
                                            name={`item-product-${item.rowId}`}
                                            options={productOptions}
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(item.rowId, { productId: e.target.value === '' ? '' : Number(e.target.value) })}
                                        />
                                    </td>
                                    <td className="py-3 pr-3">
                                        <input
                                            type="text"
                                            value={item.dosage}
                                            onChange={(e) => handleItemChange(item.rowId, { dosage: e.target.value })}
                                            placeholder="e.g. Daily wear"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors duration-300 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500"
                                        />
                                    </td>
                                    <td className="py-3 pr-3">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(item.rowId, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                                            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors duration-300 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100"
                                        />
                                    </td>
                                    <td className="py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.rowId)}
                                            disabled={items.length === 1}
                                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-500/10"
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
                <div className="mt-4">
                    <Button type="button" variant="outline" size="sm" icon={<Plus size={14} />} onClick={addItem}>
                        Add Item
                    </Button>
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