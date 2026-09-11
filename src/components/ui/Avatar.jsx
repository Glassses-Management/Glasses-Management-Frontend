import { getInitials, getAvatarColors } from '@/utils/avatar'

// join class names, ignoring falsy values so callers can conditionally pass classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Colored initials circle derived from a name + id, same look as the table rows.
function Avatar({ name, id, size = 'size-10' }) {
  const { bg, text } = getAvatarColors(id)
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full text-sm font-semibold',
        size,
      )}
      style={{ backgroundColor: bg, color: text }}
    >
      {getInitials(name)}
    </span>
  )
}

export default Avatar