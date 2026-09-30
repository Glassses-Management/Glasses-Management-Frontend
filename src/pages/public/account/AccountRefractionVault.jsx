import { useEffect, useState } from 'react'
import { Eye, FileText, Ruler } from 'lucide-react'
import AccountCard from '@/pages/public/account/AccountCard'
import { getMyPrescriptions } from '@/api/prescriptionApi'
import { formatDate } from '@/utils/FormatDate'

// The customer's real prescription, from GET /api/prescriptions/mine.
//
// This card used to render hard-coded values from AccountData (REFRACTION_ROWS,
// SUB_METRICS, LENS_TAGS) - a fixed "-3.25 D / 178°" presented under a "Signed"
// badge as if it were this patient's own prescription.
//
// Only fields the backend actually stores are shown. Segment height, pantoscopic
// tilt and wrap angle have no column on PrescriptionResponse, so they are gone
// rather than invented: a plausible-looking measurement that came from nowhere is
// worse than an absent one on a medical record.
const num = (value) =>
  value === null || value === undefined || value === '' ? null : Number(value)

const fmt = (value) => {
  const n = num(value)
  return n === null ? '—' : `${n}`
}

const fmtAxis = (value) => {
  const n = num(value)
  return n === null ? '—' : `${n}°`
}

// Newest first. prescription_date is the clinical date; createdAt is only a
// fallback for rows that predate it.
function latestOf(prescriptions) {
  return [...prescriptions].sort((a, b) =>
    String(b.prescription_date || b.createdAt || '').localeCompare(
      String(a.prescription_date || a.createdAt || ''),
    ),
  )[0]
}

const ROWS = [
  { param: 'Sphere', od: 'od_sphere', os: 'os_sphere' },
  { param: 'Cylinder', od: 'od_cylinder', os: 'os_cylinder' },
  { param: 'Axis', od: 'od_axis', os: 'os_axis', axis: true },
  { param: 'Add Power', od: 'near_addition', os: 'near_addition' },
]

export default function AccountRefractionVault() {
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getMyPrescriptions()
      .then((list) => {
        if (cancelled) return
        setPrescription(latestOf(Array.isArray(list) ? list : []))
        setError('')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.response?.data?.message || err?.message || 'Failed to load your prescription.')
        setPrescription(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const dated = prescription?.prescription_date
  const pd = num(prescription?.pupillary_distance)

  return (
    <AccountCard>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 pt-6 pb-4 dark:border-neutral-800" data-aos="fade-up">
        <div>
          <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
            Prescription on file
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {dated ? `Exam of ${formatDate(dated)} · OD right / OS left` : 'Your latest refraction'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
          <Eye size={13} />
          Latest
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 px-6 py-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-mist dark:bg-surface-raised" />
          ))}
        </div>
      ) : error ? (
        <p className="px-6 py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : !prescription ? (
        <div className="px-6 py-12 text-center">
          <FileText size={30} className="mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No prescription on file</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Book an eye exam and your results will appear here.
          </p>
        </div>
      ) : (
        <div className="px-6 pt-4" data-aos="fade-up" data-aos-delay="100">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                <th className="py-0 pr-3 font-semibold">Parameter</th>
                <th className="py-0 pr-3 font-semibold">OD (Right)</th>
                <th className="py-0 font-semibold">OS (Left)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {ROWS.map((row) => (
                <tr key={row.param} className="text-sm">
                  <td className="py-2.5 pr-3 text-neutral-500 dark:text-neutral-400">{row.param}</td>
                  <td className="py-2.5 pr-3 font-semibold text-neutral-900 dark:text-neutral-50">
                    {row.axis ? fmtAxis(prescription[row.od]) : fmt(prescription[row.od])}
                  </td>
                  <td className="py-2.5 font-semibold text-neutral-900 dark:text-neutral-50">
                    {row.axis ? fmtAxis(prescription[row.os]) : fmt(prescription[row.os])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pd !== null && (
            <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <Ruler size={14} className="text-neutral-400" />
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Pupillary Distance
              </p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{pd} mm</p>
            </div>
          )}

          {prescription.notes && (
            <p className="mt-3 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400" title={prescription.notes}>
              {prescription.notes}
            </p>
          )}
        </div>
      )}
    </AccountCard>
  )
}
