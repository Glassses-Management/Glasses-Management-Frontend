import { Camera, Cog, Wrench } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const TAGS = ['Ø 52 mm', '2.1 g', 'PD 62.5']

function LabFeedCard() {
  return (
    <div className="rounded-xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-center gap-2 border-b border-edge px-5 py-4 dark:border-neutral-800">
        <h2 className="text-base font-semibold text-ink dark:text-neutral-50">Lab Feed</h2>
        <Badge text="Live · Bench 4A" variant="info" />
      </div>

      <div className="p-5">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#0E1A15] to-[#16271F]">
          <Camera size={30} className="text-leaf/50" />
          <span className="absolute left-3 top-3 rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white">
            CAM-02 · Cell 4A
          </span>
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white">
            <span className="size-1.5 animate-pulse rounded-full bg-leaf" />
            REC
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Jetting</p>
          <p className="mt-1 text-sm font-semibold text-ink dark:text-neutral-100">BlueShield 1.2 · PD 62.5</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <span key={tag} className="rounded-lg bg-mist-soft px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-edge dark:bg-white/5 dark:text-neutral-300 dark:ring-neutral-800">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm" variant="forest" icon={<Wrench size={14} />}>
              Calibrate Robot Screwdriver
            </Button>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
              <Cog size={13} />
              Driver v2.4.1
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabFeedCard