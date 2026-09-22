import { Eye, Milestone, Ruler, Stethoscope } from 'lucide-react'

const num = (value) => (value === null || value === undefined || value === '' ? null : Number(value))

const fmt = (value) => (value === null ? '—' : `${value}`)
const fmtAxis = (value) => (value === null ? '—' : `${value}°`)

function EyeCell({ label, sub, dot }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <span className="font-semibold text-gray-900 dark:text-neutral-50">{label}</span>
      <span className="text-xs text-gray-400 dark:text-neutral-500">{sub}</span>
    </span>
  )
}

function Mini({ icon: Icon, title, value, note, className = '' }) {
  return (
    <div className={`rounded-xl border border-gray-100 p-4 dark:border-neutral-800 ${className}`}>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500">
        <Icon size={13} />
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-neutral-50">{value}</p>
      {note && <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-500">{note}</p>}
    </div>
  )
}

function RefractionCard({ prescription }) {
  const pd = num(prescription.pupillary_distance)
  const monoPd = pd === null ? '—' : `${(pd / 2).toFixed(1)} mm`
  const add = num(prescription.near_addition)
  const addValue = add === null ? '—' : `${add}`
  const correctionType = add === null ? 'Single Vision' : 'Progressive / Bifocal'

  const rows = [
    {
      label: 'OD', sub: 'Right Eye', dot: 'bg-emerald-500',
      sphere: num(prescription.od_sphere), cylinder: num(prescription.od_cylinder), axis: num(prescription.od_axis),
    },
    {
      label: 'OS', sub: 'Left Eye', dot: 'bg-sky-500',
      sphere: num(prescription.os_sphere), cylinder: num(prescription.os_cylinder), axis: num(prescription.os_axis),
    },
  ]

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-4 w-1 shrink-0 rounded-full bg-emerald-500" />
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-neutral-50">Refraction Parameters</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
            Retinoscopy values in diopters (D). Axis in degrees, Mono PD in millimetres per eye.
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 dark:border-neutral-800 dark:text-neutral-500">
              <th className="pb-3 pr-3 font-medium">Eye</th>
              <th className="pb-3 pr-3 font-medium">Sphere (SPH)</th>
              <th className="pb-3 pr-3 font-medium">Cylinder (CYL)</th>
              <th className="pb-3 pr-3 font-medium">Axis</th>
              <th className="pb-3 pr-3 font-medium">ADD</th>
              <th className="pb-3 font-medium">Mono PD</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-gray-50 last:border-0 dark:border-neutral-800">
                <td className="py-3.5 pr-3">
                  <EyeCell label={row.label} sub={row.sub} dot={row.dot} />
                </td>
                <td className="py-3.5 pr-3 text-base font-semibold tabular-nums text-gray-900 dark:text-neutral-50">{fmt(row.sphere)}</td>
                <td className="py-3.5 pr-3 text-base font-semibold tabular-nums text-gray-900 dark:text-neutral-50">{fmt(row.cylinder)}</td>
                <td className="py-3.5 pr-3 tabular-nums text-gray-700 dark:text-neutral-300">{fmtAxis(row.axis)}</td>
                <td className="py-3.5 pr-3 tabular-nums text-gray-700 dark:text-neutral-300">{addValue}</td>
                <td className="py-3.5 tabular-nums text-gray-700 dark:text-neutral-300">{monoPd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Mini
          icon={Ruler}
          title="Pupillary Distance"
          value={pd === null ? '—' : `${pd} mm`}
          note={monoPd === '—' ? 'Total PD not recorded' : `≈ ${monoPd} per eye`}
          className="bg-sky-50/60 dark:bg-sky-500/10"
        />
        <Mini
          icon={Eye}
          title="Correction Type"
          value={correctionType}
          note="Derived from the ADD value"
          className="bg-emerald-50/60 dark:bg-emerald-500/10"
        />
        <Mini
          icon={Milestone}
          title="Prism & Base"
          value="None recorded"
          note="No prism on this RX"
          className="bg-gray-50 dark:bg-white/5"
        />
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-neutral-800 dark:bg-white/5">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500">
          <Stethoscope size={13} />
          Clinical Note
        </p>
        <p className="mt-2 text-sm text-gray-700 dark:text-neutral-300">
          {prescription.notes || 'No clinical notes on this prescription.'}
        </p>
      </div>
    </section>
  )
}

export default RefractionCard