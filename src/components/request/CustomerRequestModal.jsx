import { useState } from 'react'
import { Send } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { createRequest } from '@/api/requestApi'

// Matches the backend RequestService: only 'exam' and 'product' are valid.
const REQUEST_TYPES = [
  { value: '', label: 'Select request type…' },
  { value: 'exam', label: 'Eye Examination' },
  { value: 'product', label: 'Product' },
]

const NOTES_MAX = 1000

export default function CustomerRequestModal({ open, onClose }) {
  const { token, user } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()

  const [requestType, setRequestType] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const isAuthenticated = !!token

  const handleTypeChange = (e) => {
    setRequestType(e.target.value)
    setErrors((prev) => ({ ...prev, requestType: undefined }))
  }

  const handleNotesChange = (e) => {
    const value = e.target.value
    if (value.length <= NOTES_MAX) setNotes(value)
    setErrors((prev) => ({ ...prev, notes: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setServerError('')

    if (!isAuthenticated) {
      onClose()
      toastError?.('Please log in or register to submit a request.')
      return
    }

    if (!requestType) {
      setErrors({ requestType: 'Please select a request type' })
      return
    }

    setSubmitting(true)
    try {
      // The backend resolves the customer from the JWT, so we never send
      // customerId here. Customers cannot create requests for other accounts.
      await createRequest({ type: requestType, notes: notes || undefined })
      toastSuccess('Request submitted successfully!')
      setSubmitted(true)
      setRequestType('')
      setNotes('')
    } catch (err) {
      const data = err?.response?.data
      const fieldErrors = {}
      if (data?.type) fieldErrors.requestType = data.type
      if (data?.notes) fieldErrors.notes = data.notes
      setErrors(fieldErrors)
      const msg =
        data?.error ||
        data?.message ||
        (data && typeof data === 'object' ? Object.values(data).find((v) => typeof v === 'string') : '') ||
        'Failed to submit request. Please try again.'
      setServerError(msg)
      if (Object.keys(fieldErrors).length === 0) {
        toastError?.(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      setRequestType('')
      setNotes('')
      setSubmitted(false)
      setErrors({})
      setServerError('')
      onClose()
    }
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        name="requestType"
        label="Request Type"
        required
        options={REQUEST_TYPES}
        value={requestType}
        onChange={handleTypeChange}
        error={errors.requestType}
      />

      {isAuthenticated ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900">
          <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">Submitting as</p>
          <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-neutral-100">{user?.name || 'Your account'}</p>
          <p className="text-xs text-gray-500 dark:text-neutral-400">{user?.email}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Please log in or create an account to submit a request.
          </p>
        </div>
      )}

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">{serverError}</p>
        </div>
      )}

      <Field
        label="Notes"
        name="notes"
        helper={`Optional details about your request. Max ${NOTES_MAX} characters.`}
      >
        <textarea
          name="notes"
          value={notes}
          onChange={handleNotesChange}
          rows={3}
          maxLength={NOTES_MAX}
          placeholder="Tell us anything we should know about your request…"
          className="h-20 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
        {errors.notes && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.notes}</p>}
      </Field>

      <div className="sticky bottom-0 -mx-6 border-t border-gray-100 bg-white px-6 py-3 dark:border-neutral-800 dark:bg-[#1c1c28]">
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" loading={submitting}>
            <span className="flex items-center gap-1"><Send size={16} /> Submit Request</span>
          </Button>
        </div>
      </div>
    </form>
  )

  const renderSubmitted = () => (
    <div className="space-y-4 py-2">
      <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <Send size={20} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-neutral-100">Request submitted!</p>
          <p className="text-sm text-gray-500 dark:text-neutral-400">We'll review your request shortly.</p>
        </div>
      </div>
      <Button onClick={handleClose} className="w-full">Close</Button>
    </div>
  )

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Submit a Request"
      maxWidth="max-w-md"
      footer={null}
    >
      {submitted ? renderSubmitted() : renderForm()}
    </Modal>
  )
}