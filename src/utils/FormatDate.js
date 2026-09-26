// Formatting helpers for dates and times.
// The backend returns ISO strings like "2026-09-03T10:00:00".

// Any extra Intl.DateTimeFormat options are merged in, so callers can ask for
// just the day or just the month without a second helper.
export const formatDate = (iso, { withTime = false, ...rest } = {}) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const options = withTime
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', ...rest }
    : { year: 'numeric', month: 'short', day: 'numeric', ...rest }
  return date.toLocaleDateString(undefined, options)
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
