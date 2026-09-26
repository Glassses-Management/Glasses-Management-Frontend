import ProductImage from '@/components/product/ProductImage'
import { formatCurrency } from '@/utils/format'

function productLabel(item) {
  const { brand, model } = item.product || {}
  if (brand || model) return [brand, model].filter(Boolean).join(' ')
  return `Product #${item.product_id}`
}

// Line items on an order. The product photo comes from the attachments service
// because products carry no image of their own, so the caller passes the
// already-loaded images map keyed by product id.
export default function OrderItemsTable({ items = [], total, images = {} }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#1c1c28]">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-neutral-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-neutral-50">Items</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5">
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Product</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Quantity</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Unit Price</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Lens Type</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Coating</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 last:border-b-0 dark:border-neutral-800">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ProductImage
                      className="h-12 w-12 shrink-0 rounded-lg object-contain"
                      src={images[item.product_id] || ''}
                      alt={productLabel(item)}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-neutral-100">{productLabel(item)}</p>
                      {item.product?.sku && (
                        <p className="text-xs text-gray-400 dark:text-neutral-500">SKU {item.product.sku}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-neutral-100">{item.quantity}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-neutral-100">{formatCurrency(item.unit_price)}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-neutral-100">{item.len_type || '—'}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-neutral-100">{item.len_coating || '—'}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-neutral-100">{formatCurrency(item.total_price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-neutral-500">Total</td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-neutral-50">{formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
