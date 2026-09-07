// Frontend-only display helpers. The backend stores no display-ready strings
// (memberId, combined frame name, etc.) — all of these are derived here.

import { formatCurrency } from '@/utils/FormatCurrency'

// Re-exported so pages can import from a single format.js file.
export { formatCurrency }

export const formatDate = (dateStr, options) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, options ?? { year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const deriveMemberId = (id) => {
  if (id === null || id === undefined) return '—'
  return `MBR-${String(id).padStart(5, '0')}`
}

export const memberSince = (createdAt) => {
  if (!createdAt) return '—'
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
}

export const frameName = (product) => {
  if (!product) return '—'
  const { brand, model } = product
  if (!brand && !model) return '—'
  return [brand, model].filter(Boolean).join(' ')
}

export const frameDescription = (item) => {
  if (!item) return '—'
  const part = item.product
    ? [item.product.category, item.product.material, item.product.color].filter(Boolean).join(', ')
    : ''
  const lens = [item.len_type, item.len_coating].filter(Boolean).join(', ')
  return [part, lens].filter(Boolean).join(' · ')
}
