import { Download, FileText, ShieldCheck } from 'lucide-react'
import AccountCard from '@/pages/public/account/AccountCard'
import { LENS_TAGS, REFRACTION_ROWS, SUB_METRICS } from '@/pages/public/account/AccountData'

function AccountRefractionVault() {
  return (
    <AccountCard>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 pt-6 pb-4 dark:border-neutral-800" data-aos="fade-up">
        <div>
          <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
            Digital Wavefront Refraction Vault
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Latest comtometry on record · OD right / OS left</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
          <ShieldCheck size={13} />
          Signed
        </span>
      </div>

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
            {REFRACTION_ROWS.map((row) => (
              <tr key={row.param} className="text-sm">
                <td className="py-2.5 pr-3 text-neutral-500 dark:text-neutral-400">{row.param}</td>
                <td className="py-2.5 pr-3 font-semibold text-neutral-900 dark:text-neutral-50">{row.od}</td>
                <td className="py-2.5 font-semibold text-neutral-900 dark:text-neutral-50">{row.os}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-4 dark:border-neutral-800">
          {SUB_METRICS.map((metric) => (
            <div key={metric.label}>
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {metric.label}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-neutral-900 dark:text-neutral-50">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {LENS_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-200 bg-mist-soft px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-white/5 dark:text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-6 py-5">
        <button className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-deep dark:bg-leaf dark:text-forest dark:hover:opacity-90">
          <FileText size={16} />
          View Full Prescription
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-forest hover:text-forest dark:border-neutral-600 dark:bg-transparent dark:text-neutral-300 dark:hover:border-leaf dark:hover:text-leaf">
          <Download size={16} />
          Download PDF
        </button>
      </div>
    </AccountCard>
  )
}

export default AccountRefractionVault