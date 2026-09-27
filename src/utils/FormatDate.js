// Formatting helpers for dates and times.
// The backend returns ISO strings like "2026-09-03T10:00:00".

// Any extra Intl.DateTimeFormat options are merged over the defaults.
//
// `only: true` drops the defaults instead, which is the only way to ask for a
// single part. Intl falls back to its own default (a numeric year, a numeric
// day) for any unit that is unset, so merging can never REMOVE one: asking for
// { day: 'numeric' } would still print the month and the year. Pass `only` when
// the caller wants exactly the parts it names and nothing else.
export const formatDate = (iso, { withTime = false, only = false, ...rest } = {}) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const defaults = only
    ? {}
    : withTime
      ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { year: 'numeric', month: 'short', day: 'numeric' }

  return date.toLocaleDateString(undefined, { ...defaults, ...rest })
}

export const formatTime = (iso) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export const toDateInputValue = (iso) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}
