import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Glasses, Send, ShoppingBag } from 'lucide-react'
import { getOrders } from '@/api/orderApi'
import { getProductById } from '@/api/productApi'
import { useToast } from '@/hook/UseToast'
import { frameName } from '@/utils/format'
import Button from '@/components/ui/Button'
import ProductImage, { pickImage } from '@/components/product/ProductImage'

const toList = (data) => (Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [])

function SavedFrameCard({ customerId, prescriptionId }) {
  const navigate = useNavigate()
  const { warning: toastWarning } = useToast()
  const [product, setProduct] = useState(null)
  const [orderItem, setOrderItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!customerId) return
    let cancelled = false
    const load = async () => {
      try {
        const orders = await getOrders({ customerId, page: 0, size: 1, sort: 'id,desc' })
        if (cancelled) return
        const latest = toList(orders)[0]
        const item = latest?.items?.[0]
        if (item?.product_id) {
          setOrderItem(item)
          try {
            const data = await getProductById(item.product_id)
            if (!cancelled) setProduct(data)
          } catch {
            if (!cancelled) setProduct(null)
          }
        }
      } catch {
        // orders not available for this customer — show the empty state
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [customerId])

  const goOrder = () => navigate('/dashboard/orders/new', { state: { customerId, prescriptionId } })

  const sendToLab = () =>
    toastWarning('Lab dispatch is not wired up yet — create the order from the frame first.')

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-4 w-1 shrink-0 rounded-full bg-emerald-500" />
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-neutral-50">Saved Frame</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">The latest frame ordered by this customer.</p>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-gray-400 dark:text-neutral-500">Locating the customer's latest frame...</p>
        ) : product ? (
          <div className="flex items-start gap-4">
            <ProductImage className="h-20 w-20 rounded-xl" src={pickImage(product.attachments)?.filePath ?? ''} alt={frameName(product)} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-neutral-50">{frameName(product)}</p>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div>
                  <dt className="text-gray-400 dark:text-neutral-500">Material</dt>
                  <dd className="font-medium text-gray-700 dark:text-neutral-300">{product.material || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 dark:text-neutral-500">Size</dt>
                  <dd className="font-medium text-gray-700 dark:text-neutral-300">{product.size || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 dark:text-neutral-500">Color</dt>
                  <dd className="font-medium text-gray-700 dark:text-neutral-300">{product.color || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 dark:text-neutral-500">Category</dt>
                  <dd className="font-medium text-gray-700 dark:text-neutral-300">{product.category || '—'}</dd>
                </div>
              </dl>
              {orderItem && (
                <p className="mt-2 text-xs text-gray-400 dark:text-neutral-500">
                  Lens: {[orderItem.len_type, orderItem.len_index].filter(Boolean).join(' · ') || '—'}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center dark:border-neutral-700">
            <Glasses size={22} className="text-gray-300 dark:text-neutral-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-neutral-300">No saved frame yet</p>
            <p className="text-xs text-gray-400 dark:text-neutral-500">Order glasses and the frame will appear here.</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Button variant="forest" icon={<ShoppingBag size={16} />} className="w-full" onClick={goOrder}>
          Order Glasses with this RX
        </Button>
        <Button variant="outline" icon={<Send size={16} />} className="w-full" onClick={sendToLab}>
          Send Directly to Lab
        </Button>
      </div>
    </section>
  )
}

export default SavedFrameCard