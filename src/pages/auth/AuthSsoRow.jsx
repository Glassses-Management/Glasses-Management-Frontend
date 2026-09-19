import { Fingerprint } from 'lucide-react'
import { AppleMark, GoogleMark } from '@/components/ui/BrandIcons'

const PROVIDERS = [
  { label: 'Apple ID', icon: AppleMark },
  { label: 'Google', icon: GoogleMark },
  { label: 'Passkey', icon: Fingerprint },
]

function AuthSsoRow() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {PROVIDERS.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-forest hover:text-forest dark:border-neutral-600 dark:bg-transparent dark:text-neutral-200 dark:hover:border-leaf dark:hover:text-leaf"
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  )
}

export default AuthSsoRow