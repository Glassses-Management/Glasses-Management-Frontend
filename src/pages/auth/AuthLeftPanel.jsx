import { CheckCircle2, Lock, ShieldCheck } from 'lucide-react'

const BULLETS = [
  'Encrypted health records, synced across every visit',
  'Real-time lab progress pushed straight to your inbox',
  'Member pricing, priority fittings and Care+ savings',
]

const eyebrow = 'text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf'

function AuthLeftPanel() {
  return (
    <div className="hidden flex-col justify-center px-10 py-16 lg:flex xl:px-16">
      <div className="max-w-md">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-forest dark:border-neutral-700 dark:bg-white/5 dark:text-leaf">
          <Lock size={12} />
          Secure Optical Vault
        </span>

        <h2 className="mt-8 font-sans text-4xl font-semibold leading-[1.1] text-neutral-900 xl:text-5xl dark:text-neutral-50">
          Pure vision.
          <br />
          <span className="italic text-forest dark:text-leaf">Personalized care.</span>
        </h2>

        <p className="mt-5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          Sign in to review your refraction record, track bespoke glazing orders, and manage member
          benefits — everything under one secure vault.
        </p>

        <ul className="mt-8 space-y-3.5">
          {BULLETS.map((text) => (
            <li key={text} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-forest dark:text-leaf" />
              {text}
            </li>
          ))}
        </ul>

        <hr className="mt-10 border-neutral-200 dark:border-neutral-800" />

        <p className={`${eyebrow} mt-5 flex items-center gap-1.5`}>
          <ShieldCheck size={13} />
          SOC2 · ISO 27001 · OAuth2/JWT Gateway
        </p>
      </div>
    </div>
  )
}

export default AuthLeftPanel