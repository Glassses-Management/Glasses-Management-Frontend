import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { deleteProduct } from '@/api/productApi'
import { getOrderItems } from '@/api/orderItemApi'
import { deleteOrder } from '@/api/orderApi'
import { getAttachmentsByProduct, deleteAttachment } from '@/api/attachmentApi'
import { useToast } from '@/hook/UseToast'
import Button from '@/components/ui/Button'

function DeleteProductModal({ product, onClose, onDeleted }) {
  const toast = useToast()
  const [deleteError, setDeleteError] = useState('')
  const [referencedOrders, setReferencedOrders] = useState(null)
  const [deletingNow, setDeletingNow] = useState(false)

  if (!product) return null

  const removeProductAttachments = async (productId) => {
    const atts = await getAttachmentsByProduct(productId).catch(() => [])
    const list = Array.isArray(atts) ? atts : Array.isArray(atts?.content) ? atts.content : []
    for (const att of list) {
      const id = att?.attachmentId ?? att?.id
      if (id) await deleteAttachment(id).catch(() => {})
    }
  }

  const handleDelete = async () => {
    if (deletingNow) return
    setDeleteError('')
    setReferencedOrders(null)
    try {
      await deleteProduct(product.id)
      toast.success('Product deleted successfully')
      onDeleted()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to delete product'
      let orderIds
      try {
        const items = await getOrderItems({ productId: product.id })
        const list = Array.isArray(items) ? items : Array.isArray(items?.content) ? items.content : []
        orderIds = [...new Set(list.map((i) => i.order_id ?? i.orderId).filter(Boolean))]
      } catch {
        orderIds = []
      }
      if (orderIds.length > 0) {
        setReferencedOrders(orderIds)
        return
      }
      try {
        await removeProductAttachments(product.id)
        await deleteProduct(product.id)
        toast.success('Product deleted successfully')
        onDeleted()
      } catch {
        setDeleteError(msg)
      }
    }
  }

  const handleForceDelete = async () => {
    if (deletingNow) return
    setDeleteError('')
    setDeletingNow(true)
    try {
      for (const orderId of referencedOrders || []) {
        await deleteOrder(orderId)
      }
      await removeProductAttachments(product.id)
      await deleteProduct(product.id)
      toast.success('Product deleted successfully')
      onDeleted()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to delete product'
      setDeleteError(msg)
    } finally {
      setDeletingNow(false)
    }
  }

  const closeDelete = () => {
    if (deletingNow) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={closeDelete} />
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-[#1c1c28]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-50">Delete Product</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-neutral-200">{product.model}</span>? This action cannot be undone.
        </p>
        {referencedOrders && (
          <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {referencedOrders.length > 0
                ? `This product is part of ${referencedOrders.length} existing order${referencedOrders.length === 1 ? '' : 's'}. Deleting it will also permanently delete those order${referencedOrders.length === 1 ? '' : 's'} and their history.`
                : 'This product is referenced by existing orders. Deleting it also removes those order records.'}
            </p>
          </div>
        )}
        {deleteError && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{deleteError}</p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={closeDelete} disabled={deletingNow}>Cancel</Button>
          {referencedOrders ? (
            <Button variant="danger" onClick={handleForceDelete} loading={deletingNow}>
              {deletingNow ? 'Deleting…' : 'Delete Product & Orders'}
            </Button>
          ) : (
            <Button variant="danger" onClick={handleDelete} loading={deletingNow}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeleteProductModal