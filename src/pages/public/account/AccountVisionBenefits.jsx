import { ShieldCheck } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import AccountCard from '@/pages/public/account/AccountCard'
import { BENEFITS } from '@/pages/public/account/AccountData'

function AccountVisionBenefits() {
  return (
    <AccountCard className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
            <ShieldCheck size={16} className="text-forest dark:text-leaf" />
            Vision Benefits
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Insurance plan on file</p>
        </div>
        <Badge text="Active Coverage" variant="success" />
      </div>

      <div className="mt-4 rounded-xl bg-mist-soft p-4 dark:bg-[#1E332B]">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{BENEFITS.provider}</p>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Member ID {BENEFITS.memberId}</p>
      </div>

      <ul className="mt-4 space-y-3" data-aos="fade-up">
        {BENEFITS.breakdown.map((benefit) => (
          <li key={benefit.label} className="flex items-center justify-between gap-3">
            <span className="text-sm text-neutral-600 dark:text-neutral-300">{benefit.label}</span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{benefit.value}</span>
          </li>
        ))}
      </ul>

      <button className="mt-5 w-full rounded-lg border border-forest px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white dark:border-leaf dark:text-leaf dark:hover:bg-leaf dark:hover:text-forest">
        Verify Different Insurance
      </button>
    </AccountCard>
  )
}

export default AccountVisionBenefits