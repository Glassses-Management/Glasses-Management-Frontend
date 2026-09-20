import { Check, Cog, Play, Truck } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const JOBS = [
  { id: 'GT-3041', patient: 'Maya Chen', optometrist: 'Dr. S. Prak', frame: 'Optic Air-7 · BlueShield 1.2', spec: 'OD -3.25 / OS -3.00', tech: 'R2 · ETA 14:20', status: 'Running', progress: 72 },
  { id: 'GT-3040', patient: 'Leo Yamada', optometrist: 'Dr. A. Reyes', frame: 'Naval 48 · Trivex', spec: 'OD -2.00 / OS -1.75', tech: 'R1 · ETA 13:05', status: 'Ready to Ship', progress: 100 },
  { id: 'GT-3039', patient: 'Nora Diallo', optometrist: 'Dr. S. Prak', frame: 'Clubman 54 · CR-39', spec: 'OD +1.50 / OS +1.75', tech: 'R3 · ETA 15:40', status: 'Telemetry', progress: 41 },
  { id: 'GT-3038', patient: 'Ilya Petrov', optometrist: 'Dr. M. Osei', frame: 'Titanium Slim · Polar', spec: 'OD -4.50 / OS -4.25', tech: 'R2 · ETA 16:10', status: 'Queued', progress: 12 },
]

const statusVariant = (status) => {
  if (status === 'Running') return 'success'
  if (status === 'Ready to Ship') return 'info'
  if (status === 'Telemetry') return 'info'
  return 'warning'
}

function MiniProgress({ value }) {
  return (
    <div className="mt-1.5 h-1.5 w-28 max-w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full ${value >= 90 ? 'bg-leaf' : 'bg-forest'}`} style={{ width: `${value}%` }} />
    </div>
  )
}

const actionBtn =
  '!px-2.5 !py-1 !text-xs border border-edge bg-white text-gray-700 hover:bg-mist-soft dark:border-neutral-700 dark:bg-transparent dark:text-neutral-200 dark:hover:bg-white/5'

function GlazingQueueCard() {
  return (
    <div className="rounded-xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge px-5 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-ink dark:text-neutral-50">Active Glazing Queue &amp; Robotics</h2>
          <Badge text="Live" variant="success" />
        </div>
        <span className="text-xs text-gray-500 dark:text-neutral-400">{JOBS.length} jobs in queue</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-edge text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-neutral-800 dark:text-neutral-400">
              <th className="px-5 py-3">Job / Patient</th>
              <th className="px-5 py-3">Optometrist</th>
              <th className="px-5 py-3">Frame &amp; Glazing Spec</th>
              <th className="px-5 py-3">Tech &amp; ETA</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {JOBS.map((job) => (
              <tr key={job.id} className="border-b border-edge last:border-0 hover:bg-mist-soft dark:border-neutral-800 dark:hover:bg-white/5">
                <td className="px-5 py-3">
                  <p className="font-semibold text-ink dark:text-neutral-100">{job.id}</p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">{job.patient}</p>
                </td>
                <td className="px-5 py-3 text-gray-600 dark:text-neutral-300">{job.optometrist}</td>
                <td className="px-5 py-3">
                  <p className="text-gray-700 dark:text-neutral-200">{job.frame}</p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">{job.spec}</p>
                  <MiniProgress value={job.progress} />
                </td>
                <td className="px-5 py-3">
                  <p className="mb-1 text-gray-700 dark:text-neutral-200">{job.tech}</p>
                  <Badge text={job.status} variant={statusVariant(job.status)} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {job.progress >= 100 ? (
                      <Button size="sm" variant="outline" icon={<Check size={13} />} className={actionBtn}>
                        Verify
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" icon={<Play size={13} />} className={actionBtn}>
                        Start Cycle
                      </Button>
                    )}
                    {job.status === 'Ready to Ship' && (
                      <Button size="sm" variant="outline" icon={<Truck size={13} />} className={actionBtn}>
                        Ship
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GlazingQueueCard