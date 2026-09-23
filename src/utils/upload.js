export function formatBytes(bytes) {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function acceptsFile(type, accept) {
  if (!accept || accept === '*/*') return true
  if (accept === 'image/*') return type.startsWith('image/')
  return accept.split(',').some((rule) => {
    const r = rule.trim()
    if (!r) return false
    if (r.endsWith('/*')) return type.startsWith(r.slice(0, -1))
    return type === r.toLowerCase()
  })
}