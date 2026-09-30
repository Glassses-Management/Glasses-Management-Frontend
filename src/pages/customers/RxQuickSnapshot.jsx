import { Copy, Download } from 'lucide-react'

import { card, cardBody, cardTitle, cardSubtitle, tableHead } from '@/pages/customers/customerDetailStyles'
import { isRxExpired, rxExpiry } from '@/pages/customers/customerDetailData'
import { formatDate } from '@/utils/format'

// Compact duplicate of the prescription for the sidebar: just the two numbers
// that get read out at the counter, plus the two actions that follow from having
// an Rx in front of you.
//
// "Duplicate Into New Order" hands the Rx id to the order form, which prefills
// the lens configuration. "Download Rx PDF" reuses the browser print dialog,
// which offers "Save as PDF" - no PDF dependency needed.

const num = (value) => (value === null || value === undefined || value === '' ? '—' : `${value > 0 ? '+' : ''}${value}`)

const deg = (value) => (value === null || value === undefined || value === '' ? '—' : `${value}°`)

const mm = (value) => (value === null || value === undefined || value === '' ? '—' : `${value} mm`)

function EyeBlock({ eye, label, sphere, cylinder, axis, tone }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-white/5">
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${tone}`}>
        {eye} <span className="font-normal normal-case text-gray-400 dark:text-neutral-500">{label}</span>
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900 dark:text-neutral-50">
        {num(sphere)} <span className="text-xs font-normal text-gray-400 dark:text-neutral-500">/ {num(cylinder)}</span>
      </p>
      <p className="text-[11px] text-gray-500 dark:text-neutral-400">Axis {deg(axis)}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 px-3 py-6 text-center dark:border-neutral-700">
      <p className="text-xs font-medium text-gray-600 dark:text-neutral-300">No prescription on file</p>
      <p className="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">Book an eye exam to record one.</p>
    </div>
  )
}

export default function RxQuickSnapshot({ prescription, onDuplicateIntoOrder, onDownload }) {
  const expired = isRxExpired(prescription)
  const expiry = rxExpiry(prescription)

  return (
    <section className={card}>
      <div className={`${cardBody} pb-3`}>
        <h2 className={cardTitle}>Rx Quick Snapshot</h2>
        <p className={cardSubtitle}>
          {prescription ? `Rx #${prescription.id} · ${expired ? 'expired' : 'current'}` : 'Nothing on file'}
        </p>
      </div>

      <div className={`${cardBody} space-y-2 pt-0`}>
        {!prescription ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <EyeBlock
                eye="OD"
                label="Right"
                sphere={prescription.od_sphere}
                cylinder={prescription.od_cylinder}
                axis={prescription.od_axis}
                tone="text-blue-600 dark:text-blue-400"
              />
              <EyeBlock
                eye="OS"
                label="Left"
                sphere={prescription.os_sphere}
                cylinder={prescription.os_cylinder}
                axis={prescription.os_axis}
                tone="text-forest-600 dark:text-forest-400"
              />
            </div>

            <dl className={`${tableHead} grid grid-cols-2 gap-2 rounded-xl px-3 py-2`}>
              <div>
                <dt className="text-[10px] uppercase tracking-wide">PD</dt>
                <dd className="text-sm font-semibold tabular-nums text-gray-900 dark:text-neutral-50">
                  {mm(prescription.pupillary_distance)}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide">Valid until</dt>
                <dd className="text-sm font-semibold text-gray-900 dark:text-neutral-50">
                  {expiry ? formatDate(expiry) : '—'}
                </dd>
              </div>
            </dl>
          </>
        )}

        <div className="flex flex-col gap-1.5 pt-1">
          <button
            type="button"
            onClick={onDuplicateIntoOrder}
            disabled={!prescription}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-forest px-3 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy size={13} />
            Duplicate Into New Order
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!prescription}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors duration-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-white/5"
          >
            <Download size={13} />
            Download Rx PDF
          </button>
        </div>
      </div>
    </section>
  )
}
