import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { composeValidators, required } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { useCustomers } from '@/hook/UseCustomer'
import { createRequest } from '@/api/requestApi'

function ProductRequestPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { success: toastSuccess, error: toastError } = useToast()
    const { customers } = useCustomers()

    const [form, setForm] = useState({
        customer_id: '',
        product_name: '',
        notes: '',
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const customerOptions = [
        { value: '', label: 'Select your profile...' },
        ...customers.map((c) => ({ value: c.id, label: c.name })),
    ]

    const handleCustomerChange = (e) => {
        const val = e.target.value === '' ? '' : Number(e.target.value)
        setForm((prev) => ({ ...prev, customer_id: val }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        const nextErrors = {
            customer_id: composeValidators(required)(form.customer_id),
            product_name: composeValidators(required)(form.product_name),
        }
        setErrors(nextErrors)
        if (Object.values(nextErrors).some((err) => err)) return

        setSubmitting(true)
        try {
            await createRequest({
                type: 'product',
                notes: form.notes || undefined,
            })
            toastSuccess('Product request submitted successfully.')
            navigate('/dashboard/requests')
        }
        catch {
            toastError?.('Failed to submit request.')
        }
        finally {
            setSubmitting(false)
        }
    }

    const goBack = id ? `/dashboard/requests/${form.customer_id}` : '/dashboard/requests'

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                <Link to="/dashboard/requests" className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
                    <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
                    Requests
                </Link>
                <span aria-hidden="true" className="text-gray-300 dark:text-neutral-600">/</span>
                <span className="font-medium text-gray-900 dark:text-neutral-50">Product Request</span>
            </nav>

            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">Product Request</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Submit a request to purchase glasses, lenses, or accessories.
                </p>
            </div>

            <Card title="Customer">
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
                </div>
            </Card>

            <Card title="Product Details">
                <div className="mt-5">
                    <Field
                        label="Product Name"
                        icon={Send}
                        name="product_name"
                        required
                        value={form.product_name}
                        onChange={(e) => setForm((prev) => ({ ...prev, product_name: e.target.value }))}
                        error={errors.product_name}
                        placeholder="e.g. Ray-Ban Wayfarer, Progressive lenses..."
                        helper="Describe the product you'd like to purchase."
                    />
                </div>
            </Card>

            <Card title="Notes">
                <div className="mt-5">
                    <Field
                        label="Additional Notes"
                        icon={Send}
                        name="notes"
                        value={form.notes}
                        onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any specific requirements..."
                        helper="Optional notes about this product request."
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

export default ProductRequestPage