import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import {
  CalendarDays, Package, DollarSign, FileText, AlertTriangle,
  Activity, Camera, MapPin, Wrench, ArrowRight,
} from 'lucide-react'
import { STATS, GLAZING_JOBS, LAB_FEED, LOW_STOCK_ITEMS, EXAM_SCHEDULE, STAFF_ROSTER } from './commandCenterData'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'

// ---- helpers ------------------------------------------------------------

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function statusVariant(status) {
  const s = String(status).toLowerCase()
  if (s === 'running' || s === 'active' || s === 'on-time' || s === 'ready to ship' || s === 'confirmed' || s === 'complete' || s === 'success') return 'success'
  if (s === 'telemetry' || s === 'processing' || s === 'in progress' || s === 'qc hold') return 'info'
  if (s === 'exam due' || s === 'upcoming' || s === 'warning') return 'warning'
  if (s === 'urgent triage' || s === 'critical' || s === 'qc hold' && s === 'urgent') return 'danger'
  return 'neutral'
}

function urgencyVariant(u) {
  return u === 'critical' ? 'danger' : 'warning'
}

// ---- mini bar chart (inline svg) ---------------------------------------

function MiniBar({ values, color = 'bg-forest' }) {
  const max = Math.max(...values, 1)
  const w = 64
  const h = 20
  return (
    <svg width={w} height={h} className="shrink-0" aria-hidden="true">
      {values.map((v, i) => {
        const barH = Math.max((v / max) * h, 2)
        return (
          <rect
            key={i}
            x={(i / values.length) * w}
            y={h - barH}
            width={Math.max(w / values.length - 1, 1)}
            height={barH}
            rx={1}
            className={cn('transition-colors duration-300', color)}
            style={{ opacity: 0.55 + (v / max) * 0.45 }}
          />
        )
      })}
    </svg>
  )
}

// ---- progress bar -------------------------------------------------------

function ProgressBar({ value, color = 'bg-forest' }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
      <div
        className={cn('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}

// ---- stat card ----------------------------------------------------------

function StatCard({ icon: Icon, label, value, sub, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{label}</p>
          <p className="mt-2 text-3xl font-bold leading-tight text-neutral-900 dark:text-neutral-50">{value}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">{sub}</p>
      {children}
    </div>
  )
}

// ---- header -------------------------------------------------------------

function CommandHeader({ user }) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
          OptiCraft Flagship Dispensary
        </p>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{dateStr} · {timeStr}</p>
        <h1 className="mt-2 font-sans text-2xl font-bold text-neutral-900 md:text-3xl dark:text-neutral-50">
          Good morning, <span className="italic text-forest dark:text-leaf">{user?.name || 'Clinician'}</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-forest/30 bg-forest/5 px-3 py-1.5 text-xs font-semibold text-forest dark:border-leaf/30 dark:bg-leaf/10 dark:text-leaf">
          <span className="size-2 animate-pulse rounded-full bg-forest dark:bg-leaf" />
          Launch CNC Glazing Job
        </span>
        <Button variant="outline" icon={<ArrowRight size={15} />}>
          + New Patient Intake
        </Button>
      </div>
    </div>
  )
}

// ---- stat strip ---------------------------------------------------------

function StatStrip() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={CalendarDays} label="Appointments Today" value={STATS.appointmentsToday} sub={`${STATS.appointmentsOnTime}% on time`} />
      <StatCard icon={Package} label="Glazing Lab Jobs" value={STATS.glazingJobs} sub={`${STATS.glazingComplete}% complete`}>
        <ProgressBar value={STATS.glazingComplete} />
      </StatCard>
      <StatCard icon={DollarSign} label="Optical Revenue" value={`$${(STATS.revenue / 1000).toFixed(1)}k`} sub={`+${STATS.revenueChange}% vs last week`}>
        <div className="mt-2 flex items-center gap-3">
          <MiniBar values={STATS.revenueHistory} />
          <span className="text-xs font-semibold text-forest dark:text-leaf">↑ {STATS.revenueChange}%</span>
        </div>
      </StatCard>
      <StatCard icon={FileText} label="Pending Insurance Claims" value={STATS.pendingClaims} sub={`$${STATS.pendingClaimsDollars.toLocaleString()} pending`}>
        <ProgressBar value={40} color="bg-amber-500" />
      </StatCard>
    </div>
  )
}

// ---- glazing queue ------------------------------------------------------

const GlazingQueueCard() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-2.5 py-1 text-[11px] font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
            <span className="size-1.5 animate-pulse rounded-full bg-forest dark:bg-leaf" />
            Live
          </span>
          <h2 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">Active Glazing Queue & Robotics</h2>
        </div>
        <Button variant="ghost" size="sm" icon={<Activity size={14} />}>View All</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-white/5">
              {['Job ID / Patient', 'Clinical Optometrist', 'Frame & Glazing Spec', 'Tech & ETA', 'Progress', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GLAZING_JOBS.map((job) => (
              <tr key={job.id} className="border-b border-neutral-50 last:border-0 dark:border-neutral-800/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">#{job.id}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{job.patient}</p>
                </td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{job.optometrist}</td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 max-w-[200px] truncate">{job.frame}</td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                  <span>{job.tech}</span>
                  <span className="block text-xs text-neutral-400 dark:text-neutral-500">{job.eta}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={job.progress} />
                    <span className="text-xs font-medium text-neutral-500">{job.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Badge text={job.status} variant={statusVariant(job.status)} raw />
                    <Button variant="outline" size="sm">Verify</Button>
                    <Button variant="blue" size="sm">Ship</Button>
                    <Button variant="ghost" size="sm" icon={<Wrench size={12} />}>Cycle</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ---- lab feed -----------------------------------------------------------

function LabFeedCard() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-2.5 py-1 text-[11px] font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
            <span className="size-1.5 animate-pulse rounded-full bg-forest dark:bg-leaf" />
            Live
          </span>
          <h2 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">Lab Camera Feed</h2>
        </div>
      </div>
      <div className="p-6">
        {/* Lab thumbnail placeholder */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-leaf/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera size={32} className="text-forest/60 dark:text-leaf/60" />
          </div>
          <span className="absolute bottom-2 right-2 rounded-full bg-forest/80 px-2 py-0.5 text-[10px] font-semibold text-white">LIVE</span>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-forest dark:text-leaf">
          <MapPin size={13} />
          {LAB_FEED.location}
        </div>
        <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-50">{LAB_FEED.product}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {LAB_FEED.specs.map((spec) => (
            <span key={spec} className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-white/5 dark:text-neutral-400">
              {spec}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full" icon={<Wrench size={15} />}>
            Calibrate Robot Screwdriver
          </Button>
        </div>
      </div>
    </section>
  )
}

// ---- low inventory ------------------------------------------------------

function LowInventoryCard() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-white shadow-sm transition-colors duration-300 dark:border-amber-500/30">
      <div className="flex items-center justify-between gap-3 border-b border-amber-100 px-6 py-4 dark:border-amber-500/10">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
          <h2 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">Low Inventory Alerts</h2>
          <Badge text="Urgent" variant="warning" raw />
        </div>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
          {LOW_STOCK_ITEMS.length} items
        </span>
      </div>
      <div className="divide-y divide-amber-50 px-6 py-2 dark:divide-amber-500/10">
        {LOW_STOCK_ITEMS.map((item) => (
          <div key={item.sku} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{item.model}</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{item.brand} · {item.sku}</p>
            </div>
            <div className="flex items-center gap-2 text-right">
              <div>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{item.current}</span>
                <span className="text-xs text-neutral-400"> / {item.threshold}</span>
              </div>
              <Badge text={item.urgency} variant={urgencyVariant(item.urgency)} raw />
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm">Reorder</Button>
              <Button variant="blue" size="sm">PO</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---- exam schedule ------------------------------------------------------

function ExamScheduleCard() {
  const [filter, setFilter] = useState('All')
  const counts = useMemo(() => ({
    All: EXAM_SCHEDULE.length,
    'Checked-in': EXAM_SCHEDULE.filter((e) => e.status === 'Upcoming').length,
    Upcoming: EXAM_SCHEDULE.filter((e) => e.status === 'Upcoming').length,
  }), [])

  const filtered = filter === 'All' ? EXAM_SCHEDULE : EXAM_SCHEDULE.filter((e) => e.status === filter || (filter === 'Checked-in' && e.status === 'Upcoming'))

  const tabs = ['All', 'Checked-in', 'Upcoming']

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
        <h2 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">Today's Refraction &amp; Exam Schedule</h2>
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                filter === t
                  ? 'bg-white text-neutral-900 shadow-sm dark:bg-[#16271F] dark:text-neutral-50'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200',
              )}
            >
              {t} ({counts[t] ?? 0})
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-neutral-100 px-4 py-2 dark:divide-neutral-800">
        {filtered.map((apt, i) => (
          <div key={i} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Avatar name={apt.name} id={i} size="size-9" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{apt.name}</p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{apt.complaint}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {apt.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-forest/10 px-2 py-0.5 text-[11px] font-medium text-forest dark:bg-leaf/10 dark:text-leaf">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{apt.time}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{apt.doctor}</p>
            <Badge text={apt.status} variant={statusVariant(apt.status)} raw />
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="sm">Chart</Button>
              <Button variant="blue" size="sm">EHR</Button>
              <Button variant="ghost" size="sm">History</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---- staff roster -------------------------------------------------------

function StaffRosterCard() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
        <h2 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">Staff &amp; Cleanroom Roster</h2>
        <span className="rounded-full bg-forest/10 px-2 py-0.5 text-xs font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
          {STAFF_ROSTER.filter((s) => s.status !== 'On Call').length} Active
        </span>
      </div>
      <div className="divide-y divide-neutral-100 px-4 py-2 dark:divide-neutral-800">
        {STAFF_ROSTER.map((member, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Avatar name={member.name} id={i} size="size-9" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{member.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{member.role}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge text={member.status} variant="success" raw />
              <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                <MapPin size={10} />
                {member.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---- page ----------------------------------------------------------------

export default function StaffCommandCenter() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-mist-soft text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <CommandHeader user={user} />
        <StatStrip />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <GlazingQueueCard />
            <LowInventoryCard />
          </div>
          <aside className="space-y-6">
            <LabFeedCard />
            <ExamScheduleCard />
            <StaffRosterCard />
          </aside>
        </div>
      </div>
    </div>
  )
}
