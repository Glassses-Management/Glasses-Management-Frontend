import OrderStatusTrack from '@/pages/public/account/OrderStatusTrack'
import { formatCurrency } from '@/utils/FormatCurrency'
import { isCancelled, orderNextStep } from '@/utils/OrderStatus'

// OrderItemResponse has no product name (API_DOCUMENT.md section 10.2), so the
// fallback is the only label available without an extra lookup per line.
// unit_price / total_price are the documented fields; `price` is accepted as a
// fallback because it is what the order list used to send.
const itemName = (item) => item?.name || item?.product_name || `Product #${item?.product_id}`

const unitPrice = (item) => item?.unit_price ?? item?.price ?? null

const lineTotal = (item) => {
  if (item?.total_price != null) return item.total_price
  const unit = unitPrice(item)
  return unit == null ? null : unit * (item?.quantity ?? 1)
}

// Lens options are only set on prescription orders, so they are usually absent.
function lensSpecs(item) {
  return [item?.len_type, item?.len_coating, item?.len_index].filter(Boolean).join(' · ')
}

// The expanded half of an order row: where it is on the journey, what is in the
// box, and what it cost. Reached by clicking the row.
export default function AccountOrderDetails({ order }) {
  const items = Array.isArray(order.items) ? order.items : []
  const next = orderNextStep(order.status)
  const cancelled = isCancelled(order.status)

  return (
    <div className="space-y-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
      {!cancelled && (
        <div>
          <OrderStatusTrack status={order.status} />
          {next ? (
            <p className="mt-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
              Next: <span className="font-semibold text-neutral-700 dark:text-neutral-200">{next}</span>
            </p>
          ) : (
            <p className="mt-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
              Nothing further is needed from you.
            </p>
          )}
        </div>
      )}

      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => {
            const specs = lensSpecs(item)
            const total = lineTotal(item)

            return (
              <li
                key={item?.id ?? index}
                className="flex flex-wrap items-start justify-between gap-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    {item?.quantity ?? 1} × {itemName(item)}
                  </p>
                  {specs && <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{specs}</p>}
                </div>
                {total != null && (
                  <span className="shrink-0 tabular-nums text-neutral-600 dark:text-neutral-300">
                    {formatCurrency(total)}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Item details are not available for this order.
        </p>
      )}

      {order.total != null && (
        <p className="flex justify-between border-t border-neutral-100 pt-3 text-sm font-semibold text-neutral-900 dark:border-neutral-800 dark:text-neutral-50">
          <span>Total</span>
          <span className="tabular-nums">{formatCurrency(order.total)}</span>
        </p>
      )}
    </div>
  )
}
