import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ClipboardList, FileText } from 'lucide-react'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CustomerSearchSelect from '@/components/request/CustomerSearchSelect'
import { createRequestForCustomer } from '@/api/requestApi'
import { useToast } from '@/hook/UseToast'

const NOTES_MAX = 1000

// Matches the backend RequestService: only 'exam' and 'product' are valid.
const REQUEST_TYPES = [
  { value: '', label: 'Select request type…' },
  { value: 'exam', label: 'Eye Exam' },
  { value: 'product', label: 'Product' },
]

function RequestAddPage() {
  const navigate = useNavigate()
  const { success: toastSuccess, error: toastError } = useToast()

  const [customer, setCustomer] = useState(null)
  const [requestType, setRequestType] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const clearError = (name) => setErrors((prev) => ({ ...prev, [name]: undefined }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    const nextErrors = {}
    if (!customer) nextErrors.customer = 'Please select a customer'
    if (!requestType) nextErrors.requestType = 'Please select a request type'
    setErrors(nextErrors)
    setServerError('')
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await createRequestForCustomer({
        customerId: customer.id,
        type: requestType,
        notes: notes.trim() || undefined,
      })
      toastSuccess(`Request created for ${customer.name}.`)
      navigate('/dashboard/requests')
    } catch (err) {
      const data = err?.response?.data
      const fieldErrors = {}
      if (data?.customerId) fieldErrors.customer = data.customerId
      if (data?.type) fieldErrors.requestType = data.type
      if (data?.notes) fieldErrors.notes = data.notes
      setErrors((prev) => ({ ...prev, ...fieldErrors }))
      const msg =
        typeof data?.error === 'string'
          ? data.error
          : data?.message || err?.message || 'Failed to create request'
      setServerError(msg)
      toastError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
        <Link to="/dashboard/requests" className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
          <ArrowLeft size={16} />
          Requests
        </Link>
        <span aria-hidden="true" className="text-gray-300 dark:text-neutral-600">/</span>
        <span className="font-medium text-gray-900 dark:text-neutral-50">Create Request</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">Create Request</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          Create a request for an existing customer. The request starts Pending and is processed from the request list.
        </p>
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{serverError}</p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Card title="Request Details">
          <div className="space-y-4">
            <CustomerSearchSelect
              value={customer}
              onChange={(c) => {
                setCustomer(c)
                clearError('customer')
              }}
              error={errors.customer}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                name="requestType"
                label="Request Type"
                required
                options={REQUEST_TYPES}
                value={requestType}
                onChange={(e) => {
                  setRequestType(e.target.value)
                  clearError('requestType')
                }}
                error={errors.requestType}
              />
            </div>

            <Field
              label="Notes"
              icon={FileText}
              name="notes"
              helper={`Optional details about this request. Max ${NOTES_MAX} characters.`}
            >
              <textarea
                name="notes"
                value={notes}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.length <= NOTES_MAX) setNotes(value)
                  clearError('notes')
                }}
                rows={4}
                maxLength={NOTES_MAX}
                placeholder="Enter any additional information about this request..."
                className="h-auto w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors duration-300 focus:border-[#8fa88f] focus:ring-2 focus:ring-[#8fa88f]/20 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500"
              />
            </Field>
          </div>
        </Card>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/requests')} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" icon={<ClipboardList size={16} />} loading={submitting} disabled={submitting}>
            Create Request
          </Button>
        </div>
      </form>
    </div>
  )
}

export default RequestAddPage