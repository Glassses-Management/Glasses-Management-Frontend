import { Link } from 'react-router-dom'
import { NotebookPen } from 'lucide-react'

import { card, cardBody, cardTitle, cardSubtitle, tagChip } from '@/pages/customers/customerDetailStyles'

// The clinical sidebar note.
//
// There is no notes field on CustomerResponse (API_DOCUMENT.md 6.5), so the note
// shown here is Prescription.notes - the only free-text clinical field in the
// schema. "Edit Notes" therefore opens that prescription's edit form, which is
// where the text can actually be changed, rather than a button that saves
// nowhere.

function Pencil() {
  return <NotebookPen size={13} />
}

export default function CustomerNotesCard({ observation, tags, prescriptionId }) {
  const canEdit = Boolean(prescriptionId)

  return (
    <section className={card}>
      <div className={`${cardBody} flex items-start justify-between gap-3 pb-2`}>
        <div className="min-w-0">
          <h2 className={cardTitle}>Clinical Notes</h2>
          <p className={cardSubtitle}>Staff observation</p>
        </div>
        <Link
          to={canEdit ? `/dashboard/prescriptions/${prescriptionId}/edit` : '/dashboard/prescriptions'}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-white/5"
        >
          <Pencil />
          {canEdit ? 'Edit Notes' : 'Add Notes'}
        </Link>
      </div>

      <div className={`${cardBody} space-y-3 pt-0`}>
        <p className="rounded-xl bg-gray-50 px-3 py-2.5 text-sm leading-relaxed text-gray-700 dark:bg-white/5 dark:text-neutral-300">
          {observation}
        </p>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500">Clinical flags</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className={tagChip}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
