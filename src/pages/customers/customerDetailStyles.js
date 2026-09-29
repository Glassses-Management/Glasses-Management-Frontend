// Shared class strings for the customer detail page.
//
// The page is split across several files (header, cards, tables, sidebar) and
// they all have to look like one surface. Keeping the strings here is the same
// trick components/product/badgeStyles.js uses, so a change to the card border
// or radius lands everywhere at once instead of drifting apart per file.

// The standard dashboard card: white on the #f5f6fb canvas, hairline border,
// no heavy shadow. Matches DashboardLayout's page background.
export const card =
  'rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]'

export const cardBody = 'p-5'
export const cardTitle = 'text-sm font-semibold text-gray-900 dark:text-neutral-50'
export const cardSubtitle = 'mt-0.5 text-xs text-gray-500 dark:text-neutral-400'

// Section header row inside a card: title on the left, actions on the right.
export const cardHead = 'flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-neutral-800'

// Small uppercase label used above values in the header and the sidebar.
export const metaLabel = 'text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500'

export const metaValue = 'mt-0.5 truncate text-sm text-gray-900 dark:text-neutral-100'

// Table primitives. Kept tight so the prescription and order tables read the
// same way.
export const tableHead =
  'bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:bg-white/5 dark:text-neutral-400'
export const tableCell = 'px-4 py-3 text-sm text-gray-900 dark:text-neutral-100'
export const tableRow = 'border-t border-gray-100 dark:border-neutral-800'

// A neutral chip, used for the clinical tags in the notes card.
export const tagChip =
  'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors duration-300 dark:bg-white/10 dark:text-neutral-300'

// A quieter, text-only action for card footers ("View All Orders").
export const linkAction =
  'text-sm font-medium text-violet-600 transition-colors duration-300 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300'

// Soft icon square used in the summary cards and the profile header.
export const iconTile =
  'flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300'
