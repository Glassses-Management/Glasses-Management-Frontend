import { useState } from 'react'
import { ClipboardList, FileText, History } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const PATIENTS = [
  { id: 'PT-5401', name: 'Ava Sinclair', complaint: 'Blurry near vision · glare at night', tags: ['Comprehensive', 'Glaucoma Screen'], doctor: 'Dr. S. Prak', status: 'Checked-In', tone: 'success' },
  { id: 'PT-5400', name: 'Marcus Reed', complaint: 'Annual recheck · PD update', tags: ['Refraction', 'Contact Lens'], doctor: 'Dr. A. Reyes', status: 'Exam Due', tone: 'warning' },
  { id: 'PT-5399', name: 'Priya Nair', complaint: 'Headaches · possible axis shift', tags: ['Urgent Triage'], doctor: 'Dr. M. Osei', status: 'Urgent', tone: 'danger' },
  { id: 'PT-5398', name: 'Jonas Weber', complaint: 'New PAL progressive fitting', tags: ['PAL Fitting'], doctor: 'Dr. A. Reyes', status: 'Upcoming', tone: 'neutral' },
  { id: 'PT-5397', name: 'Hana Kimura', complaint: 'Digital eye strain consult', tags: ['VDU Consult'], doctor: 'Dr. S. Prak', status: 'Upcoming', tone: 'neutral' },
]

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'checkedIn', label: 'Checked-In' },
  { key: 'exam', label: 'Exam Due' },
  { key: 'upcoming', label: 'Upcoming' },
]

function countFor(tab) {
  if (tab === 'checkedIn') return PATIENTS.filter((p) => p.status === 'Checked-In').length
  if (tab === 'exam') return PATIENTS.filter((p) => p.status === 'Exam Due' || p.status === 'Urgent').length
  if (tab === 'upcoming') return PATIENTS.filter((p) => p.status === 'Upcoming').length
  return PATIENTS.length
}

const activeFilter = 'rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-ink shadow-sm ring-1 ring-edge dark:bg-neutral-800 dark:text-neutral-50 dark:ring-neutral-700'
const idleFilter = 'rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-white/5'

function ExamScheduleCard() {
  const [tab, setTab] = useState('all')
  const visible = PATIENTS.filter((p) => {
    if (tab === 'all') return true
    if (tab === 'checkedIn') return p.status === 'Checked-In'
    if (tab === 'exam') return p.status === 'Exam Due' || p.status === 'Urgent'
    return p.status === 'Upcoming'
  })

  return (
    <div className="rounded-xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge px-5 py-4 dark:border-neutral-800">
        <div>
          <h2 className="text-base font-semibold text-ink dark:text-neutral-50">Patients &amp; Refraction Schedule</h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">Exam Room 2 · Dr. Sean Jenks, OD</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-mist-soft p-1 ring-1 ring-edge dark:bg-white/5 dark:ring-neutral-800">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setTab(f.key)}
              className={tab === f.key ? activeFilter : idleFilter}
            >
              {f.label}
              <span className="ml-1.5 text-xs text-gray-400 dark:text-neutral-500">{countFor(f.key)}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-edge dark:divide-neutral-800">
        {visible.map((patient) => (
          <li key={patient.id} className="flex items-center gap-3 px-5 py-3.5">
            <Avatar name={patient.name} id={patient.id} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-ink dark:text-neutral-100">{patient.name}</p>
                <Badge text={patient.status} variant={patient.tone} />
              </div>
              <p className="truncate text-xs text-gray-500 dark:text-neutral-400">{patient.complaint}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {patient.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-mist-soft px-2 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-edge dark:bg-white/5 dark:text-neutral-300 dark:ring-neutral-800">
                    {tag}
                  </span>
                ))}
                <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                  {patient.doctor}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="outline" icon={<FileText size={13} />}>Open Chart</Button>
              <Button size="sm" variant="ghost" icon={<ClipboardList size={14} />} aria-label="Add to EHR" />
              <Button size="sm" variant="ghost" icon={<History size={14} />} aria-label="Patient History" />
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-edge px-5 py-3 dark:border-neutral-800">
        <p className="text-xs text-gray-500 dark:text-neutral-400">
          {visible.length} of {PATIENTS.length} patients · Next slot <span className="font-medium text-ink dark:text-neutral-100">10:30 — 11:00 · Exam Room 1</span>
        </p>
      </div>
    </div>
  )
}

export default ExamScheduleCard