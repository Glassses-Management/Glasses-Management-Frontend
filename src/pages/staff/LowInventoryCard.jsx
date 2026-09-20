import { AlertTriangle, Package, PackagePlus } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const ITEMS = [
  { name: 'Acetate Flex Arms', current: 6, threshold: 20, urgency: 'Critical', tone: 'danger', countText: 'text-red-600 font-semibold dark:text-red-400' },
  { name: 'BlueShield 1.2 Lens', current: 9, threshold: 25, urgency: 'Critical', tone: 'danger', countText: 'text-red-600 font-semibold dark:text-red-400' },
  { name: 'Titanium Screw Kit', current: 14, threshold: 30, urgency: 'Low', tone: 'warning', countText: 'text-amber-600 font-semibold dark:text-amber-400' },
  { name: 'Nose Pad Rubber', current: 18, threshold: 50, urgency: 'Low', tone: 'warning', countText: 'text-amber-600 font-semibold dark:text-amber-400' },
]

function LowInventoryCard() {
  return (
    <div className="rounded-xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge px-5 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <AlertTriangle size={17} className="text-amber-500" />
          <h2 className="text-base font-semibold text-ink dark:text-neutral-50">Low Inventory Alerts</h2>
          <Badge text="Urgent" variant="warning" />
        </div>
        <span className="text-xs text-gray-500 dark:text-neutral-400">{ITEMS.length} items low</span>
      </div>

      <ul className="divide-y divide-edge dark:divide-neutral-800">
        {ITEMS.map((item) => (
          <li key={item.name} className="flex items-center gap-3 px-5 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
              <Package size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink dark:text-neutral-100">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                <span className={item.countText}>{item.current}</span> left · thresholds {item.threshold}
              </p>
            </div>
            <Badge text={item.urgency} variant={item.tone} />
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" icon={<PackagePlus size={13} />}>PO</Button>
              <Button size="sm" variant="ghost" icon={<Package size={13} />}>Reorder</Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-edge px-5 py-3.5 dark:border-neutral-800">
        <p className="text-xs text-gray-500 dark:text-neutral-400">
          Auto-restock triggers next at <span className="font-medium text-ink dark:text-neutral-100">PENDING_REVIEW</span>
        </p>
      </div>
    </div>
  )
}

export default LowInventoryCard