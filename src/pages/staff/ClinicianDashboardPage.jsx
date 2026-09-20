import { CalendarClock, Cog, CreditCard, DollarSign, UserPlus } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ClinicianStatCard from '@/pages/staff/ClinicianStatCard'
import GlazingQueueCard from '@/pages/staff/GlazingQueueCard'
import LabFeedCard from '@/pages/staff/LabFeedCard'
import LowInventoryCard from '@/pages/staff/LowInventoryCard'
import ExamScheduleCard from '@/pages/staff/ExamScheduleCard'
import StaffRosterCard from '@/pages/staff/StaffRosterCard'

const now = new Date()
const dateLine = `${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`

function MiniProgress({ value, tone = 'bg-leaf' }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
    </div>
  )
}

const REV_BARS = [35, 48, 52, 44, 62, 55, 78, 88]

function RevenueBars() {
  return (
    <div className="flex h-10 items-end gap-1">
      {REV_BARS.map((height, index) => (
        <div
          key={index}
          className={`w-full rounded-sm ${index === REV_BARS.length - 1 ? 'bg-leaf' : 'bg-leaf/30'}`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  )
}

function ClinicianDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest dark:text-leaf">
            OptiCraft Flagship Dispensary
          </p>
          <h1 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ink dark:text-neutral-50 md:text-3xl">
            Good morning, Dr. Sean Jenks, O.D.
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{dateLine}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-leaf/40 bg-forest px-3.5 py-1.5 text-xs font-semibold text-leaf shadow-sm">
            <span className="size-2 animate-pulse rounded-full bg-leaf" />
            Launch CNC Glazing Job
          </span>
          <Button variant="forest" icon={<UserPlus size={16} />}>
            New Patient Intake
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ClinicianStatCard icon={<CalendarClock size={17} />} label="Appointments Today" value="18" delta="96% on time today" deltaTone="good" footer={<MiniProgress value={96} />} />
        <ClinicianStatCard icon={<Cog size={17} />} label="Glazing Lab Jobs" value="12" delta="86% completion rate" deltaTone="good" footer={<MiniProgress value={86} />} />
        <ClinicianStatCard icon={<DollarSign size={17} />} label="Optical Revenue" value="$24,530" delta="+12.4% vs last week" deltaTone="good" footer={<RevenueBars />} />
        <ClinicianStatCard icon={<CreditCard size={17} />} label="Pending Insurance Claims" value="7" delta="$3,240 outstanding" deltaTone="warn" footer={<MiniProgress value={30} tone="bg-amber-400" />} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <GlazingQueueCard />
        </div>
        <LabFeedCard />

        <LowInventoryCard />
        <div className="xl:col-span-2">
          <ExamScheduleCard />
        </div>

        <div className="xl:col-span-3">
          <StaffRosterCard />
        </div>
      </section>
    </div>
  )
}

export default ClinicianDashboardPage