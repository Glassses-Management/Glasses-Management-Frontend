import { useState, useEffect } from 'react'
import { PackageX, SlidersHorizontal, RefreshCw } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getLowStock } from '@/api/inventoryApi'

function PriorityIcon({ tone = 'red', children }) {
  const tones = {
    red: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300',
  }
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
      {children}
    </span>
  )
}

export default function StockAttentionCard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getLowStock()
      .then((rows) => {
        if (!cancelled) setItems(rows || [])
      })
      .catch((err) => {
        if (!cancelled) console.error('StockAttentionCard: load failed:', err?.response?.status || err?.message || err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const item = items[0]
  const max = Math.max(item?.reorder_point || item?.threshold || 10, 1)
  const pct = Math.min(100, Math.round(((item?.quantity ?? 0) / max) * 100))

  return (
    <div className="flex flex-col rounded-2xl border border-red-200 bg-white p-5 shadow-sm ring-1 ring-red-100 transition-colors duration-300 dark:border-red-500/25 dark:bg-[#1c1c28] dark:ring-red-500/10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PriorityIcon tone="red">
            <PackageX size={16} />
          </PriorityIcon>
          <div>
            <h3 className="text-sm font-semibold text-ink dark:text-neutral-50">Stock Attention</h3>
            <p className="text-xs text-gray-400 dark:text-neutral-500">Restock before it becomes a problem</p>
          </div>
        </div>
        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
          Critical
        </span>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400 dark:text-neutral-500">Checking inventory…</p>
      ) : !item ? (
        <p className="py-8 text-center text-sm text-gray-400 dark:text-neutral-500">All stock levels healthy ✓</p>
      ) : (
        <>
          <p className="text-sm text-gray-400 dark:text-neutral-500">Lowest stock</p>
          <p className="mt-0.5 text-base font-semibold text-ink dark:text-neutral-50">
            {item.name || item.product_name || `Item #${item.product_id || item.id}`}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-gray-400 dark:text-neutral-500">{item.quantity ?? 0} on hand</span>
            <span className="font-medium text-red-600 dark:text-red-300">needs ≥ {max}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-red-100 dark:bg-red-500/15">
            <div className="h-full rounded-full bg-red-500 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Button variant="forest" size="md" icon={<RefreshCw size={16} />}>Reorder From Supplier</Button>
            <Button variant="outline" size="md" icon={<SlidersHorizontal size={16} />}>Adjust Stock</Button>
          </div>
        </>
      )}
    </div>
  )
}
