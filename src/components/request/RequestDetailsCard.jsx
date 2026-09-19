import { AlertCircle, StickyNote } from 'lucide-react'

const EXAM_REASONS = [
  'New eye examination',
  'Vision check',
  'Blurry vision',
  'Prescription update',
  'Follow-up',
  'Other',
]

const PRODUCT_TYPES = [
  'Eyeglasses',
  'Sunglasses',
  'Frames',
  'Prescription Lenses',
  'Contact Lenses',
  'Other',
]

const CONTACT_METHODS = ['Phone', 'Email']

const NOTES_MAX = 900

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Reusable pill-style option chooser used for reason / product type / contact method.
function PillGroup({ options, value, name, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role={name === 'contact' ? 'radiogroup' : undefined}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role={name === 'contact' ? 'radio' : undefined}
          aria-checked={value === opt}
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200',
            value === opt
              ? 'border-[#6f8a6f] bg-[#6f8a6f]/10 text-[#6f8a6f] dark:border-[#8fa88f] dark:bg-[#8fa88f]/15 dark:text-[#a8c2a8]'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-500',
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// Request detail fields whose content varies with the selected request type.
// These selections are included in the notes our optical team reviews.
export default function RequestDetailsCard({ type, value, onChange, error }) {
  const { reason, productType, contactMethod, notes } = value

  return (
    <div>
      <PillGroup
        options={type === 'exam' ? EXAM_REASONS : PRODUCT_TYPES}
        value={type === 'exam' ? reason : productType}
        onChange={type === 'exam' ? (reason) => onChange({ reason }) : (productType) => onChange({ productType })}
      />

      {type === 'exam' && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Preferred contact method
            <span className="ml-1 text-xs font-normal text-neutral-400 dark:text-neutral-500">
              How should we reach you?
            </span>
          </p>
          <PillGroup options={CONTACT_METHODS} value={contactMethod} name="contact" onChange={(contactMethod) => onChange({ contactMethod })} />
        </div>
      )}

      <div className="mt-5">
        <label htmlFor="request-notes" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
          <StickyNote size={14} className="text-neutral-400 dark:text-neutral-500" />
          Additional Notes
          <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500">(optional)</span>
        </label>
        <textarea
          id="request-notes"
          name="request-notes"
          rows={4}
          maxLength={NOTES_MAX}
          value={notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Tell us anything else our optical staff should know..."
          aria-invalid={Boolean(error?.notes)}
          className={cn(
            'w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors duration-300 placeholder:text-neutral-400 focus:border-[#8fa88f] focus:ring-2 focus:ring-[#8fa88f]/30',
            error?.notes
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
              : 'border-neutral-300 dark:border-neutral-600',
            'dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500',
          )}
        />
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            You can also mention model, brand, or lens preferences.
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">{notes.length}/{NOTES_MAX}</p>
        </div>
      </div>

      {error?.notes && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500" role="alert">
          <AlertCircle size={13} />
          {error.notes}
        </p>
      )}
    </div>
  )
}