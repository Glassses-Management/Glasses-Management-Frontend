import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, UserRound } from 'lucide-react'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { composeValidators, required } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { usePrescriptions } from '@/hook/UsePrescription'
import { useCustomers } from '@/hook/UseCustomer'
import { getOptometrists } from '@/api/userApi'

function PrescriptionForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { success: toastSuccess, error: toastError } = useToast()
    const { prescriptions, addPrescription, updatePrescription } = usePrescriptions()
    const { customers } = useCustomers()

    const isEdit = Boolean(id)
    const existing = isEdit ? prescriptions.find((p) => p.id === Number(id)) : null

    const [form, setForm] = useState(() => ({
        customer_id: '',
        user_id: '',
        od_sphere: '',
        od_cylinder: '',
        od_axis: '',
        os_sphere: '',
        os_cylinder: '',
        os_axis: '',
        near_addition: '',
        pupillary_distance: '',
        notes: '',
        prescription_date: new Date().toISOString().slice(0, 10),
    }))
    const [errors, setErrors] = useState({})
    const [optometrists, setOptometrists] = useState([])
    const [optometristLoading, setOptometristLoading] = useState(false)

    useEffect(() => {
        if (existing) {
            void Promise.resolve().then(() => {
                setForm({
                    customer_id: existing.customer_id || '',
                    user_id: existing.user_id || '',
                    od_sphere: existing.od_sphere ?? '',
                    od_cylinder: existing.od_cylinder ?? '',
                    od_axis: existing.od_axis ?? '',
                    os_sphere: existing.os_sphere ?? '',
                    os_cylinder: existing.os_cylinder ?? '',
                    os_axis: existing.os_axis ?? '',
                    near_addition: existing.near_addition ?? '',
                    pupillary_distance: existing.pupillary_distance ?? '',
                    notes: existing.notes || '',
                    prescription_date: existing.prescription_date || '',
                })
            })
        }
    }, [existing])

    useEffect(() => {
        const load = async () => {
            setOptometristLoading(true)
            try {
                const data = await getOptometrists()
                setOptometrists(data)
            }
            catch {
                // silently fail
            }
            finally {
                setOptometristLoading(false)
            }
        }
        void load()
    }, [])

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
    const optometristOptions = [
        { value: '', label: 'Select optometrist...' },
        ...optometrists.map((u) => ({ value: u.id, label: u.name || u.email || '—' })),
    ]

    const numericFields = new Set([
        'customer_id', 'user_id', 'od_sphere', 'od_cylinder', 'od_axis',
        'os_sphere', 'os_cylinder', 'os_axis', 'near_addition', 'pupillary_distance',
    ])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: numericFields.has(name) ? (value === '' ? '' : Number(value)) : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const lensValid = (val) => val === '' || Number.isFinite(Number(val))
        const axisValid = (val) => val === '' || (Number(val) >= 0 && Number(val) <= 180)

        const nextErrors = {
            customer_id: composeValidators(required)(form.customer_id),
            prescription_date: '',
            od_sphere: lensValid(form.od_sphere) ? '' : 'Must be a number',
            od_cylinder: lensValid(form.od_cylinder) ? '' : 'Must be a number',
            od_axis: axisValid(form.od_axis) ? '' : 'Must be 0-180',
            os_sphere: lensValid(form.os_sphere) ? '' : 'Must be a number',
            os_cylinder: lensValid(form.os_cylinder) ? '' : 'Must be a number',
            os_axis: axisValid(form.os_axis) ? '' : 'Must be 0-180',
            near_addition: lensValid(form.near_addition) ? '' : 'Must be a number',
            pupillary_distance: lensValid(form.pupillary_distance) ? '' : 'Must be >= 0',
        }
        setErrors(nextErrors)
        if (Object.values(nextErrors).some((error) => error)) return

        const payload = {
            customer_id: Number(form.customer_id),
            user_id: form.user_id ? Number(form.user_id) : undefined,
            od_sphere: form.od_sphere !== '' ? Number(form.od_sphere) : undefined,
            od_cylinder: form.od_cylinder !== '' ? Number(form.od_cylinder) : undefined,
            od_axis: form.od_axis !== '' ? Number(form.od_axis) : undefined,
            os_sphere: form.os_sphere !== '' ? Number(form.os_sphere) : undefined,
            os_cylinder: form.os_cylinder !== '' ? Number(form.os_cylinder) : undefined,
            os_axis: form.os_axis !== '' ? Number(form.os_axis) : undefined,
            near_addition: form.near_addition !== '' ? Number(form.near_addition) : undefined,
            pupillary_distance: form.pupillary_distance !== '' ? Number(form.pupillary_distance) : undefined,
            notes: form.notes || undefined,
            prescription_date: form.prescription_date,
        }

                try {
                    if (isEdit) {
                        const updated = { ...existing, ...payload }
                        await updatePrescription(existing.id, updated)
                        toastSuccess('Prescription updated successfully.')
                        navigate(`/dashboard/prescriptions/${existing.id}`)
                    } else {
                        await addPrescription(payload)
                        toastSuccess('Prescription created successfully.')
                        const from = location.state?.from || '/dashboard/prescriptions'
                        navigate(from)
                    }
                }
        catch {
            toastError('Failed to save prescription.')
        }
    }

    const fromPath = location.state?.from || '/dashboard/prescriptions'
    const goBack = isEdit ? `/dashboard/prescriptions/${existing.id}` : fromPath
    const pageTitle = isEdit ? 'Edit Prescription' : 'New Prescription'

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
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Issue an eyeglass prescription with lens parameters for both eyes.
                </p>
            </div>

            <Card title="Patient Information">
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Select
                        name="customer_id"
                        label="Customer"
                        required
                        options={customerOptions}
                        value={form.customer_id}
                        onChange={handleChange}
                        error={errors.customer_id}
                    />
                    <Select
                        name="user_id"
                        label="Optometrist"
                        options={optometristOptions}
                        value={form.user_id}
                        onChange={handleChange}
                        error={errors.user_id}
                        disabled={optometristLoading}
                    />
                    <Field label="Prescription Date" icon={UserRound} name="prescription_date" type="date" value={form.prescription_date} onChange={handleChange} error={errors.prescription_date} disabled={!isEdit} />
                </div>
            </Card>

            <Card title="Right Eye (OD)">
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Field label="OD Sphere" icon={UserRound} name="od_sphere" type="number" step="0.25" required value={form.od_sphere} onChange={handleChange} error={errors.od_sphere} placeholder="-1.50" />
                    <Field label="OD Cylinder" icon={UserRound} name="od_cylinder" type="number" step="0.25" value={form.od_cylinder} onChange={handleChange} error={errors.od_cylinder} placeholder="-0.25" />
                    <Field label="OD Axis" icon={UserRound} name="od_axis" type="number" min="0" max="180" required value={form.od_axis} onChange={handleChange} error={errors.od_axis} placeholder="180" />
                </div>
            </Card>

            <Card title="Left Eye (OS)">
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Field label="OS Sphere" icon={UserRound} name="os_sphere" type="number" step="0.25" required value={form.os_sphere} onChange={handleChange} error={errors.os_sphere} placeholder="-1.25" />
                    <Field label="OS Cylinder" icon={UserRound} name="os_cylinder" type="number" step="0.25" value={form.os_cylinder} onChange={handleChange} error={errors.os_cylinder} placeholder="-0.50" />
                    <Field label="OS Axis" icon={UserRound} name="os_axis" type="number" min="0" max="180" required value={form.os_axis} onChange={handleChange} error={errors.os_axis} placeholder="175" />
                </div>
            </Card>

            <Card title="Additional Values">
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Near Addition" icon={UserRound} name="near_addition" type="number" step="0.25" value={form.near_addition} onChange={handleChange} error={errors.near_addition} placeholder="1.00" helper="Optional; for progressive/bifocal lenses" />
                    <Field label="Pupillary Distance (mm)" icon={UserRound} name="pupillary_distance" type="number" step="0.5" value={form.pupillary_distance} onChange={handleChange} error={errors.pupillary_distance} placeholder="62" helper="Optional; distance between pupils in mm" />
                </div>
            </Card>

            <Card title="Notes">
                <div className="mt-5">
                    <Field label="Notes" icon={UserRound} name="notes" value={form.notes} onChange={handleChange} placeholder="Clinical notes for the dispensing team..." helper="Optional notes about the prescription." />
                </div>
            </Card>

            <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200/60 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#1c1c28]/80 md:-mx-6 md:px-6 md:py-5">
                <div className="flex items-center justify-between gap-3">
                    <p className="hidden text-xs text-gray-400 dark:text-neutral-500 sm:block">
                        {isEdit ? 'Changes apply immediately.' : 'New prescription appears in the registry right away.'}
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