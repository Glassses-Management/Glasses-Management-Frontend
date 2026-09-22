import { useMemo } from 'react'
import { Package } from 'lucide-react'
import Badge from '@/components/ui/Badge'

function productLabel(product, productId) {
  const name = [product?.brand, product?.model].filter(Boolean).join(' ')
  return name || `Product #${productId}`
}

function urgencyFor(item) {
  const qty = Number(item.quantity) || 0
  const threshold = Number(item.reorder_threshold) || 0
  const critical = threshold > 0 && qty <= threshold / 2
  return critical
    ? { label: 'Critical', variant: 'danger' }
    : { label: 'Low', variant: 'warning' }
}

function ClinicLowStockCard({ items, products }) {
  const productsById = useMemo(() => {
    const map = new Map()
    ;(Array.isArray(products) ? products : []).forEach((p) => map.set(p.id, p))
    return map
  }, [products])

  const list = useMemo(() => (Array.isArray(items) ? items : []), [items])

  return (
    <div className="rounded-xl border border-edge bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-center justify-between gap-2 border-b border-edge px-5 py-4 dark:border-neutral-800">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink dark:text-neutral-50">
          <Package size={16} className="text-amber-500" />
          Low Stock
        </h2>
        <Badge text={`${list.length} below`} variant={list.length ? 'warning' : 'success'} />
      </div>

      {list.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-500 dark:text-neutral-400">
          Stock levels look good.
        </p>
      ) : (
        <ul className="divide-y divide-edge dark:divide-neutral-800">
          {list.map((item) => {
            const urgency = urgencyFor(item)
            return (
              <li key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink dark:text-neutral-100">
                    {productLabel(productsById.get(item.product_id), item.product_id)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                    {item.quantity} left · threshold {item.reorder_threshold}
                  </p>
                </div>
                <Badge text={urgency.label} variant={urgency.variant} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ClinicLowStockCard