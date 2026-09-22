import { useNavigate } from 'react-router-dom'
import ProductImage from '@/components/product/ProductImage'
import { formatCurrency } from '@/utils/format'
import Button from '@/components/ui/Button'

function CategoryPill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
      {children}
    </span>
  )
}

function ProductTable({ products, images, onDelete }) {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500 dark:bg-white/5 dark:text-neutral-500">
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">SKU</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Optical Details</th>
              <th className="px-5 py-4 font-medium">Cost Price</th>
              <th className="px-5 py-4 font-medium">Sale Price</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50/70 dark:border-neutral-800 dark:hover:bg-white/5"
              >
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/products/${p.id}`)}
                    className="flex items-center gap-3 text-left"
                  >
                    <ProductImage className="h-10 w-10 shrink-0 rounded-lg" src={images[p.id] || ''} alt={p.model} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-gray-900 dark:text-neutral-100">{p.model}</span>
                      <span className="block truncate text-xs text-gray-500 dark:text-neutral-400">{p.brand}</span>
                    </span>
                  </button>
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-neutral-300">{p.sku}</td>
                <td className="px-5 py-4">
                  <CategoryPill>{p.category || 'Other'}</CategoryPill>
                </td>
                <td className="px-5 py-4 text-xs text-gray-500 dark:text-neutral-400">
                  {[p.color, p.material, p.size].filter(Boolean).join(' · ') || '—'}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-neutral-300">{formatCurrency(p.cost_price)}</td>
                <td className="px-5 py-4 font-semibold tabular-nums text-gray-900 dark:text-neutral-50">
                  {formatCurrency(p.sale_price)}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button variant="blue" size="sm" onClick={() => navigate(`/dashboard/products/edit/${p.id}`)}>Edit</Button>
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

export default ProductTable