// join class names, ignoring falsy values so callers can conditionally pass classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const sizeMap = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
}

const colorMap = {
  violet: 'text-violet-600',
  gray: 'text-gray-400',
  current: 'text-current',
}

function Spinner({ size = 'md', color = 'violet', className = '' }) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeMap[size],
        colorMap[color],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner