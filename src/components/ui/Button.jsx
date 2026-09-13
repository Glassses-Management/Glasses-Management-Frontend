import Spinner from '@/components/ui/Spinner'

// join class names, ignoring falsy values so callers can conditionally pass classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Reusable button so every page shares the same look instead of styling its own <button>
const variants = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-white/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-white/10 dark:text-neutral-300',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
    >
{loading && <Spinner size="sm" color="current" aria-hidden="true" />}
      {!loading && icon}
      {children}
    </button>
  )
}

export default Button
