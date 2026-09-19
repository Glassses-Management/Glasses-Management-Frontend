import { Mail, MapPin, Pencil, Phone } from 'lucide-react'
import AccountCard from '@/pages/public/account/AccountCard'
import { CONTACT_INFO } from '@/pages/public/account/AccountData'

const BAR_WIDTHS = [2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 1, 2, 2, 1, 3, 1, 2]

function AccountContactDelivery() {
  return (
    <AccountCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">Contact & Delivery</h3>
        <button className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline dark:text-leaf">
          <Pencil size={12} />
          Edit
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        <li className="flex items-start gap-3">
          <MapPin size={15} className="mt-0.5 shrink-0 text-forest dark:text-leaf" />
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {CONTACT_INFO.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </li>
        <li className="flex items-center gap-3">
          <Phone size={15} className="shrink-0 text-forest dark:text-leaf" />
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{CONTACT_INFO.phone}</p>
        </li>
        <li className="flex items-center gap-3">
          <Mail size={15} className="shrink-0 text-forest dark:text-leaf" />
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{CONTACT_INFO.email}</p>
        </li>
      </ul>

      <div className="mt-5 flex items-center gap-4 rounded-xl bg-mist-soft p-4 dark:bg-[#1E332B]">
        <div className="flex h-10 items-end gap-[3px]" aria-hidden="true">
          {BAR_WIDTHS.map((width, index) => (
            <span key={index} className="bg-neutral-700 dark:bg-neutral-300" style={{ width: `${width}px` }} />
          ))}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Patient ID
          </p>
          <p className="mt-0.5 text-sm font-semibold tracking-[0.15em] text-neutral-900 dark:text-neutral-50">
            {CONTACT_INFO.memberNumber}
          </p>
        </div>
      </div>
    </AccountCard>
  )
}

export default AccountContactDelivery