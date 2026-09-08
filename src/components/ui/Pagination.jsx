// Pagination bar used on list pages. The parent manages the page state and
// computes totalPages / totalItems — this component only renders controls.

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function buildPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
  const ordered = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  const result = []
  for (let i = 0; i < ordered.length; i++) {
    if (i > 0 && ordered[i] - ordered[i - 1] > 1) {
      result.push('...')
    }
    result.push(ordered[i])
  }
  return result
}

function ChevronLeft() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function PageButton({ page, isCurrent, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isCurrent}
className={cn(
          'inline-flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors duration-300',
          isCurrent
            ? 'bg-violet-600 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-white/10',
        )}
    >
      {page}
    </button>
  )
}

function Ellipsis() {
  return <span className="inline-flex size-8 items-center justify-center text-sm text-gray-400 dark:text-neutral-500">…</span>
}

function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalItems)
  const pages = buildPageNumbers(currentPage, totalPages)

  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Pagination">
      <p className="shrink-0 text-sm text-gray-500 dark:text-neutral-400">
        Showing {start}–{end} of {totalItems.toLocaleString()} records
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-full transition-colors duration-300',
            currentPage <= 1 ? 'cursor-not-allowed text-gray-300 dark:text-neutral-600' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-white/10',
          )}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>

        {pages.map((page, i) =>
          page === '...' ? (
            <Ellipsis key={`ellipsis-${i}`} />
          ) : (
            <PageButton
              key={page}
              page={page}
              isCurrent={page === currentPage}
              onClick={() => onPageChange(page)}
            />
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-full transition-colors duration-300',
            currentPage >= totalPages ? 'cursor-not-allowed text-gray-300 dark:text-neutral-600' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-white/10',
          )}
          aria-label="Next page"
        >
          <ChevronRight />
        </button>
      </div>
    </nav>
  )
}

export default Pagination