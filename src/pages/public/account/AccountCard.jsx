import { cn } from '@/utils/cn'

// Local re-usable card shell for the public-facing patient dashboard.
// Uses the same forest dark surfaces as the rest of the storefront pages.
function AccountCard({ children, className = '' }) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-surface-storefront',
        className,
      )}
    >
      {children}
    </section>
  )
}

export default AccountCard