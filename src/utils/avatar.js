// Derivations that only exist on the frontend. The backend Customer has no
// avatarColor / avatarInitials columns, so both are computed from name/id here
// and are never stored or sent back to the API.

const PALETTE = [
  { bg: '#ede9fe', text: '#5b21b6' }, // violet
  { bg: '#dcfce7', text: '#166534' }, // green
  { bg: '#dbeafe', text: '#1e40af' }, // blue
  { bg: '#fce7f3', text: '#9d174d' }, // pink
  { bg: '#ffedd5', text: '#9a3412' }, // orange
  { bg: '#e0e7ff', text: '#3730a3' }, // indigo
]

export const getInitials = (name) => {
  if (!name) return ''
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export const getAvatarColors = (seed) => {
  const numericSeed =
    typeof seed === 'number'
      ? seed
      : String(seed)
          .split('')
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return PALETTE[numericSeed % PALETTE.length]
}
