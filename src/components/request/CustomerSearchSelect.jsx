import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Search, User, X } from 'lucide-react'
import { getCustomers } from '@/api/customerApi'
import { useDebouce } from '@/hook/UseDebounce'
import { getInitials, getAvatarColors } from '@/utils/avatar'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function toList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  return []
}

function Avatar({ name, id }) {
  const { bg, text } = getAvatarColors(id)
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {getInitials(name)}
    </span>
  )
}

// Searchable dropdown that fetches existing customers from /customers and lets
// the staff member pick one. The selected customer's real id is returned via
// onChange — no arbitrary customer ids can be typed.
function CustomerSearchSelect({ value, onChange, error }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const debouncedQ = useDebouce(query, 250)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    getCustomers({ page: 0, size: 200, sort: 'name,asc' })
      .then((data) => {
        if (!cancelled) setCustomers(toList(data))
      })
      .catch(() => {
        if (!cancelled) setCustomers([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [open, debouncedQ])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = customers.filter((c) =>
      !q ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.email || '').toLowerCase().includes(q),
    )
    return matches.slice(0, 30)
  }, [customers, query])

  const select = (customer) => {
    onChange(customer)
    setOpen(false)
    setQuery('')
  }

  const clear = () => {
    onChange(null)
    setQuery('')
  }

  const inputClasses =
    'w-full rounded-xl border bg-white px-10 py-2.5 text-sm outline-none transition-all duration-300 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500 ' +
    (error
      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
      : 'border-gray-200 focus:border-[#8fa88f] focus:ring-2 focus:ring-[#8fa88f]/20 dark:border-neutral-600 dark:focus:border-[#8fa88f] dark:focus:ring-[#8fa88f]/20')

  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-neutral-300">
        <User size={14} className="text-gray-400 dark:text-neutral-500" />
        Customer
        <span className="text-red-500">*</span>
      </label>

      {value ? (
        <div className="rounded-xl border border-[#8fa88f]/50 bg-[#8fa88f]/5 p-3 dark:border-leaf/40 dark:bg-leaf/5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#6f8a6f] dark:text-leaf">Selected Customer</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={value.name} id={value.id} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-neutral-100">{value.name}</p>
                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                  Phone: {value.phone || '—'} · Email: {value.email || '—'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clear}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-800 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-100"
            >
              <X size={13} /> Change
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            value={query}
            onFocus={() => {
              setOpen(true)
              setLoading(true)
            }}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              setLoading(true)
            }}
            placeholder="Search customer by name, phone, or email"
            aria-invalid={Boolean(error)}
            className={inputClasses}
          />
          <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute z-50 mt-1.5 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-[#1c1c28]">
                {loading ? (
                  <p className="px-3 py-4 text-center text-sm text-gray-400 dark:text-neutral-500">Searching customers…</p>
                ) : filtered.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-gray-400 dark:text-neutral-500">
                    No customers found.
                  </p>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onMouseDown={() => select(c)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                        'hover:bg-gray-50 dark:hover:bg-white/5',
                      )}
                    >
                      <Avatar name={c.name} id={c.id} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-gray-900 dark:text-neutral-100">{c.name}</span>
                        <span className="block truncate text-xs text-gray-500 dark:text-neutral-400">
                          {c.phone || '—'} · {c.email || '—'}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
}

export default CustomerSearchSelect