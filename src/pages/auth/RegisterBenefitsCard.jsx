import { Hash } from 'lucide-react'
import { BENEFITS, RX_SNIPPET } from '@/pages/auth/RegisterData'

function RegisterBenefitsCard() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
        Why Create an Account?
      </h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Everything your optical care record needs, in one vault.
      </p>

      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
        <Hash size={12} />
        {RX_SNIPPET.code}
      </span>
      <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {RX_SNIPPET.label}
      </p>

      <ul className="mt-4 space-y-3.5">
        {BENEFITS.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
              <Icon size={15} />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{title}</p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RegisterBenefitsCard