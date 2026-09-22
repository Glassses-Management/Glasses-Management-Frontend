import { Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/utils/format'

export const LENS_TYPES = ['Single Vision', 'Progressive', 'Bifocal', 'Standard']
export const COATINGS = ['Standard', 'Anti-Glare', 'Blue Light']
export const LENS_INDEXES = [1.5, 1.6, 1.67, 1.74]

export function newRow() {
  return {
    rowId: Date.now() + Math.random(),
    productId: '',
    quantity: 1,
    lenType: 'Single Vision',
    coating: 'Standard',
    lenIndex: 1.6,
    lensPrice: '',
  }
}

function OrderLineItems({ products, rows, onRowsChange }) {
  const productById = (id) => products.find((p) => p.id === id)

  const updateRow = (rowId, patch) => {
    onRowsChange(rows.map((row) => (row.rowId === rowId ? { ...row, ...patch } : row)))
  }

  const addRow = () => onRowsChange([...rows, newRow()])
  const removeRow = (rowId) => onRowsChange(rows.length === 1 ? rows : rows.filter((row) => row.rowId !== rowId))

  const rowTotal = (row) => {
    const product = productById(row.productId)
    if (!product) return 0
    const lensPrice = row.lensPrice !== '' && row.lensPrice !== undefined ? Number(row.lensPrice) : 0
    return (Number(product.sale_price) || 0) * Number(row.quantity) + lensPrice * Number(row.quantity)
  }

  const selectClass =
    'rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm focus:border-leaf focus:outline-none dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100'

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-edge text-xs uppercase tracking-wide text-gray-500 dark:border-neutral-800 dark:text-neutral-400">
              <th className="pb-3 pr-3 font-medium">Product</th>
              <th className="pb-3 pr-3 font-medium">Quantity</th>
              <th className="pb-3 pr-3 font-medium">Lens Type</th>
              <th className="pb-3 pr-3 font-medium">Coating</th>
              <th className="pb-3 pr-3 font-medium">Lens Index</th>
              <th className="pb-3 pr-3 font-medium">Lens Price</th>
              <th className="pb-3 pr-3 font-medium">Total</th>
              <th className="pb-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const product = productById(row.productId)
              return (
                <tr key={row.rowId} className="border-b border-gray-50 dark:border-neutral-800">
                  <td className="py-3 pr-3">
                    <select
                      value={row.productId}
                      onChange={(e) => updateRow(row.rowId, { productId: Number(e.target.value) })}
                      className={`${selectClass} w-44`}
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {[p.brand, p.model].filter(Boolean).join(' ')} ({p.sku})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => updateRow(row.rowId, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                      className={`${selectClass} w-16`}
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <select value={row.lenType} onChange={(e) => updateRow(row.rowId, { lenType: e.target.value })} className={selectClass}>
                      {LENS_TYPES.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-3">
                    <select value={row.coating} onChange={(e) => updateRow(row.rowId, { coating: e.target.value })} className={selectClass}>
                      {COATINGS.map((coating) => (
                        <option key={coating}>{coating}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-3">
                    <select
                      value={row.lenIndex}
                      onChange={(e) => updateRow(row.rowId, { lenIndex: Number(e.target.value) })}
                      className={selectClass}
                    >
                      {LENS_INDEXES.map((index) => (
                        <option key={index} value={index}>
                          {index.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={row.lensPrice}
                      onChange={(e) => updateRow(row.rowId, { lensPrice: e.target.value })}
                      placeholder="0.00"
                      className={`${selectClass} w-20`}
                    />
                  </td>
                  <td className="py-3 pr-3 font-medium text-gray-900 dark:text-neutral-100">
                    {product ? formatCurrency(rowTotal(row)) : '—'}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(row.rowId)}
                      disabled={rows.length === 1}
                      aria-label="Remove row"
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-white/5"
      >
        <Plus size={16} />
        Add Row
      </button>
    </div>
  )
}

export default OrderLineItems