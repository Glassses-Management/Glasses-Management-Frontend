import { useState } from 'react'
import { X, Upload, ImageIcon } from 'lucide-react'
import { createProduct, updateProduct } from '@/api/productApi'
import { uploadAttachment } from '@/api/attachmentApi'

const EMPTY = {
  sku: '',
  model: '',
  brand: '',
  category: '',
  color: '',
  material: '',
  size: '',
  cost_price: '',
  sale_price: '',
  supplier_name: '',
  supplier_contact: '',
}

const FIELDS = [
  { name: 'sku', label: 'SKU', required: true },
  { name: 'model', label: 'Model', required: true },
  { name: 'brand', label: 'Brand', required: true },
  { name: 'category', label: 'Category', required: true },
  { name: 'color', label: 'Color' },
  { name: 'material', label: 'Material' },
  { name: 'size', label: 'Size' },
  { name: 'cost_price', label: 'Cost Price', type: 'number' },
  { name: 'sale_price', label: 'Sale Price', type: 'number' },
  { name: 'supplier_name', label: 'Supplier' },
  { name: 'supplier_contact', label: 'Supplier Contact' },
]

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 5

export default function ProductForm({ product, onClose, onSaved }) {
  const isEdit = !!product
  const [form, setForm] = useState(() => {
    if (!product) return { ...EMPTY }
    return {
      sku: product.sku || '',
      model: product.model || '',
      brand: product.brand || '',
      category: product.category || '',
      color: product.color || '',
      material: product.material || '',
      size: product.size || '',
      cost_price: product.cost_price ?? '',
      sale_price: product.sale_price ?? '',
      supplier_name: product.supplier_name || '',
      supplier_contact: product.supplier_contact || '',
    }
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Please upload a JPG, PNG, or WebP image.')
      return
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`)
      return
    }
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const required = FIELDS.filter((f) => f.required && !String(form[f.name]).trim())
    if (required.length > 0) {
      setError(`Please fill in: ${required.map((f) => f.label).join(', ')}`)
      return
    }
    if (!isEdit && !file) {
      setError('Please upload a product image.')
      return
    }

    setSubmitting(true)
    try {
      const payload = { ...form }
      if (payload.cost_price !== '') payload.cost_price = Number(payload.cost_price)
      if (payload.sale_price !== '') payload.sale_price = Number(payload.sale_price)

      if (isEdit) {
        await updateProduct(product.id, payload)
        if (file) {
          await uploadAttachment({ file, productId: product.id })
        }
      } else {
        const saved = await createProduct(payload)
        if (file && saved?.id) {
          await uploadAttachment({ file, productId: saved.id })
        }
      }
      onSaved?.()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Something went wrong'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-[#1c1c28]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-neutral-50">
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#1a1a2e] dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Product Image {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <label
              htmlFor="product-image"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition-colors hover:border-[#8fa88f] hover:bg-[#8fa88f]/5 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-[#8fa88f]"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="h-32 w-32 rounded-lg object-cover" />
              ) : (
                <>
                  <ImageIcon size={32} className="text-gray-300 dark:text-neutral-600" />
                  <span className="text-xs text-gray-400 dark:text-neutral-500">
                    Click to upload JPG, PNG, or WebP (max {MAX_SIZE_MB}MB)
                  </span>
                </>
              )}
            </label>
            <input
              id="product-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name} className={f.name === 'sku' || f.name === 'model' ? 'sm:col-span-2' : ''}>
                <label htmlFor={`pf-${f.name}`} className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  {f.label}{f.required && ' *'}
                </label>
                <input
                  id={`pf-${f.name}`}
                  type={f.type || 'text'}
                  value={form[f.name]}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-[#8fa88f]"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8fa88f] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload size={16} />
              {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
