import { Lock } from 'lucide-react'

const CERTS = ['SOC2', 'ISO 27001']

function AuthTrustLine() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
      <p className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
        <Lock size={12} />
        HIPAA Compliant &amp; 256-Bit TLS Vault Encryption
      </p>
      <div className="flex gap-1.5">
        {CERTS.map((cert) => (
          <span
            key={cert}
            className="rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"
          >
            {cert}
          </span>
        ))}
      </div>
    </div>
  )
}

export default AuthTrustLine