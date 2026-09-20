import { Lock } from 'lucide-react'

function AuthTrustLine() {
  return (
    <p className="flex items-center justify-center gap-1.5 border-t border-neutral-100 pt-4 text-center text-[11px] text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
      <Lock size={12} />
      256-Bit TLS Vault · Synced Across Devices
    </p>
  )
}

export default AuthTrustLine