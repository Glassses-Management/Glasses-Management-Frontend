// Reusable status pill for backend enum strings (Appointment.status, Order.status, Order.payment_status).
// The backend sends raw SCREAMING_SNAKE_CASE values — this component turns them into readable labels.

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const variantClasses = {
  success: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  neutral: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-200',
}

const dotClasses = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-400',
  danger: 'bg-red-500',
}

const toTitleCase = (text) =>
  text
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const getVariantFromStatus = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'READY':
    case 'PAID':
      return 'success'
    case 'SCHEDULED':
    case 'PROCESSING':
    case 'PARTIAL':
      return 'info'
    case 'PENDING':
    case 'UNPAID':
      return 'warning'
    case 'CANCELLED':
    case 'FAILED':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function Badge({ text, variant, raw = false, className = '' }) {
  const displayText = raw ? text : toTitleCase(text || '')
  const variantKey = variant || getVariantFromStatus(text)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        variantClasses[variantKey],
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', dotClasses[variantKey])} aria-hidden="true" />
      {displayText}
    </span>
  )
}

export default Badge