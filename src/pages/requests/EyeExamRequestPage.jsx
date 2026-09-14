import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Eye } from 'lucide-react'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { composeValidators, required } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { useCustomers } from '@/hook/UseCustomer'
import { createRequest } from '@/api/requestApi'
import { getPrescriptionsByCustomer } from '@/api/prescriptionApi'

function EyeExamRequestPage() {
    const navigate = useNavigate()
    const { success: toastSuccess, error: toastError } = useToast()
    const { customers } = useCustomers()

    const [form, setForm] = useState({
        customer_id: '',
        prescription_id: '',
        notes: '',
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [prescriptionOptions, setPrescriptionOptions] = useState([])

    const customerId = form.customer_id || ''

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPrescriptionsByCustomer(customerId)
                const list = data.content || data
                const opts = [{ value: '', label: 'Select a prescription...' }, ...list.map((p) => ({ value: p.id, label: `RX-${String(p.id).padStart(5, '0')} — ${p.notes || 'No notes'}` }))]
                setPrescriptionOptions(opts)
            }
            catch {
                setPrescriptionOptions([{ value: '', label: 'Select a prescription...' }])
            }
        }
        if (customerId) {
            void load()
        }
    }, [customerId])

    const customerOptions = [
        { value: '', label: 'Select your profile...' },
        ...customers.map((c) => ({ value: c.id, label: c.name })),
    ]

    const handleCustomerChange = (e) => {
        const val = e.target.value === '' ? '' : Number(e.target.value)
        setForm((prev) => ({ ...prev, customer_id: val, prescription_id: '', notes: '' }))
        setPrescriptionOptions([{ value: '', label: 'Select a prescription...' }])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        const nextErrors = {
            customer_id: composeValidators(required)(form.customer_id),
            prescription_id: composeValidators(required)(form.prescription_id),
        }
        setErrors(nextErrors)
        if (Object.values(nextErrors).some((err) => err)) return

        setSubmitting(true)
        try {
            await createRequest({
                type: 'exam',
                prescriptionId: Number(form.prescription_id),
                notes: form.notes || undefined,
            })
            toastSuccess('Eye exam request submitted successfully.')
            navigate('/dashboard/requests')
        }
        catch {
            toastError?.('Failed to submit request.')
        }
        finally {
            setSubmitting(false)
        }
    }

    const goBack = '/dashboard/requests'

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                <button type="button" onClick={() => navigate('/dashboard/requests')} className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
                    <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
                    Requests
                </button>
                <span aria-hidden="true" className="text-gray-300 dark:text-neutral-600">/</span>
                <span className="font-medium text-gray-900 dark:text-neutral-50">Eye Exam Request</span>
            </nav>

            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">Eye Exam Request</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Submit an eye exam request using an existing prescription.
                </p>
            </div>

            <Card title="Patient Information">
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Select
                        name="customer_id"
                        label="Your Profile"
                        required
                        options={customerOptions}
                        value={form.customer_id}
                        onChange={handleCustomerChange}
                        error={errors.customer_id}
                    />
                    <Select
                        name="prescription_id"
                        label="Prescription"
                        required
                        options={prescriptionOptions}
                        value={form.prescription_id}
                        onChange={(e) => setForm((prev) => ({ ...prev, prescription_id: e.target.value }))}
                        error={errors.prescription_id}
                        disabled={!form.customer_id}
                    />
                </div>
            </Card>

            <Card title="Notes">
                <div className="mt-5">
                    <Field
                        label="Additional Notes"
                        icon={Eye}
                        name="notes"
                        value={form.notes}
                        onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any specific requirements or preferences..."
                        helper="Optional notes about this eye exam request."
                    />
                </div>
            </Card>

            <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200/60 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#1c1c28]/80 md:-mx-6 md:px-6 md:py-5">
                <div className="flex items-center justify-between gap-3">
                    <p className="hidden text-xs text-gray-400 dark:text-neutral-500 sm:block">
                        Your request will be reviewed by staff.
                    </p>
                    <div className="flex items-center gap-3">
                        <Button type="button" variant="ghost" onClick={() => navigate(goBack)}>Cancel</Button>
                        <Button type="submit" loading={submitting}>
                            <span className="flex items-center gap-1"><Send size={16} /> Submit Request</span>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default EyeExamRequestPage