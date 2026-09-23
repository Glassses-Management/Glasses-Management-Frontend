import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import HomeFooter from '@/pages/public/HomeFooter'
import Button from '@/components/ui/Button'
import { useCart } from '@/hook/UseCart'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { createOrder } from '@/api/orderApi'
import { getPublicAttachmentsByProduct } from '@/api/publicProductApi'
import { formatCurrency } from '@/utils/FormatCurrency'

function CartPage() {
  const navigate = useNavigate()
  const { items, count, subtotal, updateQuantity, removeItem, clearCart } = useCart()
  const { token, user } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const [placing, setPlacing] = useState(false)
  const [images, setImages] = useState({})

  // Load every picture of each product in the cart (product_id -> image paths).
  const missingIds = items.map((i) => i.product_id).filter((id) => id != null && !(id in images))
  useEffect(() => {
    if (missingIds.length === 0) return undefined
    let cancelled = false
    Promise.all(
      missingIds.map((id) =>
        getPublicAttachmentsByProduct(id)
          .then((atts) => [id, (Array.isArray(atts) ? atts : []).filter((a) => a?.filePath).map((a) => a.filePath)])
          .catch(() => [id, []]),
      ),
    ).then((entries) => {
      if (!cancelled) setImages((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
    })
    return () => { cancelled = true }
  }, [missingIds])

  const customerId = user?.customer_id ?? user?.id

  const handleCheckout = async () => {
    if (!token) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    if (customerId == null) {
      toastError('No customer profile found for this account.')
      return
    }
    setPlacing(true)
    try {
      await createOrder({
        customer_id: customerId,
        items: items.map((i) => ({ product_id: i.product_id, quantity: Number(i.quantity) || 1 })),
      })
      toastSuccess('Order placed successfully.')
      clearCart()
      navigate('/account')
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to place order'
      toastError(msg)
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-forest dark:text-neutral-400 dark:hover:text-leaf"
        >
          <ArrowLeft size={16} /> Continue shopping
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">Your Selection</p>
        <h1 className="mt-3 font-sans font-semibold text-4xl text-neutral-900 dark:text-neutral-50 md:text-5xl" data-aos="fade-up">
          Shopping <span className="italic">Cart</span>
        </h1>
        <div className="mt-4 h-[3px] w-12 rounded-full bg-forest" />

        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-neutral-200/60 dark:bg-[#16271F]/60 dark:ring-neutral-800" data-aos="fade-up">
            <ShoppingBag size={40} className="text-neutral-300 dark:text-neutral-600" />
            <p className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-50">Your cart is empty</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Browse our collection and add your favourite frames.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-deep dark:bg-leaf dark:text-forest dark:hover:opacity-90"
            >
              Browse Products <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Item list */}
            <div className="divide-y divide-neutral-100 rounded-3xl bg-white ring-1 ring-neutral-200/60 dark:divide-neutral-800 dark:bg-[#16271F]/60 dark:ring-neutral-800 lg:col-span-2" data-aos="fade-left">
              {items.map((item) => {
                const lineTotal = (Number(item.quantity) || 0) * (Number(item.product?.sale_price) || 0)
                const itemImages = images[item.product_id] || []
                return (
                  <div key={item.product_id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {itemImages.length > 0 ? (
                          itemImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${item.product?.model} view ${idx + 1}`}
                              className="h-20 w-20 rounded-2xl object-cover ring-1 ring-neutral-200/60 dark:ring-neutral-700"
                            />
                          ))
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100 text-xs text-neutral-400 dark:bg-neutral-800/60">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          {item.product?.brand || 'Optic Shop'}
                        </p>
                        <p className="truncate font-sans text-lg font-medium text-neutral-900 dark:text-neutral-50">
                          {item.product?.model}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                          {item.product?.sku}{item.product?.color ? ` · ${item.product.color}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-600">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product_id, (Number(item.quantity) || 1) - 1)}
                          className="px-2.5 py-1.5 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product_id, (Number(item.quantity) || 0) + 1)}
                          className="px-2.5 py-1.5 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                          {formatCurrency(item.product?.sale_price)} each
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{formatCurrency(lineTotal)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product_id)}
                        className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        aria-label={`Remove ${item.product?.model} from cart`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-6">
              <div className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200/60 dark:bg-[#16271F]/60 dark:ring-neutral-800" data-aos="fade-right">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                  Summary
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                    <span>Items</span>
                    <span className="text-neutral-900 dark:text-neutral-50">{count}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800">
                    <span className="font-medium text-neutral-900 dark:text-neutral-50">Subtotal</span>
                    <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">{formatCurrency(subtotal)}</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-neutral-400 dark:text-neutral-500">
                  A member of our team will confirm your order details and any lens options when it's ready.
                </p>
                <Button className="w-full !rounded-full !bg-forest hover:!bg-forest-deep dark:!bg-leaf dark:!text-forest dark:hover:!opacity-90 mt-5" onClick={handleCheckout} loading={placing}>
                  {token ? 'Place Order' : 'Sign In to Checkout'}
                </Button>
                {!token && (
                  <p className="mt-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
                    You'll sign in to place your order.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <HomeFooter />
    </div>
  )
}

export default CartPage