import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { useCustomers } from '@/hook/UseCustomer'
import { usePrescriptions } from '@/hook/UsePrescription'
import { useToast } from '@/hook/UseToast'
import { createPrescriptionsBulk } from '@/api/prescriptionApi'
import { prescriptionErrors } from '@/utils/Validators'
import { formatDate } from '@/utils/format'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import BulkPrescriptionForm from '@/pages/prescription/BulkPrescriptionForm'

const today = () => new Date().toISOString().slice(0, 10)

const blankDraft = () => ({
  customer_id: '',
  prescription_date: today(),
  od_sphere: '',
  od_cylinder: '',
  od_axis: '',
  os_sphere: '',
  os_cylinder: '',
  os_axis: '',
  near_addition: '',
  pupillary_distance: '',
  notes: '',
})

const toNumber = (value) =>
  value === '' || value === null || value === undefined ? undefined : Number(value)

function toPayload(draft) {
  return {
    customer_id: Number(draft.customer_id),
    prescription_date: draft.prescription_date || today(),
    od_sphere: toNumber(draft.od_sphere),
    od_cylinder: toNumber(draft.od_cylinder),
    od_axis: toNumber(draft.od_axis),
    os_sphere: toNumber(draft.os_sphere),
    os_cylinder: toNumber(draft.os_cylinder),
    os_axis: toNumber(draft.os_axis),
    near_addition: toNumber(draft.near_addition),
    pupillary_distance: toNumber(draft.pupillary_distance),
    notes: draft.notes?.trim() ? draft.notes.trim() : undefined,
  }
}

function BulkPrescriptionPage() {
  const navigate = useNavigate()
  const { success: toastSuccess, error: toastError } = useToast()
  const { customers } = useCustomers()
  const { prescriptions } = usePrescriptions()

  const [draft, setDraft] = useState(blankDraft)
  const [batch, setBatch] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const missing = useMemo(() => {
    const withPrescription = new Set(prescriptions.map((p) => p.customer_id))
    return customers.filter((c) => !withPrescription.has(c.id))
  }, [customers, prescriptions])

  const errors = useMemo(() => prescriptionErrors(draft), [draft])
  const hasErrors = Object.values(errors).some(Boolean)

  const customerById = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers])

  const handleChange = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  const addToBatch = () => {
    if (hasErrors || !draft.customer_id) return
    setBatch((prev) => [...prev, toPayload(draft)])
    setDraft(blankDraft())
  }

  const removeFromBatch = (index) => setBatch((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    if (batch.length === 0 || submitting) return
    setSubmitting(true)
    try {
      await createPrescriptionsBulk(batch)
      toastSuccess(`${batch.length} prescription${batch.length > 1 ? 's' : ''} created.`)
      navigate('/dashboard/prescriptions')
    } catch (err) {
      toastError(err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to create prescriptions.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
        <button type="button" onClick={() => navigate('/dashboard/prescriptions')} className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Prescriptions
        </button>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-gray-900 dark:text-neutral-50">Bulk Create</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">Bulk Create Prescriptions</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          {missing.length} customer{missing.length === 1 ? '' : 's'} have no prescription yet. Draft one at a time, then create them all in a single request.
        </p>
      </div>

      {missing.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 size={28} className="text-forest dark:text-leaf" />
            <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">All customers have a prescription.</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/prescriptions')}>Back to Prescriptions</Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-6">
            <BulkPrescriptionForm customers={missing} form={draft} errors={errors} onChange={handleChange} />
          </div>

          <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200/60 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#1c1c28]/80 md:-mx-6 md:px-6">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button type="button" variant="outline" icon={<Plus size={16} />} disabled={hasErrors || !draft.customer_id} onClick={addToBatch}>
                Add to Batch
              </Button>
            </div>
          </div>

          <Card title={`Batch (${batch.length})`}>
            {batch.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">Nothing added yet — draft above then click Add to Batch.</p>
            ) : (
              <ul className="mt-3 divide-y divide-gray-100 dark:divide-neutral-800">
                {batch.map((item, index) => {
                  const customer = customerById.get(item.customer_id)
                  return (
                    <li key={`${item.customer_id}-${index}`} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-neutral-100">{customer?.name || `Customer #${item.customer_id}`}</p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                          OD {item.od_sphere ?? '—'} / OS {item.os_sphere ?? '—'} · {formatDate(item.prescription_date)}
                        </p>
                      </div>
                      <button type="button" onClick={() => removeFromBatch(index)} aria-label="Remove from batch" className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
            <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-neutral-800">
              <Button type="button" variant="primary" loading={submitting} disabled={batch.length === 0} onClick={handleSubmit}>
                Create {batch.length} Prescription{batch.length === 1 ? '' : 's'}
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default BulkPrescriptionPage