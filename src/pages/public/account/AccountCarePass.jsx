import { Sparkles, Wallet } from 'lucide-react'
import { CARE_PASS } from '@/pages/public/account/AccountData'

function AccountCarePass() {
  return (
    <section className="rounded-2xl border border-forest bg-forest p-6 shadow-sm transition-colors duration-300 dark:border-forest-deep dark:bg-forest-deep">
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 text-leaf">
        <Sparkles size={20} />
      </span>
      <h3 className="mt-4 font-sans text-lg font-semibold text-white">{CARE_PASS.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/80">{CARE_PASS.blurb}</p>
      <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-2 text-sm font-semibold text-forest transition-colors hover:opacity-90">
        <Wallet size={16} />
        Add to Apple Wallet
      </button>
      <p className="mt-2 text-center text-[11px] text-white/60">{CARE_PASS.membership}</p>
    </section>
  )
}

export default AccountCarePass