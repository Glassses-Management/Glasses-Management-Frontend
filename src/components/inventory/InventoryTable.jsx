import { formatCurrency } from '@/utils/format'
import Button from '@/components/ui/Button'
import { Pencil, Trash2 } from 'lucide-react'

const STATUS_BADGE = {
  'In Stock': 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
  'Low Stock': 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
  'Out Of Stock': 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
}

const STATUS_DOT = {
  'In Stock': 'bg-green-500',
  'Low Stock': 'bg-orange-500',
  'Out Of Stock': 'bg-red-500',
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[status] || 'bg-gray-100 text-gray-700'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] || 'bg-gray-400'}`} aria-hidden="true" />
      {status}
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
                <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button variant="outline" size="sm" icon={<Pencil size={14} />} onClick={() => onEdit?.(p)}>Edit</Button>
                    <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => onDelete?.(p)}>Delete</Button>
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
