import { Check, Eye, Glasses } from 'lucide-react'

const OPTIONS = [
  {
    value: 'exam',
    icon: Eye,
    title: 'Eye Exam Request',
    description: 'Request an eye examination or consultation with our optical staff.',
    meta: 'No prescription needed to get started.',
  },
  {
    value: 'product',
    icon: Glasses,
    title: 'Product Request',
    description: 'Request glasses, frames, lenses, or other optical products.',
    meta: 'Tell us what you are looking for — we will confirm availability.',
  },
]

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Two large selectable cards that drive which fields appear on the page.
export default function RequestTypePicker({ value, onChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {OPTIONS.map(({ value: type, icon: Icon, title, description, meta }) => {
        const selected = value === type
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(type)}
            className={cn(
              'relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200',
              selected
                ? 'border-[#8fa88f] bg-[#8fa88f]/5 shadow-sm ring-2 ring-[#8fa88f]/30'
                : 'border-neutral-200 bg-white shadow-sm hover:border-[#8fa88f]/60 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/60 dark:hover:bg-neutral-800',
            )}
          >
            {selected && (
              <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-[#6f8a6f] text-white">
                <Check size={14} strokeWidth={3} />
              </span>
            )}

            <span
              className={cn(
                'flex size-11 items-center justify-center rounded-xl transition-colors duration-200',
                selected
                  ? 'bg-[#6f8a6f] text-white'
                  : 'bg-[#8fa88f]/15 text-[#6f8a6f]',
              )}
            >
              <Icon size={22} strokeWidth={1.8} />
            </span>

            <h3 className="mt-4 font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
              {title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
            <p className={cn('mt-3 text-xs font-medium', selected ? 'text-[#6f8a6f]' : 'text-neutral-400 dark:text-neutral-500')}>
              {meta}
            </p>
          </button>
        )
      })}
    </div>
  )
}