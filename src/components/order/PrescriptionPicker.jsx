import { Link } from 'react-router-dom'
import { AlertCircle, Check, Plus } from 'lucide-react'
import { formatDate } from '@/utils/format'
import Button from '@/components/ui/Button'

const rxLabel = (id) => `RX-${String(id).padStart(5, '0')}`

const eyeSummary = (sphere, cylinder) => {
  if (sphere === null || sphere === undefined) return '—'
  return cylinder ? `${sphere} / ${cylinder}` : String(sphere)
}

function PrescriptionPicker({ prescriptions, loading, value, onChange, customerName }) {
  const list = Array.isArray(prescriptions) ? prescriptions : []

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-neutral-400">Loading prescriptions...</p>
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">
            {customerName ? `${customerName} has no prescription on file.` : 'No prescription on file.'}
          </p>
        </div>
        <p className="text-xs text-amber-700/80 dark:text-amber-300/70">
          A prescription is required before placing an order.
        </p>
        <Link to="/dashboard/prescriptions/new" state={{ from: '/dashboard/orders/new' }}>
          <Button variant="primary" size="sm" icon={<Plus size={14} />}>
            Create Prescription
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {list.map((prescription) => {
        const selected = Number(value) === prescription.id
        return (
          <button
            key={prescription.id}
            type="button"
            onClick={() => onChange(prescription.id)}
            className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
              selected
                ? 'border-leaf bg-mist-soft dark:border-leaf/60 dark:bg-forest/20'
                : 'border-edge hover:bg-mist-soft dark:border-neutral-700 dark:hover:bg-white/5'
            }`}
          >
            <div className="min-w-0">
              <p className="font-semibold text-ink dark:text-neutral-100">{rxLabel(prescription.id)}</p>
              <p className="mt-1 text-xs text-gray-600 dark:text-neutral-300">
                OD {eyeSummary(prescription.od_sphere, prescription.od_cylinder)} · OS{' '}
                {eyeSummary(prescription.os_sphere, prescription.os_cylinder)}
              </p>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-500">
                Issued {formatDate(prescription.prescription_date)}
              </p>
            </div>
            {selected && <Check size={18} className="shrink-0 text-forest dark:text-leaf" aria-hidden="true" />}
          </button>
        )
      })}
    </div>
  )
}

export default PrescriptionPicker