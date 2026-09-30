import { Link } from 'react-router-dom'
import { Eye, Printer } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatDate } from '@/utils/format'
import { isRxExpired, rxExpiry } from '@/pages/customers/customerDetailData'
import { card, cardHead, cardTitle, tableCell, tableHead, tableRow } from '@/pages/customers/customerDetailStyles'

// The clinical centrepiece: the customer's current prescription laid out the way
// an optometrist reads it (OD then OS, sphere / cylinder / axis), with the
// two-sided fields ADD and PD spanning both eyes.
//
// Print and PDF both go through the browser's own print pipeline. A real PDF
// generator would need a new dependency, and print-to-PDF gives the same output
// without adding one.

const eyeRows = (rx) => [
  { eye: 'OD', label: 'Right Eye', sphere: rx.od_sphere, cylinder: rx.od_cylinder, axis: rx.od_axis },
  { eye: 'OS', label: 'Left Eye', sphere: rx.os_sphere, cylinder: rx.os_cylinder, axis: rx.os_axis },
]

// Sphere and cylinder carry a sign, because that is how they are written on a
// prescription. Axis does not: 180 degrees is "180", never "+180".
const num = (value) =>
  value === null || value === undefined || value === '' ? '—' : `${value > 0 ? '+' : ''}${value}`

const deg = (value) => (value === null || value === undefined || value === '' ? '—' : `${value}°`)

const mm = (value) => (value === null || value === undefined || value === '' ? '—' : `${value} mm`)

function EmptyState() {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-medium text-gray-700 dark:text-neutral-200">No prescription on file</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500 dark:text-neutral-400">
        This customer has never had a refraction recorded. Book an eye exam to get started.
      </p>
      <Link
        to="/dashboard/appointments"
        className="mt-4 inline-flex items-center rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-forest-deep"
      >
        Book an eye exam
      </Link>
    </div>
  )
}

export default function ActivePrescriptionCard({ prescription, onPrint }) {
  const expired = isRxExpired(prescription)
  const expiry = rxExpiry(prescription)

  return (
    <section className={card}>
      <div className={cardHead}>
        <div>
          <h2 className={cardTitle}>Active Optical Prescription</h2>
          {prescription ? (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
              Rx #{prescription.id} · Recorded {formatDate(prescription.prescription_date)}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">Most recent refraction</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {prescription && (
            <Badge text={expired ? 'EXPIRED' : 'CURRENT'} variant={expired ? 'danger' : 'success'} />
          )}
          <Button variant="outline" size="sm" icon={<Printer size={14} />} onClick={onPrint} disabled={!prescription}>
            Print Rx
          </Button>
          <Link to={prescription ? `/dashboard/prescriptions/${prescription.id}` : '/dashboard/prescriptions'}>
            <Button variant="outline" size="sm" icon={<Eye size={14} />}>
              Full Rx
            </Button>
          </Link>
        </div>
      </div>

      {!prescription ? (
        <EmptyState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px]">
              <thead className={tableHead}>
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Eye</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Sphere</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Cylinder</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Axis</th>
                  <th className="px-4 py-2.5 text-right font-semibold">ADD</th>
                  <th className="px-4 py-2.5 text-right font-semibold">PD</th>
                </tr>
              </thead>
              <tbody>
                {eyeRows(prescription).map((row, index) => (
                  <tr key={row.eye} className={tableRow}>
                    <td className={tableCell}>
                      <span className="font-semibold">{row.eye}</span>
                      <span className="ml-2 text-xs text-gray-400 dark:text-neutral-500">{row.label}</span>
                    </td>
                    <td className={`${tableCell} text-right font-medium tabular-nums`}>{num(row.sphere)}</td>
                    <td className={`${tableCell} text-right font-medium tabular-nums`}>{num(row.cylinder)}</td>
                    <td className={`${tableCell} text-right font-medium tabular-nums`}>{deg(row.axis)}</td>
                    {index === 0 && (
                      <>
                        <td rowSpan={2} className={`${tableCell} text-right font-medium tabular-nums`}>
                          {num(prescription.near_addition)}
                        </td>
                        <td rowSpan={2} className={`${tableCell} text-right font-medium tabular-nums`}>
                          {mm(prescription.pupillary_distance)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-gray-100 px-5 py-3 text-xs sm:grid-cols-3 dark:border-neutral-800">
            <p className="text-gray-500 dark:text-neutral-400">
              {/* PrescriptionResponse carries user_id but no prescriber name. */}
              <span className="font-medium text-gray-700 dark:text-neutral-200">Recorded by: </span>
              {prescription.user_id != null ? `Optometrist #${prescription.user_id}` : 'Not recorded'}
            </p>
            <p className="text-gray-500 dark:text-neutral-400">
              <span className="font-medium text-gray-700 dark:text-neutral-200">Valid until: </span>
              {expiry ? formatDate(expiry) : '—'}
            </p>
            <p className="text-gray-500 dark:text-neutral-400">
              <span className="font-medium text-gray-700 dark:text-neutral-200">Clinical note: </span>
              {prescription.notes || 'None recorded'}
            </p>
          </div>
        </>
      )}
    </section>
  )
}
