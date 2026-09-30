// Formatting helpers for dates and times.
// The backend returns ISO strings like "2026-09-03T10:00:00".
//
// This is the single implementation of date display in the app. `@/utils/format`
// re-exports thin wrappers around it for pages that want an em-dash fallback
// instead of an empty string, so the two import paths can never drift apart.
//
// Any extra Intl.DateTimeFormat options are merged over the defaults.
//
// `only: true` drops the defaults instead, which is the only way to ask for a
// single part. Intl falls back to its own default (a numeric year, a numeric
// day) for any unit that is unset, so merging can never REMOVE one: asking for
// { day: 'numeric' } would still print the month and the year. Pass `only` when
// the caller wants exactly the parts it names and nothing else.
//
// `merge: false` inverts the default: the options you pass REPLACE the defaults
// wholesale (unless you pass none at all). A few call sites rely on this to get
// a bare weekday such as "Monday" with no date attached.
//
// `fallback` is what an empty or unparseable value renders as.
const DATE_DEFAULTS = { year: 'numeric', month: 'short', day: 'numeric' }
const DATE_TIME_DEFAULTS = { ...DATE_DEFAULTS, hour: '2-digit', minute: '2-digit' }

export const formatDate = (
  iso,
  { withTime = false, only = false, merge = true, fallback = '', ...rest } = {},
) => {
  if (!iso) return fallback
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return fallback

  const defaults = only ? {} : withTime ? DATE_TIME_DEFAULTS : DATE_DEFAULTS
  const hasOptions = Object.keys(rest).length > 0
  const options = merge === false && hasOptions ? rest : { ...defaults, ...rest }

  return date.toLocaleDateString(undefined, options)
}

export const formatTime = (iso, { fallback = '' } = {}) => {
  if (!iso) return fallback
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export const toDateInputValue = (iso) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}
