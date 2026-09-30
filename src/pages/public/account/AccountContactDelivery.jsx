import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Pencil, Phone } from 'lucide-react'
import AccountCard from '@/pages/public/account/AccountCard'
import { getMyCustomer } from '@/api/customerApi'

// Decorative barcode behind the real patient id.
const BAR_WIDTHS = [2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 1, 2, 2, 1, 3, 1, 2]

function Row({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <Icon size={15} className="mt-0.5 shrink-0 text-forest dark:text-leaf" />
      <div className="min-w-0 text-sm text-neutral-600 dark:text-neutral-300">{children}</div>
    </li>
  )
}

// The customer's real contact details, from GET /api/customers/me.
//
// This rendered a hard-coded CONTACT_INFO fixture - a street address, a phone
// number and an email belonging to nobody, above a "Patient ID" that was also
// invented. Everything here is now whatever the backend holds, and anything
// genuinely missing reads as "Not provided" rather than as a detail.
export default function AccountContactDelivery() {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getMyCustomer()
      .then((data) => {
        if (cancelled) return
        setCustomer(data)
        setError('')
      })
      .catch((err) => {
        if (cancelled) return
        // 404 means this account has no customer profile linked yet.
        if (err?.response?.status !== 404) {
          setError(err?.response?.data?.message || err?.message || 'Failed to load your details.')
        }
        setCustomer(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const address = customer?.address?.trim()
  const phone = customer?.phone?.trim()
  const email = customer?.email?.trim()
  const nothingOnFile = !address && !phone && !email

  return (
    <AccountCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">Contact & Delivery</h3>
        <Link
          to="/account?tab=personal"
          className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline dark:text-leaf"
        >
          <Pencil size={12} />
          Edit
        </Link>
      </div>

      {loading ? (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-5 animate-pulse rounded bg-mist dark:bg-surface-raised" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : nothingOnFile ? (
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          No contact details on file yet. Add them so we can reach you about your order.
        </p>
      ) : (
        <ul className="mt-4 space-y-3" data-aos="fade-up">
          {address && (
            <Row icon={MapPin}>{address}</Row>
          )}
          {phone && (
            <Row icon={Phone}>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:underline">
                {phone}
              </a>
            </Row>
          )}
          {email && (
            <Row icon={Mail}>
              <a href={`mailto:${email}`} className="break-all hover:underline">
                {email}
              </a>
            </Row>
          )}
        </ul>
      )}

      {customer?.id != null && (
        <div className="mt-5 flex items-center gap-4 rounded-xl bg-mist-soft p-4 dark:bg-surface-raised">
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
              #{customer.id}
            </p>
          </div>
        </div>
      )}
    </AccountCard>
  )
}
