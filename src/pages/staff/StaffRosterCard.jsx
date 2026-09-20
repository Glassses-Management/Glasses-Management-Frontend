import { BadgeCheck, Circle, MapPin, ShieldCheck } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'

const STAFF = [
  { id: 'EMP-1104', name: 'Dr. Sofia Prak', role: 'Clinical Optometrist', tags: ['Exam Room 2'], location: 'Cleanroom · Bench A', token: 'ehr-read', online: true },
  { id: 'EMP-1103', name: 'Marco Ellis', role: 'Lab Technician', tags: ['Glazing Prep'], location: 'Cleanroom · Cell 4A', token: 'cnc-write', online: true },
  { id: 'EMP-1102', name: 'Chen Wei', role: 'Robotics Operator', tags: ['CNC · Telemetry'], location: 'Lab · CNC Bay', token: 'robot-write', online: true },
  { id: 'EMP-1101', name: 'Alicia Grant', role: 'Dispenser & Fitter', tags: ['Dispensary Floor'], location: 'Front Desk', token: 'inventory-read', online: true },
  { id: 'EMP-1100', name: 'Diego Santos', role: 'Optical Assistant', tags: ['Fitting Room 1'], location: 'Glazing Area', token: 'inventory-read', online: false },
]

function StaffRosterCard() {
  const active = STAFF.filter((s) => s.online).length

  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge px-5 py-4 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-ink dark:text-neutral-50">Staff &amp; Cleanroom Roster</h2>
            <Badge text={`${active} Active`} variant="success" />
          </div>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">Real-time presence · bench assignment</p>
        </div>
      </div>

      <ul className="divide-y divide-edge dark:divide-neutral-800">
        {STAFF.map((person) => (
          <li key={person.id} className="flex items-center gap-3 px-5 py-3.5">
            <span className="relative shrink-0">
              <Avatar name={person.name} id={person.id} size="md" />
              <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-[#16271F] ${person.online ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-600'}`} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-ink dark:text-neutral-100">{person.name}</p>
                {person.online ? <Badge text="On Bench" variant="success" /> : <Badge text="Off Bench" variant="neutral" />}
              </div>
              <p className="truncate text-xs text-gray-500 dark:text-neutral-400">{person.role}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {person.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-mist-soft px-2 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-edge dark:bg-white/5 dark:text-neutral-300 dark:ring-neutral-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-forest/10 px-2.5 py-1 text-[11px] font-medium text-forest dark:bg-forest/20 dark:text-leaf">
                <MapPin size={12} />
                {person.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-mist-soft px-2.5 py-1 text-[11px] font-medium text-gray-500 ring-1 ring-edge dark:bg-white/5 dark:text-neutral-400 dark:ring-neutral-800">
                <ShieldCheck size={12} />
                {person.token}
              </span>
            </div>
            {person.online ? <Circle size={10} className="shrink-0 fill-green-500 text-green-500" /> : <Circle size={10} className="shrink-0 text-gray-300 dark:text-neutral-600" />}
          </li>
        ))}
      </ul>

      <div className="border-t border-edge px-5 py-3 dark:border-neutral-800">
        <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
          <BadgeCheck size={13} className="text-forest dark:text-leaf" />
          All roles hold valid opticianry &amp; cleanroom HIPAA clearance · next audit due Dec
        </p>
      </div>
    </div>
  )
}

export default StaffRosterCard