import { useState } from 'react'
import { UserPlus, Eye, FlaskConical, Printer, Zap } from 'lucide-react'
import { cn } from '@/utils/cn'

const actions = [
  { key: 'patient', label: 'New Patient', sublabel: 'Walk-in intake', icon: UserPlus, tone: 'leaf' },
  { key: 'exam', label: 'Eye Exam Rx', sublabel: 'Capture Rx', icon: Eye, tone: 'forest' },
  { key: 'lab', label: 'Lens Lab', sublabel: 'Glazing queue', icon: FlaskConical, tone: 'amber' },
  { key: 'rx', label: 'Print Rx Tag', sublabel: 'Tag preview', icon: Printer, tone: 'blue' },
]

const tones = {
  leaf: 'bg-leaf/15 text-forest dark:bg-leaf/10 dark:text-leaf',
  forest: 'bg-forest/10 text-forest dark:bg-forest/10 dark:text-leaf',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
}

function QuickDeskCard({ deskName = 'Optical Desk 1', onAction }) {
  const [active, setActive] = useState(null)

  const handle = (action) => {
    setActive(action.key)
    onAction?.(action.key)
  }

  return (
    <div className="rounded-xl border border-edge bg-white p-4 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-neutral-50">Quick Optical Desk</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-leaf/15 px-2 py-0.5 text-xs font-medium text-forest dark:bg-leaf/10 dark:text-leaf">
          <Zap size={12} /> {deskName}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          const isActive = active === action.key
          return (
            <button
              key={action.key}
              type="button"
              onClick={() => handle(action)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all duration-300',
                isActive
                  ? 'border-forest bg-forest/5 dark:border-forest dark:bg-forest/10'
                  : 'border-gray-100 hover:border-forest/40 hover:bg-forest/5 dark:border-neutral-700 dark:hover:border-forest/60',
              )}
            >
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', tones[action.tone])}>
                <Icon size={16} />
              </span>
              <span className="text-xs font-medium text-[#1a1a2e] dark:text-neutral-100">{action.label}</span>
              <span className="text-[11px] leading-tight text-gray-400 dark:text-neutral-500">{action.sublabel}</span>
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-center text-[11px] text-gray-400 dark:text-neutral-500">
        One-click shortcuts for your daily lab &amp; exam workflow.
      </p>
    </div>
  )
}

export default QuickDeskCard