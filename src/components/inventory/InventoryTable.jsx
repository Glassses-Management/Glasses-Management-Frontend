import Button from '@/components/ui/Button'
import { inventoryStatus, INVENTORY_STATUS_LABEL } from '@/utils/InventoryStatus'

const STATUS_BADGE = {
  IN_STOCK: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
  LOW_STOCK: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
  OUT_OF_STOCK: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
}

const STATUS_DOT = {
  IN_STOCK: 'bg-green-500',
  LOW_STOCK: 'bg-orange-500',
  OUT_OF_STOCK: 'bg-red-500',
}

function StatusBadge({ status }) {
  return (
    // whitespace-nowrap keeps "Out of Stock" on one line when the table gets
    // narrow, and shrink-0 stops the dot being squashed by the wrapping text.
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[status] || 'bg-gray-100 text-gray-700'}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[status] || 'bg-gray-400'}`} aria-hidden="true" />
      {INVENTORY_STATUS_LABEL[status] || status}
    </span>
  )
}

function InventoryTable({ products, onEdit, onDelete }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm transition-colors duration-300 dark:bg-[#1c1c28] dark:text-neutral-400">
        No inventory found
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-colors duration-300 dark:bg-[#1c1c28]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5">
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">SKU</th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Product</th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Brand</th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Category</th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Quantity</th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Reorder</th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Status</th>
              <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 transition-colors duration-300 last:border-b-0 hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-white/5">
                <td className="px-5 py-4 font-medium text-gray-900 dark:text-neutral-100">{p.sku}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900 dark:text-neutral-100">{p.model}</p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">{p.color} · {p.size}</p>
                </td>
                <td className="px-5 py-4 text-gray-900 dark:text-neutral-100">{p.brand}</td>
                <td className="px-5 py-4 text-gray-900 dark:text-neutral-100">{p.category}</td>
                <td className="px-5 py-4 text-gray-900 dark:text-neutral-100">{p.quantity}</td>
                <td className="px-5 py-4 text-gray-900 dark:text-neutral-100">{p.reorder_threshold}</td>
                <td className="px-5 py-4"><StatusBadge status={inventoryStatus(p.quantity, p.reorder_threshold)} /></td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button variant="blue" size="sm" onClick={() => onEdit?.(p)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete?.(p)}>Delete</Button>
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

export default InventoryTable
