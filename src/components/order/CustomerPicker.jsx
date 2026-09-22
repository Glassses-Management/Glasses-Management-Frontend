import { useMemo, useState } from 'react'
import { Search, UserCheck } from 'lucide-react'
import { deriveMemberId } from '@/utils/format'

const RECENT_SHOWN = 5
const MAX_MATCHES = 8

function initials(name) {
  return String(name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function CustomerPicker({ customers, value, onChange }) {
  const [query, setQuery] = useState('')

  const allCustomers = useMemo(() => (Array.isArray(customers) ? customers : []), [customers])
  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!q) return allCustomers
    return allCustomers.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        String(c.phone || '').includes(q) ||
        (c.email || '').toLowerCase().includes(q),
    )
  }, [allCustomers, q])

  const isSearching = q.length > 0
  const visible = isSearching ? filtered.slice(0, MAX_MATCHES) : allCustomers.slice(0, RECENT_SHOWN)

  if (value) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge bg-mist-soft/60 px-4 py-3 dark:border-neutral-700 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest/10 font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
            {initials(value.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink dark:text-neutral-100">{value.name}</p>
            <p className="truncate text-xs text-gray-500 dark:text-neutral-400">
              {value.phone} · {deriveMemberId(value.id)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-white/60 dark:text-blue-400 dark:hover:bg-white/10"
        >
          Change
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="relative max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customer by name, phone or email..."
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf focus:outline-none dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
      </div>
      <ul className="mt-3 divide-y divide-edge overflow-hidden rounded-lg border border-edge dark:divide-neutral-800">
        {!isSearching && allCustomers.length > RECENT_SHOWN && (
          <li className="flex items-center justify-between gap-3 px-4 py-2 text-xs text-gray-500 dark:text-neutral-400">
            <span>Showing most recent {RECENT_SHOWN} of {allCustomers.length}</span>
            <span className="shrink-0">Search to find more</span>
          </li>
        )}
        {isSearching && filtered.length > MAX_MATCHES && (
          <li className="flex items-center justify-between gap-3 px-4 py-2 text-xs text-gray-500 dark:text-neutral-400">
            <span>Showing first {MAX_MATCHES} of {filtered.length} matches</span>
          </li>
        )}
        {visible.map((customer) => (
          <li key={customer.id}>
            <button
              type="button"
              onClick={() => onChange(customer)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-mist-soft dark:hover:bg-white/5"
            >
              <span className="flex min-w-0 items-center gap-3">
                <UserCheck size={16} className="shrink-0 text-gray-400 dark:text-neutral-500" />
                <span className="truncate font-medium text-gray-900 dark:text-neutral-100">{customer.name}</span>
              </span>
              <span className="shrink-0 text-xs text-gray-500 dark:text-neutral-400">{customer.phone}</span>
            </button>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="px-4 py-3 text-sm text-gray-500 dark:text-neutral-400">No customers found.</li>
        )}
      </ul>
    </div>
  )
}

export default CustomerPicker