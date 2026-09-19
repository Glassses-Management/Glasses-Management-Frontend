import { Activity, BadgeCheck, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Insurance sync',
    desc: 'Live eligibility checks against your active vision benefits.',
  },
  {
    icon: PackageCheck,
    title: 'Glazing tracking',
    desc: 'Step-by-step lab progress pushed straight to your inbox.',
  },
  {
    icon: Sparkles,
    title: 'Dispensary privilege',
    desc: 'Priority fittings, member pricing and Care+ savings.',
  },
]

const RX_ROWS = [
  { eye: 'OD', sph: '-3.25', cyl: '-0.75', axis: '178°', pd: '62.5' },
  { eye: 'OS', sph: '-3.00', cyl: '-0.50', axis: '5°', pd: '62.5' },
]

function AuthLeftPanel() {
  return (
    <div className="flex flex-col justify-between gap-8 bg-gradient-to-br from-mist via-mist-soft to-white p-8 lg:p-10 dark:from-[#16271F] dark:via-[#0E1A15] dark:to-[#0E1A15]">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
            <ShieldCheck size={13} />
            Patient Health Vault V2.4
          </span>
          <span className="text-[11px] font-medium tracking-wide text-neutral-400 dark:text-neutral-500">
            ID: SEC-OD-2025
          </span>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
          Diagnostic Optical Archive
        </p>
        <h2 className="mt-3 font-sans text-3xl font-semibold leading-[1.1] text-neutral-900 md:text-4xl dark:text-neutral-50">
          Precision clarity meets{' '}
          <span className="italic text-forest dark:text-leaf">bespoke dispensary.</span>
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          Sign in to review your wavefront refraction record, track bespoke glazing orders and manage member
          benefits — all under one secure vault.
        </p>

        <div className="mt-8 max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#16271F]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Wavefront Digital Prescription</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-0.5 text-[11px] font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
              <BadgeCheck size={12} />
              Verified
            </span>
          </div>

          <table className="mt-3 w-full text-left">
            <thead>
              <tr className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                <th className="py-0 pr-2 font-semibold">Eye</th>
                <th className="py-0 pr-2 font-semibold">SPH</th>
                <th className="py-0 pr-2 font-semibold">CYL</th>
                <th className="py-0 pr-2 font-semibold">Axis</th>
                <th className="py-0 font-semibold">PD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {RX_ROWS.map((row) => (
                <tr key={row.eye} className="text-xs">
                  <td className="py-1.5 pr-2 font-semibold text-neutral-900 dark:text-neutral-50">{row.eye}</td>
                  <td className="py-1.5 pr-2 text-neutral-600 dark:text-neutral-300">{row.sph}</td>
                  <td className="py-1.5 pr-2 text-neutral-600 dark:text-neutral-300">{row.cyl}</td>
                  <td className="py-1.5 pr-2 text-neutral-600 dark:text-neutral-300">{row.axis}</td>
                  <td className="py-1.5 text-neutral-600 dark:text-neutral-300">{row.pd}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-3 border-t border-neutral-100 pt-3 text-[11px] text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
            Dr. S. Prak · OptiCraft Clinic · Valid thru Aug 2027
          </p>
        </div>

        <ul className="mt-8 max-w-md space-y-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                <Icon size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{title}</p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-neutral-200/70 pt-4 dark:border-neutral-800">
        <p className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
          <span className="size-1.5 rounded-full bg-leaf" />
          Spring Auth Gateway · OAuth2/JWT Active
        </p>
        <p className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
          <Activity size={12} />
          24 ms
        </p>
      </div>
    </div>
  )
}

export default AuthLeftPanel